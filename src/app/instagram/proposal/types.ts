export type Reaction = "pending" | "accept" | "refuse";

export interface Proposal {
  id: number;
  instagram_id: string;
  followers: number;
  created_at: string;
  is_sent: boolean;
  sent_at: string | null;
  reaction: Reaction;
  content: string;
  memo: string;
}

export type SortKey = "created_at" | "sent_at";

export interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}
