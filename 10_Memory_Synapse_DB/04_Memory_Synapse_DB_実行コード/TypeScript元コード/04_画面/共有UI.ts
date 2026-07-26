import {
  初期状態を作る as createInitialState,
  検証用検査結果一覧 as browserInspectionResults
} from "../03_データ入出力/ブラウザー内データ";
import { 検証用親工程ログ一覧 as parentLogs } from "../03_データ入出力/検証用親工程ログ";
import {
  SystemLogの項目一覧 as systemLogEntries,
  検証用SystemLog一覧 as systemLogs,
  type 検証用SystemLogID as SystemLogId
} from "../03_データ入出力/検証用SystemLogs";
import type { カード as Card } from "../01_データ構造/カード";
import { カード種類表示名 as KIND_LABEL } from "../01_データ構造/カード";
import type { 手書き情報 as HandwrittenNote } from "../01_データ構造/手書き情報";
import { 空の手書き情報 as EMPTY_NOTE } from "../01_データ構造/手書き情報";
import type { 操作結果 as OperationResult } from "../01_データ構造/操作結果";
import type { 表示方法 as DisplayMode, 融合状態 as SynapseState } from "../01_データ構造/融合グループ";
import { 大きなカードを変更する as changeBigCard } from "../02_操作処理/大きなカード変更";
import { カードを分離する as splitCard, 融合をすべて解体する as dissolveGroup } from "../02_操作処理/分離";
import { 手書き情報を保存する as saveHandwritten } from "../02_操作処理/手書き保存";
import { カードの融合グループを探す as groupForCard, グループの全カードID as groupCardIds } from "../02_操作処理/状態参照";
import { 多重所属の検証状態を作る as createInvalidMultiMembershipState, 状態を検証する as validateState } from "../02_操作処理/状態検証";
import { 表示方法を変更する as setDisplayMode } from "../02_操作処理/表示切替";
import { カードを融合する as mergeCards, 大きなカードを推奨する as recommendBigCard } from "../02_操作処理/融合";
import { ブラウザー操作履歴 } from "../02_操作処理/元に戻す";

type DialogState =
  | {
      type: "select-merge-target";
      sourceId: string;
      search: string;
      kindFilters: Card["kind"][];
      statusFilters: CardStatusFilter[];
    }
  | { type: "merge"; sourceId: string; receiverId: string; selectedBigId?: string }
  | { type: "change-big"; oldBigId: string; selectedBigId?: string; selectedMode?: DisplayMode }
  | { type: "split-big"; oldBigId: string; splitId: string; selectedBigId?: string; selectedMode?: DisplayMode }
  | { type: "split-card"; bigCardId: string; splitId: string }
  | { type: "handwritten"; cardId: string; confirm: boolean }
  | { type: "dissolve"; bigCardId: string }
  | null;

type CardStatusFilter = "single" | "big" | "merged";
type KnowledgeSnapshot = { bigCardId: string | null; memberIds: string[] };

let state: SynapseState = null as any;
let selectedCardId: string | null = null;
let selectedLogFile: string | null = null;
let selectedSystemLogId: SystemLogId | null = null;
let dialog: DialogState = null;
const history = new ブラウザー操作履歴();
let notice = "Vaultのデータを表示しています。";
let noticeType: "normal" | "success" | "error" = "normal";
let draggedCardId: string | null = null;
let gridTabOpen: boolean = false;
let searchQuery = "";
let handwrittenOnly = false;
const kindFilters = new Set<Card["kind"]>();
const statusFilters = new Set<CardStatusFilter>();
let expandedFolders = new Set<string>(["Instagram_Logs", "Posts", "Reels", "Stories", "Synapses", "Locations", "Mentions", "Tags", "SystemLogs"]);

let app: HTMLElement = null as any;
let _onCommit: (oldState: SynapseState, newState: SynapseState) => Promise<void> = async () => {};
let _onOpenFile: (cardId: string) => void = () => {};

export function mountUI(
  container: HTMLElement,
  initialState: SynapseState,
  onCommit: (oldState: SynapseState, newState: SynapseState) => Promise<void>,
  onOpenFile: (cardId: string) => void
) {
  state = initialState;
  app = container;
  _onCommit = onCommit;
  _onOpenFile = onOpenFile;
  render();
}

async function performAction(actionName: string, action: () => OperationResult) {
  const oldState = state;
  const result = action();
  if (result.ok) {
    history.保存する(oldState);
    state = result.state;
    notice = result.message;
    noticeType = "success";
    render();
    try {
      await _onCommit(oldState, state);
    } catch (e) {
      notice = `保存エラー: ${e}`;
      noticeType = "error";
      state = oldState; // Rollback UI state
      render();
    }
  } else {
    notice = result.message;
    noticeType = "error";
    render();
  }
}

function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function statusFor(cardId: string): { label: string; className: string } {
  const group = groupForCard(state, cardId);
  if (!group) return { label: "単独", className: "status-single" };
  return group.bigCardId === cardId
    ? { label: `大きなカード・${groupCardIds(group).length}枚`, className: "status-big" }
    : { label: `融合済み・${state.cards[group.bigCardId]?.name ?? group.bigCardId}`, className: "status-member" };
}

function render(): void {
  const selectedCard = selectedCardId ? state.cards[selectedCardId] : null;
  app.innerHTML = `
    <div class="app-shell">
      <div class="obsidian-ribbon">
        <span class="ribbon-action" title="戻る">◀</span>
        <span class="ribbon-action" title="進む">▶</span>
        <span class="ribbon-action" title="検索">🔍</span>
        <span class="ribbon-action" title="タグ">🏷</span>
        <span class="ribbon-action" title="メンション">@</span>
        <span class="ribbon-action" title="場所">📍</span>
        <div style="flex:1;"></div>
        <button class="ribbon-action" data-action="reset" title="初期状態へ戻す">🔄</button>
        <button class="ribbon-action" data-action="undo" title="元に戻す" ${history.件数() === 0 ? "disabled" : ""}>↩</button>
      </div>
      <div class="obsidian-sidebar-left">
        <div class="sidebar-header">エクスプローラー</div>
        <div class="explorer-tree">
          ${renderTreeFolder("Instagram_Logs", 0)}
        </div>
      </div>
      <div class="obsidian-center">
        <div class="tab-bar">
          <div class="tab ${!gridTabOpen ? 'active' : ''}" data-action="open-tab-log">${escapeHtml(selectedLogFile || selectedCardId || systemLogs.find((item) => item.id === selectedSystemLogId)?.filename || "無題")}</div>
          <div class="tab ${gridTabOpen ? 'active' : ''}" data-action="open-tab-grid">リンク一覧</div>
          <div class="tab">+</div>
        </div>
        <div class="center-content">
          ${gridTabOpen
            ? renderGridTab()
            : selectedSystemLogId
              ? renderSystemLogFileView(selectedSystemLogId)
              : selectedLogFile
                ? renderLogFileView(selectedLogFile)
                : selectedCard
                  ? renderCardView(selectedCard as Card)
                  : '<div class="empty">左サイドバーからLogファイル、SystemLogまたはSynapseカードを選択してください。</div>'}
        </div>
      </div>
      <div class="obsidian-sidebar-right">
        <div class="sidebar-right-header">
          <h2>Memory Synapse</h2>
          <button class="btn-open-grid" data-action="open-tab-grid">🔗 リンク一覧を開く</button>
        </div>
        <div class="panel-body">
          <div class="notice ${noticeType === "normal" ? "" : noticeType}">${escapeHtml(notice)}</div>
          ${renderRightSidebarContent()}
        </div>
      </div>
      ${renderDialog()}
    </div>`;
  bindEvents();
}

function getLogFiles(): { posts: string[], reels: string[], stories: string[] } {
  const logs = Object.values(parentLogs);
  return {
    posts: logs.filter((log) => log.type === "Feed").map((log) => log.id).sort().reverse(),
    reels: logs.filter((log) => log.type === "Reels").map((log) => log.id).sort().reverse(),
    stories: logs.filter((log) => log.type === "Stories").map((log) => log.id).sort().reverse(),
  };
}

function cardFilename(card: Card): string {
  return card.kind === "tag" ? card.name.replace(/^#/, "") : card.name;
}

function renderTreeFolder(name: string, depth: number): string {
  const isExpanded = expandedFolders.has(name);
  const indent = `padding-left: ${16 + depth * 16}px;`;
  let html = `<div class="tree-item" style="${indent}" data-action="toggle-folder" data-folder="${escapeHtml(name)}">
    <span style="width:16px; display:inline-block; text-align:center; color: var(--text-muted);">${isExpanded ? "▼" : "▶"}</span> ${escapeHtml(name)}
  </div>`;

  if (isExpanded) {
    const logs = getLogFiles();
    if (name === "Instagram_Logs") {
      html += renderTreeFolder("media", depth + 1);
      html += renderTreeFolder("Posts", depth + 1);
      html += renderTreeFolder("Reels", depth + 1);
      html += renderTreeFolder("Stories", depth + 1);
      html += renderTreeFolder("Synapses", depth + 1);
      html += renderTreeFolder("SystemLogs", depth + 1);
    } else if (name === "Posts" || name === "Reels" || name === "Stories") {
      const files = name === "Posts" ? logs.posts : name === "Reels" ? logs.reels : logs.stories;
      const fileIndent = `padding-left: ${16 + (depth + 1) * 16 + 16}px;`;
      if (files.length > 0) {
        html += files.map(f => `<div class="tree-item ${f === selectedLogFile ? 'active' : ''}" style="${fileIndent}" data-action="select-log" data-log-id="${f}">${escapeHtml(f)}.md</div>`).join("");
      } else {
        html += `<div class="tree-item" style="${fileIndent} color: var(--text-muted);">(空)</div>`;
      }
    } else if (name === "SystemLogs") {
      const fileIndent = `padding-left: ${16 + (depth + 1) * 16 + 16}px;`;
      html += systemLogs.map((systemLog) =>
        `<div class="tree-item ${systemLog.id === selectedSystemLogId ? 'active' : ''}" style="${fileIndent}" data-action="select-system-log" data-system-log-id="${systemLog.id}">
          ${escapeHtml(systemLog.filename)}
        </div>`
      ).join("");
    } else if (name === "Synapses") {
      html += renderTreeFolder("Locations", depth + 1);
      html += renderTreeFolder("Mentions", depth + 1);
      html += renderTreeFolder("Tags", depth + 1);
    } else if (name === "Locations" || name === "Mentions" || name === "Tags") {
      const kind = name.toLowerCase().replace(/s$/, "");
      const cards = Object.values(state.cards).filter(c => c.kind === kind);
      const fileIndent = `padding-left: ${16 + (depth + 1) * 16 + 16}px;`;
      if (cards.length > 0) {
        html += cards.map(c =>
          `<div class="tree-item ${c.id === selectedCardId ? 'active' : ''}" style="${fileIndent}" data-action="select-card" data-card-id="${c.id}">
            ${escapeHtml(cardFilename(c))}.md
          </div>`
        ).join("");
      } else {
        html += `<div class="tree-item" style="${fileIndent} color: var(--text-muted);">(空)</div>`;
      }
    } else {
      const fileIndent = `padding-left: ${16 + (depth + 1) * 16 + 16}px;`;
      html += `<div class="tree-item" style="${fileIndent} color: var(--text-muted);">(空)</div>`;
    }
  }
  return html;
}

function renderGridTab(): string {
  const allCards = Object.values(state.cards);
  const knowledgeCards = allCards.filter((card) => cardStatus(card.id) !== "merged");
  const filterSource = statusFilters.has("merged") ? allCards : knowledgeCards;
  const shownCards = filteredCards(filterSource);
  return `<div class="grid-view-container">
    <header class="grid-toolbar">
      <div class="grid-heading">
        <h1>Memory Synapse DB (リンク一覧)</h1>
        <p class="drag-help"><span aria-hidden="true">⠿</span> カードを別のカードへドラッグして融合</p>
      </div>
      <section class="filter-panel" aria-label="カードの絞り込み">
        <input class="filter-search" data-filter-search type="search" value="${escapeHtml(searchQuery)}" placeholder="カードを検索">
        <div class="filter-row">
          <span class="filter-label">種類</span>
          ${filterButton("Tag", "toggle-kind-filter", "tag", kindFilters.has("tag"))}
          ${filterButton("Mention", "toggle-kind-filter", "mention", kindFilters.has("mention"))}
          ${filterButton("Location", "toggle-kind-filter", "location", kindFilters.has("location"))}
        </div>
        <div class="filter-row">
          <span class="filter-label">状態</span>
          ${filterButton("単独", "toggle-status-filter", "single", statusFilters.has("single"))}
          ${filterButton("大きなカード", "toggle-status-filter", "big", statusFilters.has("big"))}
          ${filterButton("融合済み", "toggle-status-filter", "merged", statusFilters.has("merged"))}
          ${filterButton("手書きあり", "toggle-handwritten-filter", "handwritten", handwrittenOnly)}
        </div>
        <div class="filter-summary">
          <button class="filter-clear" data-action="clear-card-filters">絞り込み解除</button>
          <span>全${knowledgeCards.length}件中${shownCards.length}件を表示</span>
        </div>
      </section>
    </header>
    <div class="card-list">${shownCards.map(renderCardTile).join("") || '<div class="empty">条件に一致するカードがありません。</div>'}</div>
  </div>`;
}

function filterButton(label: string, action: string, value: string, active: boolean): string {
  return `<button class="filter-button ${active ? "active" : ""}" data-action="${action}" data-filter-value="${value}" aria-pressed="${active}">${label}</button>`;
}

function cardStatus(cardId: string): CardStatusFilter {
  const group = groupForCard(state, cardId);
  if (!group) return "single";
  return group.bigCardId === cardId ? "big" : "merged";
}

function filteredCards(cards: Card[]): Card[] {
  const query = searchQuery.trim().toLocaleLowerCase("ja");
  return cards.filter((card) => {
    const unitCards = cardStatus(card.id) === "merged" ? [card] : cardsInKnowledgeUnit(card);
    if (query && !unitCards.some((unitCard) => mergeCandidateSearchText(unitCard).includes(query))) return false;
    if (kindFilters.size > 0 && !unitCards.some((unitCard) => kindFilters.has(unitCard.kind))) return false;
    if (statusFilters.size > 0 && !statusFilters.has(cardStatus(card.id))) return false;
    if (handwrittenOnly && !unitCards.some((unitCard) => Boolean(unitCard.handwritten))) return false;
    return true;
  });
}

function cardsInKnowledgeUnit(card: Card): Card[] {
  const group = groupForCard(state, card.id);
  if (!group) return [card];
  return groupCardIds(group)
    .map((id) => state.cards[id])
    .filter((item): item is Card => Boolean(item));
}

function renderSystemLogFileView(systemLogId: SystemLogId): string {
  const systemLog = systemLogs.find((item) => item.id === systemLogId);
  if (!systemLog) return '<div class="empty">対応する検証用SystemLogが見つかりません。</div>';
  const entries = systemLogEntries(state, systemLogId);

  return `<div class="log-view" style="color: var(--text-main);">
    <h1 style="font-size: 1.8em; margin-bottom: 16px;">${escapeHtml(systemLog.title)} - IGC統合</h1>
    <p>初期状態で全て採用（<code>- [x]</code>）です。除外したい項目は <code>- [x]</code> を <code>- [ ]</code> にしてください。</p>
    <hr style="border:0; border-top:1px solid var(--line); margin:20px 0;">
    ${entries.map((entry) => `
      <section style="margin:0 0 24px;">
        <div>- [x]
          <span class="post-link" data-action="select-card" data-card-id="${escapeHtml(entry.card.id)}" style="cursor:pointer; color:var(--text-accent); text-decoration:underline;">
            ${escapeHtml(entry.wikiLink)}
          </span>
        </div>
        <p style="margin:8px 0;">出現回数: ${entry.relatedPostIds.length}回</p>
        <div>出現投稿:</div>
        <div style="padding-left:24px;">
          ${entry.relatedPostIds.map((postId) => `
            <div style="margin:6px 0;">-
              <span class="post-link" data-action="select-log" data-log-id="${escapeHtml(postId)}" style="cursor:pointer; color:var(--text-accent); text-decoration:underline;">
                ${escapeHtml(`[[${postId}]]`)}
              </span>
            </div>
          `).join("")}
        </div>
      </section>
      <hr style="border:0; border-top:1px solid var(--line); margin:20px 0;">
    `).join("")}
  </div>`;
}

function renderRightSidebarContent(): string {
  if (selectedCardId) {
    const card = state.cards[selectedCardId];
    if (card) return renderSelected(card);
  }
  if (selectedLogFile) {
    const log = parentLogs[selectedLogFile];
    const relatedCardIds = log
      ? [...new Set(log.relatedCardIds.map((cardId) => groupForCard(state, cardId)?.bigCardId ?? cardId))]
      : [];
    const relatedCards = relatedCardIds
      .map((cardId) => state.cards[cardId])
      .filter((card): card is Card => Boolean(card));
    if (relatedCards.length === 0) return '<div class="empty">関連するMemory Synapseはありません。</div>';

    return `<div style="margin-bottom:16px;">
        <h3>関連するMemory Synapse (${relatedCards.length}件)</h3>
      </div>
      <div class="card-list">
        ${relatedCards.map(renderCardTile).join("")}
      </div>`;
  }
  return "";
}

function renderCardView(card: Card): string {
  return `<div class="log-view" style="color: var(--text-main);">
    <h1 style="font-size: 1.8em; margin-bottom: 24px;">${escapeHtml(cardFilename(card))}.md</h1>
    <div class="properties-block">
      <div style="color: var(--text-muted); font-size: 12px; margin-bottom: 8px;">プロパティ</div>
      <div class="properties-grid">
        <div class="prop-key">id</div><div>${escapeHtml(card.id)}</div>
        <div class="prop-key">source</div><div>instagram</div>
        <div class="prop-key">type</div><div>${escapeHtml(KIND_LABEL[card.kind])}</div>
        <div class="prop-key">name</div><div>${escapeHtml(card.name)}</div>
      </div>
    </div>
    <div class="log-content">
      <p>このカードは ${escapeHtml(card.name)} に関する情報です。<br>
      関連する投稿（クリックでログ本文へ移動）:</p>
      <div class="post-links" style="margin-top:16px;">
        ${card.relatedPosts.map((post) => {
          const filename = post.replace(/^\[\[/, "").replace(/\]\]$/, "").replace(/\\.md$/, "");
          return `<span class="post-link" data-action="select-log" data-log-id="${filename}" style="cursor:pointer; color:var(--text-accent); text-decoration:underline;">${escapeHtml(post)}</span>`;
        }).join(" ")}
      </div>
    </div>
  </div>`;
}

function renderLogFileView(filename: string): string {
  const log = parentLogs[filename];
  if (!log) return '<div class="empty">対応する検証用ログが見つかりません。</div>';

  const tags = log.tags.length > 0 ? log.tags.join(", ") : "[]";
  const mentions = log.mentions.length > 0 ? log.mentions.join(", ") : "[]";
  const locationName = log.location.raw ?? "null";
  const geo = log.location.geo.lat === null || log.location.geo.lng === null
    ? "null"
    : `${log.location.geo.lat}, ${log.location.geo.lng}`;
  const media = log.media
    .map((name) => `<p style="margin:16px 0;">${escapeHtml(`![[${name}]]`)}</p>`)
    .join("");
  const footerLinks = log.links.map((link) => {
    if (!link.cardId) return `<span>${escapeHtml(link.wiki)}</span>`;
    return `<span class="post-link" data-action="select-card" data-card-id="${escapeHtml(link.cardId)}" style="cursor:pointer; color:var(--text-accent);">${escapeHtml(link.wiki)}</span>`;
  }).join(" ");

  return `<div class="log-view" style="color: var(--text-main);">
    <h1 style="font-size: 1.8em; margin-bottom: 24px;">${escapeHtml(filename)}.md</h1>
    <div class="properties-block">
      <div style="color: var(--text-muted); font-size: 12px; margin-bottom: 8px;">プロパティ</div>
      <div class="properties-grid">
        <div class="prop-key">source</div><div>${escapeHtml(log.source)}</div>
        <div class="prop-key">type</div><div>${escapeHtml(log.type)}</div>
        <div class="prop-key">content</div><div>${escapeHtml(log.content ?? "null")}</div>
        <div class="prop-key">date</div><div>${escapeHtml(log.date)}</div>
        <div class="prop-key">tags</div><div>${escapeHtml(tags)}</div>
        <div class="prop-key">mentions</div><div>${escapeHtml(mentions)}</div>
        <div class="prop-key">location.raw</div><div>${escapeHtml(locationName)}</div>
        <div class="prop-key">location.geo</div><div>${escapeHtml(geo)}</div>
        <div class="prop-key">raw_source_path</div><div>${escapeHtml(log.rawSourcePath)}</div>
      </div>
    </div>
    <div class="log-content">
      <p>${escapeHtml("[[instagram]]")}</p>
      <p style="line-height:1.8; white-space:pre-wrap;">${escapeHtml(log.caption)}</p>
      ${media}
      <hr style="border:0; border-top:1px solid var(--line); margin:20px 0;">
      <div class="post-links">${footerLinks}</div>
    </div>
  </div>`;
}


function renderCardTile(card: Card): string {
  const status = statusFor(card.id);
  const group = groupForCard(state, card.id);
  const unitCards = cardStatus(card.id) === "merged" ? [card] : cardsInKnowledgeUnit(card);
  const relatedPostCount = new Set(unitCards.flatMap((unitCard) => unitCard.relatedPosts)).size;
  const hasHandwritten = unitCards.some((unitCard) => Boolean(unitCard.handwritten));
  const displayName = group?.bigCardId === card.id
    && group.displayMode === "handwritten"
    && card.handwritten?.displayName
      ? card.handwritten.displayName
      : card.name;
  return `<button class="card-tile ${card.id === selectedCardId ? "selected" : ""}" draggable="true" data-card-id="${card.id}" title="別のカードへドラッグして融合" aria-label="${escapeHtml(displayName)}。別のカードへドラッグして融合できます">
    <div class="card-title"><span class="card-name"><span class="drag-handle" aria-hidden="true">⠿</span><strong>${escapeHtml(displayName)}</strong></span><span class="pill kind-${card.kind}">${KIND_LABEL[card.kind]}</span></div>
    <div class="meta"><span class="${status.className}">${escapeHtml(status.label)}</span><span>関連投稿 ${relatedPostCount}件</span>${hasHandwritten ? "<span>手書きあり</span>" : ""}</div>
  </button>`;
}

function renderSelected(card: Card): string {
  const group = groupForCard(state, card.id);
  const bigCard = group ? state.cards[group.bigCardId] : card;
  if (!bigCard) return '<div class="empty">カードが見つかりません。</div>';
  const isBig = group?.bigCardId === card.id;
  const mode = group?.displayMode ?? (card.handwritten ? "handwritten" : "source");
  const mainCard = group ? bigCard : card;
  const showHandwritten = mode === "handwritten" && Boolean(mainCard.handwritten);
  const singleSource = !group && showHandwritten
    ? `<section class="source-details"><div class="eyebrow">移行時点の個別カード情報</div>${renderCardFields(card.source)}${renderRelatedPosts(card)}</section>`
    : "";

  return `${renderCurrentLocation(card)}
    ${renderInspectionIssues(card)}
    ${renderHero(mainCard, showHandwritten)}${singleSource}
    <div class="actions">
      <button class="btn primary" data-action="start-merge" data-card-id="${card.id}">融合へ追加</button>
      <button class="btn" data-action="handwritten" data-card-id="${card.id}">手書き</button>
      ${isBig ? `<button class="btn" data-action="change-big" data-card-id="${card.id}">大きなカードを変更</button>` : ""}
      ${isBig && group?.displayMode === "handwritten" ? `<button class="btn" data-action="source-mode" data-card-id="${card.id}">通常表示へ戻す</button>` : ""}
      ${isBig ? `<button class="btn danger" data-action="dissolve" data-card-id="${card.id}">融合をすべて解体</button>` : ""}
    </div>
    ${group ? renderReceptacle(group.bigCardId) : ""}`;
}

function renderCurrentLocation(card: Card): string {
  const group = groupForCard(state, card.id);
  if (!group) {
    return `<section class="current-location" aria-label="選択中カードの現在地">
      <span class="current-location-label">現在地</span>
      <strong>単独カード</strong>
      <span>どの融合グループにも所属していません</span>
    </section>`;
  }
  const bigCard = state.cards[group.bigCardId];
  const groupName = bigCard?.handwritten?.displayName || bigCard?.name || group.bigCardId;
  const role = card.id === group.bigCardId ? "大きなカード" : "構成員";
  return `<section class="current-location" aria-label="選択中カードの現在地">
    <span class="current-location-label">現在地</span>
    <span>融合グループ「${escapeHtml(groupName)}」</span>
    <span class="location-arrow">→</span>
    <span>大きなカード：<strong>${escapeHtml(bigCard?.name ?? group.bigCardId)}</strong></span>
    <span class="location-arrow">→</span>
    <span>このカードの役割：<strong>${role}</strong></span>
  </section>`;
}

function renderInspectionIssues(card: Card): string {
  const result = browserInspectionResults.find((item) => item.cardId === card.id);
  if (!result) return "";
  const allRows: Array<[string, number]> = [
    ["Wikiリンク切れ", result.brokenWikiLinks],
    ["複数所属の疑い", result.suspectedMultipleMemberships],
    ["管理見出しの形式不正", result.malformedManagedHeadings]
  ];
  const rows = allRows.filter(([, count]) => count > 0);
  if (rows.length === 0) return "";
  return `<section class="inspection-issues" aria-label="検査で見つかった問題">
    <div class="inspection-heading">検査で問題が見つかりました</div>
    ${rows.map(([label, count]) => `<div class="inspection-row"><span>${label}</span><strong>${count}件</strong></div>`).join("")}
    <button class="btn" data-action="open-inspection-target" data-card-id="${escapeHtml(result.targetCardId)}">対象ファイルを開く</button>
  </section>`;
}

function renderHero(card: Card, handwritten: boolean): string {
  const values: Array<[string, string]> = handwritten && card.handwritten
    ? noteFields(card.handwritten)
    : Object.entries(card.source).map(([key, value]) => [key, Array.isArray(value) ? value.join("、") : String(value ?? "")]);
  return `<article class="hero">
    <div class="eyebrow">${handwritten ? "手書き・補正後" : "移行時点の個別カード情報"}</div>
    <h2>${escapeHtml(handwritten && card.handwritten?.displayName ? card.handwritten.displayName : card.name)}</h2>
    <span class="pill kind-${card.kind}">${KIND_LABEL[card.kind]}</span>
    ${renderFieldValues(values)}
    ${renderRelatedPosts(card)}
  </article>`;
}

function renderReceptacle(bigCardId: string): string {
  const group = state.groups[bigCardId];
  if (!group) return "";
  return `<section class="receptacle"><h3>受け皿（${groupCardIds(group).length}枚・入れ子なし）</h3>
    ${groupCardIds(group).map((id) => {
      const card = state.cards[id];
      if (!card) return "";
      const compact = id === bigCardId && group.displayMode === "source";
      return `<article class="member ${compact ? "active-source" : ""}">
        <header><div><span class="pill kind-${card.kind}">${KIND_LABEL[card.kind]}</span> <strong>${escapeHtml(card.name)}</strong></div><button class="btn" data-action="split" data-card-id="${id}" data-big-id="${bigCardId}">このカードを分離</button></header>
        ${compact
          ? `<div class="compact">上に表示中・関連投稿 ${card.relatedPosts.length}件</div>`
          : `${renderCardFields(card.source)}
            ${card.handwritten && id !== bigCardId ? `<div class="member-section-label">手書き情報</div>${renderFieldValues(noteFields(card.handwritten))}` : ""}
            ${renderRelatedPosts(card)}`}
      </article>`;
    }).join("")}
  </section>`;
}

function renderCardFields(source: Card["source"]): string {
  return renderFieldValues(
    Object.entries(source).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join("、") : String(value ?? "")
    ])
  );
}

function renderFieldValues(values: Array<[string, string]>): string {
  const fields = values.filter(([, value]) => value.trim());
  return fields.length === 0
    ? '<div class="compact">表示できる情報はありません。</div>'
    : `<dl class="field-grid">${fields.map(([key, value]) => `<div class="field"><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>`;
}

function renderRelatedPosts(card: Card): string {
  const links = card.relatedPosts.map((post) => {
    const filename = post.replace(/^\[\[/, "").replace(/\]\]$/, "").replace(/\\.md$/, "");
    return `<span class="post-link" data-action="select-log" data-log-id="${escapeHtml(filename)}" style="cursor:pointer; color:var(--text-accent); text-decoration:underline;">${escapeHtml(post)}</span>`;
  }).join(" ");
  return `<div class="member-section-label">関連投稿（${card.relatedPosts.length}件）</div><div class="post-links">${links || '<span class="compact">関連投稿なし</span>'}</div>`;
}

function noteFields(note: HandwrittenNote): Array<[string, string]> {
  return [
    ["display_name", note.displayName], ["aliases", note.aliases.join("、")], ["name", note.name],
    ["phone", note.phone.join("、")], ["web", note.web.join("、")],
    ["geo", [note.geo.lat, note.geo.lng, note.geo.alt].filter(Boolean).join(", ")],
    ["address.full", note.address.full], ["country", note.address.country],
    ["prefecture", note.address.prefecture], ["city", note.address.city],
    ["district", note.address.district], ["street", note.address.street],
    ["postal_code", note.address.postalCode], ["note", note.note]
  ];
}

function renderDialog(): string {
  if (!dialog) return "";
  if (dialog.type === "select-merge-target") return renderMergeTargetDialog(dialog);
  if (dialog.type === "merge") return renderMergeDialog(dialog.sourceId, dialog.receiverId, dialog.selectedBigId);
  if (dialog.type === "change-big") return renderBigChoiceDialog(dialog.oldBigId, undefined, dialog.selectedBigId, dialog.selectedMode);
  if (dialog.type === "split-big") return renderBigChoiceDialog(dialog.oldBigId, dialog.splitId, dialog.selectedBigId, dialog.selectedMode);
  if (dialog.type === "split-card") return renderSplitCardDialog(dialog.bigCardId, dialog.splitId);
  if (dialog.type === "handwritten") return renderHandwrittenDialog(dialog.cardId, dialog.confirm);
  const group = state.groups[dialog.bigCardId];
  if (!group) return "";
  const after = groupCardIds(group).map((id) => snapshotForSingle(id));
  return dialogFrame(
    "融合をすべて解体しますか？",
    renderOperationComparison(
      [snapshotForGroup(group.bigCardId)],
      after,
      [group.bigCardId],
      ["全個別カード", "カテゴリ固有情報", "関連投稿", "手書き情報"],
      "はい。直前操作として元に戻せます。"
    ),
    "解体する",
    "confirm-dissolve"
  );
}

function renderMergeTargetDialog(targetDialog: Extract<DialogState, { type: "select-merge-target" }>): string {
  const sourceCard = state.cards[targetDialog.sourceId];
  if (!sourceCard) return "";
  const sourceGroup = groupForCard(state, targetDialog.sourceId);
  const sourceGroupIds = new Set(sourceGroup ? groupCardIds(sourceGroup) : [targetDialog.sourceId]);
  const query = targetDialog.search.trim().toLocaleLowerCase("ja");
  const candidates = Object.values(state.cards).filter((card) => {
    if (sourceGroupIds.has(card.id)) return false;
    if (targetDialog.kindFilters.length > 0 && !targetDialog.kindFilters.includes(card.kind)) return false;
    if (targetDialog.statusFilters.length > 0 && !targetDialog.statusFilters.includes(cardStatus(card.id))) return false;
    return !query || mergeCandidateSearchText(card).includes(query);
  });
  const allCandidateCount = Object.keys(state.cards).length - sourceGroupIds.size;

  return `<div class="dialog-backdrop" role="presentation">
    <section class="dialog merge-target-dialog" role="dialog" aria-modal="true" aria-label="融合先候補を選択">
      <header><h2>融合先候補を選択</h2></header>
      <div class="dialog-content">
        <div class="merge-source"><span>選択中</span><strong>${escapeHtml(sourceCard.name)}</strong><span class="pill kind-${sourceCard.kind}">${KIND_LABEL[sourceCard.kind]}</span></div>
        <div class="merge-step-arrow">↓</div>
        <section class="filter-panel merge-filter-panel" aria-label="融合先候補の絞り込み">
          <input class="filter-search" data-merge-search type="search" value="${escapeHtml(targetDialog.search)}" placeholder="名前・別名・関連投稿を検索">
          <div class="filter-row">
            <span class="filter-label">種類</span>
            ${mergeFilterButton("Tag", "toggle-merge-kind-filter", "tag", targetDialog.kindFilters.includes("tag"))}
            ${mergeFilterButton("Mention", "toggle-merge-kind-filter", "mention", targetDialog.kindFilters.includes("mention"))}
            ${mergeFilterButton("Location", "toggle-merge-kind-filter", "location", targetDialog.kindFilters.includes("location"))}
          </div>
          <div class="filter-row">
            <span class="filter-label">状態</span>
            ${mergeFilterButton("単独", "toggle-merge-status-filter", "single", targetDialog.statusFilters.includes("single"))}
            ${mergeFilterButton("大きなカード", "toggle-merge-status-filter", "big", targetDialog.statusFilters.includes("big"))}
            ${mergeFilterButton("融合済み", "toggle-merge-status-filter", "merged", targetDialog.statusFilters.includes("merged"))}
          </div>
          <div class="filter-summary"><span>全${allCandidateCount}件中${candidates.length}件を表示</span></div>
        </section>
        <div class="merge-step-arrow">↓</div>
        <div class="merge-candidate-list">
          ${candidates.map(renderMergeCandidate).join("") || '<div class="empty">条件に一致する候補がありません。</div>'}
        </div>
      </div>
      <footer><button class="btn" data-action="cancel-dialog">キャンセル</button></footer>
    </section>
  </div>`;
}

function mergeFilterButton(label: string, action: string, value: string, active: boolean): string {
  return `<button class="filter-button ${active ? "active" : ""}" data-action="${action}" data-filter-value="${value}" aria-pressed="${active}">${label}</button>`;
}

function mergeCandidateSearchText(card: Card): string {
  return [
    card.name,
    ...Object.values(card.source).flat().map(String),
    card.handwritten?.displayName ?? "",
    ...(card.handwritten?.aliases ?? []),
    ...card.relatedPosts
  ].join(" ").toLocaleLowerCase("ja");
}

function renderMergeCandidate(card: Card): string {
  const aliases = [card.handwritten?.displayName ?? "", ...(card.handwritten?.aliases ?? [])].filter(Boolean);
  const status = statusFor(card.id);
  return `<button class="merge-candidate" data-action="select-merge-target" data-card-id="${escapeHtml(card.id)}">
    <span class="merge-candidate-main"><strong>${escapeHtml(card.name)}</strong><span class="pill kind-${card.kind}">${KIND_LABEL[card.kind]}</span></span>
    ${aliases.length > 0 ? `<span class="merge-candidate-alias">別名: ${escapeHtml(aliases.join("、"))}</span>` : ""}
    <span class="merge-candidate-meta">${escapeHtml(status.label)}・関連投稿 ${card.relatedPosts.length}件</span>
  </button>`;
}

function renderMergeDialog(sourceId: string, receiverId: string, selectedBigId?: string): string {
  const rec = recommendBigCard(state, sourceId, receiverId);
  const currentBigIds = new Set(
    rec.candidateIds
      .map((id) => groupForCard(state, id)?.bigCardId)
      .filter((id): id is string => Boolean(id))
  );
  const choices = rec.candidateIds
    .map((id) => choiceHtml(id, selectedBigId, rec.recommendedIds.includes(id), currentBigIds.has(id)))
    .join("");
  const changedFileIds = new Set<string>([
    ...currentBigIds,
    ...(selectedBigId ? [selectedBigId] : [])
  ]);
  const currentBigNames = currentBigIds.size > 0
    ? [...currentBigIds].map((id) => state.cards[id]?.name ?? id).join("、")
    : "なし";
  const changedFiles = changedFileIds.size > 0
    ? [...changedFileIds].map((id) => {
        const card = state.cards[id];
        return card ? `${cardFilename(card)}.md` : `${id}.md`;
      }).join("、")
    : "大きなカードを選択すると表示します";
  const currentUnits = uniqueSnapshotsForCards([sourceId, receiverId]);
  const afterUnits = selectedBigId
    ? [{ bigCardId: selectedBigId, memberIds: rec.candidateIds }]
    : [];
  return dialogFrame(
    "大きなカードはどれにしますか？",
    `<div class="notice">${escapeHtml(rec.reason)}</div>
    <p><strong>現在の大きなカード:</strong> ${escapeHtml(currentBigNames)}</p>
    ${choices}
    ${renderOperationComparison(
      currentUnits,
      afterUnits,
      [...changedFileIds],
      ["個別カード", "カテゴリ固有情報", "関連投稿", "手書き情報"],
      "はい。直前操作として元に戻せます。",
      selectedBigId ? undefined : "大きなカードを選択すると操作後と変更ファイルを表示します。"
    )}
    <span class="visually-hidden">変更されるMarkdownファイル: ${escapeHtml(changedFiles)}</span>`,
    "融合する",
    "confirm-merge",
    !selectedBigId
  );
}

function renderBigChoiceDialog(oldBigId: string, splitId?: string, selectedBigId?: string, selectedMode?: DisplayMode): string {
  const group = state.groups[oldBigId];
  if (!group) return "";
  const ids = groupCardIds(group).filter((id) => id !== splitId);
  const highest = Math.max(...ids.map((id) => ({ mention: 3, location: 2, tag: 1 })[state.cards[id]?.kind ?? "tag"]));
  const recommended = ids.filter((id) => ({ mention: 3, location: 2, tag: 1 })[state.cards[id]?.kind ?? "tag"] === highest);
  const hasHandwritten = selectedBigId ? Boolean(state.cards[selectedBigId]?.handwritten) : false;
  const modeChoice = selectedBigId
    ? hasHandwritten
      ? `<h3>上部に何を表示しますか？</h3><label class="choice"><input type="radio" name="display-mode" value="source" ${selectedMode === "source" ? "checked" : ""}><span>元の個別カード情報</span></label><label class="choice"><input type="radio" name="display-mode" value="handwritten" ${selectedMode === "handwritten" ? "checked" : ""}><span>手書き情報</span></label>`
      : `<div class="notice">手書き情報がないため、元の個別カード情報を表示します。</div>`
    : "";
  const disabled = !selectedBigId || (hasHandwritten && !selectedMode);
  const currentBigNotice = `<div class="notice">現在の大きなカード: ${escapeHtml(state.cards[oldBigId]?.name ?? oldBigId)}。種類の優先順位（Mention → Location → Tag）による推奨は変更できます。</div>`;
  const comparison = renderOperationComparison(
    [snapshotForGroup(oldBigId)],
    selectedBigId ? [{ bigCardId: selectedBigId, memberIds: ids }] : [],
    selectedBigId ? [...new Set([oldBigId, selectedBigId])] : [],
    ["全個別カード", "カテゴリ固有情報", "関連投稿", "各カードの手書き情報"],
    "はい。直前操作として元に戻せます。",
    selectedBigId ? undefined : "大きなカードを選択すると操作後と変更ファイルを表示します。"
  );
  return dialogFrame(
    splitId ? "残す大きなカードはどれにしますか？" : "新しい大きなカードを選んでください",
    currentBigNotice + ids.map((id) => choiceHtml(id, selectedBigId, recommended.includes(id), id === oldBigId)).join("") + modeChoice + comparison,
    splitId ? "分離する" : "変更する",
    splitId ? "confirm-split-big" : "confirm-change-big",
    disabled
  );
}

function choiceHtml(id: string, selectedId: string | undefined, recommended: boolean, currentBig = false): string {
  const card = state.cards[id];
  if (!card) return "";
  const labels = [
    currentBig ? "現在の大きなカード" : "",
    recommended ? "推奨候補" : "",
    "選択可能"
  ].filter(Boolean);
  return `<label class="choice ${recommended ? "recommended" : ""}"><input type="radio" name="big-card" value="${id}" ${selectedId === id ? "checked" : ""}><span><strong>${escapeHtml(card.name)}</strong> <span class="pill kind-${card.kind}">${KIND_LABEL[card.kind]}</span><small>${escapeHtml(labels.join("・"))}</small></span></label>`;
}

function renderSplitCardDialog(bigCardId: string, splitId: string): string {
  const group = state.groups[bigCardId];
  const split = state.cards[splitId];
  if (!group || !split) return "";
  const remaining = groupCardIds(group).filter((id) => id !== splitId);
  const endsFusion = remaining.length === 1;
  const after = endsFusion
    ? [snapshotForSingle(remaining[0] ?? ""), snapshotForSingle(splitId)]
    : [{ bigCardId, memberIds: remaining }, snapshotForSingle(splitId)];
  return dialogFrame(
    `${split.name}を分離しますか？`,
    `<p><strong>分離するカード:</strong> ${escapeHtml(split.name)} <span class="pill kind-${split.kind}">${KIND_LABEL[split.kind]}</span></p>
    <p><strong>分離後:</strong> ${endsFusion
      ? `残る${escapeHtml(state.cards[remaining[0] ?? ""]?.name ?? "")}も単独カードへ戻り、融合状態を終了します。`
      : `${escapeHtml(split.name)}だけが単独カードへ戻り、残る融合関係は維持します。`}</p>
    ${renderOperationComparison(
      [snapshotForGroup(bigCardId)],
      after,
      [bigCardId],
      ["分離するカードのファイル", "カテゴリ固有情報", "関連投稿", "手書き情報"],
      "はい。直前操作として元に戻せます。"
    )}`,
    "分離する",
    "confirm-split-card"
  );
}

function renderHandwrittenDialog(cardId: string, confirm: boolean): string {
  const card = state.cards[cardId];
  if (!card) return "";
  if (confirm) {
    const note = readNoteFromDraft();
    const group = groupForCard(state, cardId);
    const currentSnapshot = group ? snapshotForGroup(group.bigCardId) : snapshotForSingle(cardId);
    return dialogFrame(
      "手書き情報の保存内容を確認してください",
      `<div class="handwritten-comparison">
        <div><h3>現在の手書き情報</h3><pre class="summary">${escapeHtml(JSON.stringify(card.handwritten ?? EMPTY_NOTE, null, 2))}</pre></div>
        <div><h3>操作後の手書き情報</h3><pre class="summary">${escapeHtml(JSON.stringify(note, null, 2))}</pre></div>
      </div>
      ${renderOperationComparison(
        [currentSnapshot],
        [currentSnapshot],
        [cardId],
        ["個別カードの元情報", "カテゴリ固有情報", "関連投稿", "他カードの手書き情報"],
        "はい。直前操作として元に戻せます。"
      )}
      <div class="notice">ブラウザー内の検証状態だけを変更します。実ファイルには書き込みません。</div>`,
      "保存",
      "confirm-handwritten"
    );
  }
  const note = card.handwritten ?? structuredClone(EMPTY_NOTE);
  return dialogFrame("手書き情報", `<form id="handwritten-form" class="form-grid">${input("displayName", "表示名", note.displayName)}${input("aliases", "別名（1行1件）", note.aliases.join("\n"), true)}${input("name", "名称", note.name)}${input("phone", "電話（1行1件）", note.phone.join("\n"), true)}${input("web", "Web等（1行1件）", note.web.join("\n"), true)}${input("lat", "緯度", note.geo.lat)}${input("lng", "経度", note.geo.lng)}${input("alt", "高度", note.geo.alt)}${input("full", "住所全文", note.address.full, false, true)}${input("country", "国", note.address.country)}${input("prefecture", "都道府県", note.address.prefecture)}${input("city", "市区町村", note.address.city)}${input("district", "地区", note.address.district)}${input("street", "番地等", note.address.street)}${input("postalCode", "郵便番号", note.address.postalCode)}${input("note", "自由メモ", note.note, true, true)}</form>`, "保存内容を確認", "review-handwritten");
}

function input(name: string, label: string, value: string, textarea = false, span = false): string {
  return `<label class="${span ? "span-2" : ""}">${label}${textarea ? `<textarea name="${name}" rows="3">${escapeHtml(value)}</textarea>` : `<input name="${name}" value="${escapeHtml(value)}">`}</label>`;
}

function dialogFrame(title: string, content: string, confirmLabel: string, action: string, disabled = false): string {
  return `<div class="dialog-backdrop" role="presentation"><section class="dialog" role="dialog" aria-modal="true" aria-label="${escapeHtml(title)}"><header><h2>${escapeHtml(title)}</h2></header><div class="dialog-content">${content}</div><footer><button class="btn" data-action="cancel-dialog">キャンセル</button><button class="btn primary" data-action="${action}" ${disabled ? "disabled" : ""}>${escapeHtml(confirmLabel)}</button></footer></section></div>`;
}

function snapshotForGroup(bigCardId: string): KnowledgeSnapshot {
  const group = state.groups[bigCardId];
  return group
    ? { bigCardId, memberIds: groupCardIds(group) }
    : snapshotForSingle(bigCardId);
}

function snapshotForSingle(cardId: string): KnowledgeSnapshot {
  return { bigCardId: null, memberIds: cardId ? [cardId] : [] };
}

function uniqueSnapshotsForCards(cardIds: string[]): KnowledgeSnapshot[] {
  const seen = new Set<string>();
  const snapshots: KnowledgeSnapshot[] = [];
  for (const cardId of cardIds) {
    const group = groupForCard(state, cardId);
    const key = group ? `group:${group.bigCardId}` : `single:${cardId}`;
    if (seen.has(key)) continue;
    seen.add(key);
    snapshots.push(group ? snapshotForGroup(group.bigCardId) : snapshotForSingle(cardId));
  }
  return snapshots;
}

function renderOperationComparison(
  current: KnowledgeSnapshot[],
  after: KnowledgeSnapshot[],
  changedCardIds: string[],
  unchangedInformation: string[],
  undoText: string,
  afterPlaceholder?: string
): string {
  const renderSide = (label: string, snapshots: KnowledgeSnapshot[], placeholder?: string) => `
    <section class="comparison-side">
      <h3>${label}</h3>
      ${snapshots.length > 0
        ? snapshots.map((snapshot) => renderSnapshot(snapshot)).join("")
        : `<p class="comparison-placeholder">${escapeHtml(placeholder ?? "操作内容を選択すると表示します。")}</p>`}
    </section>`;
  const changedFiles = changedCardIds.length > 0
    ? changedCardIds.map((id) => {
        const card = state.cards[id];
        return card ? `${cardFilename(card)}.md` : `${id}.md`;
      })
    : ["操作内容を選択すると表示します"];
  return `<section class="operation-comparison" aria-label="操作前後の比較">
    <div class="comparison-columns">
      ${renderSide("現在", current)}
      <div class="comparison-arrow" aria-hidden="true">→</div>
      ${renderSide("操作後", after, afterPlaceholder)}
    </div>
    <dl class="impact-list">
      <div><dt>変更するファイル</dt><dd>${changedFiles.map((file) => `<span>${escapeHtml(file)}</span>`).join("")}</dd></div>
      <div><dt>変更しない情報</dt><dd>${unchangedInformation.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</dd></div>
      <div><dt>元に戻せるか</dt><dd>${escapeHtml(undoText)}</dd></div>
    </dl>
  </section>`;
}

function renderSnapshot(snapshot: KnowledgeSnapshot): string {
  const names = snapshot.memberIds.map((id) => state.cards[id]?.name ?? id);
  if (!snapshot.bigCardId) {
    return `<div class="snapshot-card">
      <div><span>大きなカード</span><strong>なし（単独）</strong></div>
      <div><span>構成員</span><strong>${snapshot.memberIds.length}枚</strong></div>
      <p>${escapeHtml(names.join("、"))}</p>
    </div>`;
  }
  return `<div class="snapshot-card">
    <div><span>大きなカード</span><strong>${escapeHtml(state.cards[snapshot.bigCardId]?.name ?? snapshot.bigCardId)}</strong></div>
    <div><span>構成員</span><strong>${snapshot.memberIds.length}枚</strong></div>
    <p>${escapeHtml(names.join("、"))}</p>
  </div>`;
}

let handwrittenDraft: HandwrittenNote | null = null;

function readNoteFromForm(): HandwrittenNote {
  const form = document.querySelector<HTMLFormElement>("#handwritten-form");
  if (!form) return structuredClone(EMPTY_NOTE);
  const data = new FormData(form);
  const value = (key: string) => String(data.get(key) ?? "");
  const list = (key: string) => value(key).split("\n");
  return {
    displayName: value("displayName"), aliases: list("aliases"), name: value("name"), phone: list("phone"), web: list("web"),
    geo: { lat: value("lat"), lng: value("lng"), alt: value("alt") },
    address: { full: value("full"), country: value("country"), prefecture: value("prefecture"), city: value("city"), district: value("district"), street: value("street"), postalCode: value("postalCode") },
    note: value("note")
  };
}
function readNoteFromDraft(): HandwrittenNote { return handwrittenDraft ?? structuredClone(EMPTY_NOTE); }

async function apply(result: OperationResult): Promise<void> {
  if (!result.ok) { setNotice(result.message, "error"); return; }
  const oldState = state;
  try {
    await _onCommit(oldState, result.state);
    history.保存する(oldState);
    state = result.state;
    setNotice(result.message, "success");
  } catch (e) {
    setNotice(`保存エラー: ${e}`, "error");
  }
}

function setNotice(message: string, type: typeof noticeType): void { notice = message; noticeType = type; dialog = null; render(); }

function openMerge(sourceId: string, receiverId: string): void {
  if (sourceId === receiverId) { setNotice("同じカード同士は融合できません。", "error"); return; }
  dialog = { type: "merge", sourceId, receiverId };
  render();
}

function bindEvents(): void {
  const searchInput = document.querySelector<HTMLInputElement>("[data-filter-search]");
  searchInput?.addEventListener("input", () => {
    searchQuery = searchInput.value;
    render();
    const nextInput = document.querySelector<HTMLInputElement>("[data-filter-search]");
    nextInput?.focus();
    nextInput?.setSelectionRange(searchQuery.length, searchQuery.length);
  });
  const mergeSearchInput = document.querySelector<HTMLInputElement>("[data-merge-search]");
  mergeSearchInput?.addEventListener("input", () => {
    if (dialog?.type !== "select-merge-target") return;
    dialog.search = mergeSearchInput.value;
    render();
    const nextInput = document.querySelector<HTMLInputElement>("[data-merge-search]");
    nextInput?.focus();
    nextInput?.setSelectionRange(dialog.search.length, dialog.search.length);
  });
  document.querySelectorAll<HTMLElement>("[data-card-id].card-tile").forEach((el) => {
    el.addEventListener("click", () => {
      selectedCardId = el.dataset.cardId ?? selectedCardId;
      selectedLogFile = null; // メイン画面もカード表示に切り替えるためにログ選択を解除
      selectedSystemLogId = null;
      render();
    });
    el.addEventListener("dragstart", (event) => {
      draggedCardId = el.dataset.cardId ?? null;
      el.classList.add("dragging");
      if (event.dataTransfer && draggedCardId) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", draggedCardId);
      }
    });
    el.addEventListener("dragover", (event) => { event.preventDefault(); el.classList.add("drag-over"); });
    el.addEventListener("dragleave", () => el.classList.remove("drag-over"));
    el.addEventListener("drop", (event) => { event.preventDefault(); el.classList.remove("drag-over"); const receiver = el.dataset.cardId; if (draggedCardId && receiver) openMerge(draggedCardId, receiver); draggedCardId = null; });
    el.addEventListener("dragend", () => {
      draggedCardId = null;
      document.querySelectorAll(".card-tile.dragging, .card-tile.drag-over").forEach((card) => card.classList.remove("dragging", "drag-over"));
    });
  });
  document.querySelectorAll<HTMLInputElement>('input[name="big-card"]').forEach((radio) => radio.addEventListener("change", () => {
    if (!dialog) return;
    if (dialog.type === "merge" || dialog.type === "change-big" || dialog.type === "split-big") {
      dialog.selectedBigId = radio.value;
      if (dialog.type === "change-big" || dialog.type === "split-big") {
        dialog.selectedMode = state.cards[radio.value]?.handwritten ? undefined : "source";
      }
    }
    render();
  }));
  document.querySelectorAll<HTMLInputElement>('input[name="display-mode"]').forEach((radio) => radio.addEventListener("change", () => {
    if (dialog?.type === "change-big" || dialog?.type === "split-big") {
      dialog.selectedMode = radio.value === "handwritten" ? "handwritten" : "source";
      render();
    }
  }));
  document.querySelectorAll<HTMLElement>("[data-action]").forEach((el) => el.addEventListener("click", () => handleAction(el.dataset.action ?? "", el.dataset)));
}

async function handleAction(action: string, data: DOMStringMap): Promise<void> {
  if (action === "toggle-folder" && data.folder) {
    if (expandedFolders.has(data.folder)) expandedFolders.delete(data.folder);
    else expandedFolders.add(data.folder);
    render();
    return;
  }
  if (action === "select-log" && data.logId) { selectedLogFile = data.logId; selectedCardId = null; selectedSystemLogId = null; render(); return; }
  if (action === "select-card" && data.cardId) { selectedCardId = data.cardId; selectedLogFile = null; selectedSystemLogId = null; render(); return; }
  if (action === "open-inspection-target" && data.cardId) {
    selectedCardId = data.cardId;
    selectedLogFile = null;
    selectedSystemLogId = null;
    gridTabOpen = false;
    render();
    return;
  }
  if (action === "select-system-log" && data.systemLogId) {
    const systemLogId = data.systemLogId as SystemLogId;
    if (systemLogs.some((item) => item.id === systemLogId)) {
      selectedSystemLogId = systemLogId;
      selectedCardId = null;
      selectedLogFile = null;
      gridTabOpen = false;
      render();
    }
    return;
  }
  if (action === "toggle-kind-filter" && data.filterValue) {
    const kind = data.filterValue as Card["kind"];
    if (kindFilters.has(kind)) kindFilters.delete(kind);
    else kindFilters.add(kind);
    render();
    return;
  }
  if (action === "toggle-status-filter" && data.filterValue) {
    const status = data.filterValue as CardStatusFilter;
    if (statusFilters.has(status)) statusFilters.delete(status);
    else statusFilters.add(status);
    render();
    return;
  }
  if (action === "toggle-handwritten-filter") { handwrittenOnly = !handwrittenOnly; render(); return; }
  if (action === "clear-card-filters") {
    searchQuery = "";
    handwrittenOnly = false;
    kindFilters.clear();
    statusFilters.clear();
    render();
    return;
  }
  if (action === "toggle-merge-kind-filter" && data.filterValue && dialog?.type === "select-merge-target") {
    const kind = data.filterValue as Card["kind"];
    dialog.kindFilters = dialog.kindFilters.includes(kind)
      ? dialog.kindFilters.filter((value) => value !== kind)
      : [...dialog.kindFilters, kind];
    render();
    return;
  }
  if (action === "toggle-merge-status-filter" && data.filterValue && dialog?.type === "select-merge-target") {
    const status = data.filterValue as CardStatusFilter;
    dialog.statusFilters = dialog.statusFilters.includes(status)
      ? dialog.statusFilters.filter((value) => value !== status)
      : [...dialog.statusFilters, status];
    render();
    return;
  }
  if (action === "select-merge-target" && data.cardId && dialog?.type === "select-merge-target") {
    const sourceId = dialog.sourceId;
    openMerge(sourceId, data.cardId);
    return;
  }
  if (action === "open-tab-grid") { gridTabOpen = true; render(); return; }
  if (action === "open-tab-log") { gridTabOpen = false; render(); return; }
  if (action === "cancel-dialog") { dialog = null; handwrittenDraft = null; setNotice("キャンセルしました。状態は変更していません。", "normal"); return; }
  if (action === "reset") {
    state = createInitialState();
    history.初期化する();
    selectedCardId = null;
    selectedLogFile = null;
    selectedSystemLogId = null;
    gridTabOpen = false;
    searchQuery = "";
    handwrittenOnly = false;
    kindFilters.clear();
    statusFilters.clear();
    setNotice("初期状態へ戻しました。", "success");
    return;
  }
  if (action === "undo") { const previous = history.直前へ戻す(); if (previous) { state = previous; setNotice("直前の操作前へ戻しました。", "success"); } return; }
  if (action === "multi-test") { const invalid = createInvalidMultiMembershipState(state); const errors = validateState(invalid); setNotice(`書き込み前検証で停止しました。状態は変更していません。\\n${errors.join("\\n")}`, "error"); return; }
  if (action === "start-merge" && data.cardId) {
    dialog = {
      type: "select-merge-target",
      sourceId: data.cardId,
      search: "",
      kindFilters: [],
      statusFilters: []
    };
    render();
    return;
  }
  if (action === "handwritten" && data.cardId) { dialog = { type: "handwritten", cardId: data.cardId, confirm: false }; render(); return; }
  if (action === "review-handwritten" && dialog?.type === "handwritten") { handwrittenDraft = readNoteFromForm(); dialog.confirm = true; render(); return; }
  if (action === "confirm-handwritten" && dialog?.type === "handwritten") { await apply(saveHandwritten(state, dialog.cardId, readNoteFromDraft())); handwrittenDraft = null; return; }
  if (action === "source-mode" && data.cardId) { await apply(setDisplayMode(state, data.cardId, "source")); return; }
  if (action === "change-big" && data.cardId) { dialog = { type: "change-big", oldBigId: data.cardId }; render(); return; }
  if (action === "confirm-change-big" && dialog?.type === "change-big" && dialog.selectedBigId) { await apply(changeBigCard(state, dialog.oldBigId, dialog.selectedBigId, dialog.selectedMode ?? "source")); return; }
  if (action === "split" && data.cardId && data.bigId) {
    const group = state.groups[data.bigId];
    if (!group) return;
    dialog = data.cardId === data.bigId && group.memberIds.length >= 2
      ? { type: "split-big", oldBigId: data.bigId, splitId: data.cardId }
      : { type: "split-card", bigCardId: data.bigId, splitId: data.cardId };
    render();
    return;
  }
  if (action === "confirm-split-card" && dialog?.type === "split-card") {
    await apply(splitCard(state, dialog.bigCardId, dialog.splitId));
    return;
  }
  if (action === "confirm-split-big" && dialog?.type === "split-big" && dialog.selectedBigId) {
    const result = splitCard(state, dialog.oldBigId, dialog.splitId, dialog.selectedBigId);
    const nextGroup = result.state.groups[dialog.selectedBigId];
    if (result.ok && nextGroup) nextGroup.displayMode = dialog.selectedMode ?? "source";
    await apply(result);
    return;
  }
  if (action === "dissolve" && data.cardId) { dialog = { type: "dissolve", bigCardId: data.cardId }; render(); return; }
  if (action === "confirm-dissolve" && dialog?.type === "dissolve") { await apply(dissolveGroup(state, dialog.bigCardId)); return; }
  if (action === "confirm-merge" && dialog?.type === "merge" && dialog.selectedBigId) { await apply(mergeCards(state, dialog.sourceId, dialog.receiverId, dialog.selectedBigId)); }
}

render();
