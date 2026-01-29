"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DualRoleAnalysis } from "@/lib/agent/types";
import { getProxiedUrl } from "@/services/instagram/utils";
import { useState } from "react";

// Sub-components
import { BadgeExplanationModal } from "./result-card/badge-explanation-modal";
import { ExpertTab } from "./result-card/expert-tab";
import { InvestmentTab } from "./result-card/investment-tab";
import { StatusBadges } from "./result-card/status-badges";
import { VerdictTab } from "./result-card/verdict-tab";

interface Props {
  analysis: DualRoleAnalysis;
}

export function AnalysisResultCard({ analysis }: Props) {
  const { investmentAnalyst: investment, influencerExpert: expert, comparisonSummary: comparison, basicStats } = analysis;
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);

  const handleBadgeClick = (badgeKey: string) => {
      setSelectedBadge(badgeKey);
      setModalOpen(true);
  };

  return (
    <>
      <Card className="w-full max-w-2xl overflow-hidden border-2 transition-all hover:border-primary/50 hover:shadow-lg bg-white dark:bg-zinc-950">
        {/* --- Basic Stats Header --- */}
        {basicStats && (
          <div className="p-6 flex flex-col sm:flex-row gap-6 border-b bg-muted/30">
              <div className="flex items-start gap-4 flex-1">
                  <div className="shrink-0">
                    <Avatar className="w-16 h-16 border-2 shadow-sm">
                      <AvatarImage src={getProxiedUrl(basicStats.profilePicUrl)} alt={basicStats.username} className="object-cover" />
                      <AvatarFallback className="text-2xl">👤</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-xl font-bold">{basicStats.username}</h3>
                          <StatusBadges analysis={analysis} onBadgeClick={handleBadgeClick} />
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                          <span className="flex items-center gap-1">
                              <span className="font-bold text-foreground">{basicStats.followers?.toLocaleString()}</span> 팔로워
                          </span>
                          <span className="flex items-center gap-1">
                              <span className="font-bold text-emerald-600">ER {basicStats.er}%</span>
                          </span>
                      </div>
                  </div>
              </div>
              <div className="flex flex-col justify-center items-end border-l pl-6 border-slate-200">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-right">Final ROI Score</div>
                  <div className="text-3xl font-black text-slate-900">{investment.totalScore}<span className="text-sm font-normal text-slate-400">/100</span></div>
              </div>
          </div>
        )}

        <div className="p-0">
          <Tabs defaultValue="investment" className="w-full">
              <div className="px-6 pt-4 border-b bg-muted/10">
                  <TabsList className="grid w-full grid-cols-3 max-w-[420px] bg-slate-100/50 p-1">
                      <TabsTrigger value="investment" className="text-xs font-bold data-[state=active]:text-blue-700">투자심사역 (냉혹)</TabsTrigger>
                      <TabsTrigger value="expert" className="text-xs font-bold data-[state=active]:text-purple-700">전문가 (육성)</TabsTrigger>
                      <TabsTrigger value="verdict" className="text-xs font-bold data-[state=active]:text-slate-900">종합 판결</TabsTrigger>
                  </TabsList>
              </div>

              <TabsContent value="investment">
                  <InvestmentTab investment={investment} />
              </TabsContent>

              <TabsContent value="expert">
                  <ExpertTab expert={expert} />
              </TabsContent>

              <TabsContent value="verdict">
                  <VerdictTab comparison={comparison} />
              </TabsContent>
          </Tabs>
        </div>
      </Card>

      <BadgeExplanationModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        selectedBadge={selectedBadge} 
        analysis={analysis} 
      />
    </>
  );
}
