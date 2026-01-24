"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { MainBlock } from "@/services/mall/types";
import { Layout } from "lucide-react";
import * as React from "react";

// Extracted Parts
import {
  categoryProductLayouts,
  detailLayouts,
  listLayouts,
  mainLayouts,
  productListLayouts,
  radiuses,
  shortsLayouts,
  spacingRules,
  subBannerLayouts,
  topBannerLayouts,
  videoProductLayouts
} from "./layout-parts/layout-data";
import { LayoutBlockPreview } from "./layout-parts/LayoutBlockPreview";
import { LayoutOptionList } from "./layout-parts/LayoutOptionList";

interface LayoutSystemCardProps {
  layout: {
    borderRadius: string;
    spacing: string;
    grid: string;
    mainBlocks: MainBlock[];
    list: string;
    detail: string;
  };
  onLayoutChange: (field: string, value: any) => void;
}

export function LayoutSystemCard({ layout, onLayoutChange }: LayoutSystemCardProps) {
  const [activeMainCategory, setActiveMainCategory] = React.useState<MainBlock['category']>('hero');

  const getLayoutList = () => {
    switch(activeMainCategory) {
      case 'top-banner': return topBannerLayouts;
      case 'hero': return mainLayouts;
      case 'sub': return subBannerLayouts;
      case 'product-list': return productListLayouts;
      case 'category-product': return categoryProductLayouts;
      case 'shorts': return shortsLayouts;
      case 'video-product': return videoProductLayouts;
      default: return mainLayouts;
    }
  };

  const handleAddBlock = (category: MainBlock['category'], type: string) => {
    const newBlock: MainBlock = {
      id: crypto.randomUUID(),
      category,
      type
    };
    const newBlocks = [...(layout.mainBlocks || []), newBlock];
    onLayoutChange('mainBlocks', newBlocks);
  };

  const handleRemoveBlock = (blockId: string) => {
    const newBlocks = (layout.mainBlocks || []).filter(b => b.id !== blockId);
    onLayoutChange('mainBlocks', newBlocks);
  };

  const renderBlueprint = (type: 'main' | 'list' | 'detail') => {
    return (
      <div className="flex-1 bg-slate-900 rounded-2xl p-6 relative flex flex-col gap-4 border border-white/5 shadow-2xl min-h-[400px]">
         <div className="flex justify-between items-center opacity-40">
            <div className="w-12 h-2 bg-white/20 rounded-full" />
            <div className="flex gap-2">
              {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-white/20 rounded-full" />)}
            </div>
         </div>
         
         <div className="space-y-3 flex-1 p-2 relative">
           {type === 'main' && (
             <div className="space-y-3 min-h-[200px] flex flex-col items-center">
               {(!layout.mainBlocks || layout.mainBlocks.length === 0) && (
                  <div className="flex flex-col items-center justify-center h-full text-white/20 gap-2 py-20">
                    <Layout className="w-8 h-8" />
                     <span className="text-xs font-medium">Select a block to add</span>
                  </div>
               )}

               {layout.mainBlocks?.map((block) => (
                 <React.Fragment key={block.id}>
                    <LayoutBlockPreview 
                        block={block} 
                        borderRadius={layout.borderRadius} 
                        onRemove={handleRemoveBlock} 
                    />
                 </React.Fragment>
               ))}
             </div>
           )}

           {type === 'list' && (
             <div className={cn("grid gap-3 transition-all duration-300", 
                layout.list === 'grid-3' ? "grid-cols-3" : 
                layout.list === 'grid-2' ? "grid-cols-2" : "grid-cols-1"
             )}>
                {[1,2,3,4,5,6].slice(0, layout.list === 'grid-2' ? 4 : 6).map(i => (
                  <div key={i} className="aspect-[3/4] bg-white/5 border border-white/10 rounded-lg flex flex-col gap-2 p-2" style={{ borderRadius: layout.borderRadius }}>
                     <div className="flex-1 bg-white/5 rounded-sm" />
                     <div className="h-2 w-2/3 bg-white/10 rounded-sm" />
                     <div className="h-2 w-1/3 bg-white/10 rounded-sm" />
                  </div>
                ))}
             </div>
           )}

           {type === 'detail' && (
             <div className="flex gap-4 h-full">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg h-5/6" style={{ borderRadius: layout.borderRadius }} />
                <div className="flex-1 flex flex-col gap-3">
                   <div className="h-6 w-3/4 bg-indigo-500/20 rounded-md" />
                   <div className="h-4 w-1/2 bg-white/10 rounded-md" />
                   <div className="h-20 w-full bg-white/5 rounded-md mt-4" />
                   <div className="h-10 w-full bg-indigo-600/20 rounded-md mt-auto mb-10" style={{ borderRadius: layout.borderRadius }} />
                </div>
             </div>
           )}
         </div>
      </div>
    );
  };

  return (
    <Card className="border-none shadow-sm bg-white rounded-3xl overflow-hidden h-full flex flex-col">
      <CardHeader className="p-6 pb-2">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Layout className="w-5 h-5 text-indigo-500" />
          4. 페이지 레이아웃 세트
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-4 flex-1 space-y-8">
        {/* Global Rules */}
        <div className="space-y-4">
          <Label className="text-[10px] text-indigo-500 uppercase font-black tracking-widest">Global Design Rules</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">곡률 (Radius)</Label>
              <Select value={layout.borderRadius} onValueChange={(val) => onLayoutChange("borderRadius", val)}>
                <SelectTrigger className="rounded-xl border-gray-100 h-11 bg-gray-50/50">
                  <SelectValue placeholder="곡률 선택" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {radiuses.map((r) => (
                    <SelectItem key={r.value} value={r.value} className="rounded-lg">
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">간격 (Spacing)</Label>
              <Select value={layout.spacing} onValueChange={(val) => onLayoutChange("spacing", val)}>
                <SelectTrigger className="rounded-xl border-gray-100 h-11 bg-gray-50/50">
                  <SelectValue placeholder="간격 선택" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {spacingRules.map((s) => (
                    <SelectItem key={s.value} value={s.value} className="rounded-lg">
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Page Specific Layouts - Split View */}
        <div className="space-y-2">
          <Label className="text-[10px] text-indigo-500 uppercase font-black tracking-widest">Page Specific Patterns</Label>
          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100/50 p-1 rounded-xl h-10 mb-4">
              <TabsTrigger value="main" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">메인</TabsTrigger>
              <TabsTrigger value="list" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">리스트</TabsTrigger>
              <TabsTrigger value="detail" className="rounded-lg text-xs font-semibold data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-sm">상세</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="mt-0">
               <div className="grid grid-cols-12 gap-6 items-start">
                 {/* Left: Builder Item Selector */}
                 <div className="col-span-5 flex flex-col gap-4 sticky top-0 h-[600px]">
                    {/* Category Selector */}
                    <div className="space-y-1.5 flex-shrink-0">
                       <Label className="text-xs text-muted-foreground font-semibold">편집 대상 Component</Label>
                       <Select value={activeMainCategory} onValueChange={(val: any) => setActiveMainCategory(val)}>
                         <SelectTrigger className="rounded-xl border-gray-200 h-10 bg-white shadow-sm">
                           <SelectValue />
                         </SelectTrigger>
                         <SelectContent className="rounded-xl h-[300px]">
                           <SelectItem value="top-banner">Top Banner (상단 띠배너)</SelectItem>
                           <SelectItem value="hero">Hero Banner (메인 배너)</SelectItem>
                           <SelectItem value="sub">Sub Banner (서브 배너)</SelectItem>
                           <SelectItem value="product-list">Product List (상품 리스트)</SelectItem>
                           <SelectItem value="category-product">Category Product (카테고리 상품)</SelectItem>
                           <SelectItem value="shorts">Shorts (숏폼)</SelectItem>
                           <SelectItem value="video-product">Video Product (비디오 커머스)</SelectItem>
                         </SelectContent>
                       </Select>
                    </div>

                    {/* Block Items List */}
                    <LayoutOptionList 
                        items={getLayoutList()} 
                        mode="add"
                        existingBlocks={layout.mainBlocks}
                        onSelect={(type) => handleAddBlock(activeMainCategory, type)}
                    />
                 </div>

                 {/* Right: Preview Visualization */}
                 <div className="col-span-7">
                   {renderBlueprint('main')}
                 </div>
               </div>
            </TabsContent>

            {['list', 'detail'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <div className="grid grid-cols-12 gap-6 items-start">
                  {/* Left: Block Items Selection */}
                  <div className="col-span-5 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar sticky top-0 h-[600px]">
                    <LayoutOptionList 
                        items={tab === 'list' ? listLayouts : detailLayouts}
                        mode="select"
                        selectedVal={tab === 'list' ? layout.list : layout.detail}
                        onSelect={(val) => onLayoutChange(tab, val)}
                    />
                  </div>

                  {/* Right: Preview Visualization */}
                  <div className="col-span-7">
                    {renderBlueprint(tab as any)}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}
