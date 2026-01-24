"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMallStore } from "@/services/mall/store";
import { Check, Pencil, Sparkles, UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { ReferenceAnalysisCard } from "./analysis-parts/ReferenceAnalysisCard";

interface ReferenceStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ReferenceStep({ onNext, onBack }: ReferenceStepProps) {
  const { 
    setReferenceAnalysis, 
    referenceAnalysis, 
    referenceImages, 
    setReferenceImages,
    updateReferenceAnalysis 
  } = useMallStore();
  
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(referenceImages || []);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles]);
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviews]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 5
  });

  const removeFile = (index: number) => {
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviews);
    
    if (index < files.length) {
      setFiles(prev => prev.filter((_, i) => i !== index));
    }
    
    if (referenceImages.length > 0) {
       const newStoreImages = referenceImages.filter((_, i) => i !== index);
       setReferenceImages(newStoreImages);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const newBase64Promises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      const newBase64Images = await Promise.all(newBase64Promises);
      
      const existingBase64 = referenceImages || [];
      const allBase64Images = [...existingBase64, ...newBase64Images];

      if (allBase64Images.length === 0) {
        toast.error("이미지를 먼저 업로드해주세요.");
        setIsAnalyzing(false);
        return;
      }

      const response = await fetch("/api/youtube/mall/reference/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: allBase64Images }),
      });

      if (!response.ok) throw new Error("Reference Analysis failed");

      const data = await response.json();
      setReferenceAnalysis(data);
      setReferenceImages(allBase64Images);
      toast.success("레퍼런스 분석이 완료되었습니다!");

    } catch (error) {
      console.error(error);
      toast.error("분석 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const updateReference = (field: string, value: any) => {
    if (!referenceAnalysis) return;
    updateReferenceAnalysis({
      [field]: value
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="space-y-2 text-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">디자인 레퍼런스</h2>
        <p className="text-muted-foreground">
          원하는 스타일의 이미지를 업로드하면, AI가 시각적 특징을 분석합니다.
        </p>
      </div>

      <div className="grid gap-6">
        {/* 1. Upload Area */}
        <Card className={referenceAnalysis ? "border-green-200 bg-green-50/10" : "border-slate-200"}>
           <CardHeader className="py-4">
             <CardTitle className="flex justify-between items-center text-lg">
               <span>Step 1. 레퍼런스 업로드</span>
               <span className="text-sm font-normal text-muted-foreground">{previewUrls.length} / 5</span>
             </CardTitle>
           </CardHeader>
           <CardContent className="pb-6">
             <div 
               {...getRootProps()} 
               className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                 ${isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"}
               `}
             >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-3 bg-white rounded-full shadow-sm text-slate-400 border border-slate-100">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-slate-700">이미지 드래그 앤 드롭</h3>
                    <p className="text-xs text-slate-400">
                      또는 클릭하여 파일 선택 (JPG, PNG, WEBP)
                    </p>
                  </div>
                </div>
             </div>

             {/* Preview Grid */}
             {previewUrls.length > 0 && (
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mt-6">
                 {previewUrls.map((url, index) => (
                   <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-slate-100 bg-slate-50 shadow-sm transition-all hover:ring-2 hover:ring-blue-100">
                     <img src={url} alt="preview" className="w-full h-full object-cover" />
                     <button 
                       onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                       className="absolute top-1.5 right-1.5 bg-white/90 text-slate-600 rounded-full p-1.5 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-500"
                     >
                       <X className="w-3 h-3" />
                     </button>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
        </Card>

        {/* 2. Analysis Action */}
        <div className="flex justify-center">
          <Button 
             size="lg" 
             onClick={handleAnalyze} 
             disabled={previewUrls.length === 0 || isAnalyzing}
             className="w-full max-w-md text-lg h-14 shadow-lg transition-all active:scale-95 bg-blue-600 hover:bg-blue-700"
             variant={referenceAnalysis ? "outline" : "default"}
          >
            {isAnalyzing ? (
               <><Sparkles className="mr-2 w-5 h-5 animate-pulse" /> AI 분석 중...</>
            ) : referenceAnalysis ? (
               "새로운 이미지로 다시 분석하기" 
            ) : (
               <><Sparkles className="mr-2 w-5 h-5" /> 레퍼런스 스타일 분석 시작</>
            )}
          </Button>
        </div>

        {/* 3. Analysis Result */}
        {referenceAnalysis && (
          <div className="space-y-4 pt-4">
             <div className="flex items-center justify-between px-1">
               <h3 className="text-lg font-bold text-slate-800">스타일 분석 결과</h3>
               <Button 
                  variant={isEditing ? "default" : "outline"} 
                  size="sm" 
                  onClick={() => {
                    if (isEditing) toast.success("수정 사항이 반영되었습니다.");
                    setIsEditing(!isEditing);
                  }}
                  className="flex gap-2 h-9 px-4"
                >
                  {isEditing ? <><Check className="w-4 h-4" /> 완료</> : <><Pencil className="w-4 h-4" /> 수정하기</>}
                </Button>
             </div>
             <ReferenceAnalysisCard
               referenceAnalysis={referenceAnalysis}
               isEditing={isEditing}
               updateReference={updateReference}
             />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-12 pt-8 border-t border-slate-100">
        <Button variant="ghost" onClick={onBack} size="lg" className="px-8">
          이전으로
        </Button>
        <Button 
          onClick={async () => {
            await useMallStore.getState().save();
            onNext();
          }} 
          size="lg" 
          disabled={!referenceAnalysis} 
          className="bg-green-600 hover:bg-green-700 px-12 shadow-md"
        >
          기획안 전체 저장 및 시안 제작하기
        </Button>
      </div>
    </div>
  );
}
