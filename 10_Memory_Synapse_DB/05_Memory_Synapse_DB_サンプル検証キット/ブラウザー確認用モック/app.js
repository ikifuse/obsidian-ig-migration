/* 05専用ブラウザー確認モック。04の実行コード・実Vaultを読みません。 */
(() => {
  "use strict";

  const sample = globalThis.MemorySynapseSampleData;
  const root = document.querySelector("#app");
  if (!sample || !root) throw new Error("05専用サンプルデータを読み込めません。");

  const kinds = ["mention", "location", "tag"];
  const kindLabels = { mention: "Mention", location: "Location", tag: "Tag" };
  const kindPriority = { mention: 3, location: 2, tag: 1 };
  const initial = {
    cards: structuredClone(sample.synapses.cards),
    groups: structuredClone(sample.synapses.groups),
  };
  let state = structuredClone(initial);
  let history = [];
  let selected = { type: "group", id: Object.keys(state.groups)[0] };
  let dialog = null;
  let notice = "検証用データだけを使用しています。再読み込みでも初期状態へ戻ります。";
  let search = "";
  let kindFilters = new Set();
  let statusFilter = "";
  let handwrittenOnly = false;
  let centerMode = "links";
  let dragId = null;
  let openFolders = new Set(["Instagram_Logs", "Synapses"]);

  const esc = (value) => String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
  const clone = (value) => structuredClone(value);
  const card = (id) => state.cards[id];
  const memberIds = (group) => group ? [group.managerId, ...group.memberIds] : [];
  const groupFor = (id) => Object.values(state.groups).find((group) => memberIds(group).includes(id));
  const nonempty = (value) => Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined && String(value).trim() !== "";
  const list = (value) => Array.isArray(value) ? value : nonempty(value) ? [String(value)] : [];
  const sourceRoot = (item) => item.kind === "mention"
    ? item.source.mention_note ?? {}
    : item.kind === "tag"
      ? item.source.hashtag_note ?? {}
      : item.source;

  function sourceValues(item) {
    const source = sourceRoot(item);
    if (item.kind === "mention") return {
      displayName: source.mention ?? item.name,
      aliases: [],
      name: source.name,
      phone: source.phone ?? [],
      web: source.web ?? [],
      note: source.note,
    };
    if (item.kind === "tag") return {
      displayName: source.hashtag ?? item.name,
      aliases: [],
      note: source.note,
    };
    return {
      displayName: source.location_note?.location ?? item.name,
      aliases: [],
      lat: source.geo?.lat,
      lng: source.geo?.lng,
      alt: source.geo?.alt,
      full: source.address?.full,
      country: source.address?.components?.country,
      prefecture: source.address?.components?.prefecture,
      city: source.address?.components?.city,
      district: source.address?.components?.district,
      street: source.address?.components?.street,
      postalCode: source.address?.components?.postal_code,
      activityId: source.activity_id,
      sourceFiles: source.source_files ?? [],
      note: source.note,
    };
  }

  function handwrittenValues(item) {
    const h = item.handwritten ?? {};
    return {
      displayName: h.displayName,
      aliases: h.aliases ?? [],
      name: h.name,
      phone: h.phone ?? [],
      web: h.web ?? [],
      lat: h.geo?.lat,
      lng: h.geo?.lng,
      alt: h.geo?.alt,
      full: h.address?.full,
      country: h.address?.country,
      prefecture: h.address?.prefecture,
      city: h.address?.city,
      district: h.address?.district,
      street: h.address?.street,
      postalCode: h.address?.postalCode,
      note: h.note,
    };
  }

  function effectiveRows(item) {
    const source = sourceValues(item);
    const hand = handwrittenValues(item);
    const fields = item.kind === "mention"
      ? [["displayName", "表示名"], ["aliases", "別名"], ["name", "名前"], ["phone", "電話番号"], ["web", "Web等"], ["note", "自由メモ"]]
      : item.kind === "tag"
        ? [["displayName", "表示名"], ["aliases", "別名"], ["note", "自由メモ"]]
        : [["displayName", "表示名"], ["aliases", "別名"], ["lat", "緯度"], ["lng", "経度"], ["alt", "高度"], ["full", "住所全文"], ["country", "国"], ["prefecture", "都道府県"], ["city", "市区町村"], ["district", "地区"], ["street", "番地等"], ["postalCode", "郵便番号"], ["activityId", "活動ID"], ["sourceFiles", "元ファイル"], ["note", "人間の記憶"]];
    return fields.flatMap(([key, label]) => {
      const canOverride = !["activityId", "sourceFiles"].includes(key);
      const handValue = hand[key];
      const value = canOverride && nonempty(handValue) ? handValue : source[key];
      if (!nonempty(value)) return [];
      return [{ key, label, value: list(value).join("\n"), origin: canOverride && nonempty(handValue) ? "手書き" : "移行時点" }];
    });
  }

  function sourceRows(item) {
    const src = sourceValues(item);
    return Object.entries(src)
      .filter(([, value]) => nonempty(value))
      .map(([key, value]) => ({ label: key, value: list(value).join("\n") }));
  }

  function handRows(item) {
    const h = handwrittenValues(item);
    return Object.entries(h)
      .filter(([, value]) => nonempty(value))
      .map(([key, value]) => ({ label: key, value: list(value).join("\n") }));
  }

  function rowsHtml(rows, withOrigin = false) {
    if (!rows.length) return '<div class="compact">表示できる情報はありません。</div>';
    return `<dl class="field-grid">${rows.map((row) => `<div class="field"><dt>${esc(row.label)}${withOrigin ? ` <span class="field-origin">${esc(row.origin)}</span>` : ""}</dt><dd>${esc(row.value)}</dd></div>`).join("")}</dl>`;
  }

  function postLinks(item) {
    return `<div class="member-section-label">関連投稿（${item.relatedPosts.length}件）</div><div class="post-links">${item.relatedPosts.map((wiki) => {
      const id = wiki.replace(/^\[\[/, "").replace(/\]\]$/, "").replace(/\.md$/, "");
      return `<button class="post-link" data-action="post" data-id="${esc(id)}">${esc(wiki)}</button>`;
    }).join("") || '<span class="compact">関連投稿なし</span>'}</div>`;
  }

  function rolesFor(item, group) {
    if (!group) return ["単独カード"];
    const roles = [];
    if (group.managerId === item.id) roles.push("関係管理カード");
    for (const kind of kinds) if (group.representatives?.[kind] === item.id) roles.push(`${kindLabels[kind]}代表`);
    if (!roles.length) roles.push("構成員");
    return roles;
  }

  function locationHtml(item) {
    const group = groupFor(item.id);
    if (!group) return '<section class="current-location"><span class="current-location-label">現在地</span><strong>単独カード</strong><span>どの融合グループにも所属していません</span></section>';
    const manager = card(group.managerId);
    return `<section class="current-location"><span class="current-location-label">現在地</span><span>融合グループ「${esc(effectiveRows(manager).find((row) => row.key === "displayName")?.value ?? manager.name)}」</span><span class="location-arrow">→</span><span>関係管理カード：<strong>${esc(manager.name)}</strong></span><span class="location-arrow">→</span><span>このカードの役割：<strong>${esc(rolesFor(item, group).join("・"))}</strong></span></section>`;
  }

  function individualHtml(item, inReceptacle = false) {
    const group = groupFor(item.id);
    return `<article class="${inReceptacle ? "member" : "hero"}" data-individual-card="${esc(item.id)}">
      ${inReceptacle ? `<header><div><span class="pill kind-${item.kind}">${kindLabels[item.kind]}</span> <strong>${esc(item.name)}</strong></div><div>${rolesFor(item, group).map((role) => `<span class="role-badge">${esc(role)}</span>`).join("")}</div></header>` : `<div class="eyebrow">個別カードの実効表示</div><h2>${esc(effectiveRows(item).find((row) => row.key === "displayName")?.value ?? item.name)}</h2><span class="pill kind-${item.kind}">${kindLabels[item.kind]}</span>`}
      ${rowsHtml(effectiveRows(item), true)}
      <details class="source-details-inline"><summary>元情報を見る</summary>${rowsHtml(sourceRows(item))}</details>
      ${item.handwritten ? `<details class="source-details-inline"><summary>保存済み手書き情報</summary>${rowsHtml(handRows(item))}</details>` : ""}
      ${postLinks(item)}
      <div class="actions individual-actions">
        <button class="btn" data-action="handwritten" data-id="${esc(item.id)}">手書き</button>
        ${group ? `<button class="btn danger" data-action="split" data-id="${esc(item.id)}">このカードを分離</button>` : `<button class="btn primary" data-action="start-merge" data-id="${esc(item.id)}">融合へ追加</button>`}
        ${inReceptacle ? `<button class="btn" data-action="select-individual" data-id="${esc(item.id)}">右側で確認</button>` : ""}
      </div>
    </article>`;
  }

  function aggregateHtml(group) {
    const members = memberIds(group).map(card).filter(Boolean);
    return `<article class="hero aggregate-card" data-group-id="${esc(group.managerId)}">
      <div class="eyebrow">読み取り専用のカテゴリ別集約表示</div>
      <h2>${esc(card(group.managerId)?.name ?? group.managerId)}</h2>
      <p class="compact">関係管理カード：${esc(card(group.managerId)?.name ?? group.managerId)}／全${members.length}枚</p>
      <div class="aggregate-sections">${kinds.flatMap((kind) => {
        const id = group.representatives?.[kind];
        const representative = card(id);
        if (!representative) return [];
        const count = members.filter((item) => item.kind === kind).length;
        return [`<section class="aggregate-category kind-border-${kind}" data-representative-kind="${kind}">
          <header><span class="pill kind-${kind}">${kindLabels[kind]}</span><strong>${esc(representative.name)}</strong><span>${count}枚中の代表</span></header>
          ${rowsHtml(effectiveRows(representative), true)}
          <button class="btn" data-action="jump-kind" data-kind="${kind}">他のカードを見る</button>
        </section>`];
      }).join("")}</div>
      <div class="actions">
        <button class="btn" data-action="change-manager" data-id="${esc(group.managerId)}">関係管理カードを変更</button>
        <button class="btn" data-action="change-representatives" data-id="${esc(group.managerId)}">代表を変更</button>
        <button class="btn danger" data-action="dissolve" data-id="${esc(group.managerId)}">融合をすべて解体</button>
      </div>
    </article>`;
  }

  function receptacleHtml(group) {
    return `<section class="receptacle"><h3>受け皿（${memberIds(group).length}枚・入れ子なし）</h3>${memberIds(group).map((id) => individualHtml(card(id), true)).join("")}</section>`;
  }

  function detailHtml() {
    if (!selected) return '<div class="empty">リンク一覧または受け皿から選択してください。</div>';
    if (selected.type === "group") {
      const group = state.groups[selected.id];
      return group ? aggregateHtml(group) : '<div class="empty">融合単位が見つかりません。</div>';
    }
    const item = card(selected.id);
    return item ? `${locationHtml(item)}${individualHtml(item)}` : '<div class="empty">カードが見つかりません。</div>';
  }

  function centerHtml() {
    if (centerMode === "cases") return casesHtml();
    if (centerMode === "post") return postHtml(selected.id);
    if (centerMode === "system-log") return systemLogHtml(selected.id);
    if (selected?.type === "group" && state.groups[selected.id]) return `<div class="grid-view-container">${aggregateHtml(state.groups[selected.id])}${receptacleHtml(state.groups[selected.id])}</div>`;
    if (selected?.type === "card" && card(selected.id)) return `<div class="grid-view-container">${locationHtml(card(selected.id))}${individualHtml(card(selected.id))}</div>`;
    return linksHtml();
  }

  function unitEntries() {
    const grouped = new Set(Object.values(state.groups).flatMap(memberIds));
    const groups = Object.values(state.groups).map((group) => ({ type: "group", id: group.managerId, cards: memberIds(group).map(card) }));
    const singles = Object.values(state.cards).filter((item) => !grouped.has(item.id)).map((item) => ({ type: "card", id: item.id, cards: [item] }));
    if (statusFilter === "merged") return Object.values(state.groups).flatMap((group) => memberIds(group).map((id) => ({ type: "card", id, cards: [card(id)] })));
    return [...groups, ...singles];
  }

  function filteredEntries() {
    const term = search.trim().toLocaleLowerCase("ja");
    return unitEntries().filter((entry) => {
      if (statusFilter === "single" && entry.type !== "card") return false;
      if (statusFilter === "manager" && entry.type !== "group") return false;
      if (kindFilters.size && !entry.cards.some((item) => kindFilters.has(item.kind))) return false;
      if (handwrittenOnly && !entry.cards.some((item) => item.handwritten)) return false;
      if (!term) return true;
      return entry.cards.some((item) => [
        item.name,
        JSON.stringify(item.source),
        JSON.stringify(item.handwritten ?? {}),
        ...item.relatedPosts,
      ].join(" ").toLocaleLowerCase("ja").includes(term));
    });
  }

  function linksHtml() {
    const entries = filteredEntries();
    return `<div class="grid-view-container">
      <div class="grid-toolbar"><div class="grid-heading"><h1>Memory Synapse DB（リンク一覧）</h1><p class="drag-help"><span>⠿</span>カードを別のカードへドラッグして融合</p></div>
      <section class="filter-panel">
        <input class="filter-search" data-search value="${esc(search)}" placeholder="カード名・別名・元情報・関連投稿を検索">
        <div class="filter-row"><span class="filter-label">種類</span>${kinds.map((kind) => `<button class="filter-button ${kindFilters.has(kind) ? "active" : ""}" data-action="filter-kind" data-kind="${kind}">${kindLabels[kind]}</button>`).join("")}</div>
        <div class="filter-row"><span class="filter-label">状態</span>${[["single", "単独"], ["manager", "関係管理カード"], ["merged", "融合済み"]].map(([value, label]) => `<button class="filter-button ${statusFilter === value ? "active" : ""}" data-action="filter-status" data-status="${value}">${label}</button>`).join("")}<button class="filter-button ${handwrittenOnly ? "active" : ""}" data-action="filter-hand">手書きあり</button></div>
        <div class="filter-summary"><button class="filter-clear" data-action="clear-filter">絞り込み解除</button><span>全${unitEntries().length}件中${entries.length}件を表示（個別カード90枚）</span></div>
      </section></div>
      <div class="card-list">${entries.map((entry) => tileHtml(entry)).join("")}</div>
    </div>`;
  }

  function tileHtml(entry) {
    const manager = card(entry.id);
    const title = entry.type === "group" ? `${manager.name}（融合${entry.cards.length}枚）` : effectiveRows(manager).find((row) => row.key === "displayName")?.value ?? manager.name;
    return `<button class="card-tile ${selected?.id === entry.id ? "selected" : ""}" draggable="true" data-entry-type="${entry.type}" data-card-id="${esc(entry.id)}">
      <div class="card-title"><span class="card-name"><span class="drag-handle">⠿</span><strong>${esc(title)}</strong></span><span class="pill kind-${manager.kind}">${kindLabels[manager.kind]}</span></div>
      <div class="meta"><span>${entry.type === "group" ? "関係管理カード" : "単独"}</span><span>関連投稿 ${new Set(entry.cards.flatMap((item) => item.relatedPosts)).size}件</span>${entry.cards.some((item) => item.handwritten) ? "<span>手書きあり</span>" : ""}</div>
    </button>`;
  }

  function casesHtml() {
    return `<div class="sample-case-list"><header><div><h1>検証ケース一覧</h1><p>重点検証16件・件数確認74件・合計90件</p></div><div class="sample-case-status ok">整合性検査：合格</div></header>
      <section class="sample-case-cards">${sample.cases.map((testCase) => `<button class="sample-case-card ${testCase.role === "重点検証" ? "focus" : ""}" data-action="post" data-id="${esc(testCase.targetPostId)}"><span class="sample-case-card-number">${esc(testCase.number)}</span><span class="sample-case-card-role">${esc(testCase.role)}</span><strong>${testCase.labels.map(esc).join("・")}</strong><span>${esc(testCase.purpose)}</span><small>${esc(testCase.targetPostId)}.md</small></button>`).join("")}</section></div>`;
  }

  function postHtml(id) {
    const item = Object.values(sample.posts).find((post) => post.id === id);
    const testCase = sample.cases.find((entry) => entry.targetPostId === id);
    if (!item) return '<div class="empty">投稿が見つかりません。</div>';
    const media = testCase?.mediaCondition ?? [];
    return `<div class="log-view"><h1>${esc(item.id)}.md</h1>
      ${testCase ? `<section class="sample-case-banner ${testCase.role === "重点検証" ? "focus" : ""}"><div class="sample-case-heading"><span class="sample-case-number">${esc(testCase.number)}</span><strong>${esc(testCase.role)}</strong></div><div class="sample-case-labels">${testCase.labels.map((label) => `<span>${esc(label)}</span>`).join("")}</div><p>${esc(testCase.purpose)}</p></section>` : ""}
      <div class="properties-block"><div class="properties-grid"><div class="prop-key">source</div><div>${esc(item.source)}</div><div class="prop-key">type</div><div>${esc(item.type)}</div><div class="prop-key">date</div><div>${esc(item.date)}</div><div class="prop-key">tags</div><div>${esc(item.tags?.join("、") ?? "")}</div><div class="prop-key">mentions</div><div>${esc(item.mentions?.join("、") ?? "")}</div></div></div>
      ${item.caption ? `<p class="sample-caption">${esc(item.caption)}</p>` : '<p class="sample-caption-empty">本文は空です</p>'}
      ${media.length ? `<div class="sample-media-grid">${media.map((entry, index) => `<figure class="sample-media"><div class="${entry.exists === false ? "sample-media-missing" : "sample-media-empty"}">メディア ${index + 1}<span>${esc(entry.relativePath ?? entry.path ?? "台帳参照")}</span></div></figure>`).join("")}</div>` : '<div class="sample-media-empty">メディアなし</div>'}
      <hr><div class="post-links">${item.links.map((link) => `<span class="post-link">${esc(link.wiki)}</span>`).join("")}</div>
    </div>`;
  }

  function systemLogHtml(id) {
    const item = Object.values(sample.systemLogs).find((log) => log.id === id);
    if (!item) return '<div class="empty">SystemLogが見つかりません。</div>';
    return `<div class="log-view"><h1>${esc(item.filename ?? `${item.id}.md`)}</h1>
      <div class="properties-block">${rowsHtml(Object.entries(item).map(([label, value]) => ({
        label,
        value: typeof value === "object" ? JSON.stringify(value, null, 2) : String(value ?? ""),
      })))}</div>
    </div>`;
  }

  function explorerFolder(name, depth, childrenHtml) {
    const open = openFolders.has(name);
    return `<button class="tree-item" style="padding-left:${16 + depth * 16}px" data-action="toggle-folder" data-folder="${esc(name)}"><span>${open ? "▼" : "▶"}</span><span>${esc(name)}</span></button>${open ? childrenHtml() : ""}`;
  }

  function explorerPosts(folder, postType, depth) {
    return explorerFolder(folder, depth, () => Object.values(sample.posts)
      .filter((post) => post.type === postType)
      .sort((a, b) => b.id.localeCompare(a.id))
      .map((post) => {
        const testCase = sample.cases.find((entry) => entry.targetPostId === post.id);
        return `<button class="tree-item ${selected?.type === "post" && selected.id === post.id ? "active" : ""}" style="padding-left:${32 + (depth + 1) * 16}px" data-action="post" data-id="${esc(post.id)}"><span class="tree-case-number ${testCase?.role === "重点検証" ? "focus" : ""}">${esc(testCase?.number ?? "")}</span><span class="tree-file-name">${esc(post.id)}</span></button>`;
      }).join(""));
  }

  function explorerSynapseFolder(folder, kind, depth) {
    return explorerFolder(folder, depth, () => Object.values(state.cards)
      .filter((item) => item.kind === kind)
      .map((item) => `<button class="tree-item ${selected?.type === "card" && selected.id === item.id ? "active" : ""}" style="padding-left:${32 + (depth + 1) * 16}px" data-action="select-individual" data-id="${esc(item.id)}"><span class="tree-file-name">${esc(item.name)}.md</span></button>`)
      .join(""));
  }

  function explorerHtml() {
    return explorerFolder("Instagram_Logs", 0, () => [
      explorerPosts("Posts", "Feed", 1),
      explorerPosts("Reels", "Reels", 1),
      explorerPosts("Stories", "Stories", 1),
      explorerFolder("Synapses", 1, () => [
        explorerSynapseFolder("Locations", "location", 2),
        explorerSynapseFolder("Mentions", "mention", 2),
        explorerSynapseFolder("Tags", "tag", 2),
      ].join("")),
      explorerFolder("SystemLogs", 1, () => Object.values(sample.systemLogs).map((log) => `<button class="tree-item ${selected?.type === "system-log" && selected.id === log.id ? "active" : ""}" style="padding-left:64px" data-action="system-log" data-id="${esc(log.id)}"><span class="tree-file-name">${esc(log.filename ?? log.id)}.md</span></button>`).join("")),
    ].join(""));
  }

  function shellHtml() {
    return `<main class="app-shell">
      <aside class="obsidian-ribbon"><span>◀</span><span>▶</span><span>🔍</span><span>📁</span><span>@</span><span>📍</span><span>🖊</span></aside>
      <aside class="obsidian-sidebar-left"><div class="sidebar-header"><span>エクスプローラー</span></div><div class="explorer-tree">${explorerHtml()}</div></aside>
      <section class="obsidian-center">
        <div class="sample-environment-banner"><strong>ブラウザー用UIモック</strong><span>架空のサンプルデータ</span><span>実Vaultを読み込みません</span><span>正式プラグインではありません</span></div>
        <nav class="tab-bar"><button class="tab ${centerMode === "links" ? "active" : ""}" data-action="links">リンク一覧</button><button class="tab ${centerMode === "cases" ? "active" : ""}" data-action="cases">検証ケース</button><button class="tab" data-action="reset">初期状態へ戻す</button><button class="tab" data-action="undo">元に戻す</button></nav>
        <div class="center-content">${centerHtml()}</div>
      </section>
      <aside class="obsidian-sidebar-right"><div class="sidebar-right-header"><h2>Memory Synapse</h2><div class="sidebar-header-actions"><button class="btn-open-grid" data-action="cases">🧪 検証ケース</button><button class="btn-open-grid" data-action="links">🔗 リンク一覧</button></div></div><div class="panel-body"><div class="notice">${esc(notice)}</div>${detailHtml()}</div></aside>
      ${dialogHtml()}
    </main>`;
  }

  function formField(name, label, value, area = false, wide = false) {
    return `<label class="${wide ? "span-2" : ""}">${label}${area ? `<textarea name="${name}" rows="3">${esc(value ?? "")}</textarea>` : `<input name="${name}" value="${esc(value ?? "")}">`}</label>`;
  }

  function editableFields(item, values) {
    const common = formField("displayName", "表示名", values.displayName) + formField("aliases", "別名（1行1件）", list(values.aliases).join("\n"), true);
    if (item.kind === "tag") return common + formField("note", "自由メモ", values.note, true, true);
    if (item.kind === "mention") return common + formField("name", "名称", values.name) + formField("phone", "電話（1行1件）", list(values.phone).join("\n"), true) + formField("web", "Web等（1行1件）", list(values.web).join("\n"), true) + formField("note", "自由メモ", values.note, true, true);
    return common + formField("lat", "緯度", values.lat) + formField("lng", "経度", values.lng) + formField("alt", "高度", values.alt) + formField("full", "住所全文", values.full, false, true) + formField("country", "国", values.country) + formField("prefecture", "都道府県", values.prefecture) + formField("city", "市区町村", values.city) + formField("district", "地区", values.district) + formField("street", "番地等", values.street) + formField("postalCode", "郵便番号", values.postalCode) + formField("note", "自由メモ", values.note, true, true);
  }

  function dialogHtml() {
    if (!dialog) return "";
    if (dialog.type === "handwritten") {
      const item = card(dialog.cardId);
      const values = dialog.draft ?? handwrittenValues(item);
      const hidden = Object.entries(handwrittenValues(item)).filter(([key, value]) => nonempty(value) && !editableKeys(item.kind).includes(key));
      const body = dialog.review
        ? `<div class="handwritten-comparison"><div><h3>現在の手書き情報</h3><pre class="summary">${esc(JSON.stringify(item.handwritten ?? {}, null, 2))}</pre></div><div><h3>操作後</h3><pre class="summary">${esc(JSON.stringify(dialog.draft, null, 2))}</pre></div></div><div class="notice">変更するファイル：${esc(item.name)}.md／元情報・関連投稿・融合状態は変更しません。取消できます。</div>`
        : `<p class="notice">${kindLabels[item.kind]}に必要な項目だけを編集します。空欄は元情報を消しません。</p><form id="hand-form" class="form-grid">${editableFields(item, values)}</form>${hidden.length ? `<details><summary>保存済みのその他項目（変更しません）</summary>${rowsHtml(hidden.map(([label, value]) => ({ label, value: list(value).join("\n") })))}</details>` : ""}`;
      return modal(`${kindLabels[item.kind]}の手書き情報`, body, dialog.review ? "保存" : "保存内容を確認", dialog.review ? "confirm-hand" : "review-hand");
    }
    if (dialog.type === "merge") {
      const ids = combinedMemberIds(dialog.sourceId, dialog.targetId);
      const cards = ids.map(card);
      const recommended = [...cards].sort((a, b) => kindPriority[b.kind] - kindPriority[a.kind])[0]?.id;
      const body = `<div class="notice">候補を確認してから融合します。推奨は種類優先順位 Mention → Location → Tag です。</div>
        <form id="merge-form"><h3>関係管理カード</h3>${ids.map((id) => choice("managerId", id, card(id).name, id === recommended)).join("")}
        ${kinds.flatMap((kind) => {
          const same = cards.filter((item) => item.kind === kind);
          if (!same.length) return [];
          const current = same.find((item) => groupFor(item.id)?.representatives?.[kind] === item.id)?.id ?? same[0].id;
          return [`<h3>${kindLabels[kind]}代表</h3>${same.map((item) => choice(`representative-${kind}`, item.id, item.name, item.id === current)).join("")}`];
        }).join("")}</form>`;
      return modal("融合後の関係を確認", body, "融合する", "confirm-merge");
    }
    if (dialog.type === "representatives" || dialog.type === "manager") {
      const group = state.groups[dialog.groupId];
      const ids = memberIds(group);
      const body = dialog.type === "manager"
        ? `<form id="relation-form"><p class="notice">代表は変更せず、関係管理カードだけを変更します。</p>${ids.map((id) => choice("managerId", id, card(id).name, id === group.managerId)).join("")}</form>`
        : `<form id="relation-form"><p class="notice">関係管理カードは変更せず、カテゴリ別代表だけを変更します。</p>${kinds.flatMap((kind) => {
          const same = ids.filter((id) => card(id).kind === kind);
          if (!same.length) return [];
          return [`<h3>${kindLabels[kind]}代表</h3>${same.map((id) => choice(`representative-${kind}`, id, card(id).name, id === group.representatives[kind])).join("")}`];
        }).join("")}</form>`;
      return modal(dialog.type === "manager" ? "関係管理カードを変更" : "カテゴリ別代表を変更", body, "変更内容を確認して反映", dialog.type === "manager" ? "confirm-manager" : "confirm-representatives");
    }
    return "";
  }

  function modal(title, body, confirmLabel, action) {
    return `<div class="dialog-backdrop"><section class="dialog" role="dialog" aria-modal="true"><header><h2>${esc(title)}</h2></header><div class="dialog-content">${body}</div><footer><button class="btn" data-action="cancel">キャンセル</button><button class="btn primary" data-action="${action}">${esc(confirmLabel)}</button></footer></section></div>`;
  }

  function choice(name, value, label, checked) {
    return `<label class="choice ${checked ? "recommended" : ""}"><input type="radio" name="${name}" value="${esc(value)}" ${checked ? "checked" : ""}><span><strong>${esc(label)}</strong>${checked ? "<small>現在または推奨候補</small>" : ""}</span></label>`;
  }

  function editableKeys(kind) {
    return kind === "tag"
      ? ["displayName", "aliases", "note"]
      : kind === "mention"
        ? ["displayName", "aliases", "name", "phone", "web", "note"]
        : ["displayName", "aliases", "lat", "lng", "alt", "full", "country", "prefecture", "city", "district", "street", "postalCode", "note"];
  }

  function readHandForm(item) {
    const form = document.querySelector("#hand-form");
    const data = new FormData(form);
    const value = (name) => String(data.get(name) ?? "").trim();
    const values = (name) => [...new Set(value(name).split("\n").map((entry) => entry.trim()).filter(Boolean))];
    const old = handwrittenValues(item);
    const result = { ...old };
    for (const key of editableKeys(item.kind)) result[key] = ["aliases", "phone", "web"].includes(key) ? values(key) : value(key);
    return result;
  }

  function toStoredHand(draft) {
    return {
      displayName: draft.displayName,
      aliases: draft.aliases ?? [],
      name: draft.name,
      phone: draft.phone ?? [],
      web: draft.web ?? [],
      geo: { lat: draft.lat, lng: draft.lng, alt: draft.alt },
      address: { full: draft.full, country: draft.country, prefecture: draft.prefecture, city: draft.city, district: draft.district, street: draft.street, postalCode: draft.postalCode },
      note: draft.note,
    };
  }

  function combinedMemberIds(sourceId, targetId) {
    const ids = [];
    for (const id of [sourceId, targetId]) {
      const group = groupFor(id);
      for (const memberId of group ? memberIds(group) : [id]) if (!ids.includes(memberId)) ids.push(memberId);
    }
    return ids;
  }

  function saveHistory() {
    history.push(clone(state));
    if (history.length > 20) history.shift();
  }

  function buildRepresentatives(ids, form) {
    const representatives = {};
    for (const kind of kinds) {
      const same = ids.filter((id) => card(id).kind === kind);
      if (!same.length) continue;
      const selectedId = form.get(`representative-${kind}`);
      representatives[kind] = same.includes(selectedId) ? selectedId : same[0];
    }
    return representatives;
  }

  function merge(sourceId, targetId) {
    const ids = combinedMemberIds(sourceId, targetId);
    const form = new FormData(document.querySelector("#merge-form"));
    const managerId = String(form.get("managerId") ?? "");
    if (!ids.includes(managerId)) return;
    saveHistory();
    for (const [id, group] of Object.entries(state.groups)) if (ids.some((memberId) => memberIds(group).includes(memberId))) delete state.groups[id];
    const representatives = buildRepresentatives(ids, form);
    state.groups[managerId] = { schemaVersion: 2, managerId, memberIds: ids.filter((id) => id !== managerId), representatives };
    selected = { type: "group", id: managerId };
    dialog = null;
    notice = `融合しました。関係管理カード：${card(managerId).name}。個別カードは全て保持しています。`;
  }

  function split(id) {
    const group = groupFor(id);
    if (!group) return;
    saveHistory();
    const remaining = memberIds(group).filter((memberId) => memberId !== id);
    delete state.groups[group.managerId];
    if (remaining.length >= 2) {
      const managerId = remaining.includes(group.managerId) ? group.managerId : [...remaining].sort((a, b) => kindPriority[card(b).kind] - kindPriority[card(a).kind])[0];
      const representatives = {};
      for (const kind of kinds) {
        const same = remaining.filter((memberId) => card(memberId).kind === kind);
        if (!same.length) continue;
        representatives[kind] = same.includes(group.representatives[kind]) ? group.representatives[kind] : same[0];
      }
      state.groups[managerId] = { schemaVersion: 2, managerId, memberIds: remaining.filter((memberId) => memberId !== managerId), representatives };
    }
    selected = { type: "card", id };
    notice = `${card(id).name}を分離しました。元情報と手書き情報は保持しています。`;
  }

  function dissolve(groupId) {
    if (!state.groups[groupId]) return;
    saveHistory();
    delete state.groups[groupId];
    selected = null;
    notice = "融合を解体しました。個別カードと手書き情報は全て保持しています。";
  }

  function render() {
    root.innerHTML = shellHtml();
    bind();
  }

  function bind() {
    document.querySelector("[data-search]")?.addEventListener("input", (event) => {
      search = event.target.value;
      render();
      const input = document.querySelector("[data-search]");
      input?.focus();
      input?.setSelectionRange(search.length, search.length);
    });
    document.querySelectorAll("[data-card-id].card-tile").forEach((tile) => {
      tile.addEventListener("click", () => {
        selected = { type: tile.dataset.entryType === "group" ? "group" : "card", id: tile.dataset.cardId };
        centerMode = "detail";
        render();
      });
      tile.addEventListener("dragstart", () => { dragId = tile.dataset.cardId; });
      tile.addEventListener("dragover", (event) => { event.preventDefault(); tile.classList.add("drag-over"); });
      tile.addEventListener("dragleave", () => tile.classList.remove("drag-over"));
      tile.addEventListener("drop", (event) => {
        event.preventDefault();
        tile.classList.remove("drag-over");
        if (dragId && dragId !== tile.dataset.cardId) {
          dialog = { type: "merge", sourceId: dragId, targetId: tile.dataset.cardId };
          render();
        }
        dragId = null;
      });
    });
    document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => act(button.dataset)));
  }

  function act(data) {
    const action = data.action;
    if (action === "toggle-folder") {
      openFolders.has(data.folder) ? openFolders.delete(data.folder) : openFolders.add(data.folder);
    } else if (action === "links") { centerMode = "links"; selected = null; }
    else if (action === "cases") { centerMode = "cases"; selected = null; }
    else if (action === "post") { centerMode = "post"; selected = { type: "post", id: data.id }; }
    else if (action === "system-log") { centerMode = "system-log"; selected = { type: "system-log", id: data.id }; }
    else if (action === "select-individual") { centerMode = "detail"; selected = { type: "card", id: data.id }; notice = "個別カードを表示しています。"; }
    else if (action === "start-merge") {
      const targetId = Object.keys(state.cards).find((id) => id !== data.id && !groupFor(id));
      dialog = { type: "merge", sourceId: data.id, targetId };
    } else if (action === "handwritten") dialog = { type: "handwritten", cardId: data.id, review: false };
    else if (action === "review-hand") { dialog.draft = readHandForm(card(dialog.cardId)); dialog.review = true; }
    else if (action === "confirm-hand") {
      saveHistory();
      card(dialog.cardId).handwritten = toStoredHand(dialog.draft);
      selected = { type: "card", id: dialog.cardId };
      dialog = null;
      notice = "選択した個別カードの手書き情報だけを更新しました。元情報は保持しています。";
    } else if (action === "confirm-merge") merge(dialog.sourceId, dialog.targetId);
    else if (action === "change-manager") dialog = { type: "manager", groupId: data.id };
    else if (action === "change-representatives") dialog = { type: "representatives", groupId: data.id };
    else if (action === "confirm-manager" || action === "confirm-representatives") {
      const oldGroup = state.groups[dialog.groupId];
      const ids = memberIds(oldGroup);
      const form = new FormData(document.querySelector("#relation-form"));
      saveHistory();
      if (action === "confirm-manager") {
        const managerId = String(form.get("managerId"));
        delete state.groups[oldGroup.managerId];
        state.groups[managerId] = { ...oldGroup, managerId, memberIds: ids.filter((id) => id !== managerId) };
        selected = { type: "group", id: managerId };
        notice = "関係管理カードだけを変更しました。カテゴリ別代表は維持しています。";
      } else {
        oldGroup.representatives = buildRepresentatives(ids, form);
        selected = { type: "group", id: oldGroup.managerId };
        notice = "カテゴリ別代表だけを変更しました。関係管理カードは維持しています。";
      }
      dialog = null;
    } else if (action === "split") split(data.id);
    else if (action === "dissolve") dissolve(data.id);
    else if (action === "cancel") { dialog = null; notice = "キャンセルしました。状態は変更していません。"; }
    else if (action === "reset") { state = clone(initial); history = []; selected = { type: "group", id: Object.keys(state.groups)[0] }; centerMode = "links"; openFolders = new Set(["Instagram_Logs", "Synapses"]); notice = "初期状態へ戻しました。"; }
    else if (action === "undo") {
      const previous = history.pop();
      if (previous) { state = previous; selected = null; centerMode = "links"; notice = "直前の操作前へ戻しました。"; }
    } else if (action === "filter-kind") kindFilters.has(data.kind) ? kindFilters.delete(data.kind) : kindFilters.add(data.kind);
    else if (action === "filter-status") statusFilter = statusFilter === data.status ? "" : data.status;
    else if (action === "filter-hand") handwrittenOnly = !handwrittenOnly;
    else if (action === "clear-filter") { search = ""; kindFilters.clear(); statusFilter = ""; handwrittenOnly = false; }
    else if (action === "jump-kind") document.querySelector(`[data-individual-card="${state.groups[selected.id]?.representatives?.[data.kind]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    render();
  }

  render();
})();
