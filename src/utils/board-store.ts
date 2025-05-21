import { create } from 'zustand';
import { CardType, CardStatus } from './global-variable';
import { ByCardsResponse } from '../bindings/ByCardsResponse';
import { invoke } from '@tauri-apps/api/core';
import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';
import { resourceDir } from '@tauri-apps/api/path';
import { load } from '@tauri-apps/plugin-store';
import { BranchName } from './global-variable';

export type CardPropreties = {
  id: string;
  onBoardPosition: number;
  type?: CardType;
  status?: CardStatus;
  completedTests?: number;
  totalTests?: number;
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
  fetchGitLabData: (branchName: BranchName | undefined) => Promise<void>;
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
  selectedBranch: '',
  gitLabCache: {},
  gitLabData: {},
  isLoading: false,
  error: undefined,

  //todo add branche on parametre to call API on specifique Branch and if blank call for all branch.
  fetchGitLabData: async (branchName: string = '') => {
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
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof Error) {
        set({ error: error.message });
      } else {
        set({ error: String(error) });
      }
    } finally {
      set({ isLoading: false });
      console.log(get().gitLabData);
    }
  },

  getCachedGitLabData: async () => {
    const dir = await resourceDir();
    const store = await load(dir + '/json/store.json', { autoSave: true });
    const cachedApiCall = (await store.get<ByCardsResponse>('gitLabData')) ?? {};
    console.log('cached API data:', cachedApiCall);
    set({ gitLabData: cachedApiCall });
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

  //todo change the Data to store on a form like Records<nameOfTheBoard, typeOfCard[]>
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
