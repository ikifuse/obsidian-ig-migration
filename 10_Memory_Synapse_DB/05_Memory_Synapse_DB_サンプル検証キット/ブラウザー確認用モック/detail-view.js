(() => {
  "use strict";

  const core = globalThis.MemorySynapseDetailViewCore;
  const appRoot = document.querySelector("#app");
  if (!core || !appRoot) return;

  function createField({ label, value, empty }) {
    const field = document.createElement("div");
    field.className = "field source-field-expanded";

    const term = document.createElement("dt");
    term.textContent = label;

    const description = document.createElement("dd");
    description.textContent = value;
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
