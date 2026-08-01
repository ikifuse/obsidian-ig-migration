import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";

const repoRoot = path.resolve(import.meta.dirname, "../..");
const projectRoot = path.resolve(import.meta.dirname, "..");
const archivedMapName = "マインドマップ_2026-07-26_プロジェクト地図へ置換";
const sourceRoot = path.join(repoRoot, "99_完了済み参考資料", archivedMapName);
const mapsRoot = path.join(projectRoot, "maps");
const snapshotRoot = path.join(projectRoot, "reference-map-copy");

const sourceFiles = [
  "index.html",
  "styles.css",
  "app.js",
  "data/map-data.js",
];

const sourceCode = fs.readFileSync(
  path.join(sourceRoot, "data/map-data.js"),
  "utf8",
);
const context = {};
vm.createContext(context);
vm.runInContext(
  `${sourceCode}\n;globalThis.__mapExport = { views, stages, flowEdges };`,
  context,
);
const { views, stages, flowEdges } = context.__mapExport;

const hashFile = (file) =>
  crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyReferenceSnapshot() {
  ensureDir(path.join(snapshotRoot, "data"));
  for (const relative of sourceFiles) {
    const destination = path.join(snapshotRoot, relative);
    ensureDir(path.dirname(destination));
    fs.copyFileSync(path.join(sourceRoot, relative), destination);
  }

  const hashes = sourceFiles
    .map((relative) => {
      const file = path.join(sourceRoot, relative);
      return `- \`${hashFile(file)}\`  \`${relative}\``;
    })
    .join("\n");

  fs.writeFileSync(
    path.join(snapshotRoot, "SOURCE_MANIFEST.md"),
    `# 公開参考資料マップ 複製記録

このディレクトリは、分解前の単一地図を変更せず複製した、公開用の読み取り専用スナップショットです。

## 原本

- ローカル退役先：\`../../99_完了済み参考資料/${archivedMapName}/\`
- 複製対象：Web本体4ファイル
- 除外：\`.DS_Store\`、原本保持用\`AGENTS.md\`

## SHA-256

${hashes}

この複製を直接編集せず、七つの\`prototype/\`を派生先として使用します。
`,
  );
}

function normalizeNode(node) {
  if (typeof node === "string") {
    return { label: node, children: [] };
  }
  return {
    label: node.label,
    children: (node.children ?? []).map(normalizeNode),
  };
}

function viewTree(viewId, title, subtitle) {
  const view = views[viewId];
  const children = [];
  if (view.toc) {
    children.push({
      label: view.toc,
      children: (view.tocEntries ?? []).map(normalizeNode),
    });
  }
  for (const [label, branchChildren] of view.branches) {
    children.push({
      label,
      children: branchChildren.map(normalizeNode),
    });
  }
  return {
    meta: {
      id: viewId,
      title,
      subtitle,
      mode: "tree",
      source: `公開参考資料 map-data.js / views.${viewId}`,
      status: "企画検証用の叩き台",
    },
    root: {
      label: view.title,
      note: "クリックして分岐を開く",
      children,
    },
  };
}

function overallFlow() {
  const ids = [
    "idea",
    "plan",
    "design",
    "spec",
    "igp",
    "igr",
    "igs",
    "igx",
    "igc",
    "import",
    "memory",
    "goal",
  ];
  const stageById = new Map(stages.map((stage) => [stage.id, stage]));
  const rows = [
    ["idea"],
    ["plan"],
    ["design"],
    ["spec"],
    ["igp", "igr", "igs", "igx"],
    ["igc"],
    ["import"],
    ["memory"],
    ["goal"],
  ];
  const links = {
    plan: "../../01_企画地図/prototype/index.html",
    design: "../../02_設計地図/prototype/index.html",
    spec: "../../04_仕様地図/prototype/index.html",
    igc: "../../09_IGC統合地図/prototype/index.html",
    memory: "../../10_Memory_Synapse_DB地図/prototype/index.html",
  };
  return {
    meta: {
      id: "overall-flow",
      title: "プロジェクト全体フロー",
      subtitle: "発端から親完成、独立後続までの縦軸",
      mode: "flow",
      source: "公開参考資料 map-data.js / stages・flowEdges",
      status: "企画検証用の叩き台",
    },
    flow: {
      rows,
      nodes: ids.map((id) => {
        const stage = stageById.get(id);
        return {
          id,
          label: stage.label,
          note: stage.note,
          kind: stage.kind,
          link: links[id] ?? null,
        };
      }),
      edges: flowEdges.filter(
        ([from, to]) => ids.includes(from) && ids.includes(to),
      ),
    },
  };
}

function routingTree() {
  const routes = [
    ["全般の構造確認", ["00_目次.md", "該当ディレクトリの00_案内"]],
    ["企画", ["docs/planning-workflow.md", "01_IG移行企画書v1.0.md", "確認後に停止"]],
    ["設計", ["docs/design-workflow.md", "02_IG移行設計書/00_設計書目次.md", "必要な現役分冊", "承認まで停止"]],
    ["仕様", ["docs/specification-workflow.md", "04_IG移行仕様書/00_仕様書目次.md", "対象仕様と対応設計", "承認まで停止"]],
    ["実装・成果物検証", ["docs/implementation-workflow.md", "対象の00_コード構成.md", "対象仕様・コード・成果物", "範囲外変更は停止"]],
    ["文書の配置・退役", ["docs/document-governance.md", "対象資料と配置根拠", "移動・削除は別承認"]],
    ["恒久ルールの変更", ["docs/rule-addition-criteria.md", "docs/information-architecture.md", "根拠と影響を確認"]],
    ["09 IGC統合", ["09_IGC統合/AGENTS.mdを追加適用", "IGC側だけの解決を先に検証"]],
    ["10 Memory Synapse DB", ["10_Memory_Synapse_DB/AGENTS.mdを追加適用", "親完成条件へ戻さない"]],
  ].map(([label, entries]) => ({
    label,
    children: entries.map((entry) => ({ label: entry, children: [] })),
  }));

  const ruleBranches = views.rules.branches.map(([label, children]) => ({
    label,
    children: children.map(normalizeNode),
  }));
  const docBranches = views.docs.branches.map(([label, children]) => ({
    label,
    children: children.map(normalizeNode),
  }));

  return {
    meta: {
      id: "rules-routing",
      title: "親AGENTS・docs 判断ルーティング",
      subtitle: "作業内容から読む文書、承認、停止点へ進む",
      mode: "routing",
      source: "公開参考資料 views.rules・views.docs ＋ 現役AGENTS読み込みルーター",
      status: "企画検証用の叩き台",
    },
    root: {
      label: "作業を始める",
      note: "何をするかを選ぶ",
      children: [
        { label: "作業種類から読む文書を選ぶ", children: routes },
        { label: "全工程で守る判断原則", children: ruleBranches },
        { label: "工程の進め方と文書保全", children: docBranches },
      ],
    },
  };
}

const mapDefinitions = [
  {
    directory: "00_プロジェクト全体フロー",
    data: overallFlow(),
  },
  {
    directory: "01_企画地図",
    data: viewTree(
      "plan",
      "01 企画地図",
      "目的・理由・価値・完走点・判断原則",
    ),
  },
  {
    directory: "02_設計地図",
    data: viewTree(
      "design",
      "02 設計地図",
      "企画条件から構造・責任・境界への変換",
    ),
  },
  {
    directory: "04_仕様地図",
    data: viewTree(
      "spec",
      "04 仕様地図",
      "入力・処理・出力・例外・再実行・完了条件",
    ),
  },
  {
    directory: "09_IGC統合地図",
    data: viewTree(
      "igc",
      "09 IGC統合地図",
      "統合・安全更新・上流境界・親完成",
    ),
  },
  {
    directory: "10_Memory_Synapse_DB地図",
    data: viewTree(
      "memory",
      "10 Memory Synapse DB地図",
      "独立後続・知識モデル・人間判断・復旧",
    ),
  },
  {
    directory: "90_親AGENTS・docs判断ルーティング",
    data: routingTree(),
  },
];

const styles = `
:root {
  color-scheme: light;
  --bg: #f5f3ee;
  --panel: rgba(255, 255, 255, 0.92);
  --ink: #20251f;
  --muted: #667064;
  --line: #a9b3a6;
  --accent: #315c4a;
  --accent-soft: #dfe9e3;
  --flow: #456d5b;
  --warn: #9b6b2f;
  --shadow: 0 10px 28px rgba(32, 37, 31, 0.12);
}
* { box-sizing: border-box; }
html, body { margin: 0; width: 100%; height: 100%; overflow: hidden; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic", sans-serif;
  color: var(--ink);
  background:
    radial-gradient(circle at 15% 0%, rgba(49, 92, 74, 0.10), transparent 28rem),
    var(--bg);
}
button, a { font: inherit; }
.app { display: grid; grid-template-rows: auto 1fr; width: 100%; height: 100%; }
.toolbar {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  background: var(--panel);
  border-bottom: 1px solid rgba(49, 92, 74, 0.16);
  backdrop-filter: blur(14px);
}
.identity { min-width: 0; margin-right: auto; }
.title { margin: 0; font-size: 16px; font-weight: 700; }
.subtitle { margin: 2px 0 0; color: var(--muted); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.badge { display: inline-flex; padding: 4px 8px; border-radius: 999px; color: var(--accent); background: var(--accent-soft); font-size: 11px; white-space: nowrap; }
.controls { display: flex; align-items: center; gap: 6px; }
.btn {
  min-height: 34px;
  padding: 6px 10px;
  border: 1px solid rgba(49, 92, 74, 0.20);
  border-radius: 9px;
  color: var(--ink);
  background: #fff;
  text-decoration: none;
  cursor: pointer;
}
.btn:hover { background: var(--accent-soft); }
.viewport { position: relative; overflow: hidden; cursor: grab; touch-action: none; }
.viewport.is-dragging { cursor: grabbing; }
.world { position: absolute; inset: 0 auto auto 0; transform-origin: 0 0; }
.edges { position: absolute; inset: 0; overflow: visible; pointer-events: none; }
.edge { fill: none; stroke: var(--line); stroke-width: 2; }
.edge.flow { stroke: var(--flow); stroke-width: 3; }
.edge.excluded { stroke: var(--warn); stroke-dasharray: 8 6; }
.node {
  position: absolute;
  width: 236px;
  min-height: 68px;
  padding: 10px 12px;
  border: 1px solid rgba(49, 92, 74, 0.18);
  border-radius: 12px;
  color: var(--ink);
  background: rgba(255, 255, 255, 0.96);
  box-shadow: var(--shadow);
  text-align: left;
  cursor: pointer;
}
.node:hover, .node:focus-visible { border-color: var(--accent); outline: 3px solid rgba(49, 92, 74, 0.18); }
.node.root { background: var(--accent); color: #fff; }
.node.parallel { background: #edf4f0; }
.node.excluded { border-color: #bd8b4f; background: #fff7e9; }
.node.owner, .node.goal { background: #e8eee2; }
.node-label { display: block; font-weight: 700; font-size: 14px; line-height: 1.35; }
.node-note { display: block; margin-top: 5px; color: var(--muted); font-size: 11px; line-height: 1.35; }
.node.root .node-note { color: rgba(255,255,255,.78); }
.node-toggle { float: right; margin-left: 7px; color: inherit; opacity: .65; }
.node-link { display: inline-block; margin-top: 7px; color: var(--accent); font-size: 11px; font-weight: 700; }
.node.root .node-link { color: #fff; }
.hint {
  position: absolute;
  left: 12px;
  bottom: 10px;
  z-index: 4;
  max-width: calc(100% - 24px);
  padding: 6px 9px;
  border-radius: 8px;
  color: var(--muted);
  background: rgba(255,255,255,.88);
  font-size: 11px;
  pointer-events: none;
}
@media (max-width: 760px) {
  .toolbar { flex-wrap: wrap; gap: 8px; }
  .identity { width: calc(100% - 116px); }
  .controls { width: 100%; overflow-x: auto; }
  .btn { white-space: nowrap; }
  .badge { margin-left: auto; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { scroll-behavior: auto !important; }
}
`;

const app = `
(() => {
  const map = window.PROTOTYPE_MAP;
  const viewport = document.querySelector("[data-viewport]");
  const world = document.querySelector("[data-world]");
  const svg = document.querySelector("[data-edges]");
  const nodesHost = document.querySelector("[data-nodes]");
  const countHost = document.querySelector("[data-count]");
  const fitButton = document.querySelector("[data-fit]");
  const expandButton = document.querySelector("[data-expand]");
  const collapseButton = document.querySelector("[data-collapse]");
  const zoomInButton = document.querySelector("[data-zoom-in]");
  const zoomOutButton = document.querySelector("[data-zoom-out]");
  const NODE_W = 236;
  const NODE_H = 76;
  const GAP_X = 92;
  const GAP_Y = 24;
  const transform = { x: 0, y: 0, scale: 1 };
  const expanded = new Set();
  let nodeIndex = new Map();
  let positions = new Map();
  let edges = [];
  let worldWidth = 1200;
  let worldHeight = 800;

  function assignIds(node, path = "root") {
    node.id = path;
    nodeIndex.set(path, node);
    (node.children || []).forEach((child, index) => assignIds(child, path + "-" + index));
  }

  if (map.root) {
    assignIds(map.root);
    expanded.add("root");
  } else {
    for (const node of map.flow.nodes) nodeIndex.set(node.id, node);
  }

  function visibleChildren(node) {
    return expanded.has(node.id) ? (node.children || []) : [];
  }

  function treeSpan(node) {
    const children = visibleChildren(node);
    if (!children.length) return NODE_H;
    return Math.max(
      NODE_H,
      children.reduce((sum, child, index) => sum + treeSpan(child) + (index ? GAP_Y : 0), 0),
    );
  }

  function placeTree(node, depth, top) {
    const children = visibleChildren(node);
    const span = treeSpan(node);
    let y = top + span / 2 - NODE_H / 2;
    if (children.length) {
      let cursor = top;
      for (const child of children) {
        const childSpan = treeSpan(child);
        placeTree(child, depth + 1, cursor);
        cursor += childSpan + GAP_Y;
      }
      const first = positions.get(children[0].id);
      const last = positions.get(children[children.length - 1].id);
      y = (first.y + last.y) / 2;
    }
    positions.set(node.id, { x: 60 + depth * (NODE_W + GAP_X), y });
    for (const child of children) edges.push([node.id, child.id, "tree"]);
  }

  function routeSpan(node) {
    const children = visibleChildren(node);
    if (!children.length) return NODE_W;
    return Math.max(
      NODE_W,
      children.reduce((sum, child, index) => sum + routeSpan(child) + (index ? 34 : 0), 0),
    );
  }

  function placeRouting(node, depth, left) {
    const children = visibleChildren(node);
    const span = routeSpan(node);
    let x = left + span / 2 - NODE_W / 2;
    if (children.length) {
      let cursor = left;
      for (const child of children) {
        const childSpan = routeSpan(child);
        placeRouting(child, depth + 1, cursor);
        cursor += childSpan + 34;
      }
      const first = positions.get(children[0].id);
      const last = positions.get(children[children.length - 1].id);
      x = (first.x + last.x) / 2;
    }
    positions.set(node.id, { x, y: 60 + depth * 132 });
    for (const child of children) edges.push([node.id, child.id, "routing"]);
  }

  function placeFlow() {
    const byId = new Map(map.flow.nodes.map((node) => [node.id, node]));
    const maxColumns = Math.max(1, ...map.flow.rows.map((row) => row.length));
    map.flow.rows.forEach((row, rowIndex) => {
      const width = row.length * NODE_W + Math.max(0, row.length - 1) * 32;
      const startX = 80 + (maxColumns * NODE_W + (maxColumns - 1) * 32 - width) / 2;
      row.forEach((id, columnIndex) => {
        positions.set(id, {
          x: startX + columnIndex * (NODE_W + 32),
          y: 60 + rowIndex * 142,
        });
      });
    });
    edges = map.flow.edges.map(([from, to, kind]) => [from, to, kind]);
    nodeIndex = byId;
  }

  function edgePath(from, to, kind) {
    const a = positions.get(from);
    const b = positions.get(to);
    if (map.meta.mode === "routing") {
      const x1 = a.x + NODE_W / 2;
      const y1 = a.y + NODE_H;
      const x2 = b.x + NODE_W / 2;
      const y2 = b.y;
      const mid = (y1 + y2) / 2;
      return '<path class="edge ' + kind + '" d="M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + mid + ', ' + x2 + ' ' + mid + ', ' + x2 + ' ' + y2 + '"/>';
    }
    if (map.meta.mode === "flow") {
      const x1 = a.x + NODE_W / 2;
      const y1 = a.y + NODE_H;
      const x2 = b.x + NODE_W / 2;
      const y2 = b.y;
      const mid = (y1 + y2) / 2;
      return '<path class="edge ' + kind + '" d="M ' + x1 + ' ' + y1 + ' C ' + x1 + ' ' + mid + ', ' + x2 + ' ' + mid + ', ' + x2 + ' ' + y2 + '"/>';
    }
    const x1 = a.x + NODE_W;
    const y1 = a.y + NODE_H / 2;
    const x2 = b.x;
    const y2 = b.y + NODE_H / 2;
    const mid = (x1 + x2) / 2;
    return '<path class="edge ' + kind + '" d="M ' + x1 + ' ' + y1 + ' C ' + mid + ' ' + y1 + ', ' + mid + ' ' + y2 + ', ' + x2 + ' ' + y2 + '"/>';
  }

  function nodeElement(node) {
    const pos = positions.get(node.id);
    const hasChildren = (node.children || []).length > 0;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.nodeId = node.id;
    button.className = "node " + (node.id === "root" ? "root " : "") + (node.kind || "");
    button.style.left = pos.x + "px";
    button.style.top = pos.y + "px";
    button.setAttribute("aria-expanded", hasChildren ? String(expanded.has(node.id)) : "false");
    const toggle = hasChildren ? '<span class="node-toggle">' + (expanded.has(node.id) ? "−" : "＋") + "</span>" : "";
    const note = node.note ? '<span class="node-note"></span>' : "";
    const link = node.link ? '<span class="node-link">この詳細地図を開く →</span>' : "";
    button.innerHTML = toggle + '<span class="node-label"></span>' + note + link;
    button.querySelector(".node-label").textContent = node.label;
    if (node.note) button.querySelector(".node-note").textContent = node.note;
    button.addEventListener("click", () => {
      if (node.link) {
        window.location.href = node.link;
        return;
      }
      if (!hasChildren) return;
      if (expanded.has(node.id)) expanded.delete(node.id);
      else expanded.add(node.id);
      render(false);
    });
    return button;
  }

  function calculate() {
    positions = new Map();
    edges = [];
    if (map.meta.mode === "flow") placeFlow();
    else if (map.meta.mode === "routing") placeRouting(map.root, 0, 60);
    else placeTree(map.root, 0, 60);
    let maxX = 0;
    let maxY = 0;
    for (const pos of positions.values()) {
      maxX = Math.max(maxX, pos.x + NODE_W + 70);
      maxY = Math.max(maxY, pos.y + NODE_H + 70);
    }
    worldWidth = Math.max(900, maxX);
    worldHeight = Math.max(620, maxY);
  }

  function render(fit = false) {
    calculate();
    world.style.width = worldWidth + "px";
    world.style.height = worldHeight + "px";
    svg.setAttribute("width", worldWidth);
    svg.setAttribute("height", worldHeight);
    svg.setAttribute("viewBox", "0 0 " + worldWidth + " " + worldHeight);
    svg.innerHTML = edges.map(([from, to, kind]) => edgePath(from, to, kind)).join("");
    nodesHost.replaceChildren();
    for (const [id, node] of nodeIndex) {
      if (!positions.has(id)) continue;
      nodesHost.appendChild(nodeElement(node));
    }
    countHost.textContent = positions.size + " / " + nodeIndex.size + "ノード";
    if (fit) requestAnimationFrame(fitAll);
  }

  function applyTransform() {
    world.style.transform = "translate(" + transform.x + "px," + transform.y + "px) scale(" + transform.scale + ")";
  }

  function fitAll() {
    const rect = viewport.getBoundingClientRect();
    transform.scale = Math.min(1, Math.max(0.12, Math.min((rect.width - 40) / worldWidth, (rect.height - 40) / worldHeight)));
    transform.x = (rect.width - worldWidth * transform.scale) / 2;
    transform.y = (rect.height - worldHeight * transform.scale) / 2;
    applyTransform();
  }

  function setScale(next, clientX, clientY) {
    const rect = viewport.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const old = transform.scale;
    transform.scale = Math.min(1.8, Math.max(0.12, next));
    transform.x = x - ((x - transform.x) / old) * transform.scale;
    transform.y = y - ((y - transform.y) / old) * transform.scale;
    applyTransform();
  }

  function expandAll() {
    if (!map.root) return;
    for (const [id, node] of nodeIndex) if ((node.children || []).length) expanded.add(id);
    render(true);
  }

  function collapseAll() {
    expanded.clear();
    if (map.root) expanded.add("root");
    render(true);
  }

  let dragging = false;
  let startX = 0;
  let startY = 0;
  let baseX = 0;
  let baseY = 0;
  viewport.addEventListener("pointerdown", (event) => {
    if (event.target.closest(".node, .btn")) return;
    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    baseX = transform.x;
    baseY = transform.y;
    viewport.classList.add("is-dragging");
    viewport.setPointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointermove", (event) => {
    if (!dragging) return;
    transform.x = baseX + event.clientX - startX;
    transform.y = baseY + event.clientY - startY;
    applyTransform();
  });
  viewport.addEventListener("pointerup", (event) => {
    dragging = false;
    viewport.classList.remove("is-dragging");
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
  });
  viewport.addEventListener("pointercancel", () => {
    dragging = false;
    viewport.classList.remove("is-dragging");
  });
  viewport.addEventListener("wheel", (event) => {
    event.preventDefault();
    setScale(transform.scale * (event.deltaY < 0 ? 1.1 : 0.9), event.clientX, event.clientY);
  }, { passive: false });

  fitButton.addEventListener("click", fitAll);
  expandButton.addEventListener("click", expandAll);
  collapseButton.addEventListener("click", collapseAll);
  zoomInButton.addEventListener("click", () => {
    const rect = viewport.getBoundingClientRect();
    setScale(transform.scale * 1.15, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
  zoomOutButton.addEventListener("click", () => {
    const rect = viewport.getBoundingClientRect();
    setScale(transform.scale * 0.85, rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
  window.addEventListener("resize", fitAll);
  document.title = map.meta.title + "｜企画検証用";
  document.querySelector("[data-title]").textContent = map.meta.title;
  document.querySelector("[data-subtitle]").textContent = map.meta.subtitle;
  render(true);
})();
`;

function htmlFor(data) {
  const safeTitle = data.meta.title
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${safeTitle}｜企画検証用</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<main class="app">
  <header class="toolbar">
    <div class="identity">
      <h1 class="title" data-title>${safeTitle}</h1>
      <p class="subtitle" data-subtitle></p>
    </div>
    <span class="badge">企画検証用・未確定</span>
    <div class="controls" aria-label="地図操作">
      <a class="btn" href="../../../index.html">七地図</a>
      <a class="btn" href="../../../reference-map-copy/index.html">分解前資料</a>
      <button class="btn" type="button" data-fit>全体</button>
      <button class="btn" type="button" data-expand>全展開</button>
      <button class="btn" type="button" data-collapse>閉じる</button>
      <button class="btn" type="button" data-zoom-out aria-label="縮小">−</button>
      <button class="btn" type="button" data-zoom-in aria-label="拡大">＋</button>
    </div>
  </header>
  <section class="viewport" data-viewport aria-label="${safeTitle}">
    <div class="world" data-world>
      <svg class="edges" data-edges aria-hidden="true"></svg>
      <div data-nodes></div>
    </div>
    <p class="hint"><span data-count></span>・ノードをクリックして展開・余白をドラッグ・ホイールで拡大縮小</p>
  </section>
</main>
<script src="data/map-data.js"></script>
<script src="app.js"></script>
</body>
</html>
`;
}

function nodeCount(data) {
  if (data.flow) return data.flow.nodes.length;
  let count = 0;
  const stack = [data.root];
  while (stack.length) {
    const node = stack.pop();
    count += 1;
    stack.push(...(node.children ?? []));
  }
  return count;
}

function writePrototype(definition) {
  const prototypeRoot = path.join(mapsRoot, definition.directory, "prototype");
  ensureDir(path.join(prototypeRoot, "data"));
  fs.writeFileSync(path.join(prototypeRoot, "index.html"), htmlFor(definition.data));
  fs.writeFileSync(path.join(prototypeRoot, "styles.css"), styles.trimStart());
  fs.writeFileSync(path.join(prototypeRoot, "app.js"), app.trimStart());
  fs.writeFileSync(
    path.join(prototypeRoot, "data/map-data.js"),
    `window.PROTOTYPE_MAP = ${JSON.stringify(definition.data, null, 2)};\n`,
  );
  fs.writeFileSync(
    path.join(prototypeRoot, "SOURCE.md"),
    `# 叩き台地図の出典

- 状態：企画検証用・未確定
- 出典：${definition.data.meta.source}
- ノード数：${nodeCount(definition.data)}
- 公開用保存コピー：\`../../../reference-map-copy/\`
- 旧原本：\`99_完了済み参考資料/${archivedMapName}/\`へローカル退役

この叩き台は、公開参考資料を七つへ分離した結果を確認するためのものです。完成版の設計・コードではありません。
`,
  );
}

function hubHtml() {
  const cards = mapDefinitions
    .map(
      ({ directory, data }, index) => `
      <a class="map-card" href="maps/${encodeURIComponent(directory)}/prototype/index.html">
        <span class="number">${String(index + 1).padStart(2, "0")}</span>
        <strong>${data.meta.title}</strong>
        <span>${data.meta.subtitle}</span>
        <small>${nodeCount(data)}ノード・${data.meta.mode}</small>
      </a>`,
    )
    .join("");
  return `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>プロジェクト地図｜七つの作成中マップ</title>
<style>
:root { color-scheme: light; --bg:#f5f3ee; --panel:#fff; --ink:#20251f; --muted:#667064; --accent:#315c4a; }
* { box-sizing:border-box; }
body { margin:0; font-family:-apple-system,BlinkMacSystemFont,"Hiragino Sans","Yu Gothic",sans-serif; color:var(--ink); background:var(--bg); }
main { max-width:1120px; margin:auto; padding:40px 20px 60px; }
.eyebrow { color:var(--accent); font-weight:700; font-size:13px; }
h1 { margin:8px 0 10px; font-size:clamp(28px,5vw,48px); }
.lead { max-width:760px; margin:0 0 28px; color:var(--muted); line-height:1.7; }
.actions { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:28px; }
.actions a { padding:10px 14px; border:1px solid rgba(49,92,74,.22); border-radius:10px; color:var(--ink); background:#fff; text-decoration:none; }
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(260px,1fr)); gap:14px; }
.map-card { display:grid; gap:8px; min-height:178px; padding:18px; border:1px solid rgba(49,92,74,.16); border-radius:16px; color:var(--ink); background:var(--panel); text-decoration:none; box-shadow:0 10px 28px rgba(32,37,31,.08); }
.map-card:hover { border-color:var(--accent); transform:translateY(-2px); }
.map-card strong { font-size:18px; }
.map-card span:not(.number), .map-card small { color:var(--muted); line-height:1.5; }
.number { color:var(--accent); font-size:12px; font-weight:700; }
.notice { margin-top:24px; padding:14px 16px; border-left:4px solid var(--accent); background:#e7eee9; line-height:1.6; }
</style>
</head>
<body>
<main>
  <p class="eyebrow">作成中・未確定・参考地図</p>
  <h1>プロジェクト地図 七つの作成中マップ</h1>
  <p class="lead">現在までの判断・工程・文書構造を思い出し、現在地を確認するための主要な参考入口です。企画・設計・仕様の正本ではなく、今後の確認によって分岐位置や表現を更新する場合があります。</p>
  <nav class="actions">
    <a href="reference-map-copy/index.html">分解前の参考資料を見る</a>
  </nav>
  <section class="grid">${cards}</section>
  <p class="notice">七地図は作成途中ですが、思い出し用の参考地図として公開しています。内容の確定判断では、親プロジェクトの企画・設計・仕様の正本を確認してください。</p>
</main>
</body>
</html>`;
}

copyReferenceSnapshot();
for (const definition of mapDefinitions) writePrototype(definition);
fs.writeFileSync(path.join(projectRoot, "index.html"), hubHtml());

console.log(
  JSON.stringify(
    {
      snapshot: snapshotRoot,
      prototypes: mapDefinitions.map(({ directory, data }) => ({
        directory,
        mode: data.meta.mode,
        nodes: nodeCount(data),
      })),
      hub: path.join(projectRoot, "index.html"),
    },
    null,
    2,
  ),
);
