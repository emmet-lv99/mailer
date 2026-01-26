"use client";

interface PostLightboxProps {
  post: {
    imageUrl: string;
    likes?: number;
    views?: number;
    comments?: number;
    productType?: string;
    timestamp?: string;
  };
  onClose: () => void;
}

export function PostLightbox({ post, onClose }: PostLightboxProps) {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] flex items-center justify-center gap-6" onClick={(e) => e.stopPropagation()}>
        {/* Image Container */}
        <div className="flex-1 h-full flex items-center justify-center min-w-0">
          <img 
            src={`/api/image-proxy?url=${encodeURIComponent(post.imageUrl)}`} 
            alt="Enlarged view" 
            className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
          />
        </div>

        {/* Info Panel (Right Side) */}
        <div className="w-[280px] shrink-0 bg-zinc-900/50 backdrop-blur-md rounded-xl border border-white/10 p-6 text-white self-center shadow-xl">
          <div className="flex flex-col gap-6">
            {/* Header / Type */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400">게시물 정보</span>
              {post.productType === 'clips' && (
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-0.5 rounded font-bold">
                  REELS
                </span>
              )}
            </div>

            {/* Metrics */}
            <div className="space-y-4">
              {/* Likes */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-xl">
                    ❤️
                  </div>
                  <span className="font-medium text-zinc-300">좋아요</span>
                </div>
                <span className="text-xl font-bold font-mono">{(post.likes || 0).toLocaleString()}</span>
              </div>

              {/* Views (Only if > 0) */}
              {(post.views || 0) > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl">
                      👁
                    </div>
                    <span className="font-medium text-zinc-300">조회수</span>
                  </div>
                  <span className="text-xl font-bold font-mono">{(post.views || 0).toLocaleString()}</span>
                </div>
              )}

              {/* Comments */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-zinc-100/20 flex items-center justify-center text-xl">
                    💬
                  </div>
                  <span className="font-medium text-zinc-300">댓글</span>
                </div>
                <span className="text-xl font-bold font-mono">{(post.comments || 0).toLocaleString()}</span>
              </div>
            </div>
            
            <div className="h-px bg-white/10 w-full" />

            {/* Timestamp */}
            <div className="text-xs text-zinc-500 text-right">
              게시일: {post.timestamp ? new Date(post.timestamp).toLocaleDateString() : '-'}
            </div>
          </div>
        </div>

        {/* Close Button */}
        <button 
          className="absolute -top-12 right-0 text-white/50 hover:text-white transition-colors p-2"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
    </div>
  );
}
