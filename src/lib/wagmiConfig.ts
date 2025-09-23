// src/lib/wagmiConfig.ts

import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia], // Les réseaux supportés (production et test)
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})