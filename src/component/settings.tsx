import React, { useEffect } from 'react';
import { useState } from 'react';
import { Input, Form, Button } from '@heroui/react';
import { invoke } from '@tauri-apps/api/core';
import { Icon } from '@iconify/react';
import {
  scan,
  Format,
  checkPermissions,
  requestPermissions,
} from '@tauri-apps/plugin-barcode-scanner';
import { addToast } from '@heroui/react';
import { bleError } from '../utils/error';
import {
  BleDevice,
  getConnectionUpdates,
  startScan,
  connect,
  disconnect,
  send,
} from '@mnlphlp/plugin-blec';

import {
  TURN_ON,
  SET_BLUE,
  SET_GREEN,
  SET_RED,
  BRIGHTNESS_UP,
  BRIGHTNESS_DOWN,
  LED,
  CMD_SET_RGB_SEQ,
  SECTION,
  WS2812B,
} from '../utils/led-control';
const uuid = '0000fee7-0000-1000-8000-00805f9b34fb';
const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  invoke('set_api_key', { token: data.Token });
};

const QrCodePress = async () => {
  const permission = await checkPermissions();
  if (permission === 'prompt') await requestPermissions();
  if (permission === 'granted') {
    console.log('ok');
    const test = await scan({ cameraDirection: 'back', formats: [Format.QRCode] });
    invoke('set_api_key', { token: test.content });
  }
};

const controlLed = async (instruction: Uint8Array<ArrayBuffer>) => {
  await send('0000ffe1-0000-1000-8000-00805f9b34fb', instruction, 'withResponse');
};

export function Settings() {
  const [devices, setDevices] = useState<BleDevice[]>([]);

  useEffect(() => {
    console.log(devices);
  }, [devices]);

  useEffect(() => {
    getConnectionUpdates((state) => {
      console.log(state);
      if (state) {
        addToast({
          title: 'LED',
          color: 'success',
          description: 'Led connected',
          timeout: 3000,
        });
      }
    });
  }, []);

  const test = (dev: BleDevice[]) => {
    const new_tab = dev.filter((device) => device.services.includes(uuid));
    setDevices(new_tab);
  };

  const tryConnection = () => {
    try {
      connect('79:97:04:04:08:8A', () => bleError('Led Disconected'));
    } catch (error: unknown) {
      console.log(test);
      const message = String(error);
      bleError(message);
    }
  };

  const tryDisconnection = () => {
    try {
      disconnect();
    } catch (error: unknown) {
      console.log(test);
      const message = String(error);
      bleError(message);
    }
  };
  return (
    <div className='flex-1 flex flex-col items-center justify-center gap-4 w-fullscreen'>
      <Form className='w-full max-w-xs' onSubmit={onSubmit}>
        <div className='flex flex-row gap-3 '>
          <Input
            className='max-w-xs'
            name='Token'
            label='Token'
            placeholder='Enter Gitlab Token'
            type={'password'}
            variant='bordered'
          />
          <Button isIconOnly className='h-14 w-16 2xl:hidden'>
            <Icon
              icon='material-symbols:qr-code'
              style={{ fontSize: '24px' }}
              onClick={QrCodePress}
            />
          </Button>
        </div>
        <Button color='primary' type='submit'>
          Submit
        </Button>
      </Form>
      <Button color='primary' onPress={() => startScan((dev: BleDevice[]) => test(dev), 10_000)}>
        Print Device
      </Button>
      <Button color='primary' onPress={tryConnection}>
        connect
      </Button>
      <Button color='primary' onPress={tryDisconnection}>
        disconnect
      </Button>
      <div className='flex space-x-4'>
        <Button color='primary' onPress={() => controlLed(TURN_ON)}>
          Led ON/OFF
        </Button>
        <Button color='primary' onPress={() => controlLed(SET_RED)}>
          RED
        </Button>
        <Button color='primary' onPress={() => controlLed(SET_GREEN)}>
          GREEN
        </Button>
        <Button color='primary' onPress={() => controlLed(SET_BLUE)}>
          BLUE
        </Button>
        <Button color='primary' onPress={() => controlLed(BRIGHTNESS_UP)}>
          MAX_BRIGHT
        </Button>
        <Button color='primary' onPress={() => controlLed(BRIGHTNESS_DOWN)}>
          MIN_BRIGHT
        </Button>
        <Button color='primary' onPress={() => controlLed(LED)}>
          SET_LED
        </Button>
        <Button color='primary' onPress={() => controlLed(SECTION)}>
          SET_SECTION
        </Button>
        <Button color='primary' onPress={() => controlLed(WS2812B)}>
          WS2812B
        </Button>
        <Button color='primary' onPress={() => controlLed(CMD_SET_RGB_SEQ)}>
          RGB SEQ
        </Button>
      </div>
    </div>
  );
}
