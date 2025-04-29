import { create } from "zustand";
import { CardType, CardStatus } from "./global-variable";
export type CardPropreties = {
  id: string;
  type?: CardType;
  status?: CardStatus;
  completedTests?: number;
  totalTests?: number;
};

type CardStore = {
  cards: Record<string, CardPropreties>;
  initCard(id: string, initial: CardPropreties): void;
  updateCard(id: string, patch: Partial<CardPropreties>): void;
  getCard(id: string): CardPropreties | undefined;
};

export const useBoardStore = create<CardStore>((set, get) => ({
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
}));
