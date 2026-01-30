import { Proposal } from "@/app/instagram/proposal/types";

export const proposalService = {
  getList: async (): Promise<Proposal[]> => {
    const res = await fetch("/api/instagram/proposal");
    if (!res.ok) throw new Error("Failed to fetch proposals");
    const data = await res.json();
    return data.results;
  },

  create: async (data: Partial<Proposal>): Promise<Proposal> => {
    const res = await fetch("/api/instagram/proposal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to create proposal");
    }
    const result = await res.json();
    return result.result;
  },

  update: async (id: number, updates: Partial<Proposal>): Promise<Proposal> => {
    const res = await fetch("/api/instagram/proposal", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) throw new Error("Failed to update proposal");
    const result = await res.json();
    return result.result;
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`/api/instagram/proposal?id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete proposal");
  },
};
