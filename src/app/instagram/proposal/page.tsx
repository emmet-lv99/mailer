"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { proposalService } from "@/services/instagram/proposal";
import { ArrowLeft, Download, Plus, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ProposalDialogs } from "./components/ProposalDialogs";
import { ProposalFilters } from "./components/ProposalFilters";
import { ProposalTable } from "./components/ProposalTable";
import { Proposal, Reaction, SortConfig, SortKey } from "./types";

export default function InstagramProposalPage() {
  const [loading, setLoading] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [proposalIdToDelete, setProposalIdToDelete] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [filters, setFilters] = useState<string[]>([]);
  const [minFollowers, setMinFollowers] = useState("");
  const [maxFollowers, setMaxFollowers] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'created_at',
    direction: 'desc'
  });

  useEffect(() => {
    fetchProposals();
  }, []);

  const fetchProposals = async () => {
    setLoading(true);
    try {
      const data = await proposalService.getList();
      setProposals(data);
    } catch (error) {
      console.error("Failed to fetch proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchProposals();
  };

  const handleDelete = async () => {
    if (proposalIdToDelete !== null) {
      try {
        await proposalService.delete(proposalIdToDelete);
        setProposals(prev => prev.filter(p => p.id !== proposalIdToDelete));
        setSelectedIds(prev => prev.filter(id => id !== proposalIdToDelete));
        setProposalIdToDelete(null);
      } catch (error) {
        console.error("Failed to delete proposal:", error);
      }
    }
  };

  const handleAddProposal = async (data: { instagram_id: string; followers: number }) => {
    try {
      const newProposal = await proposalService.create(data);
      setProposals(prev => [newProposal, ...prev]);
      setIsAddDialogOpen(false);
      toast.success("제안이 추가되었습니다.");
    } catch (error: any) {
      console.error("Failed to add proposal:", error);
      toast.error(error.message);
    }
  };

  const handleSaveRow = async (id: number, data: { instagram_id: string; followers: number }) => {
    try {
      const updated = await proposalService.update(id, data);
      setProposals(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (error) {
      console.error("Failed to update row:", error);
    }
  };

  const handleMemoChange = async (id: number, memo: string) => {
    // Optimistic update
    setProposals(prev => prev.map(p => (p.id === id ? { ...p, memo } : p)));
    try {
      await proposalService.update(id, { memo });
    } catch (error) {
      console.error("Failed to update memo:", error);
    }
  };

  const handleSaveContent = async (content: string) => {
    if (selectedProposal) {
      try {
        const updated = await proposalService.update(selectedProposal.id, { content });
        setProposals(prev => prev.map(p => (p.id === selectedProposal.id ? updated : p)));
        setSelectedProposal(null);
      } catch (error) {
        console.error("Failed to save content:", error);
      }
    }
  };

  const handleToggleReaction = async (id: number) => {
    const item = proposals.find(p => p.id === id);
    if (!item) return;

    let nextReaction: Reaction;
    if (item.reaction === "pending") nextReaction = "accept";
    else if (item.reaction === "accept") nextReaction = "refuse";
    else nextReaction = "pending";

    try {
      const updated = await proposalService.update(id, { reaction: nextReaction });
      setProposals(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (error) {
      console.error("Failed to toggle reaction:", error);
    }
  };

  const handleToggleSent = async (id: number) => {
    const item = proposals.find(p => p.id === id);
    if (!item) return;

    const nextIsSent = !item.is_sent;
    const nextSentAt = nextIsSent ? new Date().toISOString() : null;

    try {
      const updated = await proposalService.update(id, { is_sent: nextIsSent, sent_at: nextSentAt });
      setProposals(prev => prev.map(p => (p.id === id ? updated : p)));
    } catch (error) {
      console.error("Failed to toggle sent status:", error);
    }
  };

  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const handleSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
    }));
  };

  const sortedAndFilteredProposals = useMemo(() => {
    return [...proposals]
      .filter((item) => {
        const matchesSearch = item.instagram_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.memo.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchesSearch) return false;

        const minF = minFollowers ? parseInt(minFollowers) : null;
        const maxF = maxFollowers ? parseInt(maxFollowers) : null;
        if (minF !== null && !isNaN(minF) && item.followers < minF) return false;
        if (maxF !== null && !isNaN(maxF) && item.followers > maxF) return false;

        if (filters.length === 0) return true;

        const sentFilters = filters.filter(f => ['sent', 'draft'].includes(f));
        const reactionFilters = filters.filter(f => ['accept', 'refuse', 'pending'].includes(f));

        const matchesSent = sentFilters.length === 0 || sentFilters.some(filter => {
          if (filter === 'sent') return item.is_sent;
          if (filter === 'draft') return !item.is_sent;
          return false;
        });

        const matchesReaction = reactionFilters.length === 0 || reactionFilters.some(filter => {
          if (filter === 'accept') return item.reaction === 'accept';
          if (filter === 'refuse') return item.reaction === 'refuse';
          if (filter === 'pending') return item.reaction === 'pending';
          return false;
        });

        return matchesSent && matchesReaction;
      })
      .sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
  }, [proposals, searchQuery, filters, minFollowers, maxFollowers, sortConfig]);

  const toggleSelectAll = () => {
    if (selectedIds.length === sortedAndFilteredProposals.length && sortedAndFilteredProposals.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(sortedAndFilteredProposals.map(p => p.id));
    }
  };

  const toggleSelectRow = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="container mx-auto p-6 flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b">
        <div className="flex items-center gap-4">
          <Link href="/instagram">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">공구제안 관리</h1>
            <p className="text-muted-foreground mt-1">
              인스타그램 인플루언서 대상 공구 제안 및 상태를 관리합니다.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="아이디 또는 내용 검색..."
              className="pl-9 h-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" size="sm" className="h-9" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            새로고침
          </Button>
          <Button size="sm" className="h-9 gap-2" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            제안 추가
          </Button>
        </div>
      </header>

      <ProposalFilters 
        filters={filters} 
        toggleFilter={toggleFilter} 
        clearFilters={() => {
          setFilters([]);
          setMinFollowers("");
          setMaxFollowers("");
        }} 
        minFollowers={minFollowers}
        setMinFollowers={setMinFollowers}
        maxFollowers={maxFollowers}
        setMaxFollowers={setMaxFollowers}
      />

      <Card>
        <ProposalTable 
          data={sortedAndFilteredProposals}
          loading={loading}
          selectedIds={selectedIds}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectRow={toggleSelectRow}
          sortConfig={sortConfig}
          onSort={handleSort}
          onDeleteRow={(id) => setProposalIdToDelete(id)}
          onViewContent={setSelectedProposal}
          onMemoChange={handleMemoChange}
          onToggleSent={handleToggleSent}
          onToggleReaction={handleToggleReaction}
          onSaveRow={handleSaveRow}
        />
      </Card>

      <ProposalDialogs 
        isAddOpen={isAddDialogOpen}
        onAddOpenChange={setIsAddDialogOpen}
        onAdd={handleAddProposal}
        selectedProposal={selectedProposal}
        onContentOpenChange={(open) => !open && setSelectedProposal(null)}
        onSaveContent={handleSaveContent}
        deleteId={proposalIdToDelete}
        onDeleteOpenChange={(open) => !open && setProposalIdToDelete(null)}
        onConfirmDelete={handleDelete}
      />
    </div>
  );
}
