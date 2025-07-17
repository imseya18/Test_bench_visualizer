import {
  BleDevice,
  getConnectionUpdates,
  startScan,
  sendString,
  readString,
  unsubscribe,
  subscribeString,
  stopScan,
  connect,
  disconnect,
  getScanningUpdates,
  checkPermissions,
} from '@mnlphlp/plugin-blec';
import { useRef } from 'react';

export async function test() {
  const devices = useRef<BleDevice[]>([]);
  startScan((dev: BleDevice[]) => (devices.current = dev), 1000);

  return devices;
}
