import { BleDevice } from '@mnlphlp/plugin-blec';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { scanBleDevices } from '../utils/ble-utils';
const UUID_SERVICE = 'd0d02988-9d8c-41e1-abbc-c1587419475d';
const MIN_BRIGHTNESS = 0;
const MAX_BRIGHTNESS = 255;

interface LEDStripState {
  isScanning: boolean;
  ledStrips: BleDevice[];
  selectedStrip: BleDevice | undefined;

  brightness: number;
  ledCount: number;
  autoConnect: boolean;

  scanForStrip: () => Promise<void>;
  setSelectedStrip: (strip: BleDevice) => void;
  updateSelectedStrip: (update: Partial<BleDevice>) => void;
  setBrightness: (value: number) => void;
}

export const useLedStripStore = create<LEDStripState>()(
  immer((set, get) => ({
    isScanning: false,
    ledStrips: [],
    selectedStrip: undefined,
    brightness: 255,
    ledCount: 60,
    autoConnect: false,

    scanForStrip: async () => {
      set((draft) => {
        draft.isScanning = true;
      });
      try {
        await scanBleDevices(
          (dev: BleDevice[]) =>
            set((draft) => {
              draft.ledStrips = dev.filter((device) => device.services.includes(UUID_SERVICE));
            }),
          5000,
        );
      } 
      finally {
        set((draft) => {
          draft.isScanning = false;
        });
      }
    },

    setSelectedStrip(strip: BleDevice) {
      set((draft) => {
        draft.selectedStrip = strip;
      });
    },

    updateSelectedStrip(update: Partial<BleDevice>) {
      set((draft) => {
        const current = draft.selectedStrip;
        if (!current) return;
        draft.selectedStrip = { ...draft.selectedStrip, ...update } as BleDevice;
      });
    },

    setBrightness(value: number) {
        if(value < MIN_BRIGHTNESS || value > MAX_BRIGHTNESS){
            console.warn("Wrong Brightness value");
            return; 
        }
        set((draft) => {
            draft.brightness = value;
        })
    }
  })),
);
