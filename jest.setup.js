/* global jest */
jest.mock('@tauri-apps/api/path', () => ({
  appDataDir: jest.fn().mockResolvedValue('/fake/dir'),
}));

jest.mock('@/stores/store-constant', () => ({
  getStorePath: () => Promise.resolve('/fake/dir/json/store.json'),
}));

jest.mock('@tauri-apps/plugin-store', () => ({
  load: jest.fn().mockResolvedValue({
    get: jest.fn().mockResolvedValue({}), // retour vide par défaut
    set: jest.fn().mockResolvedValue(),
    save: jest.fn().mockResolvedValue(),
  }),
}));

jest.mock('@tauri-apps/api/core', () => ({
  invoke: jest.fn().mockResolvedValue({}), // par défaut retourne {}
}));
