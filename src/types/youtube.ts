export interface YouTubeChannel {
  id: string;
  title: string;
  description: string;
  customUrl?: string; // e.g. @channelname
  publishedAt: string;
  thumbnailUrl: string;
  statistics?: {
    subscriberCount: string;
    videoCount: string;
    viewCount: string;
  };
}

export interface YouTubeSearchResponse {
  items: {
    id: {
      kind: string;
      channelId: string;
    };
    snippet: {
      publishedAt: string;
      channelId: string;
      title: string;
      description: string;
      thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
      };
      channelTitle: string;
      liveBroadcastContent: string;
      publishTime: string;
    };
  }[];
  nextPageToken?: string;
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeChannelListResponse {
  items: {
    id: string;
    snippet: {
      title: string;
      description: string;
      customUrl: string;
      publishedAt: string;
      thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
      };
    };
    statistics: {
      viewCount: string;
      subscriberCount: string;
      hiddenSubscriberCount: boolean;
      videoCount: string;
    };
  }[];
}
