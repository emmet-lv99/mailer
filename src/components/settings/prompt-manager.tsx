"use client";

import { PromptEditor } from "@/components/settings/prompt-editor";
import { Prompt, PromptList } from "@/components/settings/prompt-list";
import { useState } from "react";

export  function PromptManager() {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);

  const handlePromptSelect = (prompt: Prompt | null) => {
    setSelectedPrompt(prompt);
  };

  const handleSaved = () => {
    // If we just created a new one, maybe we should select it?
    // For now, just refresh logic is handled inside components via SWR mutate
    // We might want to clear selection if it was a create action?
    // Let's keep selection logic simple.
    // If updated, keep selected. If created, maybe remain on "create mode" or select it?
    // For simplicity, let's reset to create mode (null) after save if it was a new prompt?
    // Actually, PromptEditor stays mounted.
  };

  const handleDeleted = () => {
    setSelectedPrompt(null);
  };

  return (
    <div className="container mx-auto p-6 max-h-screen flex flex-col gap-6">
      <header className="flex-none">
        <h1 className="text-3xl font-bold tracking-tight">설정 (Settings)</h1>
        <p className="text-muted-foreground">
          프롬프트와 API 키를 관리합니다.
        </p>
      </header>
      
      <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 min-h-0">
        <div className="md:col-span-4 h-[600px] md:h-auto border rounded-lg bg-card overflow-hidden">
          <div className="h-full p-4 overflow-hidden">
             <PromptList selectedId={selectedPrompt?.id || null} onSelect={handlePromptSelect} />
          </div>
        </div>
        
        <div className="md:col-span-8 h-auto">
          <PromptEditor 
            prompt={selectedPrompt} 
            onSaved={handleSaved} 
            onDeleted={handleDeleted} 
          />
        </div>
      </main>

      {/* API Key configuration removed as it uses server env */}
    </div>
  );
}
