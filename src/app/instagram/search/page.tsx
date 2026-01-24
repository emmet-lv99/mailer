"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { instagramService } from "@/services/instagram/api";
import { useInstagramStore } from "@/services/instagram/store";
import { Search } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { getLatestPostDate, getProxiedUrl } from "@/services/instagram/utils";
import { useSearchParams } from "next/navigation";
import { InstagramUserCard } from "./components/InstagramUserCard";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const urlMode = searchParams.get('mode') === 'target' ? 'target' : 'tag';
  
  // Use Global Store
  const { 
    keyword, setKeyword, 
    searchMode, setSearchMode,
    results, setResults, 
    selectedUsernames, toggleSelection, setSelectedUsers 
  } = useInstagramStore();

  const [limit, setLimit] = useState(30);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(results.length > 0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Sync URL mode to Store
  useEffect(() => {
    if (urlMode !== searchMode) {
        setSearchMode(urlMode);
    }
  }, [urlMode, searchMode, setSearchMode]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setSearched(false);
    try {
      // In target mode, limit is always 1 (semantically), but API handles it.
      const data = await instagramService.search(keyword, limit, urlMode);
      setResults(data.results);
      setSearched(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
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
                    onImageSelect={setSelectedImage}
                />
            ))}
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
                          <Search className="w-6 h-6 rotate-45" /> 
                      </button>
                  </div>
              </div>
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
