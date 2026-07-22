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
