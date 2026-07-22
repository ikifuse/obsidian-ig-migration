import { 初期状態を作る as createInitialState } from "../03_データ入出力/ブラウザー内データ";
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
  | { type: "merge"; sourceId: string; receiverId: string; selectedBigId?: string }
  | { type: "change-big"; oldBigId: string; selectedBigId?: string; selectedMode?: DisplayMode }
  | { type: "split-big"; oldBigId: string; splitId: string; selectedBigId?: string; selectedMode?: DisplayMode }
  | { type: "handwritten"; cardId: string; confirm: boolean }
  | { type: "dissolve"; bigCardId: string }
  | null;

let state = createInitialState();
let selectedCardId = "mention-cafe";
let dialog: DialogState = null;
const history = new ブラウザー操作履歴();
let notice = "検証用データだけを使用しています。再読込でも初期状態へ戻ります。";
let noticeType: "normal" | "success" | "error" = "normal";
let draggedCardId: string | null = null;

const appElement = document.querySelector<HTMLDivElement>("#app");
if (!appElement) throw new Error("#app was not found");
const app: HTMLDivElement = appElement;

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
  const selected = state.cards[selectedCardId];
  app.innerHTML = `
    <div class="app-shell">
      <header class="topbar">
        <div class="brand">
          <h1>Memory Synapse DB <span class="pill">BROWSER PROTOTYPE</span></h1>
          <p>実Vault・output_IGC・外部ネットワークを使用しない確認画面</p>
        </div>
        <div class="toolbar">
          <button class="btn" data-action="undo" ${history.件数() === 0 ? "disabled" : ""}>元に戻す</button>
          <button class="btn" data-action="multi-test">多重所属を試す</button>
          <button class="btn danger" data-action="reset">初期状態へ戻す</button>
        </div>
      </header>
      <main class="layout">
        <section class="panel">
          <div class="panel-head"><h2>1. カード一覧</h2><p>カードを別カードへドラッグして融合を開始できます。</p></div>
          <div class="panel-body card-list">${Object.values(state.cards).map(renderCardTile).join("")}</div>
        </section>
        <section class="panel">
          <div class="panel-head"><h2>2. 選択中のカードと受け皿</h2><p>表示内容と操作の意味を確認します。</p></div>
          <div class="panel-body">${selected ? renderSelected(selected) : '<div class="empty">カードを選択してください。</div>'}</div>
        </section>
        <aside class="panel guide">
          <div class="panel-head"><h2>3. 確認状況</h2><p>操作結果と仕様ケースの案内</p></div>
          <div class="panel-body">
            <div class="notice ${noticeType === "normal" ? "" : noticeType}">${escapeHtml(notice)}</div>
            <div class="case-list">
              ${[
                ["B-01〜04", "種類別の推奨と手動変更"],
                ["B-05〜06", "四枚・グループ同士の平坦な融合"],
                ["B-07〜08", "通常表示と手書き表示"],
                ["B-09〜11", "構成員・大きなカードの分離"],
                ["B-12〜13", "元に戻す・キャンセル"],
                ["B-14", "多重所属を検出して不実行"]
              ].map(([id, label]) => `<div class="case"><strong>${id}</strong><span>${label}</span></div>`).join("")}
            </div>
          </div>
        </aside>
      </main>
      ${renderDialog()}
    </div>`;
  bindEvents();
}

function renderCardTile(card: Card): string {
  const status = statusFor(card.id);
  return `<button class="card-tile ${card.id === selectedCardId ? "selected" : ""}" draggable="true" data-card-id="${card.id}">
    <div class="card-title"><strong>${escapeHtml(card.name)}</strong><span class="pill kind-${card.kind}">${KIND_LABEL[card.kind]}</span></div>
    <div class="meta"><span class="${status.className}">${escapeHtml(status.label)}</span><span>関連投稿 ${card.relatedPosts.length}件</span>${card.handwritten ? "<span>手書きあり</span>" : ""}</div>
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

  return `${renderHero(mainCard, showHandwritten)}
    <div class="actions">
      <button class="btn primary" data-action="start-merge" data-card-id="${card.id}">融合へ追加</button>
      <button class="btn" data-action="handwritten" data-card-id="${card.id}">手書き</button>
      ${isBig ? `<button class="btn" data-action="change-big" data-card-id="${card.id}">大きなカードを変更</button>` : ""}
      ${isBig && group?.displayMode === "handwritten" ? `<button class="btn" data-action="source-mode" data-card-id="${card.id}">通常表示へ戻す</button>` : ""}
      ${isBig ? `<button class="btn danger" data-action="dissolve" data-card-id="${card.id}">融合をすべて解体</button>` : ""}
    </div>
    ${group ? renderReceptacle(group.bigCardId) : ""}`;
}

function renderHero(card: Card, handwritten: boolean): string {
  const values = handwritten && card.handwritten
    ? noteFields(card.handwritten)
    : Object.entries(card.source).map(([key, value]) => [key, Array.isArray(value) ? value.join("、") : value]);
  return `<article class="hero">
    <div class="eyebrow">${handwritten ? "手書き・補正後" : "移行時点の個別カード情報"}</div>
    <h2>${escapeHtml(handwritten && card.handwritten?.displayName ? card.handwritten.displayName : card.name)}</h2>
    <span class="pill kind-${card.kind}">${KIND_LABEL[card.kind]}</span>
    <dl class="field-grid">${values.filter(([, value]) => String(value).trim()).map(([key, value]) => `<div class="field"><dt>${escapeHtml(key)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>
    <div class="post-links">${card.relatedPosts.map((post) => `<span class="post-link">${escapeHtml(post)}</span>`).join("")}</div>
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
        ${compact ? `<div class="compact">上に表示中・関連投稿 ${card.relatedPosts.length}件</div>` : `<div class="compact">${escapeHtml(Object.values(card.source).flat().join(" / "))}${card.handwritten ? " / 手書き情報あり" : ""} / 関連投稿 ${card.relatedPosts.length}件</div>`}
      </article>`;
    }).join("")}
  </section>`;
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
  if (dialog.type === "merge") return renderMergeDialog(dialog.sourceId, dialog.receiverId, dialog.selectedBigId);
  if (dialog.type === "change-big") return renderBigChoiceDialog(dialog.oldBigId, undefined, dialog.selectedBigId, dialog.selectedMode);
  if (dialog.type === "split-big") return renderBigChoiceDialog(dialog.oldBigId, dialog.splitId, dialog.selectedBigId, dialog.selectedMode);
  if (dialog.type === "handwritten") return renderHandwrittenDialog(dialog.cardId, dialog.confirm);
  const group = state.groups[dialog.bigCardId];
  return dialogFrame("融合をすべて解体しますか？", `<p>${group ? groupCardIds(group).map((id) => escapeHtml(state.cards[id]?.name ?? id)).join("、") : ""}</p><div class="notice">個別カード、カテゴリ固有情報、関連投稿、手書き情報は削除しません。</div>`, "解体する", "confirm-dissolve");
}

function renderMergeDialog(sourceId: string, receiverId: string, selectedBigId?: string): string {
  const rec = recommendBigCard(state, sourceId, receiverId);
  const choices = rec.candidateIds.map((id) => choiceHtml(id, selectedBigId, rec.recommendedIds.includes(id))).join("");
  const changedGroups = new Set(rec.candidateIds.map((id) => groupForCard(state, id)?.bigCardId).filter(Boolean));
  const effect = `更新案: 選択した大きなカードへMemory Synapseを設定。旧大きなカード${changedGroups.size ? ` ${[...changedGroups].join("、")}` : "なし"}から管理見出しだけを除去。`;
  return dialogFrame("大きなカードはどれにしますか？", `<div class="notice">${escapeHtml(rec.reason)}</div>${choices}<p class="summary">融合後: ${rec.candidateIds.map((id) => state.cards[id]?.name ?? id).join(" → ")}\n${escapeHtml(effect)}</p>`, "融合する", "confirm-merge", !selectedBigId);
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
  return dialogFrame(splitId ? "残す大きなカードはどれにしますか？" : "新しい大きなカードを選んでください", ids.map((id) => choiceHtml(id, selectedBigId, recommended.includes(id))).join("") + modeChoice, splitId ? "分離する" : "変更する", splitId ? "confirm-split-big" : "confirm-change-big", disabled);
}

function choiceHtml(id: string, selectedId: string | undefined, recommended: boolean): string {
  const card = state.cards[id];
  if (!card) return "";
  return `<label class="choice ${recommended ? "recommended" : ""}"><input type="radio" name="big-card" value="${id}" ${selectedId === id ? "checked" : ""}><span><strong>${escapeHtml(card.name)}</strong> <span class="pill kind-${card.kind}">${KIND_LABEL[card.kind]}</span><small>${recommended ? "推奨候補・選択後も変更できます" : "選択可能"}</small></span></label>`;
}

function renderHandwrittenDialog(cardId: string, confirm: boolean): string {
  const card = state.cards[cardId];
  if (!card) return "";
  if (confirm) {
    const note = readNoteFromDraft();
    return dialogFrame("手書き情報の保存内容を確認してください", `<p><strong>変更対象:</strong> ${escapeHtml(card.name)} の「手書き情報」</p><pre class="summary">${escapeHtml(JSON.stringify(note, null, 2))}</pre><div class="notice">ブラウザー内の検証状態だけを変更します。実ファイルには書き込みません。</div>`, "保存", "confirm-handwritten");
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

function apply(result: OperationResult): void {
  if (!result.ok) { setNotice(result.message, "error"); return; }
  history.保存する(state);
  state = result.state;
  setNotice(result.message, "success");
}

function setNotice(message: string, type: typeof noticeType): void { notice = message; noticeType = type; dialog = null; render(); }

function openMerge(sourceId: string, receiverId: string): void {
  if (sourceId === receiverId) { setNotice("同じカード同士は融合できません。", "error"); return; }
  const rec = recommendBigCard(state, sourceId, receiverId);
  dialog = { type: "merge", sourceId, receiverId, selectedBigId: rec.recommendedIds.length === 1 ? rec.recommendedIds[0] : undefined };
  render();
}

function bindEvents(): void {
  document.querySelectorAll<HTMLElement>("[data-card-id].card-tile").forEach((el) => {
    el.addEventListener("click", () => { selectedCardId = el.dataset.cardId ?? selectedCardId; render(); });
    el.addEventListener("dragstart", () => { draggedCardId = el.dataset.cardId ?? null; });
    el.addEventListener("dragover", (event) => { event.preventDefault(); el.classList.add("drag-over"); });
    el.addEventListener("dragleave", () => el.classList.remove("drag-over"));
    el.addEventListener("drop", (event) => { event.preventDefault(); el.classList.remove("drag-over"); const receiver = el.dataset.cardId; if (draggedCardId && receiver) openMerge(draggedCardId, receiver); draggedCardId = null; });
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

function handleAction(action: string, data: DOMStringMap): void {
  if (action === "cancel-dialog") { dialog = null; handwrittenDraft = null; setNotice("キャンセルしました。状態は変更していません。", "normal"); return; }
  if (action === "reset") { state = createInitialState(); history.初期化する(); selectedCardId = "mention-cafe"; setNotice("初期状態へ戻しました。", "success"); return; }
  if (action === "undo") { const previous = history.直前へ戻す(); if (previous) { state = previous; setNotice("直前の操作前へ戻しました。", "success"); } return; }
  if (action === "multi-test") { const invalid = createInvalidMultiMembershipState(state); const errors = validateState(invalid); setNotice(`書き込み前検証で停止しました。状態は変更していません。\n${errors.join("\n")}`, "error"); return; }
  if (action === "start-merge" && data.cardId) { const target = prompt("融合先カードのIDを入力してください:\n" + Object.values(state.cards).filter((card) => card.id !== data.cardId).map((card) => `${card.id}: ${card.name}`).join("\n")); if (target && state.cards[target]) openMerge(data.cardId, target); return; }
  if (action === "handwritten" && data.cardId) { dialog = { type: "handwritten", cardId: data.cardId, confirm: false }; render(); return; }
  if (action === "review-handwritten" && dialog?.type === "handwritten") { handwrittenDraft = readNoteFromForm(); dialog.confirm = true; render(); return; }
  if (action === "confirm-handwritten" && dialog?.type === "handwritten") { apply(saveHandwritten(state, dialog.cardId, readNoteFromDraft())); handwrittenDraft = null; return; }
  if (action === "source-mode" && data.cardId) { apply(setDisplayMode(state, data.cardId, "source")); return; }
  if (action === "change-big" && data.cardId) { dialog = { type: "change-big", oldBigId: data.cardId }; render(); return; }
  if (action === "confirm-change-big" && dialog?.type === "change-big" && dialog.selectedBigId) { apply(changeBigCard(state, dialog.oldBigId, dialog.selectedBigId, dialog.selectedMode ?? "source")); return; }
  if (action === "split" && data.cardId && data.bigId) { const group = state.groups[data.bigId]; if (!group) return; if (data.cardId === data.bigId && group.memberIds.length >= 2) { dialog = { type: "split-big", oldBigId: data.bigId, splitId: data.cardId }; render(); } else if (confirm(`${state.cards[data.cardId]?.name ?? data.cardId}だけを分離しますか？`)) apply(splitCard(state, data.bigId, data.cardId)); return; }
  if (action === "confirm-split-big" && dialog?.type === "split-big" && dialog.selectedBigId) {
    const result = splitCard(state, dialog.oldBigId, dialog.splitId, dialog.selectedBigId);
    const nextGroup = result.state.groups[dialog.selectedBigId];
    if (result.ok && nextGroup) nextGroup.displayMode = dialog.selectedMode ?? "source";
    apply(result);
    return;
  }
  if (action === "dissolve" && data.cardId) { dialog = { type: "dissolve", bigCardId: data.cardId }; render(); return; }
  if (action === "confirm-dissolve" && dialog?.type === "dissolve") { apply(dissolveGroup(state, dialog.bigCardId)); return; }
  if (action === "confirm-merge" && dialog?.type === "merge" && dialog.selectedBigId) { apply(mergeCards(state, dialog.sourceId, dialog.receiverId, dialog.selectedBigId)); }
}

render();
