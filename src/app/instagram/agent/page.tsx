"use client";

import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

// Components
import { AgentSidebar } from "./components/AgentSidebar";
import { ChatInput } from "./components/ChatInput";
import { ChatList } from "./components/ChatList";

// Utils & Types
import { Conversation, Message } from "@/lib/agent/types";
import { parseAgentResponse } from "@/lib/agent/utils";

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
  const [analysisStage, setAnalysisStage] = useState<'idle' | 'scraping' | 'analyzing' | 'evaluating' | 'generating' | 'complete'>('idle');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Effects ---

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

  // 3. Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // 4. Progress Logic
  useEffect(() => {
    if (!isLoading) {
        if (analysisStage !== 'idle') {
            setAnalysisStage('complete');
            setTimeout(() => setAnalysisStage('idle'), 4000); 
        }
        return;
    }

    if (analysisStage === 'scraping') {
        const timer = setTimeout(() => setAnalysisStage('analyzing'), 5000); 
        return () => clearTimeout(timer);
    }
    
    if (analysisStage === 'analyzing') {
        const timer = setTimeout(() => setAnalysisStage('evaluating'), 5000);
        return () => clearTimeout(timer);
    }
    
    const lastMsg = messages[messages.length - 1];
    if (analysisStage === 'evaluating' && lastMsg?.role === 'assistant' && lastMsg.content.length > 5) {
        setAnalysisStage('generating');
    }

  }, [isLoading, messages, analysisStage]);


  // --- API Handlers ---

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
                let parsedContent: { 
                    content: string; 
                    analysis?: import("@/lib/agent/types").DualRoleAnalysis; 
                    profileData?: any; 
                    errorData?: any 
                } = { content: m.content };
                
                if (m.role === 'assistant') {
                    const parsed = parseAgentResponse(m.content);
                    parsedContent = {
                        content: parsed.content,
                        analysis: parsed.analysis,
                        profileData: parsed.profileData,
                        errorData: parsed.errorData
                    };
                }

                return {
                    id: m.id,
                    role: m.role,
                    content: parsedContent.content || m.content,
                    analysis: parsedContent.analysis,
                    profileData: parsedContent.profileData,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (input.includes('분석') || input.includes('ㄱㄱ') || input.includes('ㅇㅇ') || input.includes('진행')) {
        setAnalysisStage('scraping');
    }

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
      
      if (!activeConversationId && data.conversationId) {
          setActiveConversationId(data.conversationId);
          router.push(`/instagram/agent?id=${data.conversationId}`);
          fetchConversations(); 
      }

      const parsed = parseAgentResponse(data.response);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: parsed.content,
        analysis: parsed.analysis,
        profileData: parsed.profileData,
        errorData: parsed.errorData,
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
      <AgentSidebar 
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={(id) => router.push(`/instagram/agent?id=${id}`)}
        onNewChat={startNewChat}
      />

      <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full bg-white shadow-sm my-0 md:my-4 md:rounded-xl overflow-hidden border">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-white z-10 w-full">
            <h1 className="font-semibold text-lg flex items-center gap-2">
                <span className="text-xl">✨</span>
                인플루언서 분석
            </h1>
            <span className="text-xs text-muted-foreground">Powered by Gemini 2.0</span>
        </div>

        <ChatList 
            messages={messages} 
            isLoading={isLoading} 
            analysisStage={analysisStage} 
            scrollRef={scrollRef as React.RefObject<HTMLDivElement>}
            onExampleClick={(text) => setInput(text)}
        />

        <ChatInput 
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
        />
      </div>
    </div>
  );
}
