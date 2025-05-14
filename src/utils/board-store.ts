import { create } from 'zustand';
import { CardType, CardStatus } from './global-variable';
import { ByCardsResponse } from '../bindings/ByCardsResponse';
import { invoke } from '@tauri-apps/api/core';
import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';
import { resourceDir } from '@tauri-apps/api/path';
import { load } from '@tauri-apps/plugin-store';
export type CardPropreties = {
  id: string;
  type?: CardType;
  status?: CardStatus;
  completedTests?: number;
  totalTests?: number;
};

type CardSlice = {
  cards: Record<string, CardPropreties>;
  initCard(id: string, initial: CardPropreties): void;
  updateCard(id: string, patch: Partial<CardPropreties>): void;
  getCard(id: string): CardPropreties | undefined;
};

type GitLabSlice = {
  gitLabData: ByCardsResponse;
  isLoading: boolean;
  error: string | undefined;
  fetchGitLabData: () => Promise<void>;
  getCardsPipeline(cardType: string): PipelineJobsResponse[];
};

type JsonSlice = {
  boards: Record<string, CardPropreties>[];
  jsonLoading: boolean;
  jsonError: string | undefined;
  fetchBoards: () => Promise<void>;
  pushBoards: (board: Record<string, CardPropreties>) => Promise<void>;
};
export const useBoardStore = create<CardSlice & GitLabSlice & JsonSlice>((set, get) => ({
  // CardSlice
  cards: {},
  initCard: (id, initial) => {
    set((state) => {
      const stateCards = { ...state.cards };
      stateCards[id] = { ...initial };
      return { cards: stateCards };
    });
  },
  updateCard: (id, patch) =>
    set((state) => {
      const stateCards = { ...state.cards };
      stateCards[id] = { ...stateCards[id], ...patch };
      return { cards: stateCards };
    }),
  getCard: (id) => get().cards[id],

  // GitLabSlice
  gitLabData: {},
  isLoading: false,
  error: undefined,

  fetchGitLabData: async () => {
    set({ isLoading: true, error: undefined });
    try {
      console.log('start api call');
      const result = await invoke<ByCardsResponse>('test_api_call');
      set({ gitLabData: result });
    } catch (error: any) {
      console.error(error);
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
      console.log(get().gitLabData);
    }
  },

  getCardsPipeline: (cardType): PipelineJobsResponse[] => {
    const data = get().gitLabData[cardType] ?? {};
    return Object.values(data);
  },

  //Json Slice

  boards: [],
  jsonLoading: false,
  jsonError: undefined,

  fetchBoards: async () => {
    set({ jsonLoading: true, error: undefined });
    try {
      const dir = await resourceDir();
      console.log(dir);
      const store = await load(dir + '/json/store.json', { autoSave: true });
      const data = (await store.get<Record<string, CardPropreties>[]>('Boards')) ?? [];
      const token = await store.get('GITLAB_TOKEN');
      console.log('token: ' + token);
      set({ boards: data });
    } catch (error: any) {
      console.error(error);
      set({ jsonError: error.message });
    } finally {
      set({ jsonLoading: false });
    }
  },

  pushBoards: async (board: Record<string, CardPropreties>) => {
    set({ jsonLoading: true, error: undefined });
    try {
      //if our boards has no data we have to get an array to use the [...oldtab, newtab] pattern so we create an empty one
      const currentBoards = get().boards ?? [];
      const updatedBoards = [...currentBoards, board];
      set({
        boards: updatedBoards,
      });
      const allBoards = get().boards;
      const dir = await resourceDir();
      const store = await load(dir + '/json/store.json', { autoSave: true });
      await store.set('Boards', allBoards);
      console.log(await store.get('GITLAB_TOKEN'));
      await store.save();
    } catch (error: any) {
      console.error(error);
      set({ jsonError: error.message });
    } finally {
      set({ jsonLoading: false });
    }
  },
}));
