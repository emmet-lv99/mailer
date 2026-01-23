"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Block, generateHtmlFromBlocks, wrapEmailHtml } from "@/lib/email-utils";
import { supabase } from "@/lib/supabase";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

interface Template {
  id: number;
  title: string;
  blocks: Block[];
}

interface EmailPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSubject: string;
  defaultBody: string;
  recipientEmail?: string; // Optional for now
  onSaveConfig: (subject: string, body: string, templateId: number | null) => void; // Parent handles actual save
}

export function EmailPreviewDialog({ open, onOpenChange, defaultSubject, defaultBody, recipientEmail, onSaveConfig }: EmailPreviewDialogProps) {
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  
  // HTML Preview
  const [previewHtml, setPreviewHtml] = useState("");

  // Fetch templates on mount
  useEffect(() => {
    if (open) {
      fetchTemplates();
      setSubject(defaultSubject);
      setBody(defaultBody);
      setSelectedTemplateId(null);
    }
  }, [open, defaultSubject, defaultBody]);

  // Update preview when body or template changes
  useEffect(() => {
    let footerHtml = "";
    if (selectedTemplateId) {
      const tmpl = templates.find(t => t.id === selectedTemplateId);
      if (tmpl && tmpl.blocks) {
        footerHtml = generateHtmlFromBlocks(tmpl.blocks);
      }
    }
    setPreviewHtml(wrapEmailHtml(body, footerHtml));
  }, [body, selectedTemplateId, templates]);

  const fetchTemplates = async () => {
    setLoadingTemplates(true);
    const { data } = await supabase.from('email_templates').select('*').order('id', { ascending: false });
    if (data) setTemplates(data);
    setLoadingTemplates(false);
  };

  const handleSave = () => {
    onSaveConfig(subject, body, selectedTemplateId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[80vw] w-[80vw] max-w-none h-[800px] flex flex-col">
        <DialogHeader>
          <DialogTitle>이메일 미리보기 및 편집</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
            {/* Left: Editor */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-2">
                <div className="space-y-2">
                    <Label>받는 사람</Label>
                    <Input value={recipientEmail || "(CSV에 이메일 없음)"} disabled className="bg-muted" />
                </div>
                
                <div className="space-y-2">
                    <Label>제목</Label>
                    <Input value={subject} onChange={e => setSubject(e.target.value)} />
                </div>

                <div className="space-y-2 flex-1 flex flex-col">
                    <Label>본문 (AI 작성)</Label>
                    <Textarea 
                        value={body} 
                        onChange={e => setBody(e.target.value)} 
                        className="flex-1 min-h-[300px] font-mono text-sm leading-relaxed"
                    />
                </div>

                <div className="space-y-2">
                    <Label>템플릿 선택 (서명/푸터)</Label>
                    <select 
                        className="w-full p-2 border rounded-md text-sm"
                        value={selectedTemplateId || ""}
                        onChange={e => setSelectedTemplateId(e.target.value ? Number(e.target.value) : null)}
                    >
                        <option value="">(선택 안함 - 본문만 전송)</option>
                        {templates.map(t => (
                            <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Right: Real-time HTML Preview */}
            <div className="flex flex-col gap-2 h-full overflow-hidden border rounded-lg bg-gray-50">
                <div className="p-2 border-b bg-gray-100 text-xs font-bold text-gray-500 uppercase text-center">
                    Real-time Preview (HTML)
                </div>
                <div className="flex-1 overflow-y-auto p-4 bg-white relative">
                    <iframe 
                        srcDoc={previewHtml}
                        className="w-full h-full border-none"
                        title="Email Preview"
                    />
                </div>
            </div>
        </div>

        <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>취소</Button>
            <Button onClick={handleSave}>
                <Mail className="mr-2 h-4 w-4" /> 이 내용으로 Gmail 저장 (Draft)
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
