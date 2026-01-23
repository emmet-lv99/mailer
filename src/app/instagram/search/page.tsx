
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { instagramService } from "@/services/instagram/api";
import { useInstagramStore } from "@/services/instagram/store"; // Import Store
import { InstagramUser } from "@/services/instagram/types";
import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function InstagramSearchPage() {
  // Use Global Store
  const { 
    keyword, setKeyword, 
    results, setResults, 
    selectedUsernames, toggleSelection, setSelectedUsers 
  } = useInstagramStore();

  const [limit, setLimit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(results.length > 0); // Init based on store
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setSearched(false);
    try {
      const data = await instagramService.search(keyword, limit);
      setResults(data.results);
      setSearched(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract date
  const getLatestPostDate = (user: InstagramUser) => {
      if (!user.recent_posts || user.recent_posts.length === 0) return null;
      const sorted = [...user.recent_posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return new Date(sorted[0].timestamp);
  };

  // Calculate stats
  const getAverageUploadCycle = (posts: any[]) => {
      if (!posts || posts.length < 2) return null;
      const sorted = [...posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      let totalDiff = 0;
      for (let i = 0; i < sorted.length - 1; i++) {
          const diff = new Date(sorted[i].timestamp).getTime() - new Date(sorted[i+1].timestamp).getTime();
          totalDiff += diff;
      }
      const avgMs = totalDiff / (sorted.length - 1);
      return Math.round(avgMs / (1000 * 60 * 60 * 24)); // Days
  };

  const isUserActive = (latestDate: Date | null) => {
      if (!latestDate) return false;
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return latestDate >= oneMonthAgo;
  };

  const sortedResults = [...results].sort((a, b) => {
      const dateA = getLatestPostDate(a)?.getTime() || 0;
      const dateB = getLatestPostDate(b)?.getTime() || 0;
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
  });

  const toggleSort = () => {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const toggleSelectAll = () => {
    if (selectedUsernames.size === results.filter(u => !u.is_registered).length && selectedUsernames.size > 0) {
        setSelectedUsers(new Set());
    } else {
        const newSet = new Set<string>();
        results.forEach(u => {
            if (!u.is_registered) newSet.add(u.username);
        });
        setSelectedUsers(newSet);
    }
  };
  
  const getProxiedUrl = (url: string | null | undefined) => {
      if (!url) return "";
      // If it's already a base64 or local image, return as is
      if (url.startsWith("data:") || url.startsWith("/")) return url;
      return `/api/image-proxy?url=${encodeURIComponent(url)}`;
  };

  return (
    <div className="container mx-auto p-6 max-h-screen flex flex-col gap-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">인스타그램 아이디 검색</h1>
        <p className="text-muted-foreground">
          해시태그로 잠재 타겟을 탐색하고, 선택하여 심층 분석하세요.
        </p>
      </header>

      {/* Search Input */}
      <Card className="p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="해시태그 또는 키워드 입력 (예: #홈카페, #육아소통)"
              className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          
          <div className="w-[100px]">
              <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={limit}
                  onChange={(e) => setLimit(Number(e.target.value))}
              >
                  <option value={10}>10명</option>
                  <option value={30}>30명</option>
                  <option value={50}>50명</option>
                  <option value={100}>100명</option>
              </select>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "검색 중..." : "검색"}
          </Button>
        </form>
      </Card>

      {/* Results */}
      {searched && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              검색 결과 <span className="text-primary">{results.length}</span>명
            </h2>
            <div className="flex gap-2">
                <Link href="/instagram/analyze">
                  <Button size="sm" disabled={selectedUsernames.size === 0}>
                    {selectedUsernames.size}명 AI 정밀 분석하러 가기 &rarr;
                  </Button>
                </Link>
            </div>
          </div>
          {/* Analysis View Removed */}
          
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 border rounded-lg bg-card mb-4">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id="selectAll"
                        className="accent-primary h-4 w-4"
                        checked={sortedResults.length > 0 && selectedUsernames.size === sortedResults.filter(u => !u.is_registered).length}
                        onChange={toggleSelectAll}
                      />
                      <label htmlFor="selectAll" className="text-sm font-medium cursor-pointer">전체 선택</label>
                 </div>
                 <div className="text-sm text-muted-foreground">
                     총 <span className="font-bold text-foreground">{results.length}</span>명 중 <span className="text-primary font-bold">{selectedUsernames.size}</span>명 선택됨
                 </div>
              </div>

              <div className="flex items-center gap-2">
                 <Button variant="outline" size="sm" onClick={toggleSort}>
                     최근 게시물순 {sortOrder === 'desc' ? '▼' : '▲'}
                 </Button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sortedResults.map((user) => {
                  const isSelected = selectedUsernames.has(user.username);
                  const isDisabled = user.is_registered;
                  
                  const latestDate = getLatestPostDate(user);
                  const isActive = isUserActive(latestDate);
                  const avgCycle = getAverageUploadCycle(user.recent_posts);

                  return (
                    <div 
                        key={user.username} 
                        className={`relative group border rounded-xl overflow-hidden bg-card transition-all hover:shadow-md ${isSelected ? "ring-2 ring-primary bg-primary/5" : ""} ${isDisabled ? "opacity-60 bg-muted/50" : ""}`}
                        onClick={() => !isDisabled && toggleSelection(user.username)}
                    >
                      {/* Selection Overlay (Active on hover or selected) */}
                      {!isDisabled && (
                          <div className={`absolute top-3 left-3 z-10`}>
                             <input 
                                type="checkbox" 
                                className="accent-primary h-5 w-5 shadow-sm"
                                checked={isSelected}
                                onChange={(e) => { e.stopPropagation(); toggleSelection(user.username); }}
                             />
                          </div>
                      )}

                      {/* Header Section */}
                      <div className="p-4 pb-2">
                          <div className="flex items-start justify-between mb-3 pl-7"> 
                             {/* Badge */}
                             {isDisabled ? (
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  user.db_status === 'todo' ? 'bg-blue-100 text-blue-700' : 
                                  user.db_status === 'ignored' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-700'
                              }`}>
                                  {user.db_status === 'todo' ? '관리중' : user.db_status === 'ignored' ? '제외됨' : '등록됨'}
                               </span>
                             ) : (
                                <span className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground font-medium">검색됨</span>
                             )}
                             <a 
                                href={`https://instagram.com/${user.username}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-primary transition-colors"
                                onClick={(e) => e.stopPropagation()}
                             >
                                 <Search className="w-4 h-4" />
                             </a>
                          </div>

                          <div className="flex flex-col items-center text-center gap-2">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-background shadow-sm">
                                    {user.profile_pic_url ? (
                                        <img src={getProxiedUrl(user.profile_pic_url)} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">👤</span>
                                    )}
                                </div>
                                {isActive && (
                                    <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" title="최근 1달 내 활동"></span>
                                )}
                            </div>
                            <div>
                                <div className="font-bold text-sm truncate max-w-[180px]">{user.full_name || user.username}</div>
                                <a 
                                    href={`https://instagram.com/${user.username}`}
                                    target="_blank"
                                    rel="noopener noreferrer" 
                                    className="text-xs text-muted-foreground truncate max-w-[180px] hover:text-primary hover:underline cursor-pointer block"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    @{user.username}
                                </a>
                            </div>
                          </div>
                      </div>

                      {/* Stats Section */}
                      <div className="grid grid-cols-2 divide-x border-y bg-muted/20">
                          <div className="p-2 text-center">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">팔로워</div>
                              <div className="text-sm font-medium">{user.followers_count === -1 ? '?' : user.followers_count.toLocaleString()}</div>
                          </div>
                          <div className="p-2 text-center">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">평균 주기</div>
                              <div className="text-sm font-medium">{avgCycle ? `${avgCycle}일` : '-'}</div>
                          </div>
                      </div>

                      {/* Recent Posts Gallery */}
                      <div className="p-3 bg-muted/10">
                          <div className="text-[10px] text-muted-foreground mb-2 flex justify-between items-center">
                              <span>최근 게시물</span>
                              <span>{latestDate ? latestDate.toLocaleDateString() : '-'}</span>
                          </div>
                          <div className="grid grid-cols-5 gap-1">
                              {/* Always show 5 slots placeholder if empty */}
                              {Array.from({ length: 5 }).map((_, idx) => {
                                  const post = user.recent_posts[idx];
                                  return (
                                      <div 
                                        key={idx} 
                                        className="aspect-square rounded-md bg-muted overflow-hidden border relative cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (post?.imageUrl) setSelectedImage(post.imageUrl);
                                        }}
                                      >
                                          {post?.imageUrl ? (
                                              <img src={getProxiedUrl(post.imageUrl)} alt="" className="w-full h-full object-cover transition-transform hover:scale-110" />
                                          ) : (
                                              <div className="w-full h-full flex items-center justify-center text-[8px] text-muted-foreground/30">•</div>
                                          )}
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                    </div>
                  );
            })}
          </div>
          
          {results.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                  검색 결과가 없습니다.
              </div>
          )}

          {/* Lightbox Overlay */}
          {selectedImage && (
              <div 
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                  onClick={() => setSelectedImage(null)}
              >
                  <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                      <img 
                          src={getProxiedUrl(selectedImage)} 
                          alt="Enlarged view" 
                          className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                          onClick={(e) => e.stopPropagation()} 
                      />
                      <button 
                          className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                          onClick={() => setSelectedImage(null)}
                      >
                          <Search className="w-6 h-6 rotate-45" /> {/* Using Search icon rotated as X closely enough, or use X icon if imported */}
                      </button>
                  </div>
              </div>
          )}
        </div>
      )}
    </div>
  );
}
