import { addToast } from '@heroui/react';

export function gitlabError(error: string) {
  let errorMessage = String('');

  if (error.includes('401')) {
    errorMessage = '401 unauthorized: change or set your API token';
  }

  addToast({
    title: 'GitLab Error',
    color: 'danger',
    description: errorMessage,
    timeout: 3000,
  });
}

export function storeError(error: string) {
  addToast({
    title: 'store Error',
    color: 'danger',
    description: error,
    timeout: 3000,
  });
}

export function bleError(error: string) {
  addToast({
    title: 'BLE Error',
    color: 'danger',
    description: error,
    timeout: 3000,
  });
}
