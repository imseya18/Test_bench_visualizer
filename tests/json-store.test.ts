/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable unicorn/no-useless-undefined */
// tests/jsonStore.test.ts
import { act } from 'react';
import { useJsonStore, BoardProperties } from '../src/stores/json-store';
import * as pluginStore from '@tauri-apps/plugin-store';
import * as tauriPath from '@tauri-apps/api/path';
import { storeError } from '../src/utils/error';
import { addToast } from '@heroui/react';

jest.mock('@tauri-apps/api/path');
jest.mock('@tauri-apps/plugin-store');
jest.mock('../src/utils/error');
jest.mock('@heroui/react');

describe('useJsonStore', () => {
  type FakeStore = {
    get: jest.Mock<Promise<Record<string, BoardProperties> | undefined>, [string]>;
    set: jest.Mock<Promise<void>, [string, any]>;
    save: jest.Mock<Promise<void>, []>;
  };

  let fakeStore: FakeStore;
  const sampleBoard: BoardProperties = {
    id: 'b1',
    name: 'Board1',
    description: 'Test board',
    cards: {},
    deviceCount: 0,
    activeDevices: 0,
    lastUpdated: new Date(),
  };

  beforeEach(() => {
    // Create a fresh fake store before each test
    useJsonStore.getState().resetJson();

    fakeStore = {
      get: jest.fn().mockResolvedValue(undefined),
      set: jest.fn().mockResolvedValue(undefined),
      save: jest.fn().mockResolvedValue(undefined),
    };

    // Mock resourceDir to return a dummy path
    (tauriPath.resourceDir as jest.Mock).mockResolvedValue('/fake/dir');

    // Mock load(...) to return our fakeStore
    (pluginStore.load as jest.Mock).mockResolvedValue(fakeStore);

    // Clear error and toast mocks
    (storeError as jest.Mock).mockClear();
    (addToast as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should set jsonLoading true then populate boards on successful fetch', async () => {
    // Arrange: fakeStore.get returns existing boards
    const existing: Record<string, BoardProperties> = {
      [sampleBoard.name]: sampleBoard,
    };
    fakeStore.get.mockResolvedValueOnce(existing);

    // Act
    const fetchPromise = act(async () => {
      await useJsonStore.getState().fetchBoards();
    });

    // Immediately after invoking fetchBoards, jsonLoading should be true
    expect(useJsonStore.getState().jsonLoading).toBe(true);

    await fetchPromise;

    // Assert: boards updated, loading false, no error
    const state = useJsonStore.getState();
    expect(state.boards).toEqual(existing);
    expect(state.jsonLoading).toBe(false);
    expect(state.jsonError).toBeUndefined();
  });

  it('should set jsonError and reset jsonLoading on fetch failure', async () => {
    // Arrange: simulate load throwing an error
    fakeStore.get.mockRejectedValueOnce(new Error('load-fail'));

    // Act
    const fetchPromise = act(async () => {
      await useJsonStore.getState().fetchBoards();
    });

    // Loading should flip to true
    expect(useJsonStore.getState().jsonLoading).toBe(true);

    await fetchPromise;

    // Assert: error captured, loading false
    const state = useJsonStore.getState();
    expect(storeError).toHaveBeenCalledWith('Error: load-fail');
    expect(state.jsonError).toBe('Error: load-fail');
    expect(state.jsonLoading).toBe(false);
  });

  it('saveBoardToJson should call plugin-store set and save', async () => {
    // Act
    await act(async () => {
      await useJsonStore.getState().saveBoardToJson();
    });

    // Assert: load, set, save calls
    expect(pluginStore.load).toHaveBeenCalledWith('/fake/dir/json/store.json', { autoSave: true });
    expect(fakeStore.set).toHaveBeenCalledWith('Boards', useJsonStore.getState().boards);
    expect(fakeStore.save).toHaveBeenCalled();
  });

  it('pushBoards should add board, call saveBoardToJson, show toast, and reset loading', async () => {
    // Spy on saveBoardToJson to bypass actual file operations
    // const saveSpy = jest.spyOn(useJsonStore.getState(), 'saveBoardToJson').mockResolvedValue();

    // Act
    const pushPromise = act(async () => {
      await useJsonStore.getState().pushBoards(sampleBoard);
    });

    // Loading flips to true
    expect(useJsonStore.getState().jsonLoading).toBe(true);

    await pushPromise;

    // Assert: board added, save called, toast shown, loading false
    const state = useJsonStore.getState();
    expect(state.boards[sampleBoard.name]).toEqual(sampleBoard);
    // expect(saveSpy).toHaveBeenCalled();
    expect(fakeStore.set).toHaveBeenCalledWith('Boards', state.boards);
    expect(fakeStore.save).toHaveBeenCalled();
    expect(addToast).toHaveBeenCalledWith({
      title: 'Board saved successfully',
      color: 'success',
      timeout: 3000,
    });
    expect(state.jsonLoading).toBe(false);

    // saveSpy.mockRestore();
  });

  it('pushBoards should capture error and reset loading when save fails', async () => {
    // Arrange: force saveBoardToJson to reject
    const saveSpy = jest
      .spyOn(useJsonStore.getState(), 'saveBoardToJson')
      .mockRejectedValueOnce(new Error('save-fail'));

    // Act
    const pushPromise = act(async () => {
      await useJsonStore.getState().pushBoards(sampleBoard);
    });

    // Loading flips to true
    expect(useJsonStore.getState().jsonLoading).toBe(true);

    await pushPromise;

    // Assert: error recorded, loading false
    const state = useJsonStore.getState();
    expect(state.jsonError).toBe('save-fail');
    expect(state.jsonLoading).toBe(false);

    saveSpy.mockRestore();
  });

  it('removeBoard should delete board and call saveBoardToJson', async () => {
    // Arrange: insert board into state
    act(() => {
      useJsonStore.getState().pushBoards(sampleBoard);
    });
    expect(useJsonStore.getState().boards[sampleBoard.name]).toBeDefined();

    // Spy on saveBoardToJson
    const saveSpy = jest.spyOn(useJsonStore.getState(), 'saveBoardToJson').mockResolvedValue();

    // Act
    await act(async () => {
      await useJsonStore.getState().removeBoard(sampleBoard.name);
    });

    // Assert: board removed and save called
    const state = useJsonStore.getState();
    expect(state.boards[sampleBoard.name]).toBeUndefined();
    expect(saveSpy).toHaveBeenCalled();

    saveSpy.mockRestore();
  });
});
