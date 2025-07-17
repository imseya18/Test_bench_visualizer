import { addToast } from '@heroui/react';

export function gitlabError(error: unknown) {
  let errorMessage = String(error);

  if (errorMessage.includes('401')) {
    errorMessage = '401 unauthorized: change or set your API token';
  }

  addToast({
    title: 'GitLab Error',
    color: 'danger',
    description: errorMessage,
    timeout: 3000,
  });
}

export function storeError(error: unknown) {
  const message = String(error);
  addToast({
    title: 'store Error',
    color: 'danger',
    description: message,
    timeout: 3000,
  });
}

export function bleError(error: unknown) {
  const message = String(error);
  addToast({
    title: 'BLE Error',
    color: 'danger',
    description: message,
    timeout: 3000,
  });
}
