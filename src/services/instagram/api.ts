
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
  }
};
