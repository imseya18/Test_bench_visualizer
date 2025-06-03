import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { ByCardsResponse } from '../bindings/ByCardsResponse';
import { PipelineJobsResponse } from '../bindings/PipelineJobsResponse';
import { BranchName } from '../utils/global-variable';
import { resourceDir } from '@tauri-apps/api/path';
import { load } from '@tauri-apps/plugin-store';
import { invoke } from '@tauri-apps/api/core';
import { gitlabError } from '../utils/error';
import { addToast } from '@heroui/react';

type GitLabSlice = {
  gitLabCache: Record<BranchName, ByCardsResponse>;
  gitLabData: ByCardsResponse;
  selectedBranch: string;
  isLoading: boolean;
  error: string | undefined;
  fetchGitLabData: (
    branchName: BranchName | undefined,
    notification?: boolean,
    SinceDays?: number,
  ) => Promise<void>;
  getCardsPipeline(cardType: string): PipelineJobsResponse[];
  getCachedGitLabData: () => Promise<void>;
  setSelectedBranch(selectedBranch: string): void;
  changeSelectedBranch(selectedBranch: string): void;
  setGitLabData(gitLabData: ByCardsResponse): void;
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

      try {
        const dir = await resourceDir();
        const store = await load(dir + '/json/store.json', { autoSave: true });
        const result = await invoke<ByCardsResponse>('test_api_call', {
          branch_name: branchName,
          since_days: sinceDays,
        });

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
        const message = String(error);
        gitlabError(message);
        set((draft) => {
          draft.error = message;
        });
      } finally {
        set((draft) => {
          draft.isLoading = false;
        });
      }
    },

    getCachedGitLabData: async () => {
      const dir = await resourceDir();
      const store = await load(dir + '/json/store.json', { autoSave: true });
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
