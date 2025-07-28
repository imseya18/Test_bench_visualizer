import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ByCardsResponse } from '../bindings/ByCardsResponse';
import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';
import { BranchName } from '../utils/global-variable';
import { load } from '@tauri-apps/plugin-store';
import { invoke } from '@tauri-apps/api/core';
import { gitlabError } from '../utils/error';
import { addToast } from '@heroui/react';
import { getStorePath } from './store-constant';
type GitLabSlice = {
  gitLabCache: Record<BranchName, ByCardsResponse>;
  gitLabData: ByCardsResponse;
  selectedBranch: string;
  isLoading: boolean;
  error: string | undefined;
  /**
   * Get the Pipeline Data of a specific branch, store the response in the cache.
   *
   * @param {BranchName | undefined} branchName Name of the branch; use '' if you don't want a specific branch.
   * @param {boolean} notification Should a notification display at the end of the call?
   * @param {number} sinceDays Number of days from which the data should be retrieved.
   */
  fetchGitLabData: (
    branchName: BranchName | undefined,
    notification?: boolean,
    SinceDays?: number,
  ) => Promise<void>;
  getCardsPipeline(cardType: string): PipelineJobsResponse[];
  /**
   * Return the GitLabData cached on the Json File.
   * @returns {Promise<void>}
   */
  getCachedGitLabData: () => Promise<void>;
  setSelectedBranch(selectedBranch: string): void;
  changeSelectedBranch(selectedBranch: string): void;
  setGitLabData(gitLabData: ByCardsResponse): void;
  resetGitLab(): void;
};

export const useGitLabStore = create<GitLabSlice>()(
  immer((set, get) => ({
    selectedBranch: 'config/projects-kirkstone',
    gitLabCache: {},
    gitLabData: {},
    isLoading: false,
    error: undefined,

    fetchGitLabData: async (
      branchName = get().selectedBranch,
      notification = false,
      sinceDays = 14,
    ) => {
      set((draft) => {
        draft.isLoading = true;
        draft.error = undefined;
      });
      console.log('api call start');
      try {
        const store_path = await getStorePath();
        const store = await load(store_path, { autoSave: true });
        const result = await invoke<ByCardsResponse>('get_gitlab_cards_data', {
          branch_name: branchName,
          since_days: sinceDays,
        });
        console.log('ResultL', result);
        set((draft) => {
          draft.gitLabCache[branchName] = result;
        });

        if (get().selectedBranch === branchName) {
          get().setGitLabData(result);
        }

        await store.set('gitLabData', get().gitLabCache);
        await store.save();

        if (notification) {
          addToast({
            title: 'Data updated',
            color: 'success',
          });
        }
      } catch (error: unknown) {
        gitlabError(error);
        set((draft) => {
          draft.error = String(error);
        });
      } finally {
        set((draft) => {
          draft.isLoading = false;
        });
      }
    },

    getCachedGitLabData: async () => {
      const store_path = await getStorePath();
      const store = await load(store_path, { autoSave: true });
      const cachedApiCall =
        (await store.get<Record<BranchName, ByCardsResponse>>('gitLabData')) ?? {};

      set((draft) => {
        draft.gitLabCache = cachedApiCall;
        draft.gitLabData = cachedApiCall[get().selectedBranch] ?? ({} as ByCardsResponse);
      });
    },

    getCardsPipeline: (cardType) => {
      const data = get().gitLabData[cardType] ?? {};
      return Object.values(data);
    },

    setSelectedBranch: (selectedBranch) => {
      set((draft) => {
        draft.selectedBranch = selectedBranch;
      });
    },

    setGitLabData: (gitLabData) => {
      set((draft) => {
        draft.gitLabData = gitLabData;
      });
    },

    changeSelectedBranch: (selectedBranch) => {
      get().setSelectedBranch(selectedBranch);
      get().setGitLabData(get().gitLabCache[selectedBranch] ?? ({} as ByCardsResponse));
    },

    resetGitLab: () => {
      set((draft) => {
        draft.gitLabCache = {} as Record<BranchName, ByCardsResponse>;
        draft.gitLabData = {} as ByCardsResponse;
        draft.selectedBranch = 'config/projects-kirkstone' as BranchName;
        draft.isLoading = false;
        draft.error = undefined;
      });
    },
  })),
);
