// src/components/ui/ConnectButton.tsx
'use client'

import { useState, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { supabase } from '@/lib/supabaseClient'
import { LoginModal } from '../features/LoginModal' // Importez la modale

export function ConnectButton() {
  const [isMounted, setIsMounted] = useState(false)
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  // État pour gérer la visibilité de la modale
  const [isLoginModalOpen, setLoginModalOpen] = useState(false)
  
  // État pour savoir si la session Supabase est active
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    
    // Vérifier la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
      // Si une session est créée, fermer la modale
      if (session) {
        setLoginModalOpen(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = () => {
    supabase.auth.signOut();
    disconnect();
  }

  if (!isMounted) {
    return null // Empêche les erreurs d'hydratation
  }

  // Si l'utilisateur est authentifié sur Supabase
  if (isAuthenticated && address) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm font-medium text-gray-700 bg-gray-100 px-3 py-2 rounded-lg">
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </p>
        <button
          onClick={handleLogout}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Déconnexion
        </button>
      </div>
    )
  }

  // Si le portefeuille est déconnecté ou pas encore authentifié sur Supabase
  return (
    <>
      <button
        onClick={() => setLoginModalOpen(true)} // Le seul rôle du bouton est d'ouvrir la modale
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
      >
        Se connecter
      </button>
      
      {/* La modale est maintenant contrôlée par le ConnectButton */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
      />
    </>
  )
}