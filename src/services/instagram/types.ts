
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
  is_registered: boolean;
  db_status: 'todo' | 'ignored' | 'sent' | 'replied' | 'unsuitable' | null;
};

export type SearchResponse = {
  results: InstagramUser[];
  fallbackUrl?: string | null; // URL to Instagram hashtag page when scraping fails
  meta: {
    keyword: string;
    count: number;
  };
};
