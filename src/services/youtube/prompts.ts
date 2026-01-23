
export interface Prompt {
  id: number;
  title: string;
  content: string;
  is_default: boolean;
  created_at: string;
}

const BASE_URL = "/api/youtube/prompts";

export const promptService = {
  getAll: async (): Promise<Prompt[]> => {
    const res = await fetch(BASE_URL);
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
