import React from 'react';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import LandingPage from '@/pages/LandingPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LandingPage />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1A365D',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.1)',
            fontFamily: 'Open Sans, sans-serif',
          },
        }}
      />
    </QueryClientProvider>
  );
}
