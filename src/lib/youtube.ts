import { google } from "googleapis";

const youtube = google.youtube({
  version: "v3",
  auth: process.env.ANMOK_YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY,
});

export const getChannelIdFromUrl = async (url: string): Promise<string | null> => {
  // 1. Extract handle or ID from URL
  const cleanUrl = url.split("?")[0];
  let handle = "";
  if (cleanUrl.includes("@")) {
    const rawHandle = cleanUrl.split("@")[1].split("/")[0];
    handle = decodeURIComponent(rawHandle);
  } else if (cleanUrl.includes("channel/")) {
    return cleanUrl.split("channel/")[1].split("/")[0];
  }

  if (!handle) return null;

  // 2. Search for the channel by handle
  try {
    const response = await youtube.search.list({
      part: ["snippet"],
      q: `@${handle}`,
      type: ["channel"],
      maxResults: 1,
    });

    if (response.data.items && response.data.items.length > 0) {
      return response.data.items[0].snippet?.channelId || null;
    } else {
      console.log("YouTube Search returned no items for handle:", handle);
      throw new Error(`Channel not found for handle: ${handle}`);
    }
  } catch (error: any) {
    console.error("Error fetching channel ID:", error);
    // Re-throw if it's our clear error, otherwise wrap
    if (error.message.includes("Channel not found")) throw error;
    throw new Error(`YouTube API Error: ${error.message}`);
  }

  return null;
};

export const getChannelDetails = async (channelId: string) => {
  try {
    const response = await youtube.channels.list({
      part: ["snippet", "brandingSettings", "contentDetails"],
      id: [channelId],
    });

    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      return {
        title: item.snippet?.title,
        description: item.snippet?.description,
        customUrl: item.snippet?.customUrl,
        thumbnails: item.snippet?.thumbnails,
        bannerExternalUrl: item.brandingSettings?.image?.bannerExternalUrl, // [NEW] Banner Image
        keywords: item.brandingSettings?.channel?.keywords,
        uploadsPlaylistId: item.contentDetails?.relatedPlaylists?.uploads,
      };
    }
  } catch (error) {
    console.error("Error fetching channel details:", error);
  }
  return null;
};

export const getRecentVideos = async (playlistId: string, limit = 5) => {
  try {
    const response = await youtube.playlistItems.list({
      part: ["snippet"],
      playlistId: playlistId,
      maxResults: limit,
    });

    return response.data.items?.map((item) => ({
      id: item.snippet?.resourceId?.videoId, // [NEW] Return ID for comment fetching
      title: item.snippet?.title,
      description: item.snippet?.description,
      thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
      publishedAt: item.snippet?.publishedAt,
    })) || [];
  } catch (error) {
    console.error("Error fetching recent videos:", error);
    return [];
  }
};

export const getVideoComments = async (videoId: string, maxResults = 10) => {
  try {
    const response = await youtube.commentThreads.list({
      part: ["snippet"],
      videoId: videoId,
      maxResults: maxResults,
      order: "relevance", // Get top comments
      textFormat: "plainText",
    });

    return response.data.items?.map((item) => ({
      author: item.snippet?.topLevelComment?.snippet?.authorDisplayName,
      text: item.snippet?.topLevelComment?.snippet?.textDisplay,
      likes: item.snippet?.topLevelComment?.snippet?.likeCount,
    })) || [];
  } catch (error) {
    // Comments might be disabled
    console.warn(`Could not fetch comments for video ${videoId}:`, error);
    return [];
  }
};
