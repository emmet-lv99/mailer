"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { instagramService } from "@/services/instagram/api";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AnalysisDialog } from "./components/AnalysisDialog";
import { HistoryTableRow } from "./components/HistoryTableRow";

export default function InstagramHistoryPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [viewAnalysisUser, setViewAnalysisUser] = useState<any | null>(null);
    const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
    const [selectedUsernames, setSelectedUsernames] = useState<Set<string>>(new Set());

    const fetchHistory = async () => {
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

    const toggleSelect = (username: string) => {
        const newSet = new Set(selectedUsernames);
        if (newSet.has(username)) {
            newSet.delete(username);
        } else {
            newSet.add(username);
        }
        setSelectedUsernames(newSet);
    };

    const toggleSelectAll = () => {
        const visibleUsernames = filteredUsers.map(u => u.username);
        const allSelected = visibleUsernames.length > 0 && visibleUsernames.every(u => selectedUsernames.has(u));
        
        if (allSelected) {
            const newSet = new Set(selectedUsernames);
            visibleUsernames.forEach(u => newSet.delete(u));
            setSelectedUsernames(newSet);
        } else {
            const newSet = new Set(selectedUsernames);
            visibleUsernames.forEach(u => newSet.add(u));
            setSelectedUsernames(newSet);
        }
    };

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
            // Silent fail for memo
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

    const getFilteredUsers = () => {
        if (filter === "all") return users;
        if (filter === "available") {
            return users.filter(u => u.status === 'todo' || !u.status);
        }
        return users.filter(u => u.status === filter);
    };

    const filteredUsers = getFilteredUsers();
    const isAllSelected = filteredUsers.length > 0 && filteredUsers.every(u => selectedUsernames.has(u.username));

    return (
        <div className="container mx-auto p-6 flex flex-col gap-6">
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
                            {selectedUsernames.size > 0 && (
                                <span className="ml-2 text-sm">
                                    (<span className="font-bold text-blue-600">{selectedUsernames.size}명</span> 선택됨)
                                </span>
                            )}
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
                            <SelectItem value="available">DM 가능 목록</SelectItem>
                            <SelectItem value="todo">관리중 (Todo)</SelectItem>
                            <SelectItem value="sent">발송 완료</SelectItem>
                            <SelectItem value="replied">회신 받음</SelectItem>
                            <SelectItem value="unsuitable">부적합</SelectItem>
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
                            <TableHead className="w-[50px]">
                                <Checkbox 
                                    checked={isAllSelected}
                                    onCheckedChange={toggleSelectAll}
                                    aria-label="전체 선택"
                                />
                            </TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead className="w-[250px]">인플루언서</TableHead>
                            <TableHead className="w-[100px]">팔로워</TableHead>
                            <TableHead className="w-[80px]">점수</TableHead>
                            <TableHead>DM 발송일</TableHead>
                            <TableHead className="w-[140px]">상태</TableHead>
                            <TableHead className="w-[200px]">메모</TableHead>
                            <TableHead className="text-right w-[60px]">관리</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                             <TableRow>
                                 <TableCell colSpan={9} className="h-32 text-center">
                                     <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                                 </TableCell>
                             </TableRow>
                        ) : filteredUsers.length === 0 ? (
                             <TableRow>
                                 <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                                     데이터가 없습니다.
                                 </TableCell>
                             </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <HistoryTableRow
                                    key={user.username}
                                    user={user}
                                    isExpanded={expandedUsers.has(user.username)}
                                    isSelected={selectedUsernames.has(user.username)}
                                    onToggleExpand={toggleExpand}
                                    onToggleSelect={toggleSelect}
                                    onStatusChange={handleStatusChange}
                                    onMemoChange={handleMemoChange}
                                    onDmDateChange={handleDmDateChange}
                                    onDelete={handleDelete}
                                    onViewAnalysis={setViewAnalysisUser}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            <AnalysisDialog 
                user={viewAnalysisUser} 
                open={!!viewAnalysisUser} 
                onOpenChange={(open) => !open && setViewAnalysisUser(null)} 
            />
        </div>
    );
}
