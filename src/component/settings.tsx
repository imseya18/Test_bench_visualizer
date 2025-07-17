import { useState } from 'react';

import { Input, Button, Card, CardBody } from '@heroui/react';
import { invoke } from '@tauri-apps/api/core';
import { Icon } from '@iconify/react';
import {
  scan,
  Format,
  checkPermissions,
  requestPermissions,
} from '@tauri-apps/plugin-barcode-scanner';
import { gitlabError } from '../utils/error';
import { LEDStripManager } from './led-manager';
import { Divider } from '@heroui/divider';
const QrCodePress = async () => {
  const permission = await checkPermissions();
  if (permission === 'prompt') await requestPermissions();
  if (permission === 'granted') {
    const test = await scan({ cameraDirection: 'back', formats: [Format.QRCode] });
    invoke('set_api_key', { token: test.content });
  }
};

export function Settings() {
  const [gitlabToken, setGitlabToken] = useState<string>('');
  const submitGitLabToken = async () => {
    try {
      await invoke('set_api_key', { token: gitlabToken });
    } catch (error: unknown) {
      gitlabError(error);
    }
  };

  return (
    <div className='flex flex-col items-center  flex-1 p-6 overflow-auto'>
      <h1 className='text-2xl font-bold mb-4'>Settings</h1>
      <div className='w-full max-w-3xl space-y-6'>
        <LEDStripManager />

        <Divider className='mt-6 mb-6 max-w-3xl' />

        <Card>
          <CardBody className='space-y-6'>
            <h2 className='text-xl font-semibold'>GitLab Configuration</h2>

            <Input
              label='GitLab API Token'
              placeholder='Enter your GitLab API token'
              type='password'
              value={gitlabToken}
              onValueChange={setGitlabToken}
              startContent={
                <Icon
                  icon='logos:gitlab'
                  className='text-default-400 pointer-events-none flex-shrink-0'
                />
              }
            />
            <Button color='primary' onPress={submitGitLabToken} isDisabled={!gitlabToken}>
              Save GitLab Token
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
