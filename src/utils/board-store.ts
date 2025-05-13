import { create } from "zustand";
import { CardType, CardStatus } from "./global-variable";
import { ByCardsResponse } from "../bindings/ByCardsResponse";
import { invoke } from "@tauri-apps/api/core";
import { PipelineJobsResponse } from "../bindings/PipelineJobsResponse";
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
  error: string | null;
  fetchGitLabData: () => Promise<void>;
  getCardsPipeline(cardType: string): PipelineJobsResponse[];
};

export const useBoardStore = create<CardSlice & GitLabSlice>((set, get) => ({
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
  error: null,
  fetchGitLabData: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("start api call");
      const result = await invoke<ByCardsResponse>("test_api_call");
      set({ gitLabData: result });
    } catch (err: any) {
      console.error(err);
      set({ error: err.message });
    } finally {
      set({ isLoading: false });
      console.log(get().gitLabData);
    }
  },

  getCardsPipeline: (cardType): PipelineJobsResponse[] => {
    const data = get().gitLabData;
    if (!data) {
      throw "No API data";
    }
    const pipelines = data[cardType];
    if (!data) {
      throw "No pipelines for this card";
    }
    return Object.values(pipelines);
  },
}));
