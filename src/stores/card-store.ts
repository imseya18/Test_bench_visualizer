import { create } from 'zustand';
import { CardType, CardStatus } from '../utils/global-variable';
import { immer } from 'zustand/middleware/immer';
export type CardPropreties = {
  id: string;
  onBoardPosition: number;
  type?: CardType;
  status?: CardStatus;
};

type CardSlice = {
  cards: Record<string, CardPropreties>;
  initCard: (id: string, initial: CardPropreties) => void;
  updateCard: (id: string, patch: Partial<CardPropreties>) => void;
  getCard: (id: string) => CardPropreties | undefined;
  setCards: (cards: Record<string, CardPropreties>) => void;
  resetCards: () => void;
};

export const useCardStore = create<CardSlice>()(
  immer((set, get) => ({
    cards: {},

    initCard: (id, initial) => {
      set((state) => {
        state.cards[id] = { ...initial };
      });
    },

    updateCard: (id, patch) => {
      set((state) => {
        state.cards[id] = { ...state.cards[id], ...patch };
      });
    },

    getCard: (id) => {
      return get().cards[id];
    },

    setCards: (cards) => {
      set((state) => {
        state.cards = cards;
      });
    },

    resetCards: () => {
      set((state) => {
        state.cards = {};
      });
    },
  })),
);
