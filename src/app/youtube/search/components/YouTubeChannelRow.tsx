"use client";

import { Input } from "@/components/ui/input";
import { YouTubeChannel } from "@/services/youtube/types";
import { CheckSquare, Square, Youtube } from "lucide-react";
import { toast } from "sonner";

interface YouTubeChannelRowProps {
  channel: YouTubeChannel;
  isSelected: boolean;
  status: string | undefined;
  email: string;
  filterType: string;
  onToggleSelect: (id: string) => void;
  onEmailChange: (id: string, email: string) => void;
}

export function YouTubeChannelRow({
  channel,
  isSelected,
  status,
  email,
  filterType,
  onToggleSelect,
  onEmailChange
}: YouTubeChannelRowProps) {
  const isInHistory = !!status;

  const formatNumber = (numStr?: string) => {
    if (!numStr) return "0";
    return parseInt(numStr).toLocaleString();
  };

  return (
    <tr 
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${isSelected ? "bg-muted/50" : ""} ${isInHistory ? "opacity-60 bg-gray-50/50" : ""}`}
      onClick={() => {
         if (!isInHistory) onToggleSelect(channel.id);
         else if (filterType === "all") toast.warning("이미 이력이 있는 채널입니다.");
      }}
    >
      <td className="p-4 align-middle">
        <div className={`cursor-pointer ${isInHistory ? "cursor-not-allowed opacity-50" : ""}`}>
          {isSelected ? (
            <CheckSquare className="h-4 w-4 text-primary" />
          ) : isInHistory ? (
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
              {status === 'sent' && (
                <span className="text-[10px] bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded border border-yellow-200 whitespace-nowrap">
                  발송됨
                </span>
              )}
              {status === 'unsuitable' && (
                <span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded border border-red-200 whitespace-nowrap">
                  부적합
                </span>
              )}
              {status === 'draft' && (
                <span className="text-[10px] bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded border border-gray-200 whitespace-nowrap">
                  임시저장
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
          value={email}
          onChange={(e) => onEmailChange(channel.id, e.target.value)}
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
}
