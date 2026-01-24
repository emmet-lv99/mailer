"use client";

import { PromptEditor } from "@/components/youtube/settings/prompt-editor";
import { Prompt, PromptList } from "@/components/youtube/settings/prompt-list";
import { useState } from "react";

interface PromptManagerProps {
  promptType?: 'YOUTUBE' | 'INSTA' | 'INSTA_TARGET';
  hideHeader?: boolean;
}

export  function PromptManager({ promptType = 'YOUTUBE', hideHeader = false }: PromptManagerProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const handlePromptSelect = (prompt: Prompt | null) => {
    setSelectedPrompt(prompt);
  };

  const handleSaved = () => {
    // ...
  };

  const handleDeleted = () => {
    setSelectedPrompt(null);
  };

  return (
    <div className="container mx-auto p-6 max-h-screen flex flex-col gap-6">
      {!hideHeader && (
        <header className="flex-none">
          <h1 className="text-3xl font-bold tracking-tight">설정 (Settings)</h1>
          <p className="text-muted-foreground">
            프롬프트와 API 키를 관리합니다.
          </p>
        </header>
      )}
      
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        <div className="md:col-span-4 h-[600px] md:h-auto border rounded-lg bg-card overflow-hidden">
          <div className="h-full p-4 overflow-hidden">
             <PromptList 
                selectedId={selectedPrompt?.id || null} 
                onSelect={handlePromptSelect} 
                promptType={promptType} 
             />
          </div>
        </div>
        
        <div className="md:col-span-8 h-auto">
          <PromptEditor 
            prompt={selectedPrompt} 
            onSaved={handleSaved} 
            onDeleted={handleDeleted} 
            promptType={promptType}
          />
        </div>
      </main>

      {/* API Key configuration removed as it uses server env */}
    </div>
  );
}
