"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { instagramService } from "@/services/instagram/api";
import { useInstagramStore } from "@/services/instagram/store";
import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { getLatestPostDate } from "@/services/instagram/utils";
import { useSearchParams } from "next/navigation";
import { PostLightbox } from "../components/PostLightbox";
import { InstagramUserCard } from "./components/InstagramUserCard";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const urlMode = searchParams.get('mode') === 'target' ? 'target' : 'tag';
  
  // Use Global Store
  const { 
    keyword, setKeyword, 
    searchMode, setSearchMode,
    results, setResults, 
    fallbackUrl, setFallbackUrl,
    selectedUsernames, toggleSelection, setSelectedUsers 
  } = useInstagramStore();

  const [limit, setLimit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(results.length > 0);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Sync URL mode to Store and clear results if mode changes
  useEffect(() => {
    if (urlMode !== searchMode) {
        // Mode changed! Clear all previous search state.
        setSearchMode(urlMode);
        setResults([]);
        setFallbackUrl(null);
        setKeyword('');
        setSelectedUsers(new Set());
        setSearched(false);
    }
  }, [urlMode, searchMode, setSearchMode, setResults, setFallbackUrl, setKeyword, setSelectedUsers]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setSearched(false);
    setFallbackUrl(null);
    try {
      // In target mode, limit is always 1 (semantically), but API handles it.
      const data = await instagramService.search(keyword, limit, urlMode);
      setResults(data.results);
      setFallbackUrl(data.fallbackUrl || null);
      setSearched(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedResults = [...results].map(user => ({
      ...user,
      recent_posts: [...user.recent_posts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  })).sort((a, b) => {
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
  
  return (
    <div className="container mx-auto p-6 max-h-screen flex flex-col gap-6">
      {/* Header */}
      <header>
        <h1 className="text-3xl font-bold tracking-tight">
            {urlMode === 'target' ? '타겟 아이디 검색' : '인스타그램 태그 검색'}
        </h1>
        <p className="text-muted-foreground">
            {urlMode === 'target' 
             ? '특정 인스타그램 계정을 직접 검색하여 분석합니다.' 
             : '해시태그로 잠재 타겟을 탐색하고, 선택하여 심층 분석하세요.'}
        </p>
      </header>

      {/* Search Input */}
      <Card className="p-6">
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={urlMode === 'target' 
                ? "인스타그램 아이디 입력 (예: anmok_hunter)" 
                : "해시태그 또는 키워드 입력 (예: #홈카페, #육아소통)"}
              className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          
          {urlMode !== 'target' && (
              <div className="w-[100px]">
                  <select 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      value={limit}
                      onChange={(e) => setLimit(Number(e.target.value))}
                  >
                      <option value={10}>10명</option>
                      <option value={30}>30명</option>
                      <option value={50}>50명</option>
                      <option value={100}>100명</option>
                  </select>
              </div>
          )}

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
            {sortedResults.map((user) => (
                <InstagramUserCard 
                    key={user.username}
                    user={user}
                    isSelected={selectedUsernames.has(user.username)}
                    isDisabled={user.is_registered}
                    onToggleSelection={toggleSelection}
                    onPostSelect={setSelectedPost}
                />
            ))}
          </div>
          
          {results.length === 0 && (
              <div className="text-center py-12 text-muted-foreground space-y-4">
                  <p>검색 결과가 없습니다.</p>
                  {fallbackUrl && (
                      <div className="flex flex-col items-center gap-2">
                          <p className="text-sm">일부 태그는 스크래핑이 제한될 수 있습니다.</p>
                          <a 
                              href={fallbackUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                          >
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                              Instagram에서 직접 확인하기
                          </a>
                      </div>
                  )}
              </div>
          )}

          {/* Lightbox Overlay */}
          {selectedPost && (
            <PostLightbox 
              post={selectedPost} 
              onClose={() => setSelectedPost(null)} 
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function InstagramSearchPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SearchPageContent />
        </Suspense>
    );
}
