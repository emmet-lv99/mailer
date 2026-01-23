
import { SearchParams, YouTubeChannel } from "./types";

const BASE_URL = "/api/youtube";

export const youtubeService = {
  search: async (params: SearchParams): Promise<{ channels: YouTubeChannel[]; nextPageToken?: string }> => {
    const searchParams = new URLSearchParams({
      q: params.q,
      minSubs: params.minSubs || "0",
      maxSubs: params.maxSubs || "",
    });
    if (params.pageToken) searchParams.append("pageToken", params.pageToken);

    const res = await fetch(`${BASE_URL}/search?${searchParams.toString()}`);
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Search failed");
    }

    return res.json();
  },
};
