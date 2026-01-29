
export type InstagramUser = {
  username: string;
  full_name: string;
  followers_count: number; // 0 if not fetched yet
  posts_count: number;
  biography: string;
  profile_pic_url: string;
  recent_posts: {
    caption: string;
    imageUrl: string;
    likes: number;
    comments: number;
    views?: number; // videoViewCount for Reels/Videos
    type?: 'Image' | 'Video' | 'Sidecar'; // Post type
    productType?: 'clips' | 'feed' | 'igtv'; // clips = Reels
    timestamp: string;
    latest_comments?: {
      text: string;
      ownerUsername: string;
      timestamp: string;
    }[];
  }[];
  is_registered?: boolean; // If true, managed in CRM
  db_status?: string; // CRM status
  latest_analysis_date?: string | null; // Last analyzed date form history
  is_from_history?: boolean; // If true, result is from DB (no posts)
};

export type SearchResponse = {
  results: InstagramUser[];
  fallbackUrl?: string | null; // URL to Instagram hashtag page when scraping fails
  meta: {
    keyword: string;
    count: number;
  };
};
