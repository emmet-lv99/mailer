"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { YouTubeChannel } from "@/types/youtube";
import { CheckSquare, Download, Loader2, Search, Square, Youtube } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function ExplorerPage() {
  const [query, setQuery] = useState("");
  const [minSubs, setMinSubs] = useState("");
  const [maxSubs, setMaxSubs] = useState("");
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);

  const searchChannels = async (pageToken?: string) => {
    if (!query.trim()) {
      toast.error("검색어를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query,
        minSubs: minSubs || "0",
        maxSubs: maxSubs || "",
      });
      if (pageToken) params.append("pageToken", pageToken);

      const res = await fetch(`/api/youtube/search?${params.toString()}`);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "검색 중 오류가 발생했습니다.");
      }

      const data = await res.json();
      
      if (pageToken) {
        setChannels(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newChannels = data.channels.filter((c: YouTubeChannel) => !existingIds.has(c.id));
          return [...prev, ...newChannels];
        });
      } else {
        setChannels(data.channels);
      }
      setNextPageToken(data.nextPageToken || null);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setChannels([]);
    setNextPageToken(null);
    searchChannels();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const toggleSelect = (channelId: string) => {
    const newSelected = new Set(selectedChannelIds);
    if (newSelected.has(channelId)) {
      newSelected.delete(channelId);
    } else {
      newSelected.add(channelId);
    }
    setSelectedChannelIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedChannelIds.size === channels.length && channels.length > 0) {
      setSelectedChannelIds(new Set());
    } else {
      const newSelected = new Set(channels.map(c => c.id));
      setSelectedChannelIds(newSelected);
    }
  };

  const downloadCsv = () => {
    if (selectedChannelIds.size === 0) {
      toast.error("선택된 채널이 없습니다.");
      return;
    }

    const selectedChannels = channels.filter(c => selectedChannelIds.has(c.id));
    
    // CSV Header: Channel Name, Subscriber Count, Channel ID, Channel URL
    const headers = ["Channel Name", "Subscribers", "Channel ID", "Channel URL"];
    const rows = selectedChannels.map(c => [
      c.title.replace(/,/g, ""), // Remove commas to prevent CSV issues
      c.statistics?.subscriberCount || "0",
      c.id,
      `https://www.youtube.com/channel/${c.id}`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `youtube_channels_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatNumber = (numStr?: string) => {
    if (!numStr) return "0";
    return parseInt(numStr).toLocaleString();
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-6xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">유튜브 채널 탐색기</h1>
        <p className="text-muted-foreground">
          키워드로 유튜브 채널을 검색하고 구독자 수로 필터링하여 리스트를 수집하세요.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="grid gap-2 flex-1 w-full">
            <label className="text-sm font-medium">검색어</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="예: 요리, 게임, 브이로그"
                className="pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          
          <div className="grid gap-2 w-full md:w-48">
            <label className="text-sm font-medium">최소 구독자 수</label>
            <Input
              type="number"
              placeholder="0"
              value={minSubs}
              onChange={(e) => setMinSubs(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="grid gap-2 w-full md:w-48">
            <label className="text-sm font-medium">최대 구독자 수</label>
            <Input
              type="number"
              placeholder="제한 없음"
              value={maxSubs}
              onChange={(e) => setMaxSubs(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "검색"}
          </Button>
        </div>
      </Card>

      {channels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              총 {channels.length}개 채널 검색됨
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                {selectedChannelIds.size === channels.length ? "전체 해제" : "전체 선택"}
              </Button>
              <Button size="sm" onClick={downloadCsv} disabled={selectedChannelIds.size === 0}>
                <Download className="mr-2 h-4 w-4" />
                CSV 다운로드 ({selectedChannelIds.size})
              </Button>
            </div>
          </div>

          <div className="border rounded-md">
            <table className="w-full caption-bottom text-sm text-left">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[50px]">
                    <div 
                      className="cursor-pointer"
                      onClick={toggleSelectAll}
                    >
                      {selectedChannelIds.size === channels.length && channels.length > 0 ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">채널</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">구독자</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">동영상</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground hidden md:table-cell">개설일</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground text-right">링크</th>
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {channels.map((channel) => {
                  const isSelected = selectedChannelIds.has(channel.id);
                  return (
                    <tr 
                      key={channel.id} 
                      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${isSelected ? "bg-muted/50" : ""}`}
                      onClick={() => toggleSelect(channel.id)}
                    >
                      <td className="p-4 align-middle">
                        <div className="cursor-pointer">
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : (
                            <Square className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <div className="flex items-center gap-3">
                          <img 
                            src={channel.thumbnailUrl} 
                            alt={channel.title} 
                            className="h-10 w-10 rounded-full object-cover border"
                          />
                          <div className="flex flex-col">
                            <span className="font-medium line-clamp-1">{channel.title}</span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{channel.description || "설명 없음"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle font-medium">
                        {formatNumber(channel.statistics?.subscriberCount)}
                      </td>
                      <td className="p-4 align-middle hidden md:table-cell">
                        {formatNumber(channel.statistics?.videoCount)}
                      </td>
                      <td className="p-4 align-middle text-muted-foreground hidden md:table-cell">
                        {new Date(channel.publishedAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <a 
                          href={`https://www.youtube.com/channel/${channel.id}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 w-9 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Youtube className="h-4 w-4" />
                        </a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {nextPageToken && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={() => searchChannels(nextPageToken)} disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "더보기"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
