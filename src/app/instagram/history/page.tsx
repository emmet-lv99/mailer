
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { instagramService } from "@/services/instagram/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ArrowLeft, CalendarIcon, ChevronDown, ChevronRight, ExternalLink, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";
import { toast } from "sonner";

export default function InstagramHistoryPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [viewAnalysisUser, setViewAnalysisUser] = useState<any | null>(null);
    const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

    const fetchHistory = async () => {
        // ... (unchanged)
        setLoading(true);
        try {
            const data = await instagramService.getHistory();
            setUsers(data.results);
        } catch (error) {
            toast.error("데이터를 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const toggleExpand = (username: string) => {
        const newSet = new Set(expandedUsers);
        if (newSet.has(username)) {
            newSet.delete(username);
        } else {
            newSet.add(username);
        }
        setExpandedUsers(newSet);
    };

    // ... (previous handlers unchanged)
    const handleStatusChange = async (username: string, newStatus: string) => {
        try {
            setUsers(prev => prev.map(u => u.username === username ? { ...u, status: newStatus } : u));
            await instagramService.updateStatus(username, newStatus);
            toast.success("상태가 변경되었습니다.");
        } catch (error) {
            toast.error("변경 실패");
            fetchHistory();
        }
    };

    const handleMemoChange = async (username: string, newMemo: string) => {
        try {
            setUsers(prev => prev.map(u => u.username === username ? { ...u, memo: newMemo } : u));
            await instagramService.updateMemo(username, newMemo);
            toast.success("메모가 저장되었습니다.");
        } catch (error: any) {
            // toast.error("메모 저장 실패");
        }
    };

    const handleDmDateChange = async (username: string, date: Date | undefined) => {
        try {
            const dateStr = date ? date.toISOString() : null;
            setUsers(prev => prev.map(u => u.username === username ? { ...u, dm_sent_date: dateStr } : u));
            await instagramService.updateDmDate(username, dateStr);
            toast.success("DM 발송일이 저장되었습니다.");
        } catch (error) {
            toast.error("저장 실패");
        }
    };

    const handleDelete = async (username: string) => {
         if (!confirm(`${username}님을 목록에서 삭제하시겠습니까?`)) return;
        try {
            setUsers(prev => prev.filter(u => u.username !== username));
            await instagramService.deleteUser(username);
            toast.success("삭제되었습니다.");
        } catch (error) {
            toast.error("삭제 실패");
            fetchHistory();
        }
    };

    const filteredUsers = filter === "all" ? users : users.filter(u => u.status === filter);

    return (
        <div className="container mx-auto p-6 flex flex-col gap-6">
             {/* Header unchanged */}
             <header className="flex items-center justify-between pb-6 border-b">
                <div className="flex items-center gap-4">
                    <Link href="/instagram/search">
                         <Button variant="ghost" size="icon">
                             <ArrowLeft className="h-5 w-5" />
                         </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">발송 이력 관리</h1>
                        <p className="text-muted-foreground">
                            등록된 인플루언서 <span className="font-bold text-primary">{users.length}명</span>을 관리합니다.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="상태 필터" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">전체 보기</SelectItem>
                            <SelectItem value="todo">관리중 (Todo)</SelectItem>
                            <SelectItem value="sent">발송 완료</SelectItem>
                            <SelectItem value="replied">회신 받음</SelectItem>
                            <SelectItem value="ignored">제외됨</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={fetchHistory}>
                        새로고침
                    </Button>
                </div>
            </header>

            <Card>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="w-[250px]">인플루언서</TableHead>
                            <TableHead className="w-[100px]">팔로워</TableHead>
                            <TableHead className="w-[120px]">점수</TableHead>
                            <TableHead>DM 발송일</TableHead>
                            <TableHead className="w-[140px]">상태</TableHead>
                            <TableHead className="text-right w-[60px]">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             <TableRow>
                                 <TableCell colSpan={7} className="h-32 text-center">
                                     <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                 </TableCell>
                             </TableRow>
                        ) : filteredUsers.length === 0 ? (
                             <TableRow>
                                 <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                     데이터가 없습니다.
                                 </TableCell>
                             </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <Fragment key={user.username}>
                                <TableRow className={expandedUsers.has(user.username) ? "bg-muted/50 border-b-0" : ""}>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleExpand(user.username)}>
                                            {expandedUsers.has(user.username) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
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
                                                    onSelect={(date) => handleDmDateChange(user.username, date)}
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </TableCell>
                                    <TableCell>
                                        <Select 
                                            defaultValue={user.status || 'todo'} 
                                            onValueChange={(val) => handleStatusChange(user.username, val)}
                                        >
                                            <SelectTrigger className={`w-[130px] h-8 text-xs ${
                                                user.status === 'sent' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                user.status === 'replied' ? 'bg-green-50 text-green-700 border-green-200' :
                                                user.status === 'ignored' ? 'bg-gray-100 text-gray-500' : ''
                                            }`}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="todo">📝 관리중</SelectItem>
                                                <SelectItem value="sent">📨 발송 완료</SelectItem>
                                                <SelectItem value="replied">💌 회신 받음</SelectItem>
                                                <SelectItem value="ignored">🚫 제외됨</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-muted-foreground hover:text-red-600"
                                            onClick={() => handleDelete(user.username)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {expandedUsers.has(user.username) && (
                                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                                        <TableCell colSpan={7} className="p-4 pt-0">
                                            <div className="grid grid-cols-2 gap-6 p-4 bg-background rounded-md border shadow-sm">
                                                <div className="space-y-4">
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
                                                                    handleMemoChange(user.username, e.target.value);
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
                                                        <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setViewAnalysisUser(user)}>개별 뷰 보기</Button>
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
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Modal remains for detailed view if needed */}
             <Dialog open={!!viewAnalysisUser} onOpenChange={(open) => !open && setViewAnalysisUser(null)}>
                {/* ... (modal content same as before) */}
                <DialogContent className="max-w-2xl">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="flex items-center gap-2 text-2xl">
                            @{viewAnalysisUser?.username} <span className="text-lg font-normal text-muted-foreground">분석 결과</span>
                        </DialogTitle>
                        <DialogDescription>
                            AI가 분석한 인플루언서의 상세 리포트입니다.
                        </DialogDescription>
                    </DialogHeader>
                    {viewAnalysisUser && (
                        <div className="space-y-6">
                             <div className="flex items-center justify-between bg-muted/30 p-4 rounded-lg border">
                                <div className="flex items-center gap-4">
                                     <div className="w-16 h-16 rounded-full bg-muted overflow-hidden border">
                                        {viewAnalysisUser.profile_pic_url ? (
                                            <img src={`/api/image-proxy?url=${encodeURIComponent(viewAnalysisUser.profile_pic_url)}`} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">👤</div>
                                        )}
                                     </div>
                                     <div>
                                         <div className="font-bold text-lg">{viewAnalysisUser.full_name}</div>
                                         <div className="text-sm text-muted-foreground">{viewAnalysisUser.followers_count?.toLocaleString()} 팔로워</div>
                                     </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-muted-foreground uppercase font-bold tracking-wider">독창성 점수</div>
                                    <div className="text-4xl font-extrabold text-primary">{viewAnalysisUser.originality_score}<span className="text-lg text-muted-foreground font-medium">/10</span></div>
                                </div>
                             </div>
                            <div>
                                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">키워드</h4>
                                <div className="flex flex-wrap gap-2">
                                    {viewAnalysisUser.mood_keywords && Array.isArray(viewAnalysisUser.mood_keywords) ? (
                                        viewAnalysisUser.mood_keywords.map((k: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="px-3 py-1">
                                                #{k}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-muted-foreground">키워드 없음</span>
                                    )}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 text-sm text-muted-foreground">AI 분석 요약</h4>
                                <div className="bg-slate-50 dark:bg-slate-900 border p-4 rounded-md text-sm leading-relaxed whitespace-pre-wrap h-[200px] overflow-y-auto">
                                    {viewAnalysisUser.analysis_summary}
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
