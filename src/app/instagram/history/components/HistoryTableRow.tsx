"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon, ChevronDown, ChevronRight, ExternalLink, Trash2 } from "lucide-react";
import { Fragment } from "react";

interface HistoryUser {
  username: string;
  full_name: string;
  profile_pic_url?: string;
  followers_count: number;
  originality_score?: number;
  dm_sent_date?: string;
  status?: string;
  memo?: string;
  category?: string;
  mood_keywords?: string[];
  analysis_summary?: string;
}

interface HistoryTableRowProps {
  user: HistoryUser;
  isExpanded: boolean;
  isSelected: boolean;
  onToggleExpand: (username: string) => void;
  onToggleSelect: (username: string) => void;
  onStatusChange: (username: string, status: string) => void;
  onMemoChange: (username: string, memo: string) => void;
  onDmDateChange: (username: string, date: Date | undefined) => void;
  onDelete: (username: string) => void;
  onViewAnalysis: (user: HistoryUser) => void;
}

export function HistoryTableRow({
  user,
  isExpanded,
  isSelected,
  onToggleExpand,
  onToggleSelect,
  onStatusChange,
  onMemoChange,
  onDmDateChange,
  onDelete,
  onViewAnalysis
}: HistoryTableRowProps) {
  return (
    <Fragment>
      <TableRow className={isExpanded ? "bg-muted/50 border-b-0" : ""}>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(user.username)}
            aria-label={`${user.username} 선택`}
          />
        </TableCell>
        <TableCell>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleExpand(user.username)}>
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden border shrink-0">
              {user.profile_pic_url ? (
                <img src={`/api/image-proxy?url=${encodeURIComponent(user.profile_pic_url)}`} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">👤</div>
              )}
            </div>
            <div className="overflow-hidden">
              <div className="font-medium truncate">{user.full_name}</div>
              <a href={`https://instagram.com/${user.username}`} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:text-primary hover:underline flex items-center gap-1">
                @{user.username} <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </TableCell>
        <TableCell>
          {user.followers_count === -1 ? '-' : user.followers_count?.toLocaleString()}
        </TableCell>
        <TableCell>
          <span className={`font-bold ${
            (user.originality_score || 0) >= 8 ? 'text-primary' : (user.originality_score || 0) >= 5 ? 'text-yellow-600' : 'text-gray-400'
          }`}>
            {user.originality_score || 0}<span className="text-xs text-muted-foreground font-normal">/10</span>
          </span>
        </TableCell>
        <TableCell>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[130px] justify-start text-left font-normal h-8 text-xs",
                  !user.dm_sent_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {user.dm_sent_date ? format(new Date(user.dm_sent_date), "PPP", { locale: ko }) : <span>선택 안함</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={user.dm_sent_date ? new Date(user.dm_sent_date) : undefined}
                onSelect={(date) => onDmDateChange(user.username, date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </TableCell>
        <TableCell>
          <Select 
            defaultValue={user.status || 'todo'} 
            onValueChange={(val) => onStatusChange(user.username, val)}
          >
            <SelectTrigger className={`w-[130px] h-8 text-xs ${
              user.status === 'sent' ? 'bg-blue-50 text-blue-700 border-blue-200' :
              user.status === 'replied' ? 'bg-green-50 text-green-700 border-green-200' :
              user.status === 'unsuitable' ? 'bg-red-50 text-red-700 border-red-200' : ''
            }`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">📝 관리중</SelectItem>
              <SelectItem value="sent">📨 발송 완료</SelectItem>
              <SelectItem value="replied">💌 회신 받음</SelectItem>
              <SelectItem value="unsuitable">❌ 부적합</SelectItem>
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <input 
            type="text" 
            className="w-full bg-transparent border rounded-md px-2 py-1 text-xs focus:border-primary focus:outline-none transition-colors h-8"
            placeholder="메모 입력..." 
            defaultValue={user.memo || ""}
            onBlur={(e) => {
              if (e.target.value !== user.memo) {
                onMemoChange(user.username, e.target.value);
              }
            }}
          />
        </TableCell>
        <TableCell className="text-right">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-red-600"
            onClick={() => onDelete(user.username)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableCell colSpan={9} className="p-4 pt-0">
            <div className="grid grid-cols-2 gap-6 p-4 bg-background rounded-md border shadow-sm">
              <div className="space-y-4">
                <div>
                  <h4 className="flex items-center gap-2 font-semibold mb-2 text-sm text-foreground">
                    🏷️ 카테고리 (Category)
                  </h4>
                  <div className="flex items-center">
                    {user.category ? (
                      <Badge variant="secondary" className="px-3 py-1 text-sm bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                        {user.category}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 font-semibold mb-2 text-sm text-foreground">
                    📝 메모 (Memo)
                  </h4>
                  <input 
                    type="text" 
                    className="w-full bg-muted/30 border rounded-md px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors"
                    placeholder="특이사항이나 메모를 입력하세요..." 
                    defaultValue={user.memo || ""}
                    onBlur={(e) => {
                      if (e.target.value !== user.memo) {
                        onMemoChange(user.username, e.target.value);
                      }
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm text-foreground">mood Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.mood_keywords && Array.isArray(user.mood_keywords) ? (
                      user.mood_keywords.map((k: string, i: number) => (
                        <Badge key={i} variant="outline" className="px-2 py-0.5 text-xs">
                          #{k}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">키워드 없음</span>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm text-foreground">AI 분석 요약</h4>
                  <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => onViewAnalysis(user)}>개별 뷰 보기</Button>
                </div>
                <div className="bg-muted/30 border rounded-md p-3 text-xs leading-relaxed text-muted-foreground h-[120px] overflow-y-auto whitespace-pre-wrap">
                  {user.analysis_summary || "분석 내용이 없습니다."}
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </Fragment>
  );
}
