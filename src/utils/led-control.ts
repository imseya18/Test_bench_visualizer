/* eslint-disable unicorn/number-literal-case */
import { bleError } from './error';
import { RGB } from './job-utilities';
import { send } from '@mnlphlp/plugin-blec';
const START_FLAG = 0x38;
const END_FLAG = 0x83;
const CMD_SET_LED_COLOR = 0x01;
const CMD_SET_LEDS_BRIGHTNESS = 0x02;
const UUID_LED_CONTROL = 'b18d531d-0d2e-4315-b253-677c0b9bdf72';

export const TURN_ON = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0x00, 0x03, END_FLAG]);
export const TURN_OFF = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0x00, 0x04, END_FLAG]);
export const SET_BLUE = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0xff, 0x01, END_FLAG]);
export const SET_RED = new Uint8Array([START_FLAG, 0x00, 0xff, 0x00, 0x00, 0x01, END_FLAG]);
export const SET_GREEN = new Uint8Array([START_FLAG, 0x00, 0x00, 0xff, 0x00, 0x01, END_FLAG]);
export const BRIGHTNESS_UP = new Uint8Array([START_FLAG, 0x00, 0xff, 0x00, 0x00, 0x02, END_FLAG]);
export const BRIGHTNESS_DOWN = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0x00, 0x02, END_FLAG]);
export const LED = new Uint8Array([START_FLAG, 0x04, 0x00, 0x00, 0x00, 0x3c, END_FLAG]);
export const SECTION = new Uint8Array([START_FLAG, 0x04, 0x00, 0x00, 0x2e, END_FLAG]);
export const WS2812B = new Uint8Array([START_FLAG, 0x03, 0x00, 0x00, 0x1c, END_FLAG]);
export const CMD_SET_RGB_SEQ = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0x10, END_FLAG]);

export async function setLedColors(cardPosition: number, ledColor: RGB) {
  console.log('payload sent on cardPosition:', cardPosition);
  const payload = new Uint8Array([
    START_FLAG,
    cardPosition,
    ledColor.r,
    ledColor.g,
    ledColor.b,
    CMD_SET_LED_COLOR,
    END_FLAG,
  ]);
  console.log('payload:', payload);
  try {
    await send(UUID_LED_CONTROL, payload, 'withoutResponse');
  } catch (error) {
    const message = String(error);
    bleError(message);
  }
}

export async function setLedBrightness(brightnessValue: number) {
  const payload = new Uint8Array([
    START_FLAG,
    0x00,
    brightnessValue,
    0x00,
    0x00,
    CMD_SET_LEDS_BRIGHTNESS,
    END_FLAG,
  ]);
  try {
    await send(UUID_LED_CONTROL, payload);
  } catch (error) {
    bleError(error);
  }
}
