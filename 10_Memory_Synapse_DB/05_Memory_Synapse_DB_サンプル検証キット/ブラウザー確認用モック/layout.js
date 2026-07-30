(() => {
  "use strict";

  const core = globalThis.MemorySynapseLayoutCore;
  const appRoot = document.querySelector("#app");
  if (!core || !appRoot) return;

  let leftWidth = core.limits.leftDefault;
  let rightWidth = core.limits.rightDefault;
  let openDrawer = null;
  let activeResize = null;
  let currentShell = null;

  const mobileQuery = window.matchMedia(`(max-width: ${core.limits.breakpoint}px)`);

  function panelElements(shell) {
    return {
      left: shell.querySelector(".obsidian-sidebar-left"),
      center: shell.querySelector(".obsidian-center"),
      right: shell.querySelector(".obsidian-sidebar-right"),
    };
  }

  function applyPanelWidths(shell) {
    const panels = panelElements(shell);
    if (!panels.left || !panels.right) return;
    panels.left.style.width = `${leftWidth}px`;
    panels.left.style.flexBasis = `${leftWidth}px`;
    panels.right.style.width = `${rightWidth}px`;
    panels.right.style.flexBasis = `${rightWidth}px`;
  }

  function normalizePanelWidths() {
    leftWidth = core.nextPanelWidth(
      "left",
      leftWidth,
      0,
      window.innerWidth,
      rightWidth
    );
    rightWidth = core.nextPanelWidth(
      "right",
      rightWidth,
      0,
      window.innerWidth,
      leftWidth
    );
  }

  function updateDrawerState(shell) {
    shell.classList.toggle("mobile-left-open", openDrawer === "left");
    shell.classList.toggle("mobile-right-open", openDrawer === "right");
    shell.querySelectorAll("[data-mobile-pane]").forEach((button) => {
      button.setAttribute("aria-expanded", String(button.dataset.mobilePane === openDrawer));
    });
  }

  function setDrawer(shell, side) {
    openDrawer = openDrawer === side ? null : side;
    updateDrawerState(shell);
  }

  function makeButton(label, pane, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    if (pane) button.dataset.mobilePane = pane;
    return button;
  }

  function makeResizer(side) {
    const separator = document.createElement("div");
    separator.className = `workspace-resizer workspace-resizer-${side}`;
    separator.dataset.resizePane = side;
    separator.setAttribute("role", "separator");
    separator.setAttribute("aria-orientation", "vertical");
    separator.setAttribute(
      "aria-label",
      side === "left" ? "左サイドバーの幅を変更" : "右サイドバーの幅を変更"
    );
    separator.tabIndex = 0;
    return separator;
  }

  function startResize(side, clientX) {
    if (mobileQuery.matches || !currentShell) return;
    activeResize = {
      side,
      startX: clientX,
      startWidth: side === "left" ? leftWidth : rightWidth,
    };
    document.body.classList.add("workspace-is-resizing");
  }

  function resizeFromKeyboard(side, key) {
    if (!currentShell || mobileQuery.matches) return;
    const panels = panelElements(currentShell);
    if (!panels.left || !panels.right) return;
    const direction = key === "ArrowRight" ? 1 : -1;
    const visualDelta = side === "left" ? direction : -direction;
    const current = side === "left" ? leftWidth : rightWidth;
    const other = side === "left" ? rightWidth : leftWidth;
    const next = core.nextPanelWidth(
      side,
      current,
      visualDelta * core.limits.keyboardStep,
      window.innerWidth,
      other
    );
    if (side === "left") leftWidth = next;
    else rightWidth = next;
    applyPanelWidths(currentShell);
  }

  function installLayout(shell) {
    if (shell.dataset.layoutReady === "true") return;
    const panels = panelElements(shell);
    if (!panels.left || !panels.center || !panels.right) return;

    shell.dataset.layoutReady = "true";
    currentShell = shell;
    normalizePanelWidths();
    applyPanelWidths(shell);

    const leftResizer = makeResizer("left");
    const rightResizer = makeResizer("right");
    panels.center.before(leftResizer);
    panels.right.before(rightResizer);

    for (const separator of [leftResizer, rightResizer]) {
      const side = separator.dataset.resizePane;
      separator.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        startResize(side, event.clientX);
      });
      separator.addEventListener("keydown", (event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        resizeFromKeyboard(side, event.key);
      });
    }

    const controls = document.createElement("nav");
    controls.className = "mobile-pane-controls";
    controls.setAttribute("aria-label", "表示領域を切り替え");
    const openLeft = makeButton("エクスプローラー", "left", "mobile-pane-button");
    const openRight = makeButton("Memory Synapse", "right", "mobile-pane-button");
    controls.append(openLeft, openRight);
    panels.center.prepend(controls);

    openLeft.addEventListener("click", () => setDrawer(shell, "left"));
    openRight.addEventListener("click", () => setDrawer(shell, "right"));

    const backdrop = document.createElement("button");
    backdrop.type = "button";
    backdrop.className = "mobile-pane-backdrop";
    backdrop.setAttribute("aria-label", "サイドバーを閉じる");
    backdrop.addEventListener("click", () => {
      openDrawer = null;
      updateDrawerState(shell);
    });
    shell.append(backdrop);

    const leftHeader = panels.left.querySelector(".sidebar-header");
    const rightHeader = panels.right.querySelector(".sidebar-right-header");
    for (const [header, label] of [
      [leftHeader, "エクスプローラーを閉じる"],
      [rightHeader, "Memory Synapseを閉じる"],
    ]) {
      if (!header) continue;
      const close = makeButton("×", null, "mobile-pane-close");
      close.setAttribute("aria-label", label);
      close.addEventListener("click", () => {
        openDrawer = null;
        updateDrawerState(shell);
      });
      header.append(close);
    }

    updateDrawerState(shell);
  }

  document.addEventListener("pointermove", (event) => {
    if (!activeResize || !currentShell) return;
    const panels = panelElements(currentShell);
    if (!panels.left || !panels.right) return;
    const side = activeResize.side;
    const pointerDelta = event.clientX - activeResize.startX;
    const visualDelta = side === "left" ? pointerDelta : -pointerDelta;
    const other = side === "left" ? rightWidth : leftWidth;
    const next = core.nextPanelWidth(
      side,
      activeResize.startWidth,
      visualDelta,
      window.innerWidth,
      other
    );
    if (side === "left") leftWidth = next;
    else rightWidth = next;
    applyPanelWidths(currentShell);
  });

  function finishResize() {
    activeResize = null;
    document.body.classList.remove("workspace-is-resizing");
  }

  document.addEventListener("pointerup", finishResize);
  document.addEventListener("pointercancel", finishResize);
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape" || !currentShell || !openDrawer) return;
    openDrawer = null;
    updateDrawerState(currentShell);
  });

  mobileQuery.addEventListener("change", () => {
    if (!currentShell) return;
    if (!mobileQuery.matches) openDrawer = null;
    updateDrawerState(currentShell);
    applyPanelWidths(currentShell);
  });
  window.addEventListener("resize", () => {
    if (!currentShell || mobileQuery.matches) return;
    normalizePanelWidths();
    applyPanelWidths(currentShell);
  });

  const observer = new MutationObserver(() => {
    const shell = appRoot.querySelector(".app-shell");
    if (shell) installLayout(shell);
  });
  observer.observe(appRoot, { childList: true, subtree: true });

  const initialShell = appRoot.querySelector(".app-shell");
  if (initialShell) installLayout(initialShell);
})();
