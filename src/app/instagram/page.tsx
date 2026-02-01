"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { format, subDays } from "date-fns";
import { Search, Send, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import useSWR from "swr";
import { StatsChart } from "./components/StatsChart";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InstagramDashboard() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const queryParams = new URLSearchParams();
  if (date?.from) queryParams.set("from", format(date.from, "yyyy-MM-dd"));
  if (date?.to) queryParams.set("to", format(date.to, "yyyy-MM-dd"));

  const { data, error, isLoading } = useSWR(
    `/api/instagram/stats?${queryParams.toString()}`,
    fetcher
  );

  if (isLoading) return <div className="p-8 text-center">대시보드 로드 중...</div>;
  if (error) return <div className="p-8 text-destructive text-center">에러 발생: {error.message}</div>;

  const { chartData, summary, userStats } = data || {};

  return (
    <div className="flex flex-col gap-8 p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight">인스타그램 대시보드</h1>
          <p className="text-muted-foreground">공구 제안 현황 및 활동 통계입니다.</p>
        </div>
        <div className="flex gap-4">
          <DateRangePicker date={date} setDate={setDate} />
          <Link href="/instagram/proposal">
            <Button variant="outline" className="gap-2">
              제안 관리 바로가기
            </Button>
          </Link>
          <Link href="/instagram/search">
            <Button className="gap-2">
              <Search className="w-4 h-4" />
              인플루언서 검색
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">기간 내 추가 인플루언서</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalAdded || 0}</div>
            <p className="text-xs text-muted-foreground">건</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">기간 내 공구 제안(Sent)</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary?.totalSent || 0}</div>
            <p className="text-xs text-muted-foreground">건</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7 border-t pt-8">
        <div className="md:col-span-4">
          <StatsChart data={chartData || []} />
        </div>
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>사용자별 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {userStats && Object.entries(userStats).map(([email, stats]: [string, any]) => (
                <div key={email} className="flex flex-col gap-2 p-3 border rounded-lg">
                  <div className="font-medium text-sm truncate mb-1" title={email}>
                    {email.split('@')[0]}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase text-muted-foreground font-semibold">인플루언서 추가</span>
                      <span className="text-lg font-bold">{stats.added}</span>
                    </div>
                    <div className="flex flex-col border-l pl-4">
                      <span className="text-[10px] uppercase text-muted-foreground font-semibold">공구 제안</span>
                      <span className="text-lg font-bold">{stats.sent}</span>
                    </div>
                  </div>
                </div>
              ))}
              {(!userStats || Object.keys(userStats).length === 0) && (
                <div className="text-sm text-center text-muted-foreground py-8">
                  활동 데이터가 없습니다.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
