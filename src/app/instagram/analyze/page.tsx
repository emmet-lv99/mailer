
"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { instagramService } from "@/services/instagram/api";
import { useInstagramStore } from "@/services/instagram/store";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function InstagramAnalyzePage() {
    const { results, selectedUsernames, analysisResults, setAnalysisResults, removeAnalysisResult, updateUserStatus, searchMode } = useInstagramStore();
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [registering, setRegistering] = useState<Set<string>>(new Set());
    
    // Derived state: Get actual user objects from selection
    const targets = results.filter(u => selectedUsernames.has(u.username));

    useEffect(() => {
        // If we have targets but no analysis results, start analysis automatically
        if (targets.length > 0 && analysisResults.length === 0 && !loading) {
            startAnalysis();
        }
    }, [targets.length]); // Dependency: targets changed (e.g. from nav)

    const startAnalysis = async () => {
        setLoading(true);
        try {
            const promptType = searchMode === 'target' ? 'INSTA_TARGET' : 'INSTA';
            const response = await instagramService.analyze(targets, promptType);
            setAnalysisResults(response.results);
            toast.success(`${response.results.length}명 분석 완료! (${promptType === 'INSTA_TARGET' ? '타겟 분석' : '기본 분석'})`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (user: any) => {
        if (!user) return;
        const username = user.username;
        
        setRegistering(prev => {
            const next = new Set(prev);
            next.add(username);
            return next;
        });

        try {
            await instagramService.register(user);
            updateUserStatus(username, 'todo'); // Update global store
            toast.success(`@${username} 등록 완료!`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setRegistering(prev => {
                const next = new Set(prev);
                next.delete(username);
                return next;
            });
        }
    };

    if (targets.length === 0) {
        return (
            <div className="container mx-auto p-6 flex flex-col items-center justify-center h-[50vh] gap-4">
                <div className="text-muted-foreground text-lg">선택된 사용자가 없습니다.</div>
                <Link href="/instagram/search">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" /> 검색 페이지로 돌아가기
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-h-screen flex flex-col gap-6">
            <header className="flex items-center justify-between pb-6 border-b">
                <div className="flex items-center gap-4">
                    <Link href="/instagram/search">
                         <Button variant="ghost" size="icon">
                             <ArrowLeft className="h-5 w-5" />
                         </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">AI 심층 분석</h1>
                        <p className="text-muted-foreground">
                            선택한 <span className="font-bold text-primary">{targets.length}명</span>의 인플루언서를 정밀 분석합니다.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {loading ? (
                        <Button disabled>
                             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 분석 중...
                        </Button>
                    ) : (
                        <Button onClick={startAnalysis}>다시 분석하기</Button>
                    )}
                </div>
            </header>

            {loading && analysisResults.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <div className="text-xl font-medium text-muted-foreground">AI가 열심히 프로필을 읽고 있습니다...</div>
                    <div className="text-sm text-muted-foreground/50 mt-2">최대 30초 정도 소요될 수 있습니다.</div>
                </div>
            )}

            <div className="flex flex-col gap-8 pb-20 max-w-4xl mx-auto">
                {analysisResults.map((result, idx) => {
                    // Match analysis result with original user data for context
                    const originalUser = results.find(u => u.username === result.username);

                    if (!result.success) {
                        return (
                            <Card key={idx} className="p-6 border-l-4 border-l-red-500 shadow-sm bg-red-50/50">
                                <div className="flex items-start gap-4">
                                     <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center border-2 border-red-200 shrink-0">
                                        {originalUser?.profile_pic_url ? (
                                            <img src={`/api/image-proxy?url=${encodeURIComponent(originalUser.profile_pic_url)}`} alt="" className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <span className="text-2xl">👤</span>
                                        )}
                                     </div>
                                     <div>
                                        <div className="font-bold text-red-700 flex items-center gap-2 text-lg">
                                            @{result.username}
                                            <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">
                                                분석 실패
                                            </span>
                                        </div>
                                        <div className="text-red-600/80 mt-1">
                                            {result.error || "알 수 없는 오류가 발생했습니다."}
                                        </div>
                                     </div>
                                </div>
                            </Card>
                        );
                    }
                    const { analysis } = result;
                    return (
                        <Card key={idx} className="overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg">
                            {/* Card Header: Profile & Score */}
                            <div className="p-6 flex flex-col sm:flex-row gap-6 border-b bg-muted/30">
                                {/* Profile Info */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="relative shrink-0">
                                        <div className="w-20 h-20 rounded-full bg-background border-2 shadow-sm overflow-hidden">
                                            {originalUser?.profile_pic_url ? (
                                                <img src={`/api/image-proxy?url=${encodeURIComponent(originalUser.profile_pic_url)}`} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-4xl flex items-center justify-center h-full w-full bg-muted text-muted-foreground">👤</span>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h3 className="text-xl font-bold">{originalUser?.full_name || result.username}</h3>
                                            <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${analysis.is_target ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                {analysis.is_target ? '적합' : '보류'}
                                            </span>
                                        </div>
                                        <a 
                                            href={`https://instagram.com/${result.username}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-sm text-muted-foreground font-medium hover:text-primary hover:underline cursor-pointer inline-block"
                                        >
                                            @{result.username}
                                        </a>
                                        <div className="text-sm text-muted-foreground line-clamp-1">{originalUser?.biography}</div>
                                        
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                                            <span className="flex items-center gap-1">
                                                <span className="font-bold text-foreground">{originalUser?.followers_count === -1 ? '?' : originalUser?.followers_count.toLocaleString()}</span> 팔로워
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="font-bold text-foreground">5</span> 분석된 게시물
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Score Badge */}
                                <div className="flex flex-col items-end sm:min-w-[120px]">
                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">독창성 점수</div>
                                    <div className="flex items-baseline gap-1">
                                        <span className={`text-4xl font-extrabold ${analysis.originality_score >= 8 ? 'text-primary' : analysis.originality_score >= 5 ? 'text-yellow-600' : 'text-gray-400'}`}>
                                            {analysis.originality_score}
                                        </span>
                                        <span className="text-lg text-muted-foreground font-medium">/10</span>
                                    </div>
                                    <div className="text-sm font-medium text-right mt-1 text-muted-foreground">
                                        {analysis.category && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                                                {analysis.category}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Analysis Content */}
                                <div className="md:col-span-2 space-y-4">
                                     <div>
                                        <h4 className="font-semibold text-sm mb-2 text-foreground/80 flex items-center gap-2">
                                            💡 AI 분석 요약
                                        </h4>
                                        <div className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border">
                                            {analysis.summary}
                                        </div>
                                     </div>

                                     <div className="flex flex-wrap gap-2">
                                        {analysis.mood_keywords?.map((keyword: string, k: number) => (
                                            <span key={k} className="px-3 py-1 bg-white dark:bg-slate-800 border rounded-full text-xs text-muted-foreground shadow-sm">
                                                #{keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Context Images */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm text-foreground/80">분석된 콘텐츠</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {originalUser?.recent_posts?.slice(0, 6).map((post: any, pIdx: number) => (
                                                <div 
                                                    key={pIdx} 
                                                    className="aspect-square rounded-md overflow-hidden bg-muted border relative group cursor-pointer"
                                                    onClick={() => post.imageUrl && setSelectedImage(post.imageUrl)}
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
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                        <Button 
                                            variant="outline" 
                                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                            onClick={() => removeAnalysisResult(result.username)}
                                        >
                                            제외
                                        </Button>
                                        <Button 
                                            className={`flex-1 ${originalUser?.is_registered ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                                            disabled={originalUser?.is_registered || registering.has(result.username)}
                                            onClick={() => originalUser && handleRegister({
                                                ...originalUser,
                                                analysis: analysis // Pass analysis data
                                            })}
                                        >
                                            {registering.has(result.username) ? (
                                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 등록 중</>
                                            ) : originalUser?.is_registered ? (
                                                "등록됨 (관리중)"
                                            ) : (
                                                "추가 (등록)"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
            {/* Lightbox Overlay */}
            {selectedImage && (
              <div 
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                  onClick={() => setSelectedImage(null)}
              >
                  <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
                      <img 
                          src={`/api/image-proxy?url=${encodeURIComponent(selectedImage)}`} 
                          alt="Enlarged view" 
                          className="max-w-full max-h-full object-contain rounded-md shadow-2xl"
                          onClick={(e) => e.stopPropagation()} 
                      />
                      <button 
                          className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2"
                          onClick={() => setSelectedImage(null)}
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                      </button>
                  </div>
              </div>
            )}
        </div>
    );
}
