
import { YouTubeChannel } from "@/types/youtube"; // Reusing existing type

export interface SearchParams {
  q: string;
  minSubs?: string;
  maxSubs?: string;
  pageToken?: string;
}

export type { YouTubeChannel };
