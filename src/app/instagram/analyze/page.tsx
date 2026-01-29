"use client";

import { Button } from "@/components/ui/button";
import { instagramService } from "@/services/instagram/api";
import { useInstagramStore } from "@/services/instagram/store";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PostLightbox } from "../components/PostLightbox";
import { AnalysisResultCard } from "./components/AnalysisResultCard";

export default function InstagramAnalyzePage() {
    const { results, selectedUsernames, analysisResults, setAnalysisResults, removeAnalysisResult, updateUserStatus, searchMode } = useInstagramStore();
    const [loading, setLoading] = useState(false);
    const [selectedPost, setSelectedPost] = useState<any | null>(null);
    const [registering, setRegistering] = useState<Set<string>>(new Set());
    
    // Derived state: Get actual user objects from selection
    const targets = results.filter(u => selectedUsernames.has(u.username));

    useEffect(() => {
        // Check if we need to re-run analysis
        if (loading) return;
        if (targets.length === 0) return;

        const resultUsernames = new Set(analysisResults.map(r => r.username));
        const targetUsernames = new Set(targets.map(t => t.username));
        
        let mismatch = false;
        
        for (const t of targets) {
            if (!resultUsernames.has(t.username)) {
                mismatch = true;
                break;
            }
        }
        
        if (!mismatch) {
            for (const r of analysisResults) {
                if (!targetUsernames.has(r.username)) {
                    mismatch = true;
                    break;
                }
            }
        }

        if (mismatch) {
            setAnalysisResults([]);
            startAnalysis();
        }
    }, [targets.length, selectedUsernames]);

    const startAnalysis = async () => {
        setLoading(true);
        // Clear previous results to avoid confusion? Or keep them?
        // Let's clear to show fresh start or maybe keep old ones until new ones arrive?
        // User probably expects a reload style.
        setAnalysisResults([]); 

        try {
            const promptType = searchMode === 'target' ? 'INSTA_TARGET' : 'INSTA';
            
            // [STAGE 1] Fetch Raw Verified Data (Fast)
            toast.info("1단계: 프로필 및 게시물 데이터 수집 중...", { duration: 2000 });
            const rawResponse = await instagramService.fetchRaw(targets);
            
            // Convert Raw results to AnalysisResult format for immediate display
            const stage1Results = rawResponse.results.map((raw: any) => ({
                username: raw.username,
                success: raw.success,
                error: raw.error,
                verifiedProfile: raw.verifiedProfile,
                trendMetrics: raw.trendMetrics,
                analysis: {
                    basicStats: {
                        username: raw.username,
                        followers: raw.tokens?.followers || raw.verifiedProfile?.followers || 0,
                        profilePicUrl: raw.verifiedProfile?.profilePicUrl || null,
                        // Estimated/Calculated metrics from raw stage
                        er: raw.metrics?.engagementRate || 0,
                        avgLikes: 0, // Not explicitly in top level metrics, but cheap to calc if needed
                        botRatio: 0,
                        purchaseKeywordRatio: 0
                    }
                }
            }));

            setAnalysisResults(stage1Results);
            
            // [STAGE 2] AI Logic Analysis (Slow)
            toast.loading("2단계: AI 정성 분석 진행 중...", { id: "ai-loading" });
            const aiResponse = await instagramService.analyzeAI(rawResponse.results, promptType);
            
            // Merge AI results
            setAnalysisResults(aiResponse.results);
            
            toast.dismiss("ai-loading");
            toast.success(`${aiResponse.results.length}명 심층 분석 완료!`);

        } catch (error: any) {
            toast.dismiss("ai-loading");
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
            updateUserStatus(username, 'todo');
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
                    const originalUser = results.find(u => u.username === result.username);
                    return (
                        <AnalysisResultCard
                            key={idx}
                            result={result}
                            originalUser={originalUser}
                            registering={registering}
                            onRegister={handleRegister}
                            onRemove={removeAnalysisResult}
                            onPostSelect={setSelectedPost}
                        />
                    );
                })}
            </div>

            {/* Lightbox */}
            {selectedPost && (
                <PostLightbox 
                    post={selectedPost} 
                    onClose={() => setSelectedPost(null)} 
                />
            )}
        </div>
    );
}
