import { BleDevice, startScan } from "@mnlphlp/plugin-blec";
/**
 *  Wrapper of StartScan function to match the scan endding and the resolution.
 *  Useful for isScanning state as exemple.
 * @param onUpdate  A function that will be called with an array of devices found during the scan
 * @param timeout 
 * @returns 
 */
export function scanBleDevices(
  onUpdate: (devs: BleDevice[]) => void,
  timeout: number
): Promise<void> {
  return new Promise(resolve => {
    startScan(onUpdate, timeout);
    setTimeout(resolve, timeout);
  });
}