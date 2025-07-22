import ReactDOM from 'react-dom/client';
import App from './app';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
ReactDOM.createRoot(document.querySelector('#root') as HTMLElement).render(
  //   <React.StrictMode>
  <HeroUIProvider>
    <ToastProvider
      toastProps={{
        variant: 'solid',
        timeout: 3000,
        classNames: {
          closeButton: 'opacity-100 absolute right-4 top-1/2 -translate-y-1/2',
        },
      }}
    />
    <main className='dark text-foreground bg-background'>
      <App />
    </main>
  </HeroUIProvider>,
  //   </React.StrictMode>
);
