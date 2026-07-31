(function exposeLayoutCore(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MemorySynapseLayoutCore = api;
}(typeof globalThis === "object" ? globalThis : this, function createLayoutCore() {
  const limits = Object.freeze({
    breakpoint: 900,
    ribbonWidth: 48,
    resizerWidth: 6,
    centerMin: 360,
    leftMin: 180,
    rightMin: 260,
    leftDefault: 280,
    rightDefault: 340,
    keyboardStep: 16,
  });

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }

  function maximumPanelWidth(viewportWidth, otherPanelWidth) {
    return Math.max(
      0,
      viewportWidth
        - limits.ribbonWidth
        - (limits.resizerWidth * 2)
        - limits.centerMin
        - otherPanelWidth
    );
  }

  function nextPanelWidth(side, currentWidth, delta, viewportWidth, otherPanelWidth) {
    const minimum = side === "left" ? limits.leftMin : limits.rightMin;
    const maximum = Math.max(minimum, maximumPanelWidth(viewportWidth, otherPanelWidth));
    return clamp(currentWidth + delta, minimum, maximum);
  }

  return Object.freeze({
    limits,
    clamp,
    maximumPanelWidth,
    nextPanelWidth,
  });
}));
