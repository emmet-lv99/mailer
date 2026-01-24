import { InstagramUser } from "./types";

export const getLatestPostDate = (user: InstagramUser) => {
    if (!user.recent_posts || user.recent_posts.length === 0) return null;
    const sorted = [...user.recent_posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    return new Date(sorted[0].timestamp);
};

export const getAverageUploadCycle = (posts: any[]) => {
    if (!posts || posts.length < 2) return null;
    const sorted = [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    let totalDiff = 0;
    for (let i = 0; i < sorted.length - 1; i++) {
        const diff = new Date(sorted[i].timestamp).getTime() - new Date(sorted[i+1].timestamp).getTime();
        totalDiff += diff;
    }
    const avgMs = totalDiff / (sorted.length - 1);
    return Math.round(avgMs / (1000 * 60 * 60 * 24));
};

export const getCommunicationStats = (user: InstagramUser) => {
  let totalFetchedComments = 0;
  let myReplies = 0;
  
  user.recent_posts.forEach(post => {
      if (post.latest_comments) {
          totalFetchedComments += post.latest_comments.length;
          post.latest_comments.forEach(c => {
               if (c.ownerUsername === user.username) {
                   myReplies++;
               }
          });
      }
  });

  if (totalFetchedComments === 0) return null;

  const fanComments = totalFetchedComments - myReplies;
  const replyRate = fanComments > 0 ? Math.round((myReplies / fanComments) * 100) : 0;
  
  return {
      replyRate,
      sampleSize: totalFetchedComments
  };
};

export const isUserActive = (latestDate: Date | null) => {
    if (!latestDate) return false;
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return latestDate >= oneMonthAgo;
};

export const getProxiedUrl = (url: string | null | undefined) => {
    if (!url) return "";
    if (url.startsWith("data:") || url.startsWith("/")) return url;
    return `/api/image-proxy?url=${encodeURIComponent(url)}`;
};
