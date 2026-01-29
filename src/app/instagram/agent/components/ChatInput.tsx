"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import React from "react";

interface ChatInputProps {
    input: string;
    setInput: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
    return (
        <div className="p-4 bg-white border-t">
            <form onSubmit={onSubmit} className="flex gap-2 relative">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="인스타그램 계정을 입력하세요 (예: @username) 또는 질문하세요"
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
    );
}
