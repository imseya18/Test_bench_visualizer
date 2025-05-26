import { create } from 'zustand';
import { CardType, CardStatus } from './global-variable';
import { ByCardsResponse } from '../bindings/ByCardsResponse';
import { invoke } from '@tauri-apps/api/core';
import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';
import { resourceDir } from '@tauri-apps/api/path';
import { load } from '@tauri-apps/plugin-store';
import { BranchName } from './global-variable';
import { gitlabError, storeError } from './error';
import { addToast } from '@heroui/react';
export type CardPropreties = {
  id: string;
  onBoardPosition: number;
  type?: CardType;
  status?: CardStatus;
};

export type BoardProperties = {
  id: string;
  name: string;
  description: string;
  cards: Record<string, CardPropreties>;
  deviceCount: number;
  activeDevices: number;
  lastUpdated: Date;
};

//? I choose a Record instead of an Array to easily update the state of my innerCards
type CardSlice = {
  cards: Record<string, CardPropreties>;
  initCard(id: string, initial: CardPropreties): void;
  updateCard(id: string, patch: Partial<CardPropreties>): void;
  getCard(id: string): CardPropreties | undefined;
  setCards(cards: Record<string, CardPropreties>): void;
};

type GitLabSlice = {
  gitLabCache: Record<BranchName, ByCardsResponse>;
  gitLabData: ByCardsResponse;
  selectedBranch: string;
  isLoading: boolean;
  error: string | undefined;
  fetchGitLabData: (branchName: BranchName | undefined, notification: boolean) => Promise<void>;
  getCardsPipeline(cardType: string): PipelineJobsResponse[];
  getCachedGitLabData: () => Promise<void>;
  setSelectedBranch(selectedBranch: string): void;
  changeSelectedBranch(selectedBranch: string): void;
  setGitLabData(gitLabData: ByCardsResponse): void;
};

type JsonSlice = {
  boards: Record<string, BoardProperties>;
  jsonLoading: boolean;
  jsonError: string | undefined;
  fetchBoards: () => Promise<void>;
  pushBoards: (board: BoardProperties) => Promise<void>;
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
  setCards: (cards) => set({ cards }),
  // GitLabSlice
  selectedBranch: 'config/projects-kirkstone',
  gitLabCache: {},
  gitLabData: {},
  isLoading: false,
  error: undefined,

  fetchGitLabData: async (branchName: string = '', notification: boolean = false) => {
    set({ isLoading: true, error: undefined });
    try {
      console.log('start api call');
      const dir = await resourceDir();
      const store = await load(dir + '/json/store.json', { autoSave: true });
      const result = await invoke<ByCardsResponse>('test_api_call', { branch_name: branchName });
      set((state) => ({
        gitLabCache: {
          ...state.gitLabCache,
          [branchName]: result,
        },
      }));
      get().setGitLabData(result);
      await store.set('gitLabData', get().gitLabCache);
      await store.save();
      if (notification) {
        addToast({
          title: 'Data updated',
          color: 'success',
        });
      }
    } catch (error: unknown) {
      gitlabError(String(error));
      set({ error: String(error) });
    } finally {
      set({ isLoading: false });
      console.log(get().gitLabData);
    }
  },

  getCachedGitLabData: async () => {
    const dir = await resourceDir();
    const store = await load(dir + '/json/store.json', { autoSave: true });
    const cachedApiCall =
      (await store.get<Record<BranchName, ByCardsResponse>>('gitLabData')) ?? {};
    console.log('cached API data:', cachedApiCall);
    set({ gitLabCache: cachedApiCall });
    set({ gitLabData: get().gitLabCache[get().selectedBranch] ?? {} });
  },
  getCardsPipeline: (cardType): PipelineJobsResponse[] => {
    const data = get().gitLabData[cardType] ?? {};
    return Object.values(data);
  },
  setSelectedBranch: (selectedBranch) => set({ selectedBranch }),
  setGitLabData: (gitLabData) => set({ gitLabData }),
  changeSelectedBranch: (selectedBranch) => {
    get().setSelectedBranch(selectedBranch);
    get().setGitLabData(get().gitLabCache[selectedBranch] ?? {});
  },
  //Json Slice

  boards: {},
  jsonLoading: false,
  jsonError: undefined,

  fetchBoards: async () => {
    set({ jsonLoading: true, error: undefined });
    try {
      const dir = await resourceDir();
      const store = await load(dir + '/json/store.json', { autoSave: true });
      const data = (await store.get<Record<string, BoardProperties>>('Boards')) ?? {};
      set({ boards: data });
    } catch (error: unknown) {
      storeError(String(error));
    } finally {
      set({ jsonLoading: false });
    }
  },

  pushBoards: async (board: BoardProperties) => {
    set({ jsonLoading: true, error: undefined });
    try {
      set({
        boards: {
          ...get().boards,
          [board.name]: board,
        },
      });
      const allBoards = get().boards;
      const dir = await resourceDir();
      const store = await load(dir + '/json/store.json', { autoSave: true });
      await store.set('Boards', allBoards);
      await store.save();
      addToast({
        title: 'Board saved successfully',
        color: 'success',
        timeout: 3000,
      });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        set({ jsonError: error.message });
      } else {
        set({ jsonError: String(error) });
      }
    } finally {
      set({ jsonLoading: false });
    }
  },
}));
