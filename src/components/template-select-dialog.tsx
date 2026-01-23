"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Template {
  id: number;
  title: string;
  position: 'top' | 'bottom';
}

interface TemplateSelection {
  headerTemplateId: number | null;
  footerTemplateId: number | null;
}

interface TemplateSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (selection: TemplateSelection) => void;
}

export function TemplateSelectDialog({ open, onOpenChange, onSelect }: TemplateSelectDialogProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 선택 상태
  const [headerTemplateId, setHeaderTemplateId] = useState<number | null>(null);
  const [footerTemplateId, setFooterTemplateId] = useState<number | null>(null);

  useEffect(() => {
    if (open) {
      fetchTemplates();
      // 다이얼로그 열릴 때마다 선택 초기화
      setHeaderTemplateId(null);
      setFooterTemplateId(null);
    }
  }, [open]);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_templates')
      .select('id, title, position')
      .order('id', { ascending: false });
    
    if (!error && data) {
      setTemplates(data);
    }
    setLoading(false);
  };

  const headerTemplates = templates.filter(t => t.position === 'top');
  const footerTemplates = templates.filter(t => t.position === 'bottom');

  const handleConfirm = () => {
    onSelect({ headerTemplateId, footerTemplateId });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>템플릿 선택</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <>
              {/* 상단 템플릿 선택 */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">📌 상단 템플릿 (본문 위)</Label>
                <div className="space-y-1 max-h-[150px] overflow-y-auto border rounded-md p-2 bg-muted/20">
                  <Button 
                    variant={headerTemplateId === null ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start font-normal text-sm" 
                    onClick={() => setHeaderTemplateId(null)}
                  >
                    {headerTemplateId === null && <Check className="mr-2 h-4 w-4" />}
                    (선택 안함)
                  </Button>
                  
                  {headerTemplates.length === 0 && (
                    <p className="text-xs text-muted-foreground px-2 py-1">
                      상단 위치로 설정된 템플릿이 없습니다.
                    </p>
                  )}
                  
                  {headerTemplates.map((t) => (
                    <Button
                      key={t.id}
                      variant={headerTemplateId === t.id ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-left text-sm"
                      onClick={() => setHeaderTemplateId(t.id)}
                    >
                      {headerTemplateId === t.id && <Check className="mr-2 h-4 w-4" />}
                      {t.title}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 하단 템플릿 선택 */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">📎 하단 템플릿 (본문 아래)</Label>
                <div className="space-y-1 max-h-[150px] overflow-y-auto border rounded-md p-2 bg-muted/20">
                  <Button 
                    variant={footerTemplateId === null ? "secondary" : "ghost"}
                    size="sm"
                    className="w-full justify-start font-normal text-sm" 
                    onClick={() => setFooterTemplateId(null)}
                  >
                    {footerTemplateId === null && <Check className="mr-2 h-4 w-4" />}
                    (선택 안함)
                  </Button>
                  
                  {footerTemplates.length === 0 && (
                    <p className="text-xs text-muted-foreground px-2 py-1">
                      하단 위치로 설정된 템플릿이 없습니다.
                    </p>
                  )}
                  
                  {footerTemplates.map((t) => (
                    <Button
                      key={t.id}
                      variant={footerTemplateId === t.id ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start text-left text-sm"
                      onClick={() => setFooterTemplateId(t.id)}
                    >
                      {footerTemplateId === t.id && <Check className="mr-2 h-4 w-4" />}
                      {t.title}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            선택 완료
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
