"use client";

import { AnalysisResultCard } from "@/components/agent/analysis-result-card";
import { ProfileCard } from "@/components/agent/profile-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DualRoleAnalysis } from "@/lib/agent/types";
import { cn } from "@/lib/utils";
import { Bot, Loader2, Send, Sparkles, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  analysis?: DualRoleAnalysis;
  profileData?: any; // For Step 1: Profile Discovery
  timestamp: Date;
};

type Conversation = {
    id: string;
    title: string;
    created_at: string;
};

// --- Main Page Component with Suspense ---
export default function HunterAgentPage() {
    return (
        <Suspense fallback={
            <div className="flex h-[calc(100vh-64px)] items-center justify-center bg-gray-50/50">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        }>
            <HunterAgent />
        </Suspense>
    );
}

// --- Inner Component using SearchParams ---
function HunterAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Fetch Conversations on Mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // 2. Handle URL Parameter (?id=...)
  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== activeConversationId) {
        loadConversation(id);
    }
  }, [searchParams]);

  const fetchConversations = async () => {
    try {
        const res = await fetch("/api/conversations");
        if (res.ok) {
            const data = await res.json();
            setConversations(data);
        }
    } catch (e) {
        console.error("Failed to fetch conversations:", e);
    }
  };

  const loadConversation = async (id: string) => {
    setIsLoading(true);
    setActiveConversationId(id);
    try {
        const res = await fetch(`/api/conversations/${id}/messages`);
        if (res.ok) {
            const data = await res.json();
            const formattedMessages: Message[] = data.map((m: any) => {
                let analysis: DualRoleAnalysis | undefined;
                let content = m.content;
                
                // Try to parse analysis from content
                // Shared Extraction Logic (Refactor to util later)
                const extractJSON = (text: string) => {
                    try {
                        const codeBlockRegex = /```json\s*(\{[\s\S]*?\})\s*```/;
                        const match = text.match(codeBlockRegex);
                        if (match && match[1]) try { return JSON.parse(match[1]); } catch {}
                        
                        const firstBrace = text.indexOf("{");
                        const lastBrace = text.lastIndexOf("}");
                        if (firstBrace !== -1 && lastBrace !== -1) {
                            try { return JSON.parse(text.substring(firstBrace, lastBrace + 1)); } catch {}
                        }
                        return null;
                    } catch { return null; }
                };

                let profileData: any;
                if (m.role === 'assistant') {
                    const parsed = extractJSON(content);
                    if (parsed) {
                        if (parsed.investmentAnalyst && parsed.influencerExpert) {
                            analysis = parsed;
                            content = "Dual-Role 분석 결과가 포함된 기록입니다. 아래 리포트를 확인해주세요.";
                        }
                        if (parsed.foundProfile) {
                            profileData = parsed.foundProfile;
                            content = content.replace(/```json\s*\{[\s\S]*?\}\s*```/g, "")
                                             .replace(/\{[\s\S]*"foundProfile"[\s\S]*\}/g, "")
                                             .trim();
                            if (!content) {
                                content = "프로필을 찾았습니다. 이 계정이 맞나요? 분석을 진행할까요?";
                            }
                        }
                    }
                }

                return {
                    id: m.id,
                    role: m.role,
                    content: content,
                    analysis: analysis,
                    profileData: profileData,
                    timestamp: new Date(m.created_at)
                };
            });
            setMessages(formattedMessages);
        }
    } catch (e) {
        console.error("Failed to load conversation:", e);
    } finally {
        setIsLoading(false);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    setInput("");
    router.push("/instagram/agent");
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // --- Add User Message ---
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // --- Call API ---
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            message: userMessage.content,
            conversationId: activeConversationId 
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

      const data = await res.json();
      
      // Update Active ID and URL if it's a new conversation
      if (!activeConversationId && data.conversationId) {
          setActiveConversationId(data.conversationId);
          router.push(`/instagram/agent?id=${data.conversationId}`);
          fetchConversations(); // Refresh sidebar
      }

      // Helper to extract JSON from mixed text
      const extractJSON = (text: string) => {
        try {
            // 1. Try generic JSON.parse first
            return JSON.parse(text);
        } catch {
            // 2. Try to find code blocks
            const codeBlockRegex = /```json\s*(\{[\s\S]*?\})\s*```/;
            const match = text.match(codeBlockRegex);
            if (match && match[1]) {
                try { return JSON.parse(match[1]); } catch {}
            }
            
            // 3. Try finding first { and last }
            const firstBrace = text.indexOf("{");
            const lastBrace = text.lastIndexOf("}");
            if (firstBrace !== -1 && lastBrace !== -1) {
                try {
                    return JSON.parse(text.substring(firstBrace, lastBrace + 1));
                } catch {}
            }
            return null;
        }
      };

      // --- Process Response ---
      let content = data.response;
      let analysis: DualRoleAnalysis | undefined;
      let profileData: any;

      const parsed = extractJSON(content);
      
      if (parsed) {
          if (parsed.investmentAnalyst && parsed.influencerExpert) {
              analysis = parsed as DualRoleAnalysis;
              content = "Dual-Role 분석이 완료되었습니다. 아래 상세 리포트를 확인해주세요.";
          }
          if (parsed.foundProfile) {
              profileData = parsed.foundProfile;
              // Clean up: Remove the JSON block from the text to show only friendly message
              content = content.replace(/```json\s*\{[\s\S]*?\}\s*```/g, "")
                               .replace(/\{[\s\S]*"foundProfile"[\s\S]*\}/g, "") // Aggressive fallback cleanup
                               .trim();
              
              if (!content) {
                  content = "프로필을 찾았습니다. 이 계정이 맞나요? 분석을 진행할까요?";
              }
          }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: content,
        analysis: analysis,
        profileData: profileData,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-gray-50/50">
      {/* Sidebar: History */}
      <div className="w-72 border-r bg-white hidden md:flex flex-col">
        <div className="p-4 border-b">
            <Button 
                onClick={startNewChat}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-2"
            >
                <Send className="w-4 h-4 rotate-[-45deg] translate-y-[-1px]" />
                새로운 대화 시작
            </Button>
        </div>
        <ScrollArea className="flex-1">
            <div className="p-4 pt-6 text-sm font-semibold text-slate-900 border-none">최근 기록</div>
            <div className="px-2 space-y-1">
                {conversations.length === 0 ? (
                    <div className="text-xs text-slate-400 p-4 text-center">
                        기록된 대화가 없습니다.
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <button
                            key={conv.id}
                            onClick={() => router.push(`/instagram/agent?id=${conv.id}`)}
                            className={cn(
                                "w-full text-left p-3 rounded-lg text-sm transition-colors group relative",
                                activeConversationId === conv.id 
                                    ? "bg-purple-50 text-purple-700 font-medium border-l-4 border-purple-600 rounded-l-none" 
                                    : "text-slate-600 hover:bg-slate-50"
                            )}
                        >
                            <div className="truncate pr-4">{conv.title}</div>
                            <div className="text-[10px] text-slate-400 mt-1">
                                {new Date(conv.created_at).toLocaleDateString()}
                            </div>
                        </button>
                    ))
                )}
            </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full bg-white shadow-sm my-0 md:my-4 md:rounded-xl overflow-hidden border">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-white z-10">
            <h1 className="font-semibold text-lg flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                인플루언서 분석
            </h1>
            <span className="text-xs text-muted-foreground">Powered by Gemini 2.0</span>
        </div>

        {/* Messages */}
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
                            onClick={() => setInput("@username 분석해줘")}
                            className="text-xs bg-white border px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                        >
                            "@username 분석해줘"
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
                    </div>
                </div>
            ))}

            {isLoading && (
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-white border shadow-sm rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-3">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                        <span className="text-sm text-muted-foreground">
                            데이터 수집 및 분석 중입니다... (약 30초)
                        </span>
                    </div>
                </div>
            )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t">
            <form onSubmit={handleSubmit} className="flex gap-2 relative">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="인스타그램 계정을 입력하세요 (예: @username)"
                    className="pr-12 py-6 bg-gray-50 border-gray-200 focus-visible:ring-purple-500"
                    disabled={isLoading}
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 top-1.5 h-9 w-9 bg-purple-600 hover:bg-purple-700"
                >
                    <Send className="w-4 h-4" />
                </Button>
            </form>
            <div className="text-center mt-2">
                <span className="text-[10px] text-muted-foreground">
                    Hunter Agent는 실수가 있을 수 있습니다. 중요한 결정 전 수치를 확인하세요.
                </span>
            </div>
        </div>
      </div>
    </div>
  );
}
