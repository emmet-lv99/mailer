
export interface HistoryItem {
  id: number;
  channel_id: string;
  channel_name: string;
  email: string;
  subject: string;
  status: string;
  sent_at: string;
  has_replied: boolean;
  note: string | null;
  source: string;
}

export type BulkUpdatePayload = {
  ids: number[];
  status: string;
};
