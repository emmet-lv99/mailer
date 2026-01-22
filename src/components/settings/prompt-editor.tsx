"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSWRConfig } from "swr";
// Actually shadcn components usually need separate install. I'll check package.json or use native input for now to be safe, or just assume I can use native.
// Wait, I installed input/textarea/button/card... checkbox was not in the list I ran? 
// The user installed: button, input, card, progress, textarea, dialog, sonner.
// Checkbox is missing. I'll use standard input type="checkbox" for now with styling.

import { Prompt } from "./prompt-list";

interface PromptEditorProps {
  prompt: Prompt | null;
  onSaved: () => void;
  onDeleted: () => void;
}

export function PromptEditor({ prompt, onSaved, onDeleted }: PromptEditorProps) {
  const { mutate } = useSWRConfig();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    is_default: false,
  });

  // Reset form when selection changes
  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title,
        content: prompt.content,
        is_default: prompt.is_default,
      });
    } else {
      setFormData({
        title: "",
        content: "",
        is_default: false,
      });
    }
  }, [prompt]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const url = prompt ? `/api/prompts/${prompt.id}` : "/api/prompts";
      const method = prompt ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success(prompt ? "프롬프트가 수정되었습니다." : "새 프롬프트가 생성되었습니다.");
      mutate("/api/prompts"); // Refresh list
      onSaved();
    } catch (error) {
      console.error(error);
      toast.error("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!prompt || !confirm("정말 삭제하시겠습니까?")) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/prompts/${prompt.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      toast.success("프롬프트가 삭제되었습니다.");
      mutate("/api/prompts");
      onDeleted();
    } catch (error) {
      console.error(error);
      toast.error("삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg p-6 bg-card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">
          {prompt ? "프롬프트 수정" : "새 프롬프트 작성"}
        </h2>
        {prompt && (
          <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading}>
            <Trash2 className="w-4 h-4 mr-2" /> 삭제
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">제목</label>
          <Input
            id="title"
            placeholder="예: 기본 협업 제안용"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col gap-2 flex-1 min-h-[600px]">
          <label htmlFor="content" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">프롬프트 내용</label>
          <div className="relative flex-1">
            <Textarea
              id="content"
              className="absolute inset-0 resize-none font-mono text-sm leading-relaxed"
              placeholder="여기에 프롬프트를 작성하세요..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              disabled={loading}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            * 사용 가능한 변수: {"{{channelName}}"}, {"{{subscribers}}"}, {"{{description}}"}, {"{{recentVideos}}"}
          </p>
        </div>

        <div className="flex items-center gap-2 py-2">
            <input
                type="checkbox"
                id="is_default"
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                disabled={loading}
            />
            <label htmlFor="is_default" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                이 프롬프트를 기본값(Default)으로 설정
            </label>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            {loading ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </form>
    </div>
  );
}
