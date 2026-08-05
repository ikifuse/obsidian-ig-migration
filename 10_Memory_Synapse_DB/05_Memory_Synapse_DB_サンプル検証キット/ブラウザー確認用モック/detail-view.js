(() => {
  "use strict";

  const core = globalThis.MemorySynapseDetailViewCore;
  const appRoot = document.querySelector("#app");
  if (!core || !appRoot) return;

  function appendValueNodes(container, value) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const lines = String(value ?? "").split("\n");
    lines.forEach((line, index) => {
      if (index > 0) container.append(document.createElement("br"));
      const parts = line.split(urlRegex);
      parts.forEach((part) => {
        if (/^https?:\/\//.test(part)) {
          const a = document.createElement("a");
          a.href = part;
          a.textContent = part;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.className = "external-link";
          container.append(a);
        } else if (part) {
          container.append(document.createTextNode(part));
        }
      });
    });
  }

  function createField({ label, value, empty }) {
    const field = document.createElement("div");
    field.className = "field source-field-expanded";

    const term = document.createElement("dt");
    term.textContent = label;

    const description = document.createElement("dd");
    appendValueNodes(description, value);
    if (empty) description.classList.add("field-empty");

    field.append(term, description);
    return field;
  }

  function expandStructuredSourceFields() {
    appRoot.querySelectorAll(".field-grid > .field").forEach((field) => {
      const term = field.children[0];
      const description = field.children[1];
      if (!term || !description) return;

      const rows = core.sourceRows(term.textContent.trim(), description.textContent);
      if (!rows) return;

      const fragment = document.createDocumentFragment();
      for (const row of rows) fragment.append(createField(row));
      field.replaceWith(fragment);
    });
  }

  const observer = new MutationObserver(expandStructuredSourceFields);
  observer.observe(appRoot, { childList: true, subtree: true });
  expandStructuredSourceFields();
})();
