"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Template {
  id: number;
  title: string;
}

interface TemplateSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (templateId: number | null) => void;
}

export function TemplateSelectDialog({ open, onOpenChange, onSelect }: TemplateSelectDialogProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchTemplates();
    }
  }, [open]);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_templates')
      .select('id, title')
      .order('id', { ascending: false });
    
    if (!error && data) {
      setTemplates(data);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>템플릿 선택</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm text-muted-foreground">
            이메일 하단에 첨부할 서명/템플릿을 선택해주세요.
          </p>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              <Button 
                variant="outline" 
                className="w-full justify-start font-normal" 
                onClick={() => onSelect(null)}
              >
                (템플릿 없이 본문만 저장)
              </Button>
              
              {templates.map((t) => (
                <Button
                  key={t.id}
                  variant="outline"
                  className="w-full justify-start text-left"
                  onClick={() => onSelect(t.id)}
                >
                  {t.title}
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
