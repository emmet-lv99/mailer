"use client";

import { useState } from "react";
import { AuthenticityModal } from "../../search/components/modals/AuthenticityModal";
import { CampaignSuitabilityModal } from "../../search/components/modals/CampaignSuitabilityModal";
import { FakeAccountModal } from "../../search/components/modals/FakeAccountModal";
import { GradeExplanationModal } from "../../search/components/modals/GradeExplanationModal";
import { MarketSuitabilityModal } from "../../search/components/modals/MarketSuitabilityModal";

interface MetricsData {
  isActive: boolean;
  avgCycle: number | null;
  authenticityScore: number;
  isFake: boolean;
  er: number;
  tier: string;
  grade: string | null;
  campaignResults: any;
  marketSuitable: boolean;
  authDetails: any;
}

interface MetricsBadgesProps {
  metrics: MetricsData;
  originalUser: any;
}

export function MetricsBadges({ metrics, originalUser }: MetricsBadgesProps) {
  const [gradeModalData, setGradeModalData] = useState<any>(null);
  const [authModalData, setAuthModalData] = useState<any>(null);
  const [campaignModalData, setCampaignModalData] = useState<any>(null);
  const [marketModalData, setMarketModalData] = useState<any>(null);
  const [fakeModalData, setFakeModalData] = useState<any>(null);

  return (
    <>
      <div className="flex flex-col items-end gap-2 sm:min-w-[180px]">
        {/* 1. Market & Grade */}
        <div className="flex gap-1.5">
          {!metrics.marketSuitable ? (
            <button
              onClick={(e) => { e.stopPropagation(); setMarketModalData({ 
                user: originalUser, 
                isActive: metrics.isActive, 
                avgCycle: metrics.avgCycle, 
                tier: metrics.tier 
              }); }} 
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 hover:bg-red-200 transition-colors cursor-pointer"
            >
              기준 미달
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setGradeModalData({ 
                tier: metrics.tier, 
                er: metrics.er, 
                authDetails: { er: { feedER: metrics.er, reelsER: metrics.er } }
              }); }} 
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1 hover:bg-indigo-200 transition-colors cursor-pointer"
            >
              {metrics.tier} <span className="text-indigo-900 border-l border-indigo-300 pl-1">{metrics.grade}</span>
            </button>
          )}
        </div>

        {/* 2. Authenticity */}
        <div>
          {metrics.isFake ? (
            <button
              onClick={(e) => { e.stopPropagation(); setFakeModalData({ 
                authDetails: metrics.authDetails, 
                tier: metrics.tier 
              }); }} 
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200 hover:bg-orange-200 transition-colors cursor-pointer"
            >
              가짜 의심
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setAuthModalData({ 
                authenticityScore: metrics.authenticityScore, 
                authDetails: metrics.authDetails 
              }); }} 
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer"
            >
              신뢰도 {metrics.authenticityScore}
            </button>
          )}
        </div>

        {/* 3. Campaign Suitability */}
        <div className="flex flex-col items-end gap-1 mt-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCampaignModalData({ results: metrics.campaignResults });
            }}
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer"
          >
            캠페인 적합도 분석
          </button>
        </div>
      </div>

      {/* Modals */}
      {gradeModalData && (
        <GradeExplanationModal 
          onClose={() => setGradeModalData(null)}
          tier={gradeModalData.tier}
          er={gradeModalData.er}
          authDetails={gradeModalData.authDetails}
        />
      )}
      {authModalData && (
        <AuthenticityModal 
          onClose={() => setAuthModalData(null)}
          authenticityScore={authModalData.authenticityScore}
          authDetails={authModalData.authDetails}
        />
      )}
      {campaignModalData && (
        <CampaignSuitabilityModal 
          onClose={() => setCampaignModalData(null)}
          campaignResults={campaignModalData.results}
        />
      )}
      {marketModalData && (
        <MarketSuitabilityModal 
          onClose={() => setMarketModalData(null)}
          user={marketModalData.user}
          isActive={marketModalData.isActive}
          avgCycle={marketModalData.avgCycle}
          tier={marketModalData.tier}
        />
      )}
      {fakeModalData && (
        <FakeAccountModal 
          onClose={() => setFakeModalData(null)}
          authDetails={fakeModalData.authDetails}
          tier={fakeModalData.tier}
        />
      )}
    </>
  );
}
