
export interface Prompt {
  id: number;
  title: string;
  content: string;
  is_default: boolean;
  created_at: string;
  prompt_type?: 'YOUTUBE' | 'INSTA' | 'INSTA_TARGET';
  type?: 'YOUTUBE' | 'INSTA' | 'INSTA_TARGET'; // Allow both for compatibility during transition
}

const BASE_URL = "/api/prompts";

export const promptService = {
  getAll: async (type: 'YOUTUBE' | 'INSTA' | 'INSTA_TARGET' = 'YOUTUBE'): Promise<Prompt[]> => {
    const res = await fetch(`${BASE_URL}?type=${type}`);
    if (!res.ok) throw new Error("Failed to fetch prompts");
    return res.json();
  },

  create: async (data: Partial<Prompt>): Promise<Prompt> => {
    const res = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create prompt");
    return res.json();
  },

  update: async (id: number, data: Partial<Prompt>): Promise<Prompt> => {
    // For update, we might still be using [id] based route which needs check.
    // Assuming /api/prompts/[id] exists? 
    // Wait, I only created /api/prompts/route.ts. I did not create /api/prompts/[id]/route.ts.
    // The previous implementation used /api/youtube/prompts/[id].
    // I need to create /api/prompts/[id]/route.ts as well!
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update prompt");
    return res.json();
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete prompt");
  },
};
