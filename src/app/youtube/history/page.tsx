"use client";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { downloadCSV } from "@/lib/csv";
import { historyService } from "@/services/history/api";
import { HistoryItem } from "@/services/history/types";
import { Download, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function HistoryPage() {
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showRepliedOnly, setShowRepliedOnly] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  
  // Delete Modal State
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);

  const handleDownloadCSV = () => {
    const csvData = filteredHistory.map((item, idx) => ({
      "No": history.length - idx,
      "채널명": item.channel_name,
      "채널 ID": item.channel_id,
      "이메일": item.email,
      "제목": item.subject,
      "발송일": item.sent_at ? new Date(item.sent_at).toLocaleDateString() : "-",
      "상태": item.status.toUpperCase(),
      "답변여부": item.has_replied ? "O" : "X",
      "비고": item.note || ""
    }));

    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(csvData, `유튜브_발송이력_${timestamp}.csv`);
  };

  // Reset selection when filters change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [showRepliedOnly, searchQuery, statusFilter]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await historyService.fetchHistory(showRepliedOnly, statusFilter);
      setHistory(data.history || []);
    } catch (error) {
      toast.error("이력을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [showRepliedOnly, statusFilter]);

  const toggleReplied = async (id: number, current: boolean) => {
    // Optimistic Update
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, has_replied: !current } : item
    ));

    try {
      await historyService.toggleReplied(id, !current);
    } catch (error) {
      toast.error("업데이트 실패");
      fetchHistory(); // Revert
    }
  };

  const handleNoteBlur = async (id: number, note: string) => {
    try {
      await historyService.updateNote(id, note);
      toast.success("비고 저장됨");
    } catch (error) {
      toast.error("비고 저장 실패");
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (history.find(h => h.id === id)?.status === newStatus) return;

    // Optimistic Update
    setHistory(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus } : item
    ));

    try {
      await historyService.updateStatus(id, newStatus);
      toast.success(`상태 변경됨: ${newStatus.toUpperCase()}`);
    } catch (error) {
      toast.error("상태 변경 실패");
      fetchHistory(); // Revert
    }
  };

  const toggleSelect = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) newSelected.delete(id);
    else newSelected.add(id);
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredHistory.length && filteredHistory.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredHistory.map(item => item.id)));
    }
  };

  const handleBulkUpdate = async (status: string) => {
    if (selectedIds.size === 0) return;
    
    const ids = Array.from(selectedIds);
    // Optimistic Update
    setHistory(prev => prev.map(item => 
      selectedIds.has(item.id) ? { ...item, status } : item
    ));
    setSelectedIds(new Set()); // Reset selection

    try {
      await historyService.bulkUpdateStatus({ ids, status });
      toast.success(`${ids.length}건의 상태가 변경되었습니다.`);
    } catch (error) {
      toast.error("일괄 업데이트 실패");
      fetchHistory(); // Revert
    }
  };

  const confirmDelete = async () => {
    // Bulk Delete Logic
    const idsToDelete = Array.from(selectedIds);
    if (idsToDelete.length === 0) return;

    // Optimistic Update
    setHistory(prev => prev.filter(item => !selectedIds.has(item.id)));
    setSelectedIds(new Set());
    
    setItemToDelete(null); 

    try {
        await Promise.all(idsToDelete.map(id => historyService.deleteHistory(id)));
        toast.success(`${idsToDelete.length}건이 삭제되었습니다.`);
    } catch (error) {
        toast.error("삭제 실패");
        fetchHistory(); // Revert
    }
  };

  const filteredHistory = history.filter(item => 
    item.channel_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">발송 이력 관리</h1>
            <p className="text-muted-foreground mt-1">
              발송된 메일의 현황을 파악하고 답변 여부를 관리합니다.
            </p>
          </div>
          <div className="flex gap-2">
            {selectedIds.size > 0 && (
                <>
                   <Button 
                      onClick={() => handleBulkUpdate('sent')} 
                      variant="default"
                      className="animate-in fade-in"
                   >
                     선택한 {selectedIds.size}건 발송완료(SENT) 처리
                   </Button>
                   <Button 
                      onClick={() => setItemToDelete(-1)} 
                      variant="destructive"
                      className="animate-in fade-in"
                   >
                     <Trash2 className="h-4 w-4 mr-2" />
                     삭제
                   </Button>
                </>
            )}
            <Button variant="outline" onClick={handleDownloadCSV} disabled={loading || filteredHistory.length === 0}>
               <Download className="h-4 w-4 mr-2" />
               CSV 다운로드
            </Button>
            <Button variant="outline" onClick={fetchHistory} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              새로고침
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3 border-b mb-4">
             <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                   <Input 
                      placeholder="채널명 또는 이메일 검색..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-[140px]">
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="상태 필터" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">전체 상태</SelectItem>
                          <SelectItem value="sent">발송 완료</SelectItem>
                          <SelectItem value="draft">임시 저장</SelectItem>
                          <SelectItem value="unsuitable">부적합</SelectItem>
                        </SelectContent>
                      </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="replied-mode" 
                      checked={showRepliedOnly}
                      onCheckedChange={setShowRepliedOnly}
                    />
                    <label htmlFor="replied-mode" className="text-sm font-medium">
                      답변 온 것만 보기
                    </label>
                  </div>
                </div>
             </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                <tr>
                  <th className="px-4 py-3 w-[50px] text-center">
                    <Checkbox 
                        checked={selectedIds.size === filteredHistory.length && filteredHistory.length > 0}
                        onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-4 py-3 w-[50px] text-center">No</th>
                  <th className="px-4 py-3">채널명</th>
                  <th className="px-4 py-3">이메일 / 제목</th>
                  <th className="px-4 py-3 w-[120px]">발송일</th>
                  <th className="px-4 py-3 w-[80px]">상태</th>
                  <th className="px-4 py-3 w-[100px] text-center">답변여부</th>
                  <th className="px-4 py-3 w-[250px]">비고</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading && history.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground">
                       <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                       데이터를 불러오는 중...
                    </td>
                  </tr>
                ) : filteredHistory.length === 0 ? (
                   <tr>
                    <td colSpan={8} className="text-center py-12 text-muted-foreground">
                       데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item, idx) => (
                    <tr key={item.id} className={`hover:bg-muted/30 transition-colors ${selectedIds.has(item.id) ? "bg-muted/50" : ""}`}>
                      <td className="px-4 py-3 text-center">
                          <Checkbox 
                             checked={selectedIds.has(item.id)}
                             onCheckedChange={() => toggleSelect(item.id)}
                          />
                      </td>
                      <td className="px-4 py-3 text-center text-muted-foreground">{history.length - idx}</td>
                      <td className="px-4 py-3 font-medium">
                        {item.channel_name}
                        {item.source === 'legacy' && (
                             <Badge variant="outline" className="ml-2 text-[10px] px-1 py-0 h-4">Legacy</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                           <span>{item.email || "-"}</span>
                           <span className="text-xs text-muted-foreground truncate max-w-[200px]">{item.subject}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {new Date(item.sent_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <Badge 
                                variant={item.status === 'sent' ? 'default' : item.status === 'unsuitable' ? 'destructive' : 'secondary'}
                                className="cursor-pointer hover:opacity-80 transition-opacity"
                             >
                                {item.status.toUpperCase()}
                             </Badge>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="start">
                             <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'sent')}>
                               발송 완료 (SENT)
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'draft')}>
                               임시 저장 (DRAFT)
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusChange(item.id, 'unsuitable')}>
                               부적합 (UNSUITABLE)
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                            <Checkbox 
                                checked={item.has_replied} 
                                onCheckedChange={() => toggleReplied(item.id, item.has_replied)}
                            />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Input 
                            defaultValue={item.note || ""}
                            onBlur={(e) => {
                                if (e.target.value !== item.note) {
                                    handleNoteBlur(item.id, e.target.value);
                                }
                            }}
                            className="h-8 text-xs bg-transparent border-transparent hover:border-input focus:border-input focus:bg-background transition-all"
                            placeholder="내용 입력..."
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이력 일괄 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말 선택한 <span className="font-bold text-foreground">{selectedIds.size}건</span>의 이력을 삭제하시겠습니까? <br/>
              삭제된 이력은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
