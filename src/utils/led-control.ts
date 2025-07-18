/* eslint-disable unicorn/number-literal-case */
import { RGB } from './job-utilities';
import { send } from '@mnlphlp/plugin-blec';
const START_FLAG = 0x38;
const END_FLAG = 0x83;
const CMD_SET_LED_COLOR = 0x01;
const CMD_SET_LEDS_BRIGHTNESS = 0x02;
const CMD_SET_LEDS_ON = 0x03;
const CMD_SET_LEDS_OFF = 0x04;
const UUID_LED_CONTROL = 'b18d531d-0d2e-4315-b253-677c0b9bdf72';

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
    console.error(error);
  }
}

export async function setLedsBrightness(brightnessValue: number) {
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
    console.error(error);
  }
}

export async function setLedsOnOff(status: boolean) {
  const command_flag = status ? CMD_SET_LEDS_ON : CMD_SET_LEDS_OFF;
  const payload = new Uint8Array([START_FLAG, 0x00, 0x00, 0x00, 0x00, command_flag, END_FLAG]);
  try {
    await send(UUID_LED_CONTROL, payload);
  } catch (error) {
    console.error(error);
  }
}
