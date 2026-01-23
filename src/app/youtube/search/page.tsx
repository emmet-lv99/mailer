"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { historyService } from "@/services/history/api";
import { youtubeService } from "@/services/youtube/api";
import { YouTubeChannel } from "@/services/youtube/types";
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
  const [sentChannelIds, setSentChannelIds] = useState<Set<string>>(new Set());

  const checkSentHistory = async (candidates: YouTubeChannel[]) => {
    if (candidates.length === 0) return;
    try {
      const ids = candidates.map(c => c.id);
      const data = await historyService.checkSentHistory(ids);
      if (data.sentChannelIds) {
        setSentChannelIds(prev => {
          const next = new Set(prev);
          data.sentChannelIds.forEach((id: string) => next.add(id));
          return next;
        });
      }
    } catch (error) {
      console.error("History Check Failed:", error);
    }
  };

  const searchChannels = async (pageToken?: string) => {
    if (!query.trim()) {
      toast.error("검색어를 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const data = await youtubeService.search({
        q: query,
        minSubs,
        maxSubs,
        pageToken
      });
      
      if (pageToken) {
        setChannels(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const newChannels = data.channels.filter((c: YouTubeChannel) => !existingIds.has(c.id));
          checkSentHistory(newChannels); // Check history for new items
          return [...prev, ...newChannels];
        });
      } else {
        setChannels(data.channels);
        checkSentHistory(data.channels); // Check history for all items
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
    setSentChannelIds(new Set()); // Reset history
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

  const [emails, setEmails] = useState<Record<string, string>>({});

  const handleEmailChange = (channelId: string, email: string) => {
    setEmails(prev => ({ ...prev, [channelId]: email }));
  };

  const downloadCsv = () => {
    if (selectedChannelIds.size === 0) {
      toast.error("선택된 채널이 없습니다.");
      return;
    }

    const selectedChannels = channels.filter(c => selectedChannelIds.has(c.id));
    
    // Updated CSV Headers for Rich Data
    const headers = [
      "Channel Name", 
      "Email", 
      "Subscribers", 
      "Channel ID", 
      "Channel URL", 
      "Description", 
      "Video Count"
    ];

    const rows = selectedChannels.map(c => [
      `"${(c.title || "").replace(/"/g, '""')}"`, // Escape quotes
      emails[c.id] || "",
      c.statistics?.subscriberCount || "0",
      c.id,
      `https://www.youtube.com/channel/${c.id}`,
      `"${(c.description || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`, // Escape quotes & newlines
      c.statistics?.videoCount || "0"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `youtube_channels_rich_${new Date().getTime()}.csv`);
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
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[200px]">이메일</th>
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
                      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${isSelected ? "bg-muted/50" : ""} ${sentChannelIds.has(channel.id) ? "opacity-60 bg-gray-50/50" : ""}`}
                      onClick={() => {
                         if (!sentChannelIds.has(channel.id)) toggleSelect(channel.id);
                         else toast.warning("이미 이메일을 발송한 채널입니다.");
                      }}
                    >
                      <td className="p-4 align-middle">
                        <div className={`cursor-pointer ${sentChannelIds.has(channel.id) ? "cursor-not-allowed opacity-50" : ""}`}>
                          {isSelected ? (
                            <CheckSquare className="h-4 w-4 text-primary" />
                          ) : sentChannelIds.has(channel.id) ? (
                             <Square className="h-4 w-4 text-gray-300" />
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
                            <span className="font-medium line-clamp-1 flex items-center gap-2">
                              {channel.title}
                              {sentChannelIds.has(channel.id) && (
                                <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200">
                                  발송됨
                                </span>
                              )}
                            </span>
                            <span className="text-xs text-muted-foreground line-clamp-1">{channel.description || "설명 없음"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 align-middle" onClick={(e) => e.stopPropagation()}>
                        <Input 
                          placeholder="이메일 입력" 
                          value={emails[channel.id] || ""}
                          onChange={(e) => handleEmailChange(channel.id, e.target.value)}
                          className="h-8 text-xs"
                        />
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
