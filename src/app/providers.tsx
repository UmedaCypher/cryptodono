// src/app/providers.tsx

'use client' // Ce composant s'exécute côté client (navigateur)

import React, { ReactNode } from 'react';
import { WagmiProvider, createConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/lib/wagmiConfig'; // On importe notre config

// wagmi a besoin de react-query pour gérer le cache des données
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}