"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MarketingStrategyCardProps {
  analysisResult: any;
  isEditing: boolean;
  updateMarketing: (field: string, value: any) => void;
}

export function MarketingStrategyCard({
  analysisResult,
  isEditing,
  updateMarketing
}: MarketingStrategyCardProps) {
  if (!analysisResult) return null;

  return (
    <Card className={isEditing ? "ring-2 ring-blue-500/20" : ""}>
      <CardHeader className="bg-blue-50/50 flex flex-row items-center justify-between space-y-0 py-3 px-6">
        <CardTitle className="text-blue-700 text-sm font-bold uppercase tracking-wider">마케팅 전략 (Marketing Strategy)</CardTitle>
        {isEditing && <span className="text-[10px] text-blue-500 font-medium">수정 모드</span>}
      </CardHeader>
      <CardContent className="space-y-6 pt-6 bg-white">
        {/* Persona Section */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
          <h4 className="font-semibold mb-3 text-sm flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded-full inline-block"></span>
            페르소나 (Persona)
          </h4>
            {isEditing ? (
              <>
                <Input 
                  value={analysisResult.marketing?.persona?.name || ""} 
                  onChange={(e) => updateMarketing("persona", { ...analysisResult.marketing?.persona, name: e.target.value })}
                  placeholder="페르소나 이름"
                  className="font-bold text-lg"
                />
                <Input 
                  value={analysisResult.marketing?.persona?.oneLiner || ""} 
                  onChange={(e) => updateMarketing("persona", { ...analysisResult.marketing?.persona, oneLiner: e.target.value })}
                  placeholder="한 줄 설명"
                  className="italic"
                />
                <div className="space-y-1">
                  <Label className="text-[10px] text-gray-400">Needs (콤마로 구분)</Label>
                  <Input 
                    value={analysisResult.marketing?.persona?.needs?.join(", ") || ""} 
                    onChange={(e) => updateMarketing("persona", { ...analysisResult.marketing?.persona, needs: e.target.value.split(",").map((s: string) => s.trim()) })}
                    placeholder="구독자 니즈"
                  />
                </div>
              </>
            ) : (
              <>
                <p className="font-medium text-lg">"{analysisResult.marketing?.persona?.name}"</p>
                <p className="text-muted-foreground italic mb-2 text-sm">{analysisResult.marketing?.persona?.oneLiner}</p>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.marketing?.persona?.needs?.map((need: any, i: number) => (
                    <span key={i} className="text-[11px] bg-blue-100 text-blue-700 px-2 py-1 rounded-md font-medium">{need}</span>
                  ))}
                </div>
              </>
            )}
          </div>

        {/* Target Audience Section (AI Inferred + Editable) */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">타겟 오디언스 (Target Audience)</h4>
          <div className="space-y-3 bg-slate-50 p-4 rounded-lg border">
            {isEditing ? (
               <div className="space-y-2">
                 <Label className="text-[11px] text-gray-500">AI가 분석한 타겟 연령 (수정 가능)</Label>
                 <div className="grid grid-cols-2 gap-2">
                   {[
                      { id: '10s', label: '10대' },
                      { id: '20-30s', label: '20-30대' },
                      { id: '40-50s', label: '40-50대' },
                      { id: '60+', label: '60대 이상' },
                   ].map((age) => {
                     // Parse current string into array logic
                     const currentAges = analysisResult.marketing?.target?.ageRange 
                        ? analysisResult.marketing.target.ageRange.split(',').map((s: string) => s.trim())
                        : [];
                        
                     // Mapping Logic: The AI might return "20-30대" strings directly or IDs if prompted.
                     // Since prompt asks for Korean "20-30대", we check partially.
                     // Ideally, we should unify keys. Let's assume text match for now.
                     // Simply checking if the label is contained in the string.
                     const isSelected = currentAges.some((s: string) => s.includes(age.label) || s.includes(age.id));
                     
                     return (
                        <div 
                          key={age.id}
                          onClick={() => {
                             let newAges = [...currentAges];
                             // Toggle Logic (Text based)
                             // Since AI returns formatted text, we toggle by adding/removing the Label.
                             if (isSelected) {
                                newAges = newAges.filter((s: string) => !s.includes(age.label) && !s.includes(age.id));
                             } else {
                                newAges.push(age.label);
                             }
                             updateMarketing("target", { 
                                ...analysisResult.marketing?.target, 
                                ageRange: newAges.join(", ") 
                             });
                          }}
                          className={`
                            cursor-pointer border p-3 rounded text-center text-sm transition-all relative bg-white
                            ${isSelected 
                              ? 'border-indigo-600 text-indigo-700 font-bold ring-1 ring-indigo-600' 
                              : 'border-slate-200 text-slate-500 hover:bg-slate-50'}
                          `}
                        >
                          {age.label}
                          {isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                        </div>
                     );
                   })}
                 </div>
               </div>
            ) : (
               <div className="flex gap-2 items-center flex-wrap">
                  <span className="text-xs font-bold text-slate-500 uppercase mr-2">AGE</span>
                  {analysisResult.marketing?.target?.ageRange?.split(',').map((age: string, i: number) => (
                    <span key={i} className="text-sm font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-100">
                      {age.trim()}
                    </span>
                  ))}
               </div>
            )}
            
            {/* Gender Section (Multi-select) */}
            <div className={`pt-3 border-t border-slate-200 ${isEditing ? 'mt-3' : 'mt-0'}`}>
               {isEditing ? (
                 <div className="space-y-2">
                   <Label className="text-[11px] text-gray-500">성별 (복수 선택 가능)</Label>
                   <div className="grid grid-cols-2 gap-2">
                     {['MALE', 'FEMALE'].map((genderKey) => {
                        const label = genderKey === 'MALE' ? '남성' : '여성';
                        // Normalize functionality: Check if "ALL", "MALE", "FEMALE" is in the string
                        // API might return "ALL", "Male", "Female", or "Male, Female"
                        const currentVal = (analysisResult.marketing?.target?.gender || "").toUpperCase();
                        
                        const isSelected = 
                          currentVal.includes("ALL") || 
                          currentVal.includes(genderKey) || 
                          (genderKey === 'MALE' && (currentVal.includes("남성") || currentVal.includes("MEN"))) ||
                          (genderKey === 'FEMALE' && (currentVal.includes("여성") || currentVal.includes("WOMEN")));

                        return (
                          <div
                            key={genderKey}
                            onClick={() => {
                               // Toggle Logic
                               let newGenders = [];
                               const isMaleSelected = currentVal.includes("ALL") || currentVal.includes("MALE") || currentVal.includes("남성");
                               const isFemaleSelected = currentVal.includes("ALL") || currentVal.includes("FEMALE") || currentVal.includes("여성");

                               if (genderKey === 'MALE') {
                                  if (isMaleSelected) { // Deselect Male
                                     if (isFemaleSelected) newGenders.push("FEMALE"); 
                                  } else { // Select Male
                                     newGenders.push("MALE");
                                     if (isFemaleSelected) newGenders.push("FEMALE");
                                  }
                               } else { // FEMALE
                                  if (isFemaleSelected) { // Deselect Female
                                     if (isMaleSelected) newGenders.push("MALE");
                                  } else { // Select Female
                                     newGenders.push("FEMALE");
                                     if (isMaleSelected) newGenders.push("MALE");
                                  }
                               }

                               // Determine final string
                               let finalStr = "";
                               if (newGenders.length === 2) finalStr = "ALL";
                               else if (newGenders.length === 1) finalStr = newGenders[0];
                               // If empty, maybe default to ALL or empty? Let's leave empty.
                               
                               updateMarketing("target", { ...analysisResult.marketing?.target, gender: finalStr });
                            }}
                            className={`
                              cursor-pointer border p-3 rounded text-center text-sm transition-all relative bg-white
                              ${isSelected 
                                ? 'border-sky-600 text-sky-700 font-bold ring-1 ring-sky-600' 
                                : 'border-slate-200 text-slate-500 hover:bg-slate-50'}
                            `}
                          >
                            {label}
                            {isSelected && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-sky-600" />}
                          </div>
                        );
                     })}
                   </div>
                 </div>
               ) : (
                  <div className="flex gap-2 items-center mt-2">
                     <span className="text-xs font-bold text-slate-500 uppercase mr-2">GENDER</span>
                     <span className="text-sm text-slate-700 font-medium">
                        {(() => {
                           const val = (analysisResult.marketing?.target?.gender || "").toUpperCase();
                           if (val.includes("ALL")) return "남성, 여성 (전체)";
                           if (val.includes("MALE") || val.includes("남성")) return "남성";
                           if (val.includes("FEMALE") || val.includes("여성")) return "여성";
                           return val;
                        })()}
                     </span>
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Product Categories Section */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">판매 예정 상품 (Product Categories)</h4>
          <div className="bg-slate-50 p-4 rounded-lg border">
            {isEditing ? (
               <div className="grid grid-cols-2 gap-2">
                 {[
                    { id: 'HEALTH_FOOD', label: '건강식품' },
                    { id: 'COSMETICS', label: '화장품/뷰티' },
                    { id: 'FASHION', label: '패션/의류' },
                    { id: 'ELECTRONICS', label: '전자제품/디지털' },
                    { id: 'FOOD', label: '식품/음료' },
                    { id: 'LIVING', label: '리빙/홈데코' },
                    { id: 'PET', label: '반려동물' },
                    { id: 'GENERAL', label: '종합/기타' },
                 ].map((cat) => {
                    const currentCats = analysisResult.marketing?.product?.categories || [];
                    const isSelected = currentCats.includes(cat.id);
                    return (
                      <div 
                        key={cat.id}
                        onClick={() => {
                           let newCats;
                           if (isSelected) newCats = currentCats.filter((c: string) => c !== cat.id);
                           else newCats = [...currentCats, cat.id];
                           updateMarketing("product", { ...analysisResult.marketing?.product, categories: newCats });
                        }}
                        className={`
                          cursor-pointer border p-2 rounded text-center text-xs transition-all relative bg-white
                          ${isSelected 
                            ? 'border-blue-600 text-blue-700 font-bold ring-1 ring-blue-600' 
                            : 'border-slate-200 text-slate-500 hover:bg-slate-50'}
                        `}
                      >
                        {cat.label}
                      </div>
                    );
                 })}
               </div>
            ) : (
               <div className="flex flex-wrap gap-2">
                 {(analysisResult.marketing?.product?.categories || []).map((catId: string, i: number) => {
                    const label = {
                      'HEALTH_FOOD': '건강식품',
                      'COSMETICS': '화장품/뷰티',
                      'FASHION': '패션/의류',
                      'ELECTRONICS': '전자제품/디지털',
                      'FOOD': '식품/음료',
                      'LIVING': '리빙/홈데코',
                      'PET': '반려동물',
                      'GENERAL': '종합/기타',
                    }[catId] || catId;
                    return (
                      <span key={i} className="text-sm font-medium bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full shadow-sm">
                        {label}
                      </span>
                    );
                 })}
               </div>
            )}
          </div>
        </div>

        {/* Strategy Section */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">전략 및 USP (Strategy & USP)</h4>
          {isEditing ? (
            <Textarea 
              value={analysisResult.marketing?.strategy?.usp || ""} 
              onChange={(e) => updateMarketing("strategy", { ...analysisResult.marketing?.strategy, usp: e.target.value })}
              className="text-sm h-24"
            />
          ) : (
            <p className="text-sm text-gray-700 leading-relaxed bg-slate-50/50 p-3 rounded-lg border border-dashed">{analysisResult.marketing?.strategy?.usp}</p>
          )}
        </div>

        {/* Brand Identity */}
        <div>
           <h4 className="font-semibold mb-2 text-sm">브랜드 정체성 (Brand Identity)</h4>
           <div className="space-y-3">
             <div className="bg-slate-50 p-3 rounded border">
               <span className="text-xs text-muted-foreground block mb-1">Brand Archetype</span>
               {isEditing ? (
                 <div className="grid grid-cols-2 gap-2">
                    <Input 
                      value={analysisResult.marketing?.strategy?.brandArchetype?.primary || ""} 
                      onChange={(e) => updateMarketing("strategy", { 
                        ...analysisResult.marketing?.strategy, 
                        brandArchetype: { ...analysisResult.marketing?.strategy?.brandArchetype, primary: e.target.value } 
                      })}
                      placeholder="주 원형"
                    />
                    <Input 
                      value={analysisResult.marketing?.strategy?.brandArchetype?.secondary || ""} 
                      onChange={(e) => updateMarketing("strategy", { 
                        ...analysisResult.marketing?.strategy, 
                        brandArchetype: { ...analysisResult.marketing?.strategy?.brandArchetype, secondary: e.target.value } 
                      })}
                      placeholder="부 원형"
                    />
                 </div>
               ) : (
                 <div className="flex items-center gap-2">
                   <span className="font-bold text-blue-600">{analysisResult.marketing?.strategy?.brandArchetype?.primary}</span>
                   <span className="text-xs text-gray-400">+ {analysisResult.marketing?.strategy?.brandArchetype?.secondary}</span>
                 </div>
               )}
             </div>
           </div>
        </div>

        {/* Competitors List */}
        <div>
          <h4 className="font-semibold mb-2 text-sm">경쟁사 (Competitors)</h4>
          <div className="space-y-2">
            {analysisResult.marketing?.strategy?.competitors?.map((comp: any, i: number) => (
              <div key={i} className="text-sm bg-gray-50 p-2 rounded flex justify-between items-center">
                <span className="font-medium">{comp.name}</span>
                <span className="text-xs text-gray-500 truncate max-w-[150px]">{comp.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
