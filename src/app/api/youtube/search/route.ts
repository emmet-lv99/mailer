import { google } from "googleapis";
import { NextResponse } from "next/server";

const youtube = google.youtube("v3");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const minSubsStr = searchParams.get("minSubs");
    const maxSubsStr = searchParams.get("maxSubs");
    const pageToken = searchParams.get("pageToken");

    if (!q) {
      return NextResponse.json({ error: "Missing query parameter 'q'" }, { status: 400 });
    }

    const apiKey = process.env.ANMOK_YOUTUBE_API_KEY || process.env.ANMOK_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Server API Key is missing (ANMOK_YOUTUBE_API_KEY or ANMOK_GEMINI_API_KEY)" }, { status: 500 });
    }

    // 1. Search for channels
    const searchRes = await youtube.search.list({
      key: apiKey,
      part: ["snippet"],
      q,
      type: ["channel"],
      regionCode: "KR", // Restrict to Korea
      maxResults: 50, // Max allowed by YouTube
      pageToken: pageToken || undefined,
    });

    const searchItems = searchRes.data.items || [];
    const nextPageToken = searchRes.data.nextPageToken;

    if (searchItems.length === 0) {
      return NextResponse.json({ channels: [], nextPageToken: null });
    }

    // 2. Get statistics for found channels
    const channelIds = searchItems
      .map((item) => item.id?.channelId)
      .filter((id): id is string => !!id);

    const channelsRes = await youtube.channels.list({
      key: apiKey,
      part: ["snippet", "statistics"],
      id: channelIds,
    });

    const channelDetails = channelsRes.data.items || [];

    // 3. Merge and Filter
    const minSubs = minSubsStr ? parseInt(minSubsStr, 10) : 0;
    const maxSubs = maxSubsStr ? parseInt(maxSubsStr, 10) : Infinity;

    const channels = channelDetails
      .map((detail) => {
        const stats = detail.statistics;
        const snippet = detail.snippet;
        const subCount = stats?.subscriberCount ? parseInt(stats.subscriberCount, 10) : 0;

        return {
          id: detail.id!,
          title: snippet?.title || "",
          description: snippet?.description || "",
          customUrl: snippet?.customUrl,
          publishedAt: snippet?.publishedAt || "",
          thumbnailUrl: snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.default?.url || "",
          statistics: {
            subscriberCount: stats?.subscriberCount || "0",
            videoCount: stats?.videoCount || "0",
            viewCount: stats?.viewCount || "0",
          },
          // Internal use for filtering
          _subCount: subCount,
        };
      })
      .filter((channel) => {
        return channel._subCount >= minSubs && channel._subCount <= maxSubs;
      })
      .map(({ _subCount, ...rest }) => rest); // Remove internal field

    return NextResponse.json({
      channels,
      nextPageToken,
      pageInfo: searchRes.data.pageInfo,
    });
  } catch (error: any) {
    console.error("YouTube API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch data from YouTube" },
      { status: 500 }
    );
  }
}
