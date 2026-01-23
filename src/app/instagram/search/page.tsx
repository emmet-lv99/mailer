
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { instagramService } from "@/services/instagram/api";
import { InstagramUser } from "@/services/instagram/types";
import { Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function InstagramSearchPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<InstagramUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Stats
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);

  const handleAnalyze = async () => {
      if (selectedUsers.size === 0) return;
      setIsAnalyzing(true);
      try {
          // Filter selected user objects
          const targets = results.filter(u => selectedUsers.has(u.username));
          const response = await instagramService.analyze(targets);
          setAnalysisResults(response.results);
          toast.success(`${response.results.length}명 분석 완료!`);
      } catch (error: any) {
          toast.error(error.message);
      } finally {
          setIsAnalyzing(false);
      }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setSearched(false);
    try {
      const data = await instagramService.search(keyword);
      setResults(data.results);
      setSearched(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (username: string) => {
    const next = new Set(selectedUsers);
    if (next.has(username)) next.delete(username);
    else next.add(username);
    setSelectedUsers(next);
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
                <Button variant="outline" size="sm" onClick={() => setSelectedUsers(new Set())}>
                    전체 해제
                </Button>
                <Button size="sm" disabled={selectedUsers.size === 0 || isAnalyzing} onClick={handleAnalyze}>
                    {isAnalyzing ? "분석 중..." : `${selectedUsers.size}명 AI 분석 시작`}
                </Button>
            </div>
          </div>

          {/* Analysis View Overlay or Inline Expansion could be better, but let's start with a simple toggle or modal concept. 
              Actually, replacing the grid with analysis result list might be cleaner for the "Browse Analysis" step.
          */}
          {analysisResults.length > 0 && (
              <div className="mb-8 border-b pb-8">
                  <h3 className="text-xl font-bold mb-4">✨ AI 분석 결과</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {analysisResults.map((result, idx) => {
                          // Find original user info
                          const user = results.find(u => u.username === result.username);
                          if (!user) return null;
                          
                          return (
                              <Card key={idx} className="overflow-hidden border-2 border-indigo-100 dark:border-indigo-900/50">
                                  <div className="p-4 bg-muted/30 flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-muted overflow-hidden">
                                          {user.profile_pic_url && <img src={user.profile_pic_url} className="w-full h-full object-cover" />}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <div className="font-bold truncate">{user.username}</div>
                                          <div className="text-xs text-muted-foreground">{user.full_name}</div>
                                      </div>
                                      <div className={`px-2 py-1 rounded text-xs font-bold ${result.analysis.is_target ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                          {result.analysis.category || '기타'}
                                      </div>
                                  </div>
                                  <div className="p-4 space-y-3">
                                      <div className="flex flex-wrap gap-1">
                                          {result.analysis.mood_keywords?.map((k: string) => (
                                              <span key={k} className="text-xs bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded">#{k}</span>
                                          ))}
                                      </div>
                                      <p className="text-sm text-muted-foreground line-clamp-3">
                                          {result.analysis.summary}
                                      </p>
                                      
                                      <div className="flex gap-2 mt-4 pt-2 border-t">
                                          <Button size="sm" className="w-full" variant={result.analysis.is_target ? "default" : "outline"}>
                                              관리 추가
                                          </Button>
                                          <Button size="sm" className="w-full" variant="ghost">
                                              제외
                                          </Button>
                                      </div>
                                  </div>
                              </Card>
                          )
                      })}
                  </div>
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((user) => {
              const isSelected = selectedUsers.has(user.username);
              const isDisabled = user.is_registered;

              return (
                <div
                  key={user.username}
                  className={`
                    relative group border rounded-lg p-4 transition-all cursor-pointer
                    ${isDisabled ? "opacity-50 bg-muted cursor-not-allowed" : "hover:border-primary"}
                    ${isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "bg-card"}
                  `}
                  onClick={() => !isDisabled && toggleSelection(user.username)}
                >
                  {/* Status Badge */}
                  {isDisabled && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground rounded">
                        {user.db_status === 'todo' ? '관리중' : 
                         user.db_status === 'ignored' ? '제외됨' : '등록됨'}
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    {/* Avatar Placeholder / Image */}
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                        {user.profile_pic_url ? (
                            <img src={user.profile_pic_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-lg">👤</span>
                        )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{user.full_name || user.username}</h3>
                      <p className="text-sm text-muted-foreground truncate">@{user.username}</p>
                      
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span title="팔로워 수">
                            👥 {user.followers_count === 0 ? '?' : user.followers_count.toLocaleString()}
                        </span>
                        <span>
                            📸 {user.recent_posts.length} 게시물
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Posts Preview */}
                  {user.recent_posts.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-2">
                          {user.recent_posts.slice(0, 3).map((post, idx) => (
                              <div key={idx} className="aspect-square rounded-md bg-muted overflow-hidden relative">
                                  {post.imageUrl ? (
                                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">No Img</div>
                                  )}
                              </div>
                          ))}
                      </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {results.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                  검색 결과가 없습니다.
              </div>
          )}
        </div>
      )}
    </div>
  );
}
