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
  gitLabData: ByCardsResponse;
  isLoading: boolean;
  error: string | undefined;
  fetchGitLabData: () => Promise<void>;
  getCardsPipeline(cardType: string): PipelineJobsResponse[];
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
    } catch (error: any) {
      console.error(error);
      set({ jsonError: error.message });
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
    } catch (error: any) {
      console.error(error);
      set({ jsonError: error.message });
    } finally {
      set({ jsonLoading: false });
    }
  },
}));
