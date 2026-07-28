import type { カード種類, TagSource, MentionSource, LocationSource } from "../01_データ構造/カード";
import type { 保存用手書き情報 } from "../01_データ構造/手書き情報";

export function validateTagSource(source: any): string | null {
  if (!source || typeof source !== "object") return "YAMLがオブジェクトではありません";
  if (!source.hashtag_note || typeof source.hashtag_note !== "object") return "hashtag_noteがありません";
  if (typeof source.hashtag_note.hashtag !== "string") return "hashtag_note.hashtagが文字列ではありません";
  if (source.hashtag_note.note !== undefined && source.hashtag_note.note !== null && typeof source.hashtag_note.note !== "string") return "hashtag_note.noteが文字列またはnullではありません";
  return null;
}

export function validateMentionSource(source: any): string | null {
  if (!source || typeof source !== "object") return "YAMLがオブジェクトではありません";
  if (!source.mention_note || typeof source.mention_note !== "object") return "mention_noteがありません";
  if (typeof source.mention_note.mention !== "string") return "mention_note.mentionが文字列ではありません";
  if (source.mention_note.name !== undefined && source.mention_note.name !== null && typeof source.mention_note.name !== "string") return "mention_note.nameが文字列またはnullではありません";
  if (!Array.isArray(source.mention_note.phone)) return "mention_note.phoneが配列ではありません";
  if (!Array.isArray(source.mention_note.web)) return "mention_note.webが配列ではありません";
  if (source.mention_note.web.some((w: any) => typeof w !== "string" || w === "" || w === "-")) return "mention_note.webに空要素や無効な要素が含まれています";
  if (source.mention_note.note !== undefined && source.mention_note.note !== null && typeof source.mention_note.note !== "string") return "mention_note.noteが文字列またはnullではありません";
  return null;
}

export function validateLocationSource(source: any): string | null {
  if (!source || typeof source !== "object") return "YAMLがオブジェクトではありません";
  if (!source.location_note || typeof source.location_note !== "object") return "location_noteがありません";
  if (typeof source.location_note.location !== "string") return "location_note.locationが文字列ではありません";
  if (!source.geo || typeof source.geo !== "object") return "geoがありません";
  if (source.geo.lat !== undefined && source.geo.lat !== null && typeof source.geo.lat !== "number") return "geo.latが数値またはnullではありません";
  if (source.geo.lng !== undefined && source.geo.lng !== null && typeof source.geo.lng !== "number") return "geo.lngが数値またはnullではありません";
  if (source.geo.alt !== undefined && source.geo.alt !== null && typeof source.geo.alt !== "number") return "geo.altが数値またはnullではありません";
  if (!source.address || typeof source.address !== "object") return "addressがありません";
  if (source.address.full !== undefined && source.address.full !== null && typeof source.address.full !== "string") return "address.fullが文字列またはnullではありません";
  if (!source.address.components || typeof source.address.components !== "object") return "address.componentsがありません";
  
  if (source.activity_id !== undefined && source.activity_id !== null && typeof source.activity_id !== "string") return "activity_idが文字列またはnullではありません";
  if (!Array.isArray(source.source_files)) return "source_filesが配列ではありません";
  if (source.note !== undefined && source.note !== null && typeof source.note !== "string") return "noteが文字列またはnullではありません";
  
  return null;
}

export function validateHandwrittenNote(note: any): string | null {
  if (!note || typeof note !== "object") return "手書き情報がオブジェクトではありません";
  if (note.display_name !== undefined && note.display_name !== null && typeof note.display_name !== "string") return "display_nameが文字列またはnullではありません";
  if (!Array.isArray(note.aliases)) return "aliasesが配列ではありません";
  if (note.name !== undefined && note.name !== null && typeof note.name !== "string") return "nameが文字列またはnullではありません";
  if (!Array.isArray(note.phone)) return "phoneが配列ではありません";
  if (!Array.isArray(note.web)) return "webが配列ではありません";
  
  if (!note.geo || typeof note.geo !== "object") return "geoがありません";
  if (note.geo.lat !== undefined && note.geo.lat !== null && typeof note.geo.lat !== "number") return "geo.latが数値またはnullではありません";
  if (note.geo.lng !== undefined && note.geo.lng !== null && typeof note.geo.lng !== "number") return "geo.lngが数値またはnullではありません";
  if (note.geo.alt !== undefined && note.geo.alt !== null && typeof note.geo.alt !== "number") return "geo.altが数値またはnullではありません";
  
  if (!note.address || typeof note.address !== "object") return "addressがありません";
  if (note.address.full !== undefined && note.address.full !== null && typeof note.address.full !== "string") return "address.fullが文字列またはnullではありません";
  if (!note.address.components || typeof note.address.components !== "object") return "address.componentsがありません";
  
  if (note.note !== undefined && note.note !== null && typeof note.note !== "string") return "noteが文字列またはnullではありません";
  
  return null;
}
