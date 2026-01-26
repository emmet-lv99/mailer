"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { historyService } from "@/services/history/api";
import { youtubeService } from "@/services/youtube/api";
import { YouTubeChannel } from "@/services/youtube/types";
import { CheckSquare, Download, Loader2, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { YouTubeChannelRow } from "./components/YouTubeChannelRow";

export default function ExplorerPage() {
  const [query, setQuery] = useState("");
  const [minSubs, setMinSubs] = useState("");
  const [maxSubs, setMaxSubs] = useState("");
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [sentChannelIds, setSentChannelIds] = useState<Set<string>>(new Set());
  const [channelStatuses, setChannelStatuses] = useState<Record<string, string>>({}); 
  const [filterType, setFilterType] = useState<string>("all");
  const [emails, setEmails] = useState<Record<string, string>>({});

  const checkSentHistory = async (candidates: YouTubeChannel[]) => {
    if (candidates.length === 0) return;
    try {
      const ids = candidates.map(c => c.id);
      const data = await historyService.checkSentHistory(ids);
      
      if (data.channelStatusMap) {
          setChannelStatuses(prev => ({ ...prev, ...data.channelStatusMap }));
      }

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
          checkSentHistory(newChannels);
          return [...prev, ...newChannels];
        });
      } else {
        setChannels(data.channels);
        checkSentHistory(data.channels);
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
    setSentChannelIds(new Set()); 
    setChannelStatuses({}); 
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
    const visibleChannels = getFilteredChannels();
    const allSelected = visibleChannels.length > 0 && visibleChannels.every(c => selectedChannelIds.has(c.id));

    if (allSelected) {
      const newSelected = new Set(selectedChannelIds);
      visibleChannels.forEach(c => newSelected.delete(c.id));
      setSelectedChannelIds(newSelected);
    } else {
      const newSelected = new Set(selectedChannelIds);
      visibleChannels.forEach(c => newSelected.add(c.id));
      setSelectedChannelIds(newSelected);
    }
  };

  const handleEmailChange = (channelId: string, email: string) => {
    setEmails(prev => ({ ...prev, [channelId]: email }));
  };

  const handleMarkUnsuitable = async () => {
    if (selectedChannelIds.size === 0) return;

    const selectedChannels = channels.filter(c => selectedChannelIds.has(c.id));
    const logs = selectedChannels.map(c => ({
      channel_id: c.id,
      channel_name: c.title,
      status: 'unsuitable',
      source: 'system'
    }));

    setLoading(true);
    try {
      await historyService.createHistory(logs);
      toast.success(`${selectedChannelIds.size}개 채널이 부적합으로 등록되었습니다.`);
      
      const newStatuses = { ...channelStatuses };
      selectedChannelIds.forEach(id => {
        newStatuses[id] = 'unsuitable';
      });
      setChannelStatuses(newStatuses);
      
      setSentChannelIds(prev => {
        const next = new Set(prev);
        selectedChannelIds.forEach(id => next.add(id));
        return next;
      });

      setSelectedChannelIds(new Set());
    } catch (error: any) {
      console.error(error);
      toast.error("부적합 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    if (selectedChannelIds.size === 0) {
      toast.error("선택된 채널이 없습니다.");
      return;
    }

    const selectedChannels = channels.filter(c => selectedChannelIds.has(c.id));
    
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
      `"${(c.title || "").replace(/"/g, '""')}"`,
      emails[c.id] || "",
      c.statistics?.subscriberCount || "0",
      c.id,
      `https://www.youtube.com/channel/${c.id}`,
      `"${(c.description || "").replace(/"/g, '""').replace(/\n/g, ' ')}"`,
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

  const getFilteredChannels = () => {
    return channels.filter(channel => {
      const status = channelStatuses[channel.id];
      if (filterType === "sendable") {
        return status !== 'sent' && status !== 'unsuitable';
      }
      if (filterType === "sent") {
        return status === 'sent';
      }
      if (filterType === "unsuitable") {
        return status === 'unsuitable';
      }
      return true;
    });
  };

  const filteredChannels = getFilteredChannels();

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

          <Button onClick={handleSearch} disabled={loading} className="w-full md:w-auto self-end">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "검색"}
          </Button>
        </div>
      </Card>

      {channels.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              총 {filteredChannels.length}개 채널 검색됨
              {filterType !== "all" && channels.length !== filteredChannels.length && (
                  <span className="ml-1 text-xs">({channels.length - filteredChannels.length}개 필터링됨)</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Select 
                value={filterType} 
                onValueChange={setFilterType}
              >
                <SelectTrigger className="w-[180px] h-9">
                  <SelectValue placeholder="필터 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">모든 채널 보기</SelectItem>
                  <SelectItem value="sendable">전송 가능 목록</SelectItem>
                  <SelectItem value="sent">발송됨 목록</SelectItem>
                  <SelectItem value="unsuitable">부적합 목록</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={toggleSelectAll}>
                 전체 선택/해제
              </Button>
              <Button 
                variant="secondary"
                size="sm" 
                onClick={handleMarkUnsuitable} 
                disabled={selectedChannelIds.size === 0 || loading}
              >
                부적합 추가 ({selectedChannelIds.size})
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
                      <CheckSquare className="h-4 w-4 text-muted-foreground" />
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
                {filteredChannels.length === 0 ? (
                    <tr>
                        <td colSpan={7} className="p-8 text-center text-muted-foreground">
                            필터링된 결과가 없습니다.
                        </td>
                    </tr>
                ) : (
                  filteredChannels.map((channel) => (
                    <YouTubeChannelRow
                      key={channel.id}
                      channel={channel}
                      isSelected={selectedChannelIds.has(channel.id)}
                      status={channelStatuses[channel.id]}
                      email={emails[channel.id] || ""}
                      filterType={filterType}
                      onToggleSelect={toggleSelect}
                      onEmailChange={handleEmailChange}
                    />
                  ))
                )}
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
