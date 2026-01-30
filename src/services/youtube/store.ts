"use client";

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { YouTubeChannel } from './types';

export interface DownloadItem {
  channel: YouTubeChannel;
  email: string;
  savedAt: number;
}

interface YouTubeState {
  downloadList: DownloadItem[];
  
  addToDownloadList: (items: { channel: YouTubeChannel; email: string }[]) => void;
  removeFromDownloadList: (channelId: string) => void;
  clearDownloadList: () => void;
  isInDownloadList: (channelId: string) => boolean;
}

export const useYouTubeStore = create<YouTubeState>()(
  persist(
    (set, get) => ({
      downloadList: [],

      addToDownloadList: (newItems) => {
        const currentList = get().downloadList;
        const currentIds = new Set(currentList.map(item => item.channel.id));
        
        const itemsToAdd = newItems
          .filter(item => !currentIds.has(item.channel.id))
          .map(item => ({
            ...item,
            savedAt: Date.now()
          }));

        if (itemsToAdd.length === 0) return;

        set({
          downloadList: [...currentList, ...itemsToAdd]
        });
      },

      removeFromDownloadList: (channelId) => set((state) => ({
        downloadList: state.downloadList.filter(item => item.channel.id !== channelId)
      })),

      clearDownloadList: () => set({ downloadList: [] }),

      isInDownloadList: (channelId) => {
        return get().downloadList.some(item => item.channel.id === channelId);
      },
    }),
    {
      name: 'youtube-download-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
