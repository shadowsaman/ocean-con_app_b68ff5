import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import type { ReactNode } from 'react';
import { queryClient } from '@/config/queryClient';
import { env } from '@/config/env';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Все провайдеры приложения в одном месте.
 * ИИ НЕ трогает этот файл, если не нужен новый провайдер.
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          duration: 4000,
        }}
      />
      {env.IS_DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
