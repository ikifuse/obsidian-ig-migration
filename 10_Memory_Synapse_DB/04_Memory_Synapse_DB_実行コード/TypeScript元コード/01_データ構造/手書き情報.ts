import { 重複と空欄を除く } from "../05_共通処理/入力値整理";

export interface 手書き情報 {
  displayName: string;
  aliases: string[];
  name: string;
  phone: string[];
  web: string[];
  geo: { lat: string; lng: string; alt: string };
  address: {
    full: string;
    country: string;
    prefecture: string;
    city: string;
    district: string;
    street: string;
    postalCode: string;
  };
  note: string;
}

export interface 保存用手書き情報 {
  display_name: string | null;
  aliases: string[];
  name: string | null;
  phone: string[];
  web: string[];
  geo: {
    lat: number | null;
    lng: number | null;
    alt: number | null;
  };
  address: {
    full: string | null;
    components: {
      country: string | null;
      prefecture: string | null;
      city: string | null;
      district: string | null;
      street: string | null;
      postal_code: string | null;
    };
  };
  note: string | null;
}

export const 空の手書き情報: 手書き情報 = {
  displayName: "",
  aliases: [],
  name: "",
  phone: [],
  web: [],
  geo: { lat: "", lng: "", alt: "" },
  address: {
    full: "",
    country: "",
    prefecture: "",
    city: "",
    district: "",
    street: "",
    postalCode: ""
  },
  note: ""
};

function parseNum(val: string): number | null {
  const parsed = Number(val.trim());
  return !isNaN(parsed) && val.trim() !== "" ? parsed : null;
}

function parseStr(val: string): string | null {
  const trimmed = val.trim();
  return trimmed === "" ? null : trimmed;
}

export function 画面データから保存用へ変換する(note: 手書き情報): 保存用手書き情報 {
  return {
    display_name: parseStr(note.displayName),
    aliases: 重複と空欄を除く(note.aliases),
    name: parseStr(note.name),
    phone: 重複と空欄を除く(note.phone),
    web: 重複と空欄を除く(note.web),
    geo: {
      lat: parseNum(note.geo.lat),
      lng: parseNum(note.geo.lng),
      alt: parseNum(note.geo.alt)
    },
    address: {
      full: parseStr(note.address.full),
      components: {
        country: parseStr(note.address.country),
        prefecture: parseStr(note.address.prefecture),
        city: parseStr(note.address.city),
        district: parseStr(note.address.district),
        street: parseStr(note.address.street),
        postal_code: parseStr(note.address.postalCode)
      }
    },
    note: parseStr(note.note)
  };
}

export function 保存用から画面データへ変換する(note: 保存用手書き情報 | null): 手書き情報 {
  if (!note) return { ...空の手書き情報, geo: { ...空の手書き情報.geo }, address: { ...空の手書き情報.address } };
  return {
    displayName: note.display_name ?? "",
    aliases: [...note.aliases],
    name: note.name ?? "",
    phone: [...note.phone],
    web: [...note.web],
    geo: {
      lat: note.geo.lat !== null ? String(note.geo.lat) : "",
      lng: note.geo.lng !== null ? String(note.geo.lng) : "",
      alt: note.geo.alt !== null ? String(note.geo.alt) : ""
    },
    address: {
      full: note.address.full ?? "",
      country: note.address.components?.country ?? "",
      prefecture: note.address.components?.prefecture ?? "",
      city: note.address.components?.city ?? "",
      district: note.address.components?.district ?? "",
      street: note.address.components?.street ?? "",
      postalCode: note.address.components?.postal_code ?? ""
    },
    note: note.note ?? ""
  };
}

export function 手書き情報を整理する(note: 手書き情報): 手書き情報 {
  return {
    displayName: note.displayName.trim(),
    aliases: 重複と空欄を除く(note.aliases),
    name: note.name.trim(),
    phone: 重複と空欄を除く(note.phone),
    web: 重複と空欄を除く(note.web),
    geo: {
      lat: note.geo.lat.trim(),
      lng: note.geo.lng.trim(),
      alt: note.geo.alt.trim()
    },
    address: {
      full: note.address.full.trim(),
      country: note.address.country.trim(),
      prefecture: note.address.prefecture.trim(),
      city: note.address.city.trim(),
      district: note.address.district.trim(),
      street: note.address.street.trim(),
      postalCode: note.address.postalCode.trim()
    },
    note: note.note.trim()
  };
}
