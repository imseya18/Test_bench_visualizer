// utils/store-path.ts
import { appDataDir, join } from '@tauri-apps/api/path';

export const getStorePath = async () => {
  const dir = await appDataDir();
  return join(dir, 'json', 'store.json');
};
