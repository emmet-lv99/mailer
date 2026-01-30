"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { TableCell, TableRow } from "@/components/ui/table";
import { YouTubeChannel } from "@/services/youtube/types";
import { Youtube } from "lucide-react";
import { toast } from "sonner";

interface YouTubeChannelRowProps {
  channel: YouTubeChannel;
  isSelected: boolean;
  status: string | undefined;
  email: string;
  filterType: string;
  onToggleSelect: (id: string) => void;
  onEmailChange: (id: string, email: string) => void;
  isSaved: boolean;
}

export function YouTubeChannelRow({
  channel,
  isSelected,
  status,
  email,
  filterType,
  onToggleSelect,
  onEmailChange,
  isSaved
}: YouTubeChannelRowProps) {
  const isInHistory = !!status;

  const formatNumber = (numStr?: string) => {
    if (!numStr) return "0";
    return parseInt(numStr).toLocaleString();
  };

  return (
    <TableRow
      className={`transition-colors hover:bg-muted/50 ${isSelected ? "bg-muted/50" : ""} ${isInHistory ? "opacity-60 bg-muted/30" : ""}`}
      onClick={() => {
         if (!isInHistory) onToggleSelect(channel.id);
         else if (filterType === "all") toast.warning("이미 이력이 있는 채널입니다.");
      }}
    >
      <TableCell className="w-[50px]">
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            disabled={isInHistory}
            onCheckedChange={() => onToggleSelect(channel.id)}
            aria-label={`${channel.title} 선택`}
          />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <img 
              src={channel.thumbnailUrl} 
              alt={channel.title} 
              className="h-10 w-10 rounded-full object-cover border"
            />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-semibold text-sm line-clamp-1">
                {channel.title}
              </span>
              {status === 'sent' && (
                <Badge variant="outline" className="text-[9px] h-4 px-1 bg-yellow-50 text-yellow-700 border-yellow-200 uppercase font-bold">
                  SENT
                </Badge>
              )}
              {status === 'unsuitable' && (
                <Badge variant="outline" className="text-[9px] h-4 px-1 bg-red-50 text-red-700 border-red-200 uppercase font-bold">
                  BAD
                </Badge>
              )}
              {status === 'draft' && (
                <Badge variant="outline" className="text-[9px] h-4 px-1 bg-gray-50 text-gray-700 border-gray-200 uppercase font-bold">
                  DRAFT
                </Badge>
              )}
              {isSaved && (
                <Badge variant="secondary" className="text-[9px] h-4 px-1 bg-blue-50 text-blue-700 border-blue-200 font-bold whitespace-nowrap">
                  임시저장
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground line-clamp-1">{channel.description || "설명 없음"}</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="w-[200px]" onClick={(e) => e.stopPropagation()}>
        <Input 
          placeholder="이메일 입력" 
          value={email}
          onChange={(e) => onEmailChange(channel.id, e.target.value)}
          className="h-8 text-xs bg-background/50 focus:bg-background transition-colors"
        />
      </TableCell>
      <TableCell className="font-semibold text-right tabular-nums">
        {formatNumber(channel.statistics?.subscriberCount)}
      </TableCell>
      <TableCell className="hidden md:table-cell text-right text-muted-foreground tabular-nums">
        {formatNumber(channel.statistics?.videoCount)}
      </TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground text-center text-[11px]">
        {new Date(channel.publishedAt).toLocaleDateString()}
      </TableCell>
      <TableCell className="text-right">
        <a 
          href={`https://www.youtube.com/channel/${channel.id}`} 
          target="_blank" 
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0 text-red-600/70 hover:text-red-600"
          onClick={(e) => e.stopPropagation()}
        >
          <Youtube className="h-5 w-5" />
        </a>
      </TableCell>
    </TableRow>
  );
}
