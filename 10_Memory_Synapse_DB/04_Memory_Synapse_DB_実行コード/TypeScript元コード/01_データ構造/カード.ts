import type { 手書き情報 } from "./手書き情報";

export type カード種類 = "mention" | "location" | "tag";

export interface TagSource {
  hashtag_note: {
    hashtag: string;
    note: string | null;
  };
}

export interface MentionSource {
  mention_note: {
    mention: string;
    name: string | null;
    phone: string[];
    web: string[];
    note: string | null;
  };
}

export interface LocationSource {
  location_note: {
    location: string;
  };
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
  activity_id: string | null;
  source_files: string[];
  note: string | null;
}

export interface TagCard {
  id: string;
  kind: "tag";
  name: string;
  source: TagSource;
  relatedPosts: string[];
  handwritten?: 手書き情報;
  yamlError?: string;
}

export interface MentionCard {
  id: string;
  kind: "mention";
  name: string;
  source: MentionSource;
  relatedPosts: string[];
  handwritten?: 手書き情報;
  yamlError?: string;
}

export interface LocationCard {
  id: string;
  kind: "location";
  name: string;
  source: LocationSource;
  relatedPosts: string[];
  handwritten?: 手書き情報;
  yamlError?: string;
}

export type カード = TagCard | MentionCard | LocationCard;
export type Card = カード;

export const カード種類表示名: Record<カード種類, string> = {
  mention: "Mention",
  location: "Location",
  tag: "Tag"
};
