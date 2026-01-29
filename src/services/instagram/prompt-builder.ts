import { BrutalUserPromptParams } from "@/app/instagram/types";

export function buildBrutalUserPrompt(params: BrutalUserPromptParams): string {
  const { username, fullName, biography, followers, metrics, trendMetrics, postsData } = params;
  
  // 게시글 텍스트 구성
  const postsText = postsData.map((post, i) => {
    const commentsText = post.comments
      .slice(0, 20)
      .map((c, j) => `${j + 1}. @${c.username}: "${c.text}"${c.likes ? ` (${c.likes} 좋아요)` : ''}`)
      .join('\n');
    
    return `
게시글 #${i + 1}:
캡션: ${post.caption || '(없음)'}
해시태그: ${post.hashtags?.join(', ') || '(없음)'}
댓글 수: ${post.comments.length}개

댓글 샘플:
${commentsText || '(댓글 없음)'}`;
  }).join('\n\n---\n');

  // 트렌드 분석 섹션 (전체 수집 게시물 기반)
  const trendText = trendMetrics ? `
**트렌드 분석 (${trendMetrics.totalPosts}개 게시물 기반):**
- ER 추세: ${trendMetrics.erTrend === 'rising' ? '📈 상승' : trendMetrics.erTrend === 'declining' ? '📉 하락' : '➡️ 유지'} (${trendMetrics.erChangePercent > 0 ? '+' : ''}${trendMetrics.erChangePercent}%)
- 구간별 ER:
  - 최근 구간 (${Math.floor(trendMetrics.totalPosts / 3)}개): ${trendMetrics.periodComparison.recent.er.toFixed(2)}% (좋아요 평균 ${trendMetrics.periodComparison.recent.avgLikes}개)
  - 중간 구간 (${Math.floor(trendMetrics.totalPosts / 3)}개): ${trendMetrics.periodComparison.middle.er.toFixed(2)}% (좋아요 평균 ${trendMetrics.periodComparison.middle.avgLikes}개)
  - 이전 구간 (${trendMetrics.totalPosts - Math.floor(trendMetrics.totalPosts / 3) * 2}개): ${trendMetrics.periodComparison.oldest.er.toFixed(2)}% (좋아요 평균 ${trendMetrics.periodComparison.oldest.avgLikes}개)
- 평균 업로드 주기: ${trendMetrics.avgUploadFrequency}일
` : '';

  // 최적화된 프롬프트 (Data Only)
  return `## 투자심사 대상 인플루언서

**기본 정보:**
- Username: @${username}
- 이름: ${fullName || '미공개'}
- 바이오: ${biography || '없음'}
- 팔로워: ${followers.toLocaleString()}명
- 티어: ${metrics.tier}

**정량 분석 (시스템 계산):**
- Engagement Rate: ${metrics.engagementRate.toFixed(2)}%
- ER 등급: ${metrics.erGrade || '미산정'}
- 신뢰도 점수: ${metrics.authenticityScore}/100
- 가짜 의심: ${metrics.isFake ? '예 ⚠️' : '아니오'}
- 활동 상태: ${metrics.isActive ? '활성' : '비활성'}
- 업로드 주기: ${metrics.avgUploadCycle !== null ? metrics.avgUploadCycle + '일' : '측정 불가'}
- 시장 기준: ${metrics.marketSuitable ? '충족 ✓' : '미달 ✗'}
${trendText}
**캠페인 적합도 (시스템 계산):**
- 협찬: ${metrics.campaignSuitability.sponsorship.grade}급 (${metrics.campaignSuitability.sponsorship.score}점)
- 유료 광고: ${metrics.campaignSuitability.paidAd.grade}급 (${metrics.campaignSuitability.paidAd.score}점)
- 공동구매: ${metrics.campaignSuitability.coPurchase.grade}급 (${metrics.campaignSuitability.coPurchase.score}점)

**게시글 데이터 (최근 10개):**
${postsText}`;
}
