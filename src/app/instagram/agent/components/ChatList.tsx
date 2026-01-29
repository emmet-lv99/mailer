"use client";

import { AgentErrorCard } from "@/components/agent/agent-error-card";
import { AnalysisProgress } from "@/components/agent/analysis-progress";
import { AnalysisResultCard } from "@/components/agent/analysis-result-card";
import { ProfileCard } from "@/components/agent/profile-card";
import { Message } from "@/lib/agent/types";
import { cn } from "@/lib/utils";
import { Bot, Loader2, User } from "lucide-react";
import { RefObject } from "react";

interface ChatListProps {
    messages: Message[];
    isLoading: boolean;
    analysisStage: 'idle' | 'scraping' | 'analyzing' | 'evaluating' | 'generating' | 'complete';
    scrollRef: RefObject<HTMLDivElement>;
    onExampleClick: (text: string) => void;
}

export function ChatList({ messages, isLoading, analysisStage, scrollRef, onExampleClick }: ChatListProps) {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50" ref={scrollRef}>
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground space-y-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                        <Bot className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900">Hunter Agent에게 물어보세요</h3>
                        <p className="mt-1">인스타그램 계정을 입력하면 투자 심사와 성장 전망을 분석해드립니다.</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button 
                            onClick={() => onExampleClick("@username 분석해줘")}
                            className="text-xs bg-white border px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            "@username 분석해줘"
                        </button>
                        <button 
                            onClick={() => onExampleClick("내가 분석한 사람들 리스트 보여줘")}
                            className="text-xs bg-white border px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            "내 DB 통계 보여줘"
                        </button>
                    </div>
                </div>
            )}

            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={cn(
                        "flex gap-3 max-w-3xl",
                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                    )}
                >
                    <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                        msg.role === "user" ? "bg-blue-600" : "bg-purple-600"
                    )}>
                        {msg.role === "user" ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    
                    <div className="space-y-2 max-w-[90%]">
                        <div className={cn(
                            "rounded-2xl px-4 py-2.5 text-sm",
                            msg.role === "user" 
                                ? "bg-blue-600 text-white rounded-tr-sm" 
                                : "bg-white border shadow-sm rounded-tl-sm text-gray-800"
                        )}>
                            {msg.content}
                        </div>
                        
                        {/* Analysis Card if available */}
                        {msg.analysis && (
                            <AnalysisResultCard analysis={msg.analysis} />
                        )}

                        {/* Profile Card if available (Step 1) */}
                        {msg.profileData && (
                            <ProfileCard data={msg.profileData} />
                        )}

                        {/* Error Card if available */}
                        {msg.errorData && (
                            <AgentErrorCard error={msg.errorData} />
                        )}
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    {analysisStage !== 'idle' && analysisStage !== 'complete' ? (
                        <AnalysisProgress stage={analysisStage} />
                    ) : (
                        <div className="bg-white border shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3 h-fit">
                            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                            <span className="text-sm text-muted-foreground">
                                생각 중...
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
