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
