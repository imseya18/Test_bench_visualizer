import React from 'react';
import { Input, Form, Button } from '@heroui/react';
import { invoke } from '@tauri-apps/api/core';
import { Icon } from '@iconify/react';
import {
  scan,
  Format,
  checkPermissions,
  requestPermissions,
} from '@tauri-apps/plugin-barcode-scanner';
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
export function Settings() {
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
    </div>
  );
}
