/* eslint-disable unicorn/prefer-module */
/* eslint-disable @typescript-eslint/no-require-imports */
// tests/gitlab-store.test.ts
import { act } from 'react';
import { useGitLabStore } from '../src/stores/gitlab-store';
import { ByCardsResponseBuilder } from './builder/byCardResponse-builder';
import { ByCardsResponse } from '../src/bindings/ByCardsResponse';

describe('GitLabStore – unit tests', () => {
  beforeEach(() => {
    // Reset the store to its initial state
    useGitLabStore.getState().resetGitLab();
  });

  it('initial state is correct', () => {
    const { gitLabCache, gitLabData, selectedBranch, isLoading, error } = useGitLabStore.getState();
    expect(gitLabCache).toEqual({});
    expect(gitLabData).toEqual({});
    expect(selectedBranch).toBe('config/projects-kirkstone');
    expect(isLoading).toBe(false);
    expect(error).toBeUndefined();
  });

  it('setSelectedBranch updates selectedBranch', () => {
    act(() => {
      useGitLabStore.getState().setSelectedBranch('ma-branch');
    });
    expect(useGitLabStore.getState().selectedBranch).toBe('ma-branch');
  });

  it('setGitLabData sets gitLabData', () => {
    const byCardsResponseBuilder = new ByCardsResponseBuilder();
    const data = byCardsResponseBuilder.default();
    act(() => {
      useGitLabStore.getState().setGitLabData(data);
    });
    expect(useGitLabStore.getState().gitLabData).toEqual(data);
  });

  it('fetchGitLabData stores result in gitLabCache and gitLabData', async () => {
    // Mock invoke to return a valid ByCardsResponse
    const byCardsResponseBuilder = new ByCardsResponseBuilder();
    const data = byCardsResponseBuilder.default();
    const { invoke } = require('@tauri-apps/api/core');
    invoke.mockResolvedValueOnce(data);

    const { load } = require('@tauri-apps/plugin-store');
    const fakeStore = await load();
    const setSpy = jest.spyOn(fakeStore, 'set');
    const saveSpy = jest.spyOn(fakeStore, 'save');

    await act(async () => {
      await useGitLabStore.getState().fetchGitLabData('config/projects-kirkstone', true, 7);
    });

    const state = useGitLabStore.getState();
    expect(state.gitLabCache['config/projects-kirkstone']).toEqual(data);
    expect(state.gitLabData).toEqual(data);
    expect(setSpy).toHaveBeenCalledWith('gitLabData', state.gitLabCache);
    expect(saveSpy).toHaveBeenCalled();
    expect(state.isLoading).toBe(false);

    setSpy.mockRestore();
    saveSpy.mockRestore();
  });

  it('fetchGitLabData handles error and updates error', async () => {
    const { invoke } = require('@tauri-apps/api/core');
    invoke.mockRejectedValueOnce(new Error('Echec API'));

    await act(async () => {
      await useGitLabStore.getState().fetchGitLabData('branche-erreur', false, 7);
    });

    expect(useGitLabStore.getState().error).toBe('Error: Echec API');
    expect(useGitLabStore.getState().isLoading).toBe(false);
  });

  it('getCachedGitLabData loads cache and gitLabData', async () => {
    // Mock load.get to return a cache matching ByCardsResponse
    const byCardsResponseBuilder = new ByCardsResponseBuilder();
    const data = byCardsResponseBuilder.default();
    const fakeCache: Record<string, ByCardsResponse> = {
      'config/projects-kirkstone': data,
    };
    const { load } = require('@tauri-apps/plugin-store');
    const fakeStore = await load();
    fakeStore.get.mockResolvedValueOnce(fakeCache);

    await act(async () => {
      await useGitLabStore.getState().getCachedGitLabData();
    });

    expect(useGitLabStore.getState().gitLabCache).toEqual(fakeCache);
    expect(useGitLabStore.getState().gitLabData).toEqual(fakeCache['config/projects-kirkstone']);
  });
});
