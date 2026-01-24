"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Check, Layout, Play, X } from "lucide-react";
import * as React from "react";

interface MainBlock {
  id: string;
  category: 'hero' | 'sub' | 'top-banner' | 'product-list' | 'category-product' | 'shorts' | 'video-product';
  type: string;
}

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

  const radiuses = [
    { name: "Sharp (0px)", value: "0px" },
    { name: "Subtle (4px)", value: "4px" },
    { name: "Standard (8px)", value: "8px" },
    { name: "Round (16px)", value: "16px" },
  ];

  const spacingRules = [
    { name: "Comfortable (Wide)", value: "comfortable" },
    { name: "Compact (Narrow)", value: "compact" },
  ];

  const topBannerLayouts = [
    { name: "Text Bar (Simple)", value: "text-bar", desc: "Minimal notification line" },
    { name: "Promotion (Timer)", value: "promotion-timer", desc: "Urgent countdown banner" },
    { name: "Marquee (Scrolling)", value: "marquee", desc: "Auto-scrolling announcement" },
  ];

  const mainLayouts = [
    { name: "Hero Grid (Standard)", value: "hero-grid", desc: "Classic banner with product grid" },
    { name: "Full Screen Scroll", value: "full-scroll", desc: "Immersive storytelling experience" },
    { name: "Sticky Story", value: "sticky-story", desc: "Fixed content with scrolling images" },
    { name: "Minimal Archive", value: "minimal-archive", desc: "Clean, gallery-focused layout" },
  ];

  const subBannerLayouts = [
    { name: "Text Ticker", value: "text-ticker", desc: "Animated scrolling text line" },
    { name: "Image Strap", value: "image-strap", desc: "Full-width decorative image" },
    { name: "Promotion Bar", value: "promotion-bar", desc: "Simple notification area" },
  ];

  const productListLayouts = [
    { name: "Grid 4-Column", value: "grid-4", desc: "Standard high-density grid" },
    { name: "Grid 2-Column", value: "grid-2", desc: "Large thumbnails for impact" },
    { name: "Scroll (Horizontal)", value: "scroll-h", desc: "Swipeable product list" },
  ];

  const categoryProductLayouts = [
    { name: "Tabbed List", value: "tabbed", desc: "Organize by category tabs" },
    { name: "Collection Highlight", value: "collection", desc: "Curated collection focus" },
  ];

  const shortsLayouts = [
    { name: "Story Grid", value: "story-grid", desc: "Instagram-style story circles" },
    { name: "Feed Scroll", value: "feed-scroll", desc: "Vertical video feed" },
  ];

  const videoProductLayouts = [
    { name: "Full Width Video", value: "full-video", desc: "Cinematic product showcase" },
    { name: "Split Video", value: "split-video", desc: "Video with product details" },
  ];

  const listLayouts = [
    { name: "Grid 3-Column", value: "grid-3", desc: "Standard e-commerce balance" },
    { name: "Grid 2-Column", value: "grid-2", desc: "Larger images for visual impact" },
    { name: "List View (Wide)", value: "list-wide", desc: "Detailed information per row" },
    { name: "Masonry", value: "masonry", desc: "Dynamic, pinterest-style grid" },
  ];

  const detailLayouts = [
    { name: "Split View (Standard)", value: "split-view", desc: "Fixed image, scrolling details" },
    { name: "Vertical Stack", value: "vertical-stack", desc: "Sequential content flow" },
    { name: "Magazine Style", value: "magazine", desc: "Editorial layout with mixed media" },
  ];

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

  const RemoveButton = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
    <button
       onClick={(e) => {
          e.stopPropagation();
          onClick(e);
       }}
       className="absolute -top-2 -right-2 w-6 h-6 bg-slate-800 text-slate-400 hover:text-white rounded-full flex items-center justify-center shadow-lg border border-white/10 transition-all opacity-0 group-hover:opacity-100 z-10 cursor-pointer"
    >
       <X className="w-3 h-3" />
    </button>
  );

  const renderBlueprint = (type: 'main' | 'list' | 'detail') => {
    return (
      <div className="flex-1 bg-slate-900 rounded-2xl p-6 relative overflow-hidden flex flex-col gap-4 border border-white/5 shadow-2xl h-full min-h-[350px]">
         <div className="flex justify-between items-center opacity-40">
            <div className="w-12 h-2 bg-white/20 rounded-full" />
            <div className="flex gap-2">
              {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-white/20 rounded-full" />)}
            </div>
         </div>
         
         <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar p-2 relative">
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
                   
                   {/* Top Banner */}
                   {block.category === 'top-banner' && (
                     <div className={cn(
                        "w-full bg-pink-500/20 border border-pink-500/30 rounded-md flex items-center justify-center transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                        "h-8 hover:ring-2 hover:ring-pink-500 hover:ring-offset-2 hover:ring-offset-slate-900"
                     )} style={{ borderRadius: layout.borderRadius }}>
                         <span className="text-[9px] text-pink-300 font-bold uppercase tracking-widest">{block.type}</span>
                         <RemoveButton onClick={() => handleRemoveBlock(block.id)} />
                     </div>
                   )}

                   {/* Hero Section */}
                   {block.category === 'hero' && (
                      <div className={cn(
                        "w-full bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                        "h-32 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 hover:ring-offset-slate-900"
                      )} style={{ borderRadius: layout.borderRadius }}>
                         <span className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest pointer-events-none">
                            {mainLayouts.find(l => l.value === block.type)?.name || block.type}
                         </span>
                         <RemoveButton onClick={() => handleRemoveBlock(block.id)} />
                      </div>
                   )}

                   {/* Sub Banner */}
                   {block.category === 'sub' && (
                     <div className={cn(
                        "w-full bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center justify-center transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                        "h-12 hover:ring-2 hover:ring-orange-500 hover:ring-offset-2 hover:ring-offset-slate-900"
                     )} style={{ borderRadius: layout.borderRadius }}>
                         <div className="w-2/3 h-1.5 bg-orange-500/40 rounded-full" />
                         <RemoveButton onClick={() => handleRemoveBlock(block.id)} />
                     </div>
                   )}

                   {/* Product List */}
                   {block.category === 'product-list' && (
                     <div className={cn(
                        "w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                        "hover:ring-2 hover:ring-emerald-500 hover:ring-offset-2 hover:ring-offset-slate-900"
                     )}>
                        <div className="grid grid-cols-4 gap-2">
                          {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-emerald-500/20 rounded-md" />)}
                        </div>
                        <RemoveButton onClick={() => handleRemoveBlock(block.id)} />
                     </div>
                   )}

                   {/* Category Product */}
                   {block.category === 'category-product' && (
                     <div className={cn(
                        "w-full bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0 space-y-2",
                        "hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 hover:ring-offset-slate-900"
                     )}>
                         <div className="flex gap-2 justify-center pb-1 border-b border-cyan-500/10">
                            {[1,2,3].map(i => <div key={i} className="w-12 h-1.5 bg-cyan-500/30 rounded-full" />)}
                         </div>
                         <div className="grid grid-cols-3 gap-2">
                            {[1,2,3].map(i => <div key={i} className="aspect-[3/4] bg-cyan-500/20 rounded-md" />)}
                         </div>
                        <RemoveButton onClick={() => handleRemoveBlock(block.id)} />
                     </div>
                   )}
                   
                   {/* Shorts */}
                   {block.category === 'shorts' && (
                     <div className={cn(
                        "w-full bg-rose-500/10 border border-rose-500/20 rounded-xl p-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                        "hover:ring-2 hover:ring-rose-500 hover:ring-offset-2 hover:ring-offset-slate-900"
                     )}>
                        <div className="flex gap-2 overflow-hidden">
                           {[1,2,3,4].map(i => (
                             <div key={i} className="w-16 h-24 bg-rose-500/20 rounded-lg border border-rose-500/10 flex items-center justify-center shrink-0">
                                <Play className="w-3 h-3 text-rose-500/50 fill-rose-500/50" />
                             </div>
                           ))}
                        </div>
                        <RemoveButton onClick={() => handleRemoveBlock(block.id)} />
                     </div>
                   )}

                   {/* Video Product */}
                   {block.category === 'video-product' && (
                     <div className={cn(
                        "w-full bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 relative group shrink-0",
                        "h-48 hover:ring-2 hover:ring-violet-500 hover:ring-offset-2 hover:ring-offset-slate-900"
                     )}>
                         <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-500/30">
                            <Play className="w-5 h-5 text-violet-300 ml-1 fill-violet-300" />
                         </div>
                        <RemoveButton onClick={() => handleRemoveBlock(block.id)} />
                     </div>
                   )}

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

         <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <span className="text-[40px] font-black uppercase tracking-tighter -rotate-12 select-none">Preview</span>
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
               <div className="grid grid-cols-12 gap-6 h-[400px]">
                 {/* Left: Builder Item Selector */}
                 <div className="col-span-5 flex flex-col gap-4">
                    {/* Category Selector */}
                    <div className="space-y-1.5">
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
                    <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                      {getLayoutList().map((item) => {
                        const count = (layout.mainBlocks || []).filter(b => b.type === item.value).length;
                        return (
                          <button
                            key={item.value}
                            onClick={() => handleAddBlock(activeMainCategory, item.value)}
                            className={cn(
                              "group relative flex flex-col items-start p-4 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md shrink-0",
                              count > 0
                                ? "border-indigo-600 bg-indigo-50/50" 
                                : "border-gray-100 hover:border-indigo-200 bg-white"
                            )}
                          >
                             {count > 0 && (
                               <div className="absolute top-3 right-3 bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                  {count}
                               </div>
                             )}
                            <span className={cn("text-xs font-bold mb-1", count > 0 ? "text-indigo-700" : "text-gray-900")}>
                              {item.name}
                            </span>
                            <span className="text-[10px] text-gray-500 leading-tight">
                              {item.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                 </div>

                 {/* Right: Preview Visualization */}
                 <div className="col-span-7 h-full">
                   {renderBlueprint('main')}
                 </div>
               </div>
            </TabsContent>

            {['list', 'detail'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-0">
                <div className="grid grid-cols-12 gap-6 h-[400px]">
                  {/* Left: Block Items Selection */}
                  <div className="col-span-5 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
                    {(tab === 'list' ? listLayouts : detailLayouts).map((item) => {
                      const currentVal = tab === 'list' ? layout.list : layout.detail;
                      const isSelected = currentVal === item.value;
                      return (
                        <button
                          key={item.value}
                          onClick={() => onLayoutChange(tab, item.value)}
                          className={cn(
                            "group relative flex flex-col items-start p-4 text-left rounded-xl border-2 transition-all duration-200 hover:shadow-md",
                            isSelected 
                              ? "border-indigo-600 bg-indigo-50/50" 
                              : "border-gray-100 hover:border-indigo-200 bg-white"
                          )}
                        >
                          <div className="flex justify-between w-full mb-1">
                            <span className={cn("text-xs font-bold", isSelected ? "text-indigo-700" : "text-gray-900")}>
                              {item.name}
                            </span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" strokeWidth={3} />}
                          </div>
                          <span className="text-[10px] text-gray-500 leading-tight">
                            {item.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Right: Preview Visualization */}
                  <div className="col-span-7 h-full">
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
