/* eslint-disable unicorn/number-literal-case */
const START_FLAG = 0x38;
const END_FLAG = 0x83;

export const TURN_ON = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0xaa, END_FLAG]);
export const TURN_OFF = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0xab, END_FLAG]);
export const SET_BLUE = new Uint8Array([START_FLAG, 0x00, 0x00, 0xff, 0x1e, END_FLAG]);
export const SET_RED = new Uint8Array([START_FLAG, 0xff, 0x00, 0x00, 0x1e, END_FLAG]);
export const SET_GREEN = new Uint8Array([START_FLAG, 0x00, 0xff, 0x00, 0x1e, END_FLAG]);
export const BRIGHTNESS_UP = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0x2a, END_FLAG]);
export const BRIGHTNESS_DOWN = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0x28, END_FLAG]);
export const LED = new Uint8Array([START_FLAG, 0x04, 0x00, 0x00, 0x3c, END_FLAG]);
export const SECTION = new Uint8Array([START_FLAG, 0x04, 0x00, 0x00, 0x2e, END_FLAG]);
export const WS2812B = new Uint8Array([START_FLAG, 0x03, 0x00, 0x00, 0x1c, END_FLAG]);
export const CMD_SET_RGB_SEQ = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0x10, END_FLAG]);
