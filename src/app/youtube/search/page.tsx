"use client";

import { historyService } from "@/services/history/api";
import { youtubeService } from "@/services/youtube/api";
import { useYouTubeStore } from "@/services/youtube/store";
import { YouTubeChannel } from "@/services/youtube/types";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { YouTubeFilters } from "./components/YouTubeFilters";
import { YouTubeSearch } from "./components/YouTubeSearch";
import { YouTubeTable } from "./components/YouTubeTable";

export default function ExplorerPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<YouTubeChannel[]>([]);
  const [selectedChannelIds, setSelectedChannelIds] = useState<Set<string>>(new Set());
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [sentChannelIds, setSentChannelIds] = useState<Set<string>>(new Set());
  const [channelStatuses, setChannelStatuses] = useState<Record<string, string>>({}); 
  const [filterType, setFilterType] = useState<string>("all");
  const [minSubs, setMinSubs] = useState("");
  const [maxSubs, setMaxSubs] = useState("");
  const [emails, setEmails] = useState<Record<string, string>>({});

  const { downloadList, addToDownloadList, clearDownloadList } = useYouTubeStore();

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

  const handleToggleSelect = (channelId: string) => {
    const newSelected = new Set(selectedChannelIds);
    if (newSelected.has(channelId)) {
      newSelected.delete(channelId);
    } else {
      newSelected.add(channelId);
    }
    setSelectedChannelIds(newSelected);
  };

  const handleToggleSelectAll = () => {
    const visibleChannels = filteredChannels;
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

  const handleSaveToTemp = () => {
    const selectedChannels = channels.filter(c => selectedChannelIds.has(c.id));
    const itemsToSave = selectedChannels.map(channel => ({
      channel,
      email: emails[channel.id] || ""
    }));

    addToDownloadList(itemsToSave);
    toast.success(`${itemsToSave.length}개 채널이 임시 저장 공간에 추가되었습니다.`);
    setSelectedChannelIds(new Set()); // 선택 초기화
  };

  const handleDownloadCsv = () => {
    if (downloadList.length === 0) return;

    const headers = ["Channel Title", "Channel ID", "URL", "Subscribers", "Videos", "Email", "Description"];
    const rows = downloadList.map(item => [
      item.channel.title,
      item.channel.id,
      `https://www.youtube.com/channel/${item.channel.id}`,
      item.channel.statistics?.subscriberCount || "0",
      item.channel.statistics?.videoCount || "0",
      item.email,
      item.channel.description?.replace(/\n/g, " ") || ""
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `youtube_channels_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("CSV 파일이 다운로드되었습니다.");
  };

  const handleLoadMore = () => {
    searchChannels(nextPageToken || undefined);
  };

  const filteredChannels = useMemo(() => {
    return channels.filter(channel => {
      // 1. Status Filter
      const status = channelStatuses[channel.id];
      let matchesStatus = true;
      if (filterType === "sendable") {
        matchesStatus = status !== 'sent' && status !== 'unsuitable';
      } else if (filterType === "sent") {
        matchesStatus = status === 'sent';
      } else if (filterType === "unsuitable") {
        matchesStatus = status === 'unsuitable';
      }

      // 2. Subscriber Filter
      let matchesSubs = true;
      const subs = parseInt(channel.statistics?.subscriberCount || "0");
      const min = minSubs ? parseInt(minSubs) : null;
      const max = maxSubs ? parseInt(maxSubs) : null;

      if (min !== null && !isNaN(min) && subs < min) matchesSubs = false;
      if (max !== null && !isNaN(max) && subs > max) matchesSubs = false;

      return matchesStatus && matchesSubs;
    });
  }, [channels, channelStatuses, filterType, minSubs, maxSubs]);

  const savedChannelIds = useMemo(() => {
    return new Set(downloadList.map(item => item.channel.id));
  }, [downloadList]);

  // Reset all filters
  const handleResetFilters = () => {
    setFilterType("all");
    setMinSubs("");
    setMaxSubs("");
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-6xl">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">유튜브 채널 탐색기</h1>
        <p className="text-muted-foreground">
          키워드로 유튜브 채널을 검색하고 구독자 수로 필터링하여 리스트를 수집하세요.
        </p>
      </div>

      <YouTubeSearch
        query={query}
        setQuery={setQuery}
        onSearch={handleSearch}
        loading={loading}
      />

      {channels.length > 0 && (
        <div className="space-y-6">
          <YouTubeFilters
            filterType={filterType}
            setFilterType={setFilterType}
            minSubs={minSubs}
            setMinSubs={setMinSubs}
            maxSubs={maxSubs}
            setMaxSubs={setMaxSubs}
            onReset={handleResetFilters}
          />

          <YouTubeTable
            channels={channels}
            filteredChannels={filteredChannels}
            selectedChannelIds={selectedChannelIds}
            channelStatuses={channelStatuses}
            emails={emails}
            loading={loading}
            filterType={filterType}
            nextPageToken={nextPageToken}
            savedCount={downloadList.length}
            savedChannelIds={savedChannelIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onEmailChange={handleEmailChange}
            onMarkUnsuitable={handleMarkUnsuitable}
            onSaveToTemp={handleSaveToTemp}
            onDownloadCsv={handleDownloadCsv}
            onClearDownloadList={clearDownloadList}
            onLoadMore={handleLoadMore}
          />
        </div>
      )}
    </div>
  );
}
