"use client";

interface Post {
  imageUrl?: string;
  productType?: string;
  likes?: number;
  views?: number;
}

interface PostsGridProps {
  posts: Post[];
  type: "all" | "reels";
  onPostSelect: (post: Post) => void;
}

export function PostsGrid({ posts, type, onPostSelect }: PostsGridProps) {
  const filteredPosts = type === "reels" 
    ? posts.filter((p) => p.productType === 'clips')
    : posts;

  if (filteredPosts.length === 0) return null;

  const aspectClass = type === "reels" ? "aspect-[9/16]" : "aspect-square";

  return (
    <div className="space-y-4">
      {type === "reels" && (
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-sm text-foreground/80 flex items-center gap-2">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">REELS</span>
            분석된 릴스 ({filteredPosts.length})
          </h4>
        </div>
      )}
      {type === "all" && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm text-foreground/80">분석된 콘텐츠 ({filteredPosts.length})</h4>
          </div>
        </div>
      )}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {filteredPosts.map((post, pIdx) => (
          <div 
            key={`${type}-${pIdx}`} 
            className={`${aspectClass} rounded-md overflow-hidden bg-muted border relative group cursor-pointer`}
            onClick={() => post.imageUrl && onPostSelect(post)}
          >
            {post.imageUrl ? (
              <img 
                src={`/api/image-proxy?url=${encodeURIComponent(post.imageUrl)}`} 
                alt="Thumbnail" 
                className="w-full h-full object-cover transition-transform group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">No Img</div>
            )}
            {/* Reels Badge (only for "all" view) */}
            {type === "all" && post.productType === 'clips' && (
              <div className="absolute top-1 right-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">
                REEL
              </div>
            )}
            {/* Metrics Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-2 text-white text-[9px]">
                <span>❤️ {(post.likes || 0).toLocaleString()}</span>
                {(post.views ?? 0) > 0 && <span>👁 {(post.views ?? 0).toLocaleString()}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
      {type === "reels" && <div className="h-px bg-border/50" />}
    </div>
  );
}
