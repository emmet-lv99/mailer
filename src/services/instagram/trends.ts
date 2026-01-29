import { TrendMetrics } from "@/app/instagram/types";

interface PostForTrend {
  likes: number;
  comments: number;
  timestamp: string;
}

export function calculateERTrend(posts: PostForTrend[], followers: number): TrendMetrics | null {
  console.log(`[TrendMetrics] Calculating for ${posts.length} posts, followers: ${followers}`);
  
  if (posts.length < 10) {
    // 최소 10개 게시물 필요
    console.log(`[TrendMetrics] Not enough posts (${posts.length} < 10)`);
    return null;
  }

  // 3개 구간으로 동적 분할 (전체 데이터 활용)
  const segmentSize = Math.floor(posts.length / 3);
  const remainder = posts.length % 3;

  // 나머지 처리를 위해 구간별 크기 조정 (최근 게시물에 나머지 할당하지 않고 가장 과거에 할당하거나 등등. 여기서는 단순하게)
  // [Recent (size)] [Middle (size)] [Oldest (size + remainder)] 형태로 분할
  
  const recentPosts = posts.slice(0, segmentSize);
  const middlePosts = posts.slice(segmentSize, segmentSize * 2);
  const oldestPosts = posts.slice(segmentSize * 2);

  console.log(`[TrendMetrics] Segment Split: Recent(${recentPosts.length}), Middle(${middlePosts.length}), Oldest(${oldestPosts.length})`);

  // 구간별 ER 계산
  const calcPeriodMetrics = (periodPosts: PostForTrend[]) => {
    if (periodPosts.length === 0) return { er: 0, avgLikes: 0, avgComments: 0 };
    const totalLikes = periodPosts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalComments = periodPosts.reduce((sum, p) => sum + (p.comments || 0), 0);
    const avgLikes = totalLikes / periodPosts.length;
    const avgComments = totalComments / periodPosts.length;
    const er = followers > 0 ? ((avgLikes + avgComments) / followers) * 100 : 0;
    return { er, avgLikes, avgComments };
  };

  const recent = calcPeriodMetrics(recentPosts);
  const middle = calcPeriodMetrics(middlePosts);
  const oldest = calcPeriodMetrics(oldestPosts);

  // ER 추세 계산 (최근 vs 중간+이전 평균)
  const previousAvgER = middlePosts.length > 0 
    ? (middle.er + (oldestPosts.length > 0 ? oldest.er : middle.er)) / (oldestPosts.length > 0 ? 2 : 1)
    : 0;
  
  const erChangePercent = previousAvgER > 0 
    ? ((recent.er - previousAvgER) / previousAvgER) * 100 
    : 0;

  // 추세 판정
  let erTrend: 'rising' | 'stable' | 'declining';
  if (erChangePercent > 15) {
    erTrend = 'rising';
  } else if (erChangePercent < -15) {
    erTrend = 'declining';
  } else {
    erTrend = 'stable';
  }

  // 평균 업로드 주기 계산
  let avgUploadFrequency = 0;
  if (posts.length >= 2) {
    const timestamps = posts
      .map(p => new Date(p.timestamp).getTime())
      .filter(t => !isNaN(t))
      .sort((a, b) => b - a); // 최신순
    
    if (timestamps.length >= 2) {
      const totalDays = (timestamps[0] - timestamps[timestamps.length - 1]) / (1000 * 60 * 60 * 24);
      avgUploadFrequency = Math.round(totalDays / (timestamps.length - 1));
    }
  }

  return {
    erTrend,
    erChangePercent: Math.round(erChangePercent * 10) / 10,
    avgUploadFrequency,
    totalPosts: posts.length,
    periodComparison: {
      recent: { er: Math.round(recent.er * 100) / 100, avgLikes: Math.round(recent.avgLikes), avgComments: Math.round(recent.avgComments) },
      middle: { er: Math.round(middle.er * 100) / 100, avgLikes: Math.round(middle.avgLikes), avgComments: Math.round(middle.avgComments) },
      oldest: { er: Math.round(oldest.er * 100) / 100, avgLikes: Math.round(oldest.avgLikes), avgComments: Math.round(oldest.avgComments) }
    }
  };
}
