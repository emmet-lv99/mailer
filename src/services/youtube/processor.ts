
const BASE_URL = "/api/youtube/process";

export interface YoutubeChannel {
  'Channel ID': string;
  'Channel Title': string;
  Description: string;
  Email: string;
  Subscribers: string;
  URL: string;
  Videos: string;
}

export interface ProcessPayload {
  promptContent: string;
  channels: YoutubeChannel[];
}

export const processorService = {
  start: async (payload: ProcessPayload): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok || !response.body) {
      throw new Error(response.statusText || "Server connection failed");
    }

    return response.body.getReader();
  },
};
