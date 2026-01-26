
import { create } from 'zustand';
import { InstagramUser } from './types';

interface InstagramState {
  keyword: string;
  searchMode: 'tag' | 'target';
  results: InstagramUser[];
  fallbackUrl: string | null; // URL to Instagram when scraping fails
  selectedUsernames: Set<string>;
  analysisResults: any[];
  
  setKeyword: (q: string) => void;
  setSearchMode: (mode: 'tag' | 'target') => void;
  setResults: (users: InstagramUser[]) => void;
  setFallbackUrl: (url: string | null) => void;
  toggleSelection: (username: string) => void;
  resetSelection: () => void;
  setSelectedUsers: (users: Set<string>) => void;
  setAnalysisResults: (results: any[]) => void;
  clearAnalysisResults: () => void;
  removeAnalysisResult: (username: string) => void;
  updateUserStatus: (username: string, status: 'todo' | 'ignored' | 'sent' | 'replied') => void;
}

export const useInstagramStore = create<InstagramState>((set) => ({
  keyword: "",
  searchMode: 'tag',
  results: [],
  fallbackUrl: null,
  selectedUsernames: new Set(),
  analysisResults: [],

  setKeyword: (q) => set({ keyword: q }),
  setSearchMode: (mode) => set({ searchMode: mode }),
  setResults: (users) => set({ results: users }),
  setFallbackUrl: (url) => set({ fallbackUrl: url }),
  
  toggleSelection: (username) => set((state) => {
    const next = new Set(state.selectedUsernames);
    if (next.has(username)) next.delete(username);
    else next.add(username);
    return { selectedUsernames: next };
  }),

  resetSelection: () => set({ selectedUsernames: new Set() }),
  setSelectedUsers: (users) => set({ selectedUsernames: users }),
  
  setAnalysisResults: (results) => set({ analysisResults: results }),
  clearAnalysisResults: () => set({ analysisResults: [] }),
  removeAnalysisResult: (username) => set((state) => ({
      analysisResults: state.analysisResults.filter(r => r.username !== username)
  })),
  updateUserStatus: (username, status) => set((state) => ({
      results: state.results.map(u => u.username === username ? { ...u, db_status: status, is_registered: true } : u)
  })),
}));
