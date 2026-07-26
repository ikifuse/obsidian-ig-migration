(() => {
  const root = document.getElementById("project-vertical-hybrid-flow");
  const viewport = root.querySelector("[data-viewport]");
  const world = root.querySelector("[data-world]");
  const lines = root.querySelector("[data-lines]");
  const nodesHost = root.querySelector("[data-nodes]");
  const crumb = root.querySelector("[data-crumb]");
  const fitButton = root.querySelector("[data-fit]");
  const entryButton = root.querySelector("[data-entry]");
  const zoomInButton = root.querySelector("[data-zoom-in]");
  const zoomOutButton = root.querySelector("[data-zoom-out]");



      function semanticChildren(nodes, path, series, stageId) {
        return nodes.map((node, index) => {
          const id = `${path}-${index}`;
          if (typeof node === "string") {
            return { id, label: node, children: [], series, stageId };
          }
          return {
            id,
            label: node.label,
            children: semanticChildren(node.children, id, series, stageId),
            series,
            stageId
          };
        });
      }

      function buildDetailForest(viewId, series, stageId) {
        const view = views[viewId];
        const branchNodes = view.branches.map(([label, children], index) => {
          const id = view.toc
            ? `detail-${viewId}-branch-${index}`
            : `detail-${viewId}-${index}`;
          return {
            id,
            label,
            children: semanticChildren(children, id, series, stageId),
            series,
            stageId
          };
        });
        if (!view.toc) return branchNodes;

        const tocId = `detail-${viewId}-0`;
        const tocEntries = semanticChildren(
          view.tocEntries ?? [],
          `${tocId}-entry`,
          series,
          stageId
        );
        return [{
          id: tocId,
          label: view.toc,
          children: [...tocEntries, ...branchNodes],
          series,
          stageId
        }];
      }

      function visibleDetailChildren(node) {
        return detailExpanded.has(node.id) ? node.children : [];
      }

      function measureDetail(node) {
        const children = visibleDetailChildren(node);
        if (!children.length) {
          node.span = NODE_WIDTH;
          return node.span;
        }
        const span = children.reduce((sum, child, index) => {
          return sum + measureDetail(child) + (index ? DETAIL_NODE_GAP : 0);
        }, 0);
        node.span = Math.max(NODE_WIDTH, span);
        return node.span;
      }

      function placeDetail(node, left, depth, baseY, direction = "down") {
        const children = visibleDetailChildren(node);
        let x = left;
        if (children.length) {
          let cursor = left;
          children.forEach((child, index) => {
            if (index) cursor += DETAIL_NODE_GAP;
            placeDetail(child, cursor, depth + 1, baseY, direction);
            cursor += child.span;
          });
          const first = detailPositions.get(children[0].id);
          const last = detailPositions.get(children[children.length - 1].id);
          x = (first.x + last.x + NODE_WIDTH) / 2 - NODE_WIDTH / 2;
        }
        detailPositions.set(node.id, {
          x,
          y: direction === "up"
            ? baseY - depth * DETAIL_LEVEL_GAP
            : baseY + depth * DETAIL_LEVEL_GAP,
          depth: depth + 2,
          stageId: node.stageId,
          direction
        });
      }

      function calculateDetails() {
        detailPositions.clear();
        if (!openStageIds.length) {
          layout.width = 3080;
          layout.height = MAIN_Y + 380;
          return [];
        }
        const bands = [];
        let bandTop = DETAIL_Y;
        let maxRight = 0;
        const ruleOpen = openStageIds.includes("rules");
        const downwardStageIds = openStageIds.filter((stageId) => stageId !== "rules");

        if (ruleOpen) {
          const stage = stageById.get("rules");
          const forest = buildDetailForest(stage.viewId, stage.series, stage.id);
          let total = 0;
          forest.forEach((node, index) => {
            total += measureDetail(node) + (index ? DETAIL_NODE_GAP : 0);
          });
          let cursor = Math.max(60, stage.x + NODE_WIDTH / 2 - total / 2);
          const branchY = 700;
          forest.forEach((node, index) => {
            if (index) cursor += DETAIL_NODE_GAP;
            placeDetail(node, cursor, 0, branchY, "up");
            cursor += node.span;
          });
          const stack = [...forest];
          while (stack.length) {
            const node = stack.pop();
            const position = detailPositions.get(node.id);
            if (position) maxRight = Math.max(maxRight, position.x + NODE_WIDTH);
            stack.push(...visibleDetailChildren(node));
          }
          bands.push({
            stage,
            forest,
            direction: "up",
            busY: 820,
            departureY: 900,
            corridorX: 38,
            labelY: 790
          });
        }

        downwardStageIds.forEach((stageId, bandIndex) => {
          const stage = stageById.get(stageId);
          const forest = buildDetailForest(stage.viewId, stage.series, stage.id);
          let total = 0;
          forest.forEach((node, index) => {
            total += measureDetail(node) + (index ? DETAIL_NODE_GAP : 0);
          });
          let cursor = Math.max(60, stage.x + NODE_WIDTH / 2 - total / 2);
          const branchY = bandTop + 105;
          forest.forEach((node, index) => {
            if (index) cursor += DETAIL_NODE_GAP;
            placeDetail(node, cursor, 0, branchY, "down");
            cursor += node.span;
          });
          let bandMaxDepth = 0;
          const stack = [...forest];
          while (stack.length) {
            const node = stack.pop();
            const position = detailPositions.get(node.id);
            if (position) {
              bandMaxDepth = Math.max(bandMaxDepth, position.depth - 2);
              maxRight = Math.max(maxRight, position.x + NODE_WIDTH);
            }
            stack.push(...visibleDetailChildren(node));
          }
          const busY = bandTop + 45;
          const departureY = MAIN_Y + 295 + bandIndex * 18;
          const corridorX = 38 + bandIndex * 22;
          bands.push({
            stage,
            forest,
            direction: "down",
            busY,
            departureY,
            corridorX,
            labelY: bandTop + 5
          });
          bandTop = branchY + bandMaxDepth * DETAIL_LEVEL_GAP + NODE_HEIGHT + 175;
        });
        layout.width = Math.max(3080, maxRight + 80);
        layout.height = Math.max(MAIN_Y + 380, bandTop + 60);
        return bands;
      }

      function applyTransform() {
        world.style.transform = `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`;
      }

      function setScale(nextScale, centerX, centerY) {
        const clamped = Math.min(1.45, Math.max(0.2, nextScale));
        const worldX = (centerX - transform.x) / transform.scale;
        const worldY = (centerY - transform.y) / transform.scale;
        transform.x = centerX - worldX * clamped;
        transform.y = centerY - worldY * clamped;
        transform.scale = clamped;
        applyTransform();
      }

      function fitAll() {
        const rect = viewport.getBoundingClientRect();
        const scaleX = (rect.width - 48) / layout.width;
        const scaleY = (rect.height - 48) / layout.height;
        transform.scale = Math.min(0.9, Math.max(0.2, Math.min(scaleX, scaleY)));
        transform.x = (rect.width - layout.width * transform.scale) / 2;
        transform.y = (rect.height - layout.height * transform.scale) / 2;
        applyTransform();
      }

      function focusEntry() {
        const rect = viewport.getBoundingClientRect();
        transform.scale = Math.min(0.9, Math.max(0.68, rect.width / 1050));
        transform.x = 34 - 70 * transform.scale;
        transform.y = rect.height * 0.46 - MAIN_Y * transform.scale;
        applyTransform();
      }

      function focusStage(stage) {
        const rect = viewport.getBoundingClientRect();
        transform.scale = Math.max(transform.scale, 0.68);
        transform.x = rect.width * 0.26 - (stage.x + NODE_WIDTH / 2) * transform.scale;
        transform.y = rect.height * 0.24 - stage.y * transform.scale;
        applyTransform();
      }

      function focusDetailNode(id) {
        const position = detailPositions.get(id);
        if (!position) return;
        const rect = viewport.getBoundingClientRect();
        transform.scale = Math.max(transform.scale, 0.68);
        transform.x = rect.width * 0.5 - (position.x + NODE_WIDTH / 2) * transform.scale;
        transform.y = rect.height * 0.46 - position.y * transform.scale;
        applyTransform();
      }

      function appendArrowDefinition() {
        const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
        const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
        marker.setAttribute("id", "journey-arrow");
        marker.setAttribute("viewBox", "0 0 10 10");
        marker.setAttribute("refX", "9");
        marker.setAttribute("refY", "5");
        marker.setAttribute("markerWidth", "6");
        marker.setAttribute("markerHeight", "6");
        marker.setAttribute("orient", "auto-start-reverse");
        const arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
        arrow.setAttribute("d", "M 0 0 L 10 5 L 0 10 z");
        arrow.setAttribute("fill", "var(--foreground)");
        marker.append(arrow);
        defs.append(marker);
        lines.append(defs);
      }

      function appendPath(d, series, kind, arrow = false) {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.classList.add("mind-line");
        path.dataset.series = String(series);
        path.dataset.lineKind = kind;
        path.setAttribute("d", d);
        if (arrow && kind === "flow") path.setAttribute("marker-end", "url(#journey-arrow)");
        lines.append(path);
      }

      function horizontalPath(from, to) {
        const x1 = from.x + NODE_WIDTH;
        const y1 = from.y;
        const x2 = to.x;
        const y2 = to.y;
        const middle = x1 + (x2 - x1) * 0.5;
        return `M ${x1} ${y1} C ${middle} ${y1}, ${middle} ${y2}, ${x2} ${y2}`;
      }

      function verticalPath(x1, y1, x2, y2) {
        const middle = y1 + (y2 - y1) * 0.5;
        return `M ${x1} ${y1} C ${x1} ${middle}, ${x2} ${middle}, ${x2} ${y2}`;
      }

      function createLabel(text, x, y, className = "journey-label text-small") {
        const label = document.createElement("span");
        label.className = className;
        label.textContent = text;
        label.style.left = `${x}px`;
        label.style.top = `${y}px`;
        nodesHost.append(label);
      }

      function createNode({ id, label, note = "", x, y, kind = "detail", series = 1, depth = 1, hasChildren = false, expanded = false, active = false, onClick }) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mind-node";
        if (active) button.classList.add("is-active");
        button.dataset.nodeId = id;
        button.dataset.kind = kind;
        button.dataset.series = String(series);
        button.dataset.depth = String(depth);
        button.style.left = `${x}px`;
        button.style.top = `${y - NODE_HEIGHT / 2}px`;
        button.style.width = `${kind === "goal" || kind === "guard" ? 270 : NODE_WIDTH}px`;

        const labelWrap = document.createElement("span");
        labelWrap.className = "mind-node-label";
        const title = document.createElement("span");
        title.className = "mind-node-title";
        title.textContent = label;
        labelWrap.append(title);
        if (note) {
          const noteNode = document.createElement("span");
          noteNode.className = "mind-node-note text-small";
          noteNode.textContent = note;
          labelWrap.append(noteNode);
        }

        const marker = document.createElement("span");
        marker.className = "mind-node-marker";
        marker.setAttribute("aria-hidden", "true");
        if (hasChildren) {
          marker.textContent = "›";
          button.setAttribute("aria-expanded", String(expanded));
        } else {
          marker.textContent = "•";
          marker.classList.add("mind-empty-marker");
        }
        button.append(labelWrap, marker);
        if (onClick) button.addEventListener("click", onClick);
        nodesHost.append(button);
      }

      function renderStage(stage) {
        const hasDetails = Boolean(stage.viewId);
        const isOpen = openStageIds.includes(stage.id);
        createNode({
          ...stage,
          depth: 1,
          hasChildren: hasDetails,
          expanded: isOpen,
          active: activeStageId === stage.id,
          onClick: (event) => {
            event.stopPropagation();
            if (hasDetails) {
              const openIndex = openStageIds.indexOf(stage.id);
              if (openIndex >= 0) {
                openStageIds.splice(openIndex, 1);
                activeStageId = null;
                crumb.textContent = "READMEから第二の脳までの横軸";
              } else {
                openStageIds.push(stage.id);
                activeStageId = stage.id;
                crumb.textContent = `横軸 › ${stage.label} › 詳細`;
              }
              render();
              if (openIndex >= 0) focusStage(stage);
              else focusDetailNode(`detail-${stage.viewId}-0`);
            } else {
              activeStageId = stage.id;
              crumb.textContent = `横軸 › ${stage.label}`;
              render();
              focusStage(stage);
            }
          }
        });
      }

      function renderDetailNode(node) {
        const position = detailPositions.get(node.id);
        const children = visibleDetailChildren(node);
        createNode({
          id: node.id,
          label: node.label,
          x: position.x,
          y: position.y,
          kind: "detail",
          series: node.series,
          depth: position.depth,
          hasChildren: node.children.length > 0,
          expanded: detailExpanded.has(node.id),
          onClick: node.children.length ? (event) => {
            event.stopPropagation();
            if (detailExpanded.has(node.id)) {
              const stack = [...node.children];
              while (stack.length) {
                const child = stack.pop();
                detailExpanded.delete(child.id);
                stack.push(...child.children);
              }
              detailExpanded.delete(node.id);
            } else {
              detailExpanded.add(node.id);
            }
            activeStageId = node.stageId;
            crumb.textContent = `横軸 › ${stageById.get(node.stageId).label} › ${node.label}`;
            render();
            focusDetailNode(node.id);
          } : null
        });
        children.forEach((child) => {
          const childPosition = detailPositions.get(child.id);
          const isUpward = childPosition.direction === "up";
          appendPath(
            verticalPath(
              position.x + NODE_WIDTH / 2,
              position.y + (isUpward ? -NODE_HEIGHT / 2 : NODE_HEIGHT / 2),
              childPosition.x + NODE_WIDTH / 2,
              childPosition.y + (isUpward ? NODE_HEIGHT / 2 : -NODE_HEIGHT / 2)
            ),
            child.series,
            "detail"
          );
          renderDetailNode(child);
        });
      }

      function renderGuardrail() {
        const rules = stageById.get("rules");
        const memory = stageById.get("memory");
        const guardY = MAIN_Y - 205;
        const guardEndX = memory.x + NODE_WIDTH / 2;
        appendPath(
          `M ${rules.x + 135} ${rules.y + NODE_HEIGHT / 2} L ${rules.x + 135} ${guardY} L ${guardEndX} ${guardY}`,
          rules.series,
          "guard"
        );
        ["plan", "design", "spec", "igc", "import", "memory"].forEach((id) => {
          const stage = stageById.get(id);
          const centerX = stage.x + NODE_WIDTH / 2;
          appendPath(`M ${centerX} ${guardY - 4} L ${centerX} ${stage.y - NODE_HEIGHT / 2 + 6}`, rules.series, "guard");
        });
        createLabel("親プロジェクトと独立した後続を支える判断・承認・停止条件", 940, guardY - 33);
      }

      function render() {
        const bands = calculateDetails();
        nodesHost.replaceChildren();
        lines.replaceChildren();
        world.style.width = `${layout.width}px`;
        world.style.height = `${layout.height}px`;
        lines.setAttribute("width", String(layout.width));
        lines.setAttribute("height", String(layout.height));
        lines.setAttribute("viewBox", `0 0 ${layout.width} ${layout.height}`);
        appendArrowDefinition();

        flowEdges.forEach(([fromId, toId, kind]) => {
          const from = stageById.get(fromId);
          const to = stageById.get(toId);
          appendPath(horizontalPath(from, to), to.series, kind, true);
        });
        renderGuardrail();

        createLabel("親プロジェクト完成から独立した後続へ接続する全体像", 350, MAIN_Y - 85);
        createLabel("並列実行", 1515, MAIN_Y - 200);
        createLabel("現在の完走条件には含めない", 1435, MAIN_Y + 255, "journey-stage-note text-small");
        stages.forEach(renderStage);

        bands.forEach(({ stage, forest, direction, busY, departureY, corridorX, labelY }) => {
          forest.forEach((node) => {
            const position = detailPositions.get(node.id);
            const stageCenterX = stage.x + NODE_WIDTH / 2;
            const rootCenterX = position.x + NODE_WIDTH / 2;
            const isUpward = direction === "up";
            const stageEdgeY = stage.y + (isUpward ? -NODE_HEIGHT / 2 : NODE_HEIGHT / 2);
            const rootEdgeY = position.y + (isUpward ? NODE_HEIGHT / 2 : -NODE_HEIGHT / 2);
            appendPath(
              `M ${stageCenterX} ${stageEdgeY} L ${stageCenterX} ${departureY} L ${corridorX} ${departureY} L ${corridorX} ${busY} L ${rootCenterX} ${busY} L ${rootCenterX} ${rootEdgeY}`,
              node.series,
              "detail"
            );
            renderDetailNode(node);
          });
          createLabel(`${stage.label}の詳細構造`, Math.max(60, stage.x - 20), labelY);
        });
      }

      const V_NODE_WIDTH = 238;
      const V_STAGE_WIDTH = 252;
      const V_GUARD_WIDTH = 270;
      const V_NODE_HEIGHT = 78;
      const V_SPINE_X = 2300;
      const V_DETAIL_X_GAP = 310;
      const V_DETAIL_Y_GAP = 26;
      const V_ROW_GAP = 72;
      const V_CLOSED_ROW_HEIGHT = 152;
      const verticalDetailLayouts = [];
      const navigationStageIds = new Set(["readme", "index", "handoff", "docs", "rules"]);

      const verticalRows = [
        ["readme", "index", "handoff", "docs"],
        ["idea"],
        ["plan"],
        ["design"],
        ["spec"],
        ["igp", "igr", "igs", "igx"],
        ["igc"],
        ["import"],
        ["memory"],
        ["goal"]
      ];

      function verticalNodeWidth(node) {
        if (node.kind === "guard") return V_GUARD_WIDTH;
        if (node.kind === "detail") return V_NODE_WIDTH;
        return node.kind === "goal" ? V_GUARD_WIDTH : V_STAGE_WIDTH;
      }

      function measureVerticalDetail(node) {
        const children = visibleDetailChildren(node);
        if (!children.length) {
          node.verticalSpan = V_NODE_HEIGHT;
          return node.verticalSpan;
        }
        const childrenSpan = children.reduce((sum, child, index) => {
          return sum + measureVerticalDetail(child) + (index ? V_DETAIL_Y_GAP : 0);
        }, 0);
        node.verticalSpan = Math.max(V_NODE_HEIGHT, childrenSpan);
        return node.verticalSpan;
      }

      function measureVerticalForest(forest) {
        return forest.reduce((sum, node, index) => {
          return sum + measureVerticalDetail(node) + (index ? V_DETAIL_Y_GAP : 0);
        }, 0);
      }

      function placeVerticalDetail(node, top, depth, rootX, direction) {
        const children = visibleDetailChildren(node);
        if (children.length) {
          let cursor = top;
          children.forEach((child, index) => {
            if (index) cursor += V_DETAIL_Y_GAP;
            placeVerticalDetail(child, cursor, depth + 1, rootX, direction);
            cursor += child.verticalSpan;
          });
        }
        let y = top + node.verticalSpan / 2;
        if (children.length) {
          const first = detailPositions.get(children[0].id);
          const last = detailPositions.get(children[children.length - 1].id);
          y = (first.y + last.y) / 2;
        }
        detailPositions.set(node.id, {
          x: direction === "left"
            ? rootX - depth * V_DETAIL_X_GAP
            : rootX + depth * V_DETAIL_X_GAP,
          y,
          depth: depth + 2,
          direction,
          stageId: node.stageId
        });
      }

      function calculateVerticalLayout() {
        detailPositions.clear();
        verticalDetailLayouts.length = 0;

        const rightForests = new Map();
        openStageIds
          .filter((stageId) => stageId !== "rules")
          .forEach((stageId) => {
            const stage = stageById.get(stageId);
            if (!stage?.viewId) return;
            const forest = buildDetailForest(stage.viewId, stage.series, stage.id);
            rightForests.set(stageId, {
              forest,
              totalHeight: measureVerticalForest(forest)
            });
          });

        let cursorY = 110;
        verticalRows.forEach((row) => {
          let rowHeight = V_CLOSED_ROW_HEIGHT;
          row.forEach((stageId) => {
            const detail = rightForests.get(stageId);
            if (detail) rowHeight = Math.max(rowHeight, detail.totalHeight + 70);
          });
          const centerY = cursorY + rowHeight / 2;
          if (row[0] === "readme") {
            stageById.get("readme").x = V_SPINE_X - 640;
            stageById.get("index").x = V_SPINE_X - 320;
            stageById.get("handoff").x = V_SPINE_X;
            stageById.get("docs").x = V_SPINE_X + 320;
          } else if (row[0] === "igp") {
            stageById.get("igp").x = V_SPINE_X - 320;
            stageById.get("igr").x = V_SPINE_X;
            stageById.get("igs").x = V_SPINE_X + 320;
            stageById.get("igx").x = V_SPINE_X + 640;
          } else {
            stageById.get(row[0]).x = V_SPINE_X;
          }
          row.forEach((stageId) => {
            stageById.get(stageId).y = centerY;
          });
          cursorY += rowHeight + V_ROW_GAP;
        });

        rightForests.forEach(({ forest, totalHeight }, stageId) => {
          const stage = stageById.get(stageId);
          const rootX = stage.x + V_STAGE_WIDTH + 180;
          let top = stage.y - totalHeight / 2;
          forest.forEach((node, index) => {
            if (index) top += V_DETAIL_Y_GAP;
            placeVerticalDetail(node, top, 0, rootX, "right");
            top += node.verticalSpan;
          });
          verticalDetailLayouts.push({ stage, forest, direction: "right" });
        });

        const plan = stageById.get("plan");
        const memory = stageById.get("memory");
        const rules = stageById.get("rules");
        rules.x = V_SPINE_X - 850;
        rules.y = (plan.y + memory.y) / 2;

        if (openStageIds.includes("rules")) {
          const forest = buildDetailForest(rules.viewId, rules.series, rules.id);
          const totalHeight = measureVerticalForest(forest);
          let top = Math.max(80, rules.y - totalHeight / 2);
          const rootX = rules.x - 180 - V_NODE_WIDTH;
          forest.forEach((node, index) => {
            if (index) top += V_DETAIL_Y_GAP;
            placeVerticalDetail(node, top, 0, rootX, "left");
            top += node.verticalSpan;
          });
          verticalDetailLayouts.push({ stage: rules, forest, direction: "left" });
        }

        let minX = 70;
        let maxX = V_SPINE_X + V_STAGE_WIDTH + 80;
        let maxY = cursorY + 80;
        detailPositions.forEach((position) => {
          minX = Math.min(minX, position.x - 70);
          maxX = Math.max(maxX, position.x + V_NODE_WIDTH + 100);
          maxY = Math.max(maxY, position.y + V_NODE_HEIGHT / 2 + 100);
        });
        layout.width = Math.max(4200, maxX - Math.min(0, minX));
        layout.height = Math.max(2350, maxY);
      }

      function verticalFlowPath(from, to) {
        const fromWidth = verticalNodeWidth(from);
        const toWidth = verticalNodeWidth(to);
        const x1 = from.x + fromWidth / 2;
        const y1 = from.y + V_NODE_HEIGHT / 2;
        const x2 = to.x + toWidth / 2;
        const y2 = to.y - V_NODE_HEIGHT / 2;
        const middleY = y1 + (y2 - y1) / 2;
        return `M ${x1} ${y1} C ${x1} ${middleY}, ${x2} ${middleY}, ${x2} ${y2}`;
      }

      function sidePath(x1, y1, x2, y2) {
        const middleX = x1 + (x2 - x1) / 2;
        return `M ${x1} ${y1} C ${middleX} ${y1}, ${middleX} ${y2}, ${x2} ${y2}`;
      }

      function createVerticalNode({
        id,
        label,
        note = "",
        x,
        y,
        kind = "detail",
        series = 1,
        depth = 1,
        hasChildren = false,
        expanded = false,
        active = false,
        onClick
      }) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "mind-node";
        if (active) button.classList.add("is-active");
        button.dataset.nodeId = id;
        button.dataset.kind = kind;
        button.dataset.series = String(series);
        button.dataset.depth = String(depth);
        button.style.left = `${x}px`;
        button.style.top = `${y - V_NODE_HEIGHT / 2}px`;
        button.style.width = `${kind === "guard" || kind === "goal"
          ? V_GUARD_WIDTH
          : depth === 1
            ? V_STAGE_WIDTH
            : V_NODE_WIDTH}px`;

        const labelWrap = document.createElement("span");
        labelWrap.className = "mind-node-label";
        const title = document.createElement("span");
        title.className = "mind-node-title";
        title.textContent = label;
        labelWrap.append(title);
        if (note) {
          const noteNode = document.createElement("span");
          noteNode.className = "mind-node-note text-small";
          noteNode.textContent = note;
          labelWrap.append(noteNode);
        }

        const marker = document.createElement("span");
        marker.className = "mind-node-marker";
        marker.setAttribute("aria-hidden", "true");
        if (hasChildren) {
          marker.textContent = kind === "guard" ? "‹" : "›";
          button.setAttribute("aria-expanded", String(expanded));
        } else {
          marker.textContent = "•";
          marker.classList.add("mind-empty-marker");
        }
        button.append(labelWrap, marker);
        if (onClick) button.addEventListener("click", onClick);
        nodesHost.append(button);
      }

      function renderVerticalStage(stage) {
        const hasDetails = Boolean(stage.viewId);
        const isOpen = openStageIds.includes(stage.id);
        const layerLabel = navigationStageIds.has(stage.id) ? "案内層" : "主工程";
        createVerticalNode({
          ...stage,
          depth: 1,
          hasChildren: hasDetails,
          expanded: isOpen,
          active: activeStageId === stage.id,
          onClick: (event) => {
            event.stopPropagation();
            if (!hasDetails) {
              activeStageId = stage.id;
              crumb.textContent = `${layerLabel} › ${stage.label}`;
              renderVertical();
              focusVerticalStage(stage);
              return;
            }
            const openIndex = openStageIds.indexOf(stage.id);
            if (openIndex >= 0) {
              openStageIds.splice(openIndex, 1);
              activeStageId = null;
              crumb.textContent = "プロジェクト全体マップ｜案内層と主工程";
            } else {
              openStageIds.push(stage.id);
              activeStageId = stage.id;
              crumb.textContent = `${layerLabel} › ${stage.label} › 詳細`;
            }
            renderVertical();
            if (openIndex >= 0) focusVerticalStage(stage);
            else focusVerticalDetail(`detail-${stage.viewId}-0`);
          }
        });
      }

      function renderVerticalDetailNode(node) {
        const position = detailPositions.get(node.id);
        if (!position) return;
        const children = visibleDetailChildren(node);
        createVerticalNode({
          id: node.id,
          label: node.label,
          x: position.x,
          y: position.y,
          kind: "detail",
          series: node.series,
          depth: position.depth,
          hasChildren: node.children.length > 0,
          expanded: detailExpanded.has(node.id),
          onClick: node.children.length ? (event) => {
            event.stopPropagation();
            if (detailExpanded.has(node.id)) {
              const stack = [...node.children];
              while (stack.length) {
                const child = stack.pop();
                detailExpanded.delete(child.id);
                stack.push(...child.children);
              }
              detailExpanded.delete(node.id);
            } else {
              detailExpanded.add(node.id);
            }
            activeStageId = node.stageId;
            const stage = stageById.get(node.stageId);
            const layerLabel = navigationStageIds.has(stage.id) ? "案内層" : "主工程";
            crumb.textContent = `${layerLabel} › ${stage.label} › ${node.label}`;
            renderVertical();
            focusVerticalDetail(node.id);
          } : null
        });

        children.forEach((child) => {
          const childPosition = detailPositions.get(child.id);
          const isLeft = position.direction === "left";
          appendPath(
            sidePath(
              isLeft ? position.x : position.x + V_NODE_WIDTH,
              position.y,
              isLeft ? childPosition.x + V_NODE_WIDTH : childPosition.x,
              childPosition.y
            ),
            child.series,
            "detail"
          );
          renderVerticalDetailNode(child);
        });
      }

      function renderVerticalFlow() {
        const chainBeforeParallel = ["idea", "plan", "design", "spec"];
        for (let index = 0; index < chainBeforeParallel.length - 1; index += 1) {
          const from = stageById.get(chainBeforeParallel[index]);
          const to = stageById.get(chainBeforeParallel[index + 1]);
          appendPath(verticalFlowPath(from, to), to.series, "flow", true);
        }

        const specStage = stageById.get("spec");
        const parallelStages = ["igp", "igr", "igs"].map((id) => stageById.get(id));
        const parallelTop = parallelStages[0].y - V_NODE_HEIGHT / 2;
        const splitY = specStage.y + V_NODE_HEIGHT / 2
          + (parallelTop - (specStage.y + V_NODE_HEIGHT / 2)) / 2;
        const firstCenter = parallelStages[0].x + V_STAGE_WIDTH / 2;
        const lastCenter = parallelStages[2].x + V_STAGE_WIDTH / 2;
        const spineCenter = V_SPINE_X + V_STAGE_WIDTH / 2;
        appendPath(
          `M ${spineCenter} ${specStage.y + V_NODE_HEIGHT / 2} L ${spineCenter} ${splitY} M ${firstCenter} ${splitY} L ${lastCenter} ${splitY}`,
          3,
          "flow"
        );
        parallelStages.forEach((stage) => {
          const centerX = stage.x + V_STAGE_WIDTH / 2;
          appendPath(`M ${centerX} ${splitY} L ${centerX} ${stage.y - V_NODE_HEIGHT / 2}`, stage.series, "flow", true);
        });

        const igcStage = stageById.get("igc");
        const mergeY = parallelStages[0].y + V_NODE_HEIGHT / 2
          + (igcStage.y - V_NODE_HEIGHT / 2 - (parallelStages[0].y + V_NODE_HEIGHT / 2)) / 2;
        appendPath(`M ${firstCenter} ${mergeY} L ${lastCenter} ${mergeY}`, 3, "flow");
        parallelStages.forEach((stage) => {
          const centerX = stage.x + V_STAGE_WIDTH / 2;
          appendPath(`M ${centerX} ${stage.y + V_NODE_HEIGHT / 2} L ${centerX} ${mergeY}`, stage.series, "flow");
        });
        appendPath(
          `M ${spineCenter} ${mergeY} L ${spineCenter} ${igcStage.y - V_NODE_HEIGHT / 2}`,
          igcStage.series,
          "flow",
          true
        );

        const igxStage = stageById.get("igx");
        const igxCenter = igxStage.x + V_STAGE_WIDTH / 2;
        appendPath(
          `M ${lastCenter} ${splitY} C ${igxCenter} ${splitY}, ${igxCenter} ${splitY}, ${igxCenter} ${igxStage.y - V_NODE_HEIGHT / 2}`,
          igxStage.series,
          "excluded"
        );

        const chainAfterParallel = ["igc", "import", "memory", "goal"];
        for (let index = 0; index < chainAfterParallel.length - 1; index += 1) {
          const from = stageById.get(chainAfterParallel[index]);
          const to = stageById.get(chainAfterParallel[index + 1]);
          appendPath(verticalFlowPath(from, to), to.series, "flow", true);
        }
      }

      function renderVerticalGuardrail() {
        const rules = stageById.get("rules");
        const plan = stageById.get("plan");
        const memory = stageById.get("memory");
        const bracketX = V_SPINE_X - 420;
        const topY = plan.y - V_NODE_HEIGHT / 2;
        const bottomY = memory.y + V_NODE_HEIGHT / 2;
        appendPath(
          `M ${rules.x + V_GUARD_WIDTH} ${rules.y} L ${bracketX} ${rules.y} M ${bracketX + 24} ${topY} L ${bracketX} ${topY} L ${bracketX} ${bottomY} L ${bracketX + 24} ${bottomY}`,
          rules.series,
          "guard"
        );
        createLabel("全工程に適用するAI行動規範・承認・停止条件", bracketX - 150, topY - 42);
      }

      function renderVertical() {
        calculateVerticalLayout();
        nodesHost.replaceChildren();
        lines.replaceChildren();
        world.style.width = `${layout.width}px`;
        world.style.height = `${layout.height}px`;
        lines.setAttribute("width", String(layout.width));
        lines.setAttribute("height", String(layout.height));
        lines.setAttribute("viewBox", `0 0 ${layout.width} ${layout.height}`);
        appendArrowDefinition();

        renderVerticalFlow();
        renderVerticalGuardrail();
        const navigation = stageById.get("index");
        createLabel("理解・案内の入口（役割を分離）", navigation.x - 20, navigation.y - V_NODE_HEIGHT / 2 - 48);
        const idea = stageById.get("idea");
        createLabel("判断・実行の主工程", idea.x + 42, idea.y - V_NODE_HEIGHT / 2 - 48);
        const parallel = stageById.get("igr");
        createLabel("05・06・07は並列実行", parallel.x + 42, parallel.y - V_NODE_HEIGHT / 2 - 48);
        const igx = stageById.get("igx");
        createLabel("現在の完走条件には含めない", igx.x - 4, igx.y + V_NODE_HEIGHT / 2 + 18, "journey-stage-note text-small");

        stages.forEach(renderVerticalStage);

        verticalDetailLayouts.forEach(({ stage, forest, direction }) => {
          forest.forEach((node) => {
            const position = detailPositions.get(node.id);
            const stageWidth = verticalNodeWidth(stage);
            appendPath(
              sidePath(
                direction === "left" ? stage.x : stage.x + stageWidth,
                stage.y,
                direction === "left" ? position.x + V_NODE_WIDTH : position.x,
                position.y
              ),
              node.series,
              "detail"
            );
            renderVerticalDetailNode(node);
          });
        });
      }

      function verticalViewportRect() {
        const rect = viewport.getBoundingClientRect();
        return {
          width: rect.width || window.innerWidth || 736,
          height: rect.height || window.innerHeight || 720
        };
      }

      function fitVerticalAll() {
        const rect = verticalViewportRect();
        const scaleX = (rect.width - 48) / layout.width;
        const scaleY = (rect.height - 48) / layout.height;
        transform.scale = Math.min(0.88, Math.max(0.16, Math.min(scaleX, scaleY)));
        transform.x = (rect.width - layout.width * transform.scale) / 2;
        transform.y = (rect.height - layout.height * transform.scale) / 2;
        applyTransform();
      }

      function focusVerticalEntry() {
        const entry = stageById.get("readme");
        const rect = verticalViewportRect();
        transform.scale = Math.min(0.92, Math.max(0.62, rect.width / 1500));
        transform.x = rect.width * 0.46 - (entry.x + V_STAGE_WIDTH / 2) * transform.scale;
        transform.y = 90 - entry.y * transform.scale;
        applyTransform();
      }

      function focusVerticalStage(stage) {
        const rect = verticalViewportRect();
        transform.scale = Math.max(transform.scale, 0.64);
        transform.x = rect.width * 0.42 - (stage.x + verticalNodeWidth(stage) / 2) * transform.scale;
        transform.y = rect.height * 0.34 - stage.y * transform.scale;
        applyTransform();
      }

      function focusVerticalDetail(id) {
        const position = detailPositions.get(id);
        if (!position) return;
        const rect = verticalViewportRect();
        transform.scale = Math.max(transform.scale, 0.64);
        transform.x = rect.width * 0.52 - (position.x + V_NODE_WIDTH / 2) * transform.scale;
        transform.y = rect.height * 0.44 - position.y * transform.scale;
        applyTransform();
      }

      render = renderVertical;
      fitAll = fitVerticalAll;
      focusEntry = focusVerticalEntry;
      focusStage = focusVerticalStage;
      focusDetailNode = focusVerticalDetail;

      let dragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let transformStartX = 0;
      let transformStartY = 0;

      viewport.addEventListener("pointerdown", (event) => {
        if (event.target.closest(".mind-node, .btn")) return;
        dragging = true;
        dragStartX = event.clientX;
        dragStartY = event.clientY;
        transformStartX = transform.x;
        transformStartY = transform.y;
        viewport.classList.add("is-dragging");
        viewport.setPointerCapture(event.pointerId);
      });

      viewport.addEventListener("pointermove", (event) => {
        if (!dragging) return;
        transform.x = transformStartX + event.clientX - dragStartX;
        transform.y = transformStartY + event.clientY - dragStartY;
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
        const rect = viewport.getBoundingClientRect();
        const factor = event.deltaY < 0 ? 1.1 : 0.9;
        setScale(transform.scale * factor, event.clientX - rect.left, event.clientY - rect.top);
      }, { passive: false });

      fitButton.addEventListener("click", fitAll);
      entryButton.addEventListener("click", focusEntry);
      zoomInButton.addEventListener("click", () => {
        const rect = viewport.getBoundingClientRect();
        setScale(transform.scale * 1.15, rect.width / 2, rect.height / 2);
      });
      zoomOutButton.addEventListener("click", () => {
        const rect = viewport.getBoundingClientRect();
        setScale(transform.scale * 0.85, rect.width / 2, rect.height / 2);
      });

      crumb.textContent = "プロジェクト全体マップ｜案内層と主工程";
      render();
      requestAnimationFrame(fitAll);
   
})();
