"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { YouTubeChannel } from "@/services/youtube/types";
import { Download, Loader2 } from "lucide-react";
import { YouTubeChannelRow } from "./YouTubeChannelRow";

interface YouTubeTableProps {
  channels: YouTubeChannel[];
  filteredChannels: YouTubeChannel[];
  selectedChannelIds: Set<string>;
  channelStatuses: Record<string, string>;
  emails: Record<string, string>;
  loading: boolean;
  filterType: string;
  nextPageToken: string | null;
  savedCount: number;
  savedChannelIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onEmailChange: (id: string, email: string) => void;
  onMarkUnsuitable: () => void;
  onSaveToTemp: () => void;
  onDownloadCsv: () => void;
  onClearDownloadList: () => void;
  onLoadMore: () => void;
}

export function YouTubeTable({
  channels,
  filteredChannels,
  selectedChannelIds,
  channelStatuses,
  emails,
  loading,
  filterType,
  nextPageToken,
  savedCount,
  savedChannelIds,
  onToggleSelect,
  onToggleSelectAll,
  onEmailChange,
  onMarkUnsuitable,
  onSaveToTemp,
  onDownloadCsv,
  onClearDownloadList,
  onLoadMore,
}: YouTubeTableProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          총 {filteredChannels.length}개 채널 검색됨
          {channels.length !== filteredChannels.length && (
            <span className="ml-1 text-xs">
              ({channels.length - filteredChannels.length}개 필터링됨)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onToggleSelectAll}>
            전체 선택/해제
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={onMarkUnsuitable}
            disabled={selectedChannelIds.size === 0 || loading}
          >
            부적합 추가 ({selectedChannelIds.size})
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onSaveToTemp}
            disabled={selectedChannelIds.size === 0 || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            임시 저장 ({selectedChannelIds.size})
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            onClick={onDownloadCsv} 
            disabled={savedCount === 0}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <Download className="mr-2 h-4 w-4" />
            CSV 다운로드 ({savedCount})
          </Button>
          {savedCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearDownloadList}
              className="text-muted-foreground hover:text-destructive"
            >
              목록 비우기
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-md overflow-hidden bg-background shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px] text-center">
                <div className="flex items-center justify-center">
                  <Checkbox
                    checked={filteredChannels.length > 0 && filteredChannels.every(c => selectedChannelIds.has(c.id))}
                    onCheckedChange={onToggleSelectAll}
                    aria-label="모든 채널 선택"
                  />
                </div>
              </TableHead>
              <TableHead>채널</TableHead>
              <TableHead className="w-[200px]">이메일</TableHead>
              <TableHead className="text-right">구독자</TableHead>
              <TableHead className="hidden md:table-cell text-right">동영상</TableHead>
              <TableHead className="hidden md:table-cell text-center">개설일</TableHead>
              <TableHead className="text-right pr-4">링크</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChannels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-muted-foreground italic">
                  필터링된 결과가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filteredChannels.map((channel) => (
                <YouTubeChannelRow
                  key={channel.id}
                  channel={channel}
                  isSelected={selectedChannelIds.has(channel.id)}
                  status={channelStatuses[channel.id]}
                  email={emails[channel.id] || ""}
                  filterType={filterType}
                  isSaved={savedChannelIds.has(channel.id)}
                  onToggleSelect={onToggleSelect}
                  onEmailChange={onEmailChange}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {nextPageToken && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onLoadMore} disabled={loading} className="w-full md:w-32">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "더보기"}
          </Button>
        </div>
      )}
    </div>
  );
}
