(function exposeDetailViewCore(root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.MemorySynapseDetailViewCore = api;
}(typeof globalThis === "object" ? globalThis : this, function createDetailViewCore() {
  const emptyValue = "—";

  function parseObject(text) {
    try {
      const value = JSON.parse(text);
      return value && typeof value === "object" && !Array.isArray(value) ? value : null;
    } catch {
      return null;
    }
  }

  function displayValue(value) {
    if (Array.isArray(value)) {
      const values = value.filter((item) => item !== null && item !== undefined && item !== "");
      return values.length > 0 ? values.join("\n") : emptyValue;
    }
    if (value === null || value === undefined || value === "") return emptyValue;
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return String(value);
  }

  function row(label, value) {
    const displayed = displayValue(value);
    return { label, value: displayed, empty: displayed === emptyValue };
  }

  function rowsForObject(object, fields) {
    return fields.map(([key, label]) => row(label, object[key]));
  }

  function sourceRows(fieldKey, fieldText) {
    if (fieldKey === "mention_note") {
      const object = parseObject(fieldText);
      return object ? rowsForObject(object, [
        ["mention", "元のメンション"],
        ["name", "名前"],
        ["phone", "電話"],
        ["web", "Web"],
        ["note", "自由メモ"],
      ]) : null;
    }

    if (fieldKey === "hashtag_note") {
      const object = parseObject(fieldText);
      return object ? rowsForObject(object, [
        ["hashtag", "元のタグ"],
        ["note", "自由メモ"],
      ]) : null;
    }

    if (fieldKey === "location_note") {
      const object = parseObject(fieldText);
      return object ? rowsForObject(object, [["location", "場所名"]]) : null;
    }

    if (fieldKey === "geo") {
      const object = parseObject(fieldText);
      return object ? rowsForObject(object, [
        ["lat", "緯度"],
        ["lng", "経度"],
        ["alt", "高度"],
      ]) : null;
    }

    if (fieldKey === "address") {
      const object = parseObject(fieldText);
      if (!object) return null;
      const components = object.components && typeof object.components === "object"
        ? object.components
        : {};
      return [
        row("住所全文", object.full),
        ...rowsForObject(components, [
          ["country", "国"],
          ["prefecture", "都道府県"],
          ["city", "市区町村"],
          ["district", "地区"],
          ["street", "番地等"],
          ["postal_code", "郵便番号"],
        ]),
      ];
    }

    const scalarLabels = {
      activity_id: "活動ID",
      source_files: "元ファイル",
      note: "人間の記憶",
    };
    const label = scalarLabels[fieldKey];
    return label ? [row(label, fieldText)] : null;
  }

  return Object.freeze({
    emptyValue,
    displayValue,
    sourceRows,
  });
}));
