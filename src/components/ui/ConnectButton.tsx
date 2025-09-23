// src/components/ui/ConnectButton.tsx

'use client' // Ce composant est interactif, il doit s'exécuter côté client.

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors' // Permet de se connecter aux portefeuilles injectés comme MetaMask

export function ConnectButton() {
  // Hook pour obtenir les informations du compte connecté
  const { address, isConnected } = useAccount()
  // Hook pour déclencher la connexion
  const { connect } = useConnect()
  // Hook pour la déconnexion
  const { disconnect } = useDisconnect()

  // Si le portefeuille est connecté, on affiche l'adresse et un bouton de déconnexion
  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-gray-700">
          {/* Affiche une version courte de l'adresse (ex: 0x1234...5678) */}
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </p>
        <button
          onClick={() => disconnect()}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Déconnexion
        </button>
      </div>
    )
  }

  // Sinon, on affiche le bouton pour se connecter
  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
    >
      Connecter le portefeuille
    </button>
  )
}