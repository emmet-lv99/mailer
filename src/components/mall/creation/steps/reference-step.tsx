"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMallStore } from "@/services/mall/store";
import { FileImage, Sparkles, UploadCloud, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ReferenceStepProps {
  onNext: () => void;
  onBack: () => void;
}

export function ReferenceStep({ onNext, onBack }: ReferenceStepProps) {
  const { setReferenceAnalysis, referenceAnalysis, referenceImages, setReferenceImages } = useMallStore();
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>(referenceImages || []); // Initialize from store
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Append new files
    setFiles(prev => [...prev, ...acceptedFiles]);
    
    // Create preview URLs
    const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
    const updatedPreviews = [...previewUrls, ...newPreviews];
    setPreviewUrls(updatedPreviews);
    
    // Convert new files to base64 immediately or wait for analysis?
    // Let's rely on handleAnalyze to save to store for now, OR convert them now.
    // Ideally we sync store on every drop, but converting File->Base64 is async.
    // For simplicity, we just keep local state until Analysis happens, 
    // BUT if we want persistence before analysis, we should convert now.
    // Let's keep it simple: Persistence happens AFTER analysis (as checkpoint).
    // If user navigates away before analysis, data is lost (acceptable for now).
    // IF user analyzes -> Saves to store -> Navigates away -> Returns -> WE MUST RESTORE.
  }, [previewUrls]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 5
  });

  const removeFile = (index: number) => {
    // If removing from store-restored images (which don't have corresponding File objects),
    // we just remove from previewUrls.
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviews);
    
    // Update files array if possible (files indices match preview indices relative to new files)
    // This is tricky if mixing restored vs new files. 
    // Simplified: We just clear the File object at that index if it exists.
    if (index < files.length) {
      setFiles(prev => prev.filter((_, i) => i !== index));
    }
    
    // Also update store if we are in restored state
    if (referenceImages.length > 0) {
       const newStoreImages = referenceImages.filter((_, i) => i !== index);
       setReferenceImages(newStoreImages);
    }
  };

  const handleAnalyze = async () => {
    // Collect all images: Restored Base64 (previewUrls that start with data:) + New Files
    setIsAnalyzing(true);
    try {
       // 1. Convert NEW files to Base64
       const newBase64Promises = files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      });
      const newBase64Images = await Promise.all(newBase64Promises);
      
      // Combine with existing store images (which are already base64, assuming previewUrls initialized from them)
      // Actually previewUrls contains everything (both old base64 and new blob urls).
      // We need strictly Base64 for the API.
      
      const existingBase64 = referenceImages || [];
      const allBase64Images = [...existingBase64, ...newBase64Images];

      if (allBase64Images.length === 0) {
        toast.error("이미지를 먼저 업로드해주세요.");
        setIsAnalyzing(false);
        return;
      }

      // 2. Call API
      const response = await fetch("/api/youtube/mall/reference/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: allBase64Images }),
      });

      if (!response.ok) throw new Error("Reference Analysis failed");

      const data = await response.json();
      
      // 3. Save everything to Store
      setReferenceAnalysis(data);
      setReferenceImages(allBase64Images); // Persist images
      
      toast.success("레퍼런스 분석이 완료되었습니다!");

    } catch (error) {
      console.error(error);
      toast.error("분석 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
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
        <Card className={referenceAnalysis ? "border-green-200 bg-green-50/20" : ""}>
           <CardHeader>
             <CardTitle className="flex justify-between items-center">
               <span>Step 1. 레퍼런스 업로드</span>
               <span className="text-sm font-normal text-muted-foreground">{files.length} / 5</span>
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div 
               {...getRootProps()} 
               className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors cursor-pointer
                 ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"}
               `}
             >
               <input {...getInputProps()} />
               <div className="flex flex-col items-center gap-4">
                 <div className="p-4 bg-slate-100 rounded-full text-slate-600">
                   <UploadCloud className="w-8 h-8" />
                 </div>
                 <div className="space-y-1">
                   <h3 className="font-semibold text-lg">이미지 드래그 앤 드롭</h3>
                   <p className="text-sm text-gray-500">
                     또는 클릭하여 파일 선택 (JPG, PNG, WEBP)
                   </p>
                 </div>
               </div>
             </div>

             {/* Preview Grid */}
             {files.length > 0 && (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-6">
                 {previewUrls.map((url, index) => (
                   <div key={index} className="relative group aspect-square rounded-md overflow-hidden border bg-white">
                     <img src={url} alt="preview" className="w-full h-full object-cover" />
                     <button 
                       onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                       className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                     >
                       <X className="w-3 h-3" />
                     </button>
                   </div>
                 ))}
               </div>
             )}
           </CardContent>
        </Card>

        {/* 2. Analysis Action (Middle Step) */}
        <div className="flex justify-center py-4">
          <Button 
             size="lg" 
             onClick={handleAnalyze} 
             disabled={files.length === 0 || isAnalyzing}
             className="w-full max-w-md text-lg h-14"
             variant={referenceAnalysis ? "outline" : "default"}
          >
            {isAnalyzing ? (
               "AI가 이미지를 분석 중입니다..."
            ) : referenceAnalysis ? (
               "다시 분석하기" 
            ) : (
               <><Sparkles className="mr-2 w-5 h-5" /> 레퍼런스 분석 시작</>
            )}
          </Button>
        </div>

        {/* 3. Analysis Result */}
        {referenceAnalysis && (
          <Card className="animate-in slide-in-from-bottom-4 duration-500 border-indigo-100 shadow-sm">
            <CardHeader className="bg-indigo-50/30 border-b border-indigo-50">
              <CardTitle className="text-indigo-700 flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Step 2. 스타일 분석 리포트
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                 <div className="col-span-2">
                    <h4 className="font-semibold mb-2">Concept & Keywords</h4>
                    <div className="flex flex-wrap gap-2 mb-2">
                       {referenceAnalysis.concept.keywords.map((k, i) => (
                         <span key={i} className="text-xs font-medium text-white bg-indigo-500 px-3 py-1 rounded-full">{k}</span>
                       ))}
                    </div>
                    <p className="text-sm text-gray-600">{referenceAnalysis.concept.description}</p>
                 </div>

                 <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Color Palette</h4>
                        <div className="flex gap-4 flex-wrap">
                          {Object.entries(referenceAnalysis.foundation.colors).map(([key, value]) => (
                            typeof value === 'string' && (
                              <div key={key} className="flex flex-col items-center gap-1">
                                <div className="w-10 h-10 rounded-full border shadow-sm" style={{ backgroundColor: value }} />
                                <span className="text-[10px] text-gray-500 uppercase">{key}</span>
                              </div>
                            )
                          ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Typography & Shape</h4>
                        <div className="bg-slate-50 p-3 rounded border space-y-2 text-sm">
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Font</span>
                             <span className="font-medium">{referenceAnalysis.foundation.typography.fontFamily}</span>
                           </div>
                           <div className="flex justify-between">
                             <span className="text-muted-foreground">Radius</span>
                             <span className="font-medium">{referenceAnalysis.foundation.shapeLayout.borderRadius}</span>
                           </div>
                        </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-2">Components Style</h4>
                        <div className="space-y-2 text-sm text-gray-700">
                           <div className="bg-gray-50 p-2 rounded flex gap-2">
                             <span className="text-xs font-bold uppercase min-w-[60px]">Button</span>
                             <p className="text-xs">{referenceAnalysis.components.buttons}</p>
                           </div>
                           <div className="bg-gray-50 p-2 rounded flex gap-2">
                             <span className="text-xs font-bold uppercase min-w-[60px]">Card</span>
                             <p className="text-xs">{referenceAnalysis.components.cards}</p>
                           </div>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Mood & Imagery</h4>
                        <div className="bg-indigo-50 p-3 rounded text-sm text-indigo-900">
                           <p className="mb-2">{referenceAnalysis.mood.imagery}</p>
                           <div className="flex gap-2 text-xs">
                             <span className="bg-white px-2 py-1 rounded border">Graphic: {referenceAnalysis.mood.graphicMotifs}</span>
                           </div>
                        </div>
                    </div>
                 </div>
               </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-12 pt-6 border-t">
        <Button variant="ghost" onClick={onBack} size="lg">
          이전 단계
        </Button>
        <Button 
          onClick={async () => {
            await useMallStore.getState().save();
            onNext();
          }} 
          size="lg" 
          disabled={!referenceAnalysis} 
          className="bg-green-600 hover:bg-green-700"
        >
          저장하고 다음 단계로 (시안 제작)
        </Button>
      </div>
    </div>
  );
}
