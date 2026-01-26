
import { BulkUpdatePayload, HistoryItem } from "./types";

const BASE_URL = "/api/youtube/history"; // Anticipating the move

export const historyService = {
  fetchHistory: async (hasReplied?: boolean, status?: string): Promise<{ history: HistoryItem[] }> => {
    const params = new URLSearchParams();
    if (hasReplied) params.append("hasReplied", "true");
    if (status && status !== "all") params.append("status", status);
    
    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch history");
    return res.json();
  },

  checkSentHistory: async (channelIds: string[]): Promise<{ sentChannelIds: string[]; channelStatusMap: Record<string, string> }> => {
    const res = await fetch(`${BASE_URL}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channelIds }),
    });
    if (!res.ok) throw new Error("History check failed");
    return res.json();
  },

  updateStatus: async (id: number, status: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Status update failed");
  },

  toggleReplied: async (id: number, has_replied: boolean): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ has_replied }),
    });
    if (!res.ok) throw new Error("Replied toggle failed");
  },

  updateNote: async (id: number, note: string): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    if (!res.ok) throw new Error("Note update failed");
  },

  bulkUpdateStatus: async (payload: BulkUpdatePayload): Promise<void> => {
    const res = await fetch(`${BASE_URL}/bulk-update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Bulk update failed");
  },

  deleteHistory: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Delete failed");
  },

  createHistory: async (logs: any[]): Promise<void> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logs }),
    });
    if (!res.ok) throw new Error("Failed to create history");
  },

  importHistory: async (file: File): Promise<{ count: number }> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const res = await fetch(`${BASE_URL}/import`, {
      method: "POST",
      body: formData,
    });
    
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Import failed");
    }
    return res.json();
  },
};
