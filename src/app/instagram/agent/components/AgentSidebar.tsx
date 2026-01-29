"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Conversation } from "@/lib/agent/types";
import { cn } from "@/lib/utils";
import { Send } from "lucide-react";

interface AgentSidebarProps {
    conversations: Conversation[];
    activeConversationId: string | null;
    onSelectConversation: (id: string) => void;
    onNewChat: () => void;
}

export function AgentSidebar({ 
    conversations, 
    activeConversationId, 
    onSelectConversation, 
    onNewChat 
}: AgentSidebarProps) {
    return (
        <div className="w-72 border-r bg-white hidden md:flex flex-col">
            <div className="p-4 border-b">
                <Button 
                    onClick={onNewChat}
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
                                onClick={() => onSelectConversation(conv.id)}
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
    );
}
