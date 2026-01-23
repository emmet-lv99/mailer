
const BASE_URL = "/api/youtube/gmail";

export interface DraftPayload {
  subject: string;
  body: string;
  headerTemplateId?: number | null;
  footerTemplateId?: number | null;
  templateId?: number | null; // For single save
  recipientEmail: string;
  channelId?: string;
  channelName?: string;
}

export const mailerService = {
  saveDraft: async (payload: DraftPayload): Promise<void> => {
    const res = await fetch(`${BASE_URL}/draft`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Failed to save draft");
    }
  },
};
