
import { InstagramUser, SearchResponse } from "./types";

export const instagramService = {
  search: async (
    keyword: string, 
    limit: number = 10, 
    mode: 'tag' | 'target' = 'tag',
    onLog?: (message: string) => void,
    force: boolean = false
  ): Promise<SearchResponse> => {
    const res = await fetch("/api/instagram/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keyword, limit, mode, force }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to search");
    }

    if (!res.body) throw new Error("ReadableStream not supported in this browser.");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let finalResult: SearchResponse | null = null;

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || ''; // Keep the last partial line

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const data = JSON.parse(line);
                    if (data.type === 'log') {
                        onLog?.(data.message);
                    } else if (data.type === 'result') {
                        finalResult = data.data;
                    } else if (data.type === 'error') {
                        throw new Error(data.message);
                    }
                } catch (e: any) {
                    console.warn("Stream parse error:", e);
                    if (e.message && e.message !== "Unexpected end of JSON input") {
                        throw e; // Re-throw actual errors
                    }
                }
            }
        }
        
    } finally {
        reader.releaseLock();
    }

    // Flush decoder
    buffer += decoder.decode();

    // Flush remaining buffer
    if (buffer.trim()) {
        try {
            console.log("[Stream] Final buffer content:", buffer); 
            const data = JSON.parse(buffer);
            if (data.type === 'log') {
                onLog?.(data.message);
            } else if (data.type === 'result') {
                finalResult = data.data;
            } else if (data.type === 'error') {
                throw new Error(data.message);
            }
        } catch (e) {
            console.warn("[Stream] Final buffer parse error:", e);
        }
    }

    if (!finalResult) {
        console.error("[Stream] No final result found. Buffer:", buffer);
        throw new Error("검색 결과가 없습니다. (서버 응답 오류)");
    }

    return finalResult;
  },

  /**
   * Stage 1: Fetch Raw Verified Data
   */
  fetchRaw: async (users: Partial<InstagramUser>[]): Promise<{ results: any[] }> => {
    const res = await fetch('/api/instagram/fetch-raw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ users }),
    });
    if (!res.ok) throw new Error('Fetch Raw failed');
    return res.json();
  },

  /**
   * Stage 2: AI Analysis (Qualitative)
   */
  analyzeAI: async (rawData: any[], promptType: 'INSTA' | 'INSTA_TARGET' = 'INSTA') => {
    const res = await fetch('/api/instagram/analyze-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rawData, promptType }),
    });
    if (!res.ok) throw new Error('AI Analysis failed');
    return res.json();
  },

  analyze: async (users: Partial<InstagramUser>[], promptType: 'INSTA' | 'INSTA_TARGET' = 'INSTA') => {
    console.warn("Using legacy monolithic analyze call. Consider migrating to fetchRaw + analyzeAI.");
    return instagramService.fetchRaw(users).then(raw => instagramService.analyzeAI(raw.results, promptType));
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

  getAnalysisResult: async (username: string): Promise<any> => {
      const res = await fetch(`/api/instagram/history?mode=analysis&username=${encodeURIComponent(username)}`);
      if (!res.ok) throw new Error("Failed to fetch analysis result");
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
