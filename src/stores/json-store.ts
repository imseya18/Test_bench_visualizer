import { CardPropreties } from './card-store';
import { immer } from 'zustand/middleware/immer';
import { create } from 'zustand';
import { storeError } from '../utils/error';
import { load } from '@tauri-apps/plugin-store';
import { addToast } from '@heroui/react';
import { getStorePath } from './store-constant';
export type BoardProperties = {
  id: string;
  name: string;
  description: string;
  cards: Record<string, CardPropreties>;
  deviceCount: number;
  activeDevices: number;
  lastUpdated: Date;
};

type JsonSlice = {
  boards: Record<string, BoardProperties>;
  jsonLoading: boolean;
  jsonError: string | undefined;
  /**
   * Fetch all cached Boards and assign them to the `boards` property of this slice.
   * @returns {Promise<void>}
   */
  fetchBoards: () => Promise<void>;
  pushBoards: (board: BoardProperties) => Promise<void>;
  /**
   * Delete a board from `boards` and immediatly store the new state to the Json Cache
   * @param boardName Name of the board to delete
   * @returns
   */
  removeBoard: (boardName: string) => Promise<void>;
  /**
   * save the current states of `boards` to the Json cache
   * @returns {Promise<void>}
   */
  saveBoardToJson: () => Promise<void>;
  resetJson: () => void;
};

export const useJsonStore = create<JsonSlice>()(
  immer((set, get) => ({
    boards: {},
    jsonLoading: false,
    jsonError: undefined,

    fetchBoards: async () => {
      set((state) => {
        state.jsonLoading = true;
        state.jsonError = undefined;
      });
      try {
        const store_path = await getStorePath();
        const store = await load(store_path, { autoSave: true });
        const data = (await store.get<Record<string, BoardProperties>>('Boards')) ?? {};
        set((state) => {
          state.boards = data;
        });
      } catch (error: unknown) {
        const message = String(error);
        storeError(message);
        set((draft) => {
          draft.jsonError = message;
        });
      } finally {
        set((state) => {
          state.jsonLoading = false;
        });
      }
    },

    saveBoardToJson: async () => {
      const allBoards = get().boards;
      console.log('all board:', allBoards);
      const store_path = await getStorePath();
      const store = await load(store_path, { autoSave: true });
      await store.set('Boards', allBoards);
      await store.save();
    },

    pushBoards: async (board) => {
      set((draft) => {
        draft.jsonLoading = true;
        draft.jsonError = undefined;
      });

      try {
        set((draft) => {
          draft.boards[board.name] = board;
        });
        await get().saveBoardToJson();
        addToast({
          title: 'Board saved successfully',
          color: 'success',
          timeout: 3000,
        });
      } catch (error: unknown) {
        console.error(error);
        const message = error instanceof Error ? error.message : String(error);
        set((draft) => {
          draft.jsonError = message;
        });
      } finally {
        set((draft) => {
          draft.jsonLoading = false;
        });
      }
    },

    removeBoard: async (boardName) => {
      set((draft) => {
        delete draft.boards[boardName];
      });
      await get().saveBoardToJson();
    },

    resetJson: () => {
      set((draft) => {
        draft.boards = {};
        draft.jsonLoading = false;
        draft.jsonError = undefined;
      });
    },
  })),
);
