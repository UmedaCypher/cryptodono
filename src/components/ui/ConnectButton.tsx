// src/components/ui/ConnectButton.tsx

'use client'

import { useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSignMessage } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { SiweMessage } from 'siwe'
import { supabase } from '@/lib/supabaseClient'

export function ConnectButton() {
  const { address, chainId, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  const [isLoading, setIsLoading] = useState(false)

  // Gère le processus de signature et de connexion à Supabase
  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      if (!address || !chainId) return

      // 1. Créer le message SIWE à signer
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: 'Connectez-vous à Tipso pour soutenir vos créateurs.',
        uri: window.location.origin,
        version: '1',
        chainId: chainId,
        nonce: (Math.random() + 1).toString(36).substring(7) // Nonce simple pour la démo
      })

      // 2. Demander à l'utilisateur de signer le message via MetaMask
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })

      // 3. Appeler notre Edge Function avec le message et la signature
      const supabaseFunctionUrl = 'https://supabase.com/dashboard/project/lqwiqjyzujfcrjabelly/functions' // <-- !! REMPLACEZ CECI !!
      const response = await fetch(supabaseFunctionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      })

      if (!response.ok) {
        throw new Error('La vérification de la signature a échoué.')
      }

      const session = await response.json()

      // 4. Établir la session dans le client Supabase
      await supabase.auth.setSession(session)
      console.log('Session Supabase établie avec succès !')

    } catch (error) {
      console.error('Erreur lors de la connexion SIWE:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Si le portefeuille est connecté, on affiche les options d'authentification
  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-gray-700">
          {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
        </p>
        <button
          onClick={handleSignIn}
          disabled={isLoading}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Connexion...' : 'Sign-In'}
        </button>
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