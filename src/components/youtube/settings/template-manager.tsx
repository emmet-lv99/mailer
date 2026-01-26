"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabase";
import { ImageIcon, LinkIcon, Plus, Save, Trash2, Type as TypeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';

// 블록 타입 정의
type BlockType = 'TEXT' | 'LINK' | 'IMAGE';

interface Block {
  id: string;
  type: BlockType;
  content?: string; // TEXT용
  text?: string;    // LINK용 (버튼명)
  url?: string;     // LINK, IMAGE용 (주소)
  linkUrl?: string; // IMAGE용 (클릭 시 이동할 링크)
  buttonStyle?: 'button' | 'text'; // LINK용 (버튼 스타일)
}

interface Template {
  id: number;
  title: string;
  blocks: Block[];
  is_default: boolean;
  position: 'top' | 'bottom';
}

export function TemplateManager() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 에디터 상태
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [position, setPosition] = useState<'top' | 'bottom'>('bottom');

  // 초기 로드
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('email_templates')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) {
      toast.error('템플릿을 불러오지 못했습니다.');
      console.error(error);
    } else {
      setTemplates(data || []);
    }
    setLoading(false);
  };

  const initNewTemplate = () => {
    setEditingId(null);
    setTitle("");
    setBlocks([]);
    setPosition('bottom');
  };

  const handleSelectTemplate = (t: Template) => {
    setEditingId(t.id);
    setTitle(t.title);
    setBlocks(t.blocks || []);
    setPosition(t.position || 'bottom');
  };

  // 저장 로직
  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("템플릿 이름을 입력해주세요.");
      return;
    }

    try {
      const payload = {
        title,
        blocks,
        position,
      };

      let error;
      if (editingId) {
        // 수정
        const res = await supabase.from('email_templates').update(payload).eq('id', editingId);
        error = res.error;
      } else {
        // 생성
        const res = await supabase.from('email_templates').insert([payload]);
        error = res.error;
      }

      if (error) throw error;

      toast.success("저장되었습니다.");
      fetchTemplates();
      if (!editingId) initNewTemplate(); // 저장 후 초기화? or 유지? -> 일단 생성 후엔 초기화가 깔끔
    } catch (e: any) {
      console.error(e);
      toast.error(`저장 실패: ${e.message}`);
    }
  };

  const handleDeleteTemplate = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    
    const { error } = await supabase.from('email_templates').delete().eq('id', id);
    if (error) {
      toast.error("삭제 실패");
      console.error(error);
    } else {
      toast.success("삭제되었습니다.");
      fetchTemplates();
      if (editingId === id) initNewTemplate();
    }
  };

  // 블록 조작
  const addBlock = (type: BlockType) => {
    const newBlock: Block = { id: uuidv4(), type };
    setBlocks([...blocks, newBlock]);
  }; 

  const updateBlock = (id: string, field: keyof Block, value: string) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, [field]: value } : block));
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = async (file: File, blockId: string) => {
    try {
      // 파일명 안전하게 처리
      const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
      const filename = `${Date.now()}-${safeName}`;
      
      console.log(`Uploading [${filename}] to 'email-assets'...`);

      const { data, error } = await supabase.storage.from('email-assets').upload(filename, file);

      if (error) {
        console.error("Supabase Upload Error:", error);
        throw error;
      }

      console.log("Upload Success Data:", data);

      const { data: { publicUrl } } = supabase.storage.from('email-assets').getPublicUrl(filename);
      
      console.log("Generated Public URL:", publicUrl);
      
      updateBlock(blockId, 'url', publicUrl);
      toast.success('이미지 업로드 성공');
    } catch (error: any) {
      console.error("Catch Block Error:", error);
      toast.error(`업로드 실패: ${error.message || JSON.stringify(error)}`); 
    } 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[calc(100vh-200px)] min-h-[600px]">
        {/* 왼쪽: 템플릿 목록 */}
        <div className="md:col-span-4 border rounded-lg p-4 flex flex-col bg-background">
            <h3 className="font-bold mb-4 flex-none">템플릿 목록</h3>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {loading && <p className="text-sm text-muted-foreground text-center py-4">로딩 중...</p>}
              {!loading && templates.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">저장된 템플릿이 없습니다.</p>}
              
              {templates.map(t => (
                <div 
                  key={t.id} 
                  className={`p-3 rounded-md border text-left cursor-pointer transition hover:bg-accent flex justify-between items-center ${editingId === t.id ? 'border-primary bg-accent/50' : 'bg-card'}`}
                  onClick={() => handleSelectTemplate(t)}
                >
                  <span className="truncate font-medium">{t.title}</span>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id); }}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full flex-none" variant="outline" onClick={initNewTemplate}>
                <Plus className="mr-2 h-4 w-4" /> 새 템플릿 만들기
            </Button>
        </div>

        {/* 오른쪽: 에디터 */}
        <div className="md:col-span-8 border rounded-lg p-4 flex flex-col gap-4 bg-background overflow-hidden relative">
            <div className="flex-none space-y-2">
                <Label>템플릿 이름</Label>
                <div className="flex gap-2">
                  <Input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="예: 기본 서명 (로고+제안서링크)" 
                    className="flex-1"
                  />
                  <Button onClick={handleSave} disabled={!title}>
                    <Save className="mr-2 h-4 w-4" /> 저장
                  </Button>
                </div>
            </div>

            {/* 위치 선택 */}
            <div className="flex-none flex items-center gap-4 p-3 border rounded-md bg-muted/20">
              <Label className="text-sm font-medium">삽입 위치</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="position" 
                    value="top" 
                    checked={position === 'top'} 
                    onChange={() => setPosition('top')}
                    className="accent-primary"
                  />
                  <span className="text-sm">상단 (본문 위)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="position" 
                    value="bottom" 
                    checked={position === 'bottom'} 
                    onChange={() => setPosition('bottom')}
                    className="accent-primary"
                  />
                  <span className="text-sm">하단 (본문 아래)</span>
                </label>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto border rounded-md p-4 bg-muted/10 space-y-4">
                <div className="flex justify-between items-center">
                  <Label>블록 구성 ({blocks.length}개)</Label>
                  {blocks.length === 0 && <span className="text-xs text-muted-foreground">아래 버튼을 눌러 블록을 추가하세요.</span>}
                </div>
                
                {blocks.map((block, index) => (
                    <div key={block.id} className="border p-4 rounded-md relative group bg-card shadow-sm transition-all hover:shadow-md">
                        <div className="absolute top-2 right-2 z-10">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive bg-card/80 backdrop-blur-sm" onClick={() => removeBlock(block.id)}>
                            <Trash2 size={14} />
                          </Button>
                        </div>
                        
                        {/* 1. TEXT Type */}
                        {block.type === 'TEXT' && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2 text-primary">
                                    <TypeIcon size={16} /> <span className="font-bold text-sm">텍스트 블록</span>
                                </div>
                                <Textarea 
                                    placeholder="내용을 입력하세요... (HTML 태그 사용 가능)" 
                                    value={block.content || ''} 
                                    onChange={e => updateBlock(block.id, 'content', e.target.value)} 
                                    className="min-h-[80px]"
                                />
                            </div>
                        )}

                        {/* 2. LINK Type */}
                        {block.type === 'LINK' && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2 text-blue-500">
                                    <LinkIcon size={16} /> <span className="font-bold text-sm">링크 버튼</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">버튼 텍스트</Label>
                                    <Input placeholder="예: 제안서 확인하기" value={block.text || ''} onChange={e => updateBlock(block.id, 'text', e.target.value)} />
                                  </div>
                                  <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">이동 URL</Label>
                                    <Input placeholder="https://..." value={block.url || ''} onChange={e => updateBlock(block.id, 'url', e.target.value)} />
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 pt-2">
                                  <Label className="text-xs text-muted-foreground">스타일</Label>
                                  <label className="flex items-center gap-1 cursor-pointer">
                                    <input 
                                      type="radio" 
                                      name={`buttonStyle-${block.id}`}
                                      checked={(block.buttonStyle || 'button') === 'button'} 
                                      onChange={() => updateBlock(block.id, 'buttonStyle', 'button')}
                                      className="accent-primary"
                                    />
                                    <span className="text-xs">일반 버튼</span>
                                  </label>
                                  <label className="flex items-center gap-1 cursor-pointer">
                                    <input 
                                      type="radio" 
                                      name={`buttonStyle-${block.id}`}
                                      checked={block.buttonStyle === 'text'} 
                                      onChange={() => updateBlock(block.id, 'buttonStyle', 'text')}
                                      className="accent-primary"
                                    />
                                    <span className="text-xs">텍스트 링크</span>
                                  </label>
                                </div>
                            </div>
                        )}

                        {/* 3. IMAGE Type */}
                        {block.type === 'IMAGE' && (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 mb-2 text-green-600">
                                    <ImageIcon size={16} /> <span className="font-bold text-sm">이미지 블록</span>
                                </div>
                                
                                <div className="border border-dashed rounded-lg p-4 text-center hover:bg-accent/50 transition">
                                  {block.url ? (
                                      <div className="relative inline-block group/preview">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={block.url} alt="Preview" className="max-h-40 object-contain rounded border bg-white" />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition rounded text-white text-xs cursor-pointer" 
                                             onClick={() => document.getElementById(`file-${block.id}`)?.click()}>
                                          이미지 변경
                                        </div>
                                      </div>
                                  ) : (
                                      <div className="relative py-8 cursor-pointer" onClick={() => document.getElementById(`file-${block.id}`)?.click()}>
                                          <ImageIcon className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                          <p className="text-sm text-muted-foreground">클릭하여 이미지 업로드</p>
                                      </div>
                                  )}
                                  <input 
                                    id={`file-${block.id}`}
                                    type="file" 
                                    accept="image/*" 
                                    className="hidden" 
                                    onChange={e => e.target.files?.[0] && handleImageUpload(e.target.files[0], block.id)} 
                                  />
                                </div>
                                
                                <div className="space-y-1">
                                    <Label className="text-xs text-muted-foreground">이미지 클릭 시 이동할 링크 (선택)</Label>
                                    <Input 
                                      placeholder="https://..." 
                                      value={block.linkUrl || ''} 
                                      onChange={e => updateBlock(block.id, 'linkUrl', e.target.value)} 
                                      className="text-sm" 
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* 블록 추가 버튼들 */}
            <div className="flex gap-2 justify-center p-4 border rounded-md bg-muted/20 flex-none">
                <Button variant="outline" size="sm" onClick={() => addBlock('TEXT')}><TypeIcon className="mr-2 h-4 w-4"/> 텍스트 추가</Button>
                <Button variant="outline" size="sm" onClick={() => addBlock('IMAGE')}><ImageIcon className="mr-2 h-4 w-4"/> 이미지 추가</Button>
                <Button variant="outline" size="sm" onClick={() => addBlock('LINK')}><LinkIcon className="mr-2 h-4 w-4"/> 버튼 추가</Button>
            </div>
        </div>
    </div>
  );
}