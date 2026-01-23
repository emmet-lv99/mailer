
import { SearchResponse } from "./types";

export const instagramService = {
  search: async (keyword: string, limit: number = 10): Promise<SearchResponse> => {
    const res = await fetch("/api/instagram/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, limit }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to search");
    }

    return res.json();
  },

  analyze: async (users: any[]): Promise<{ results: any[] }> => {
    const res = await fetch("/api/instagram/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Analysis failed");
    }
    return res.json();
  },

  register: async (user: any): Promise<{ success: boolean }> => {
    const res = await fetch("/api/instagram/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user }),
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Registration failed");
    }
    return res.json();
  },

  getHistory: async (): Promise<{ results: any[] }> => {
      const res = await fetch("/api/instagram/history");
      if (!res.ok) throw new Error("Failed to fetch history");
      return res.json();
  },

  updateStatus: async (username: string, status: string): Promise<void> => {
      const res = await fetch("/api/instagram/history", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
  },

  updateMemo: async (username: string, memo: string): Promise<void> => {
      const res = await fetch("/api/instagram/history", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, memo }),
      });
      if (!res.ok) throw new Error("Failed to update memo");
  },

  updateDmDate: async (username: string, date: string | null): Promise<void> => {
      const res = await fetch("/api/instagram/history", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, dm_sent_date: date }),
      });
      if (!res.ok) throw new Error("Failed to update DM date");
  },

  deleteUser: async (username: string): Promise<void> => {
      const res = await fetch(`/api/instagram/history?username=${encodeURIComponent(username)}`, {
          method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete user");
  }
};
