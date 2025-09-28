// src/app/settings/profile/page.tsx

'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabaseClient'
import type { User } from '@supabase/supabase-js'

export default function ProfileSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [username, setUsername] = useState('')
  const [description, setDescription] = useState('')

  // La logique reste 100% identique
  const getProfile = useCallback(async (currentUser: User) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('profiles').select(`username, description`).eq('id', currentUser.id).single()
      if (error && error.code !== 'PGRST116') throw error
      if (data) {
        setUsername(data.username || '')
        setDescription(data.description || '')
      }
    } catch (error) { console.error(error) } 
    finally { setLoading(false) }
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user)
        getProfile(session.user)
      } else { setLoading(false) }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user)
        getProfile(session.user)
      } else {
        setUser(null)
        setLoading(false)
      }
    })
    return () => subscription.unsubscribe()
  }, [getProfile])

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!user) return

    try {
      setLoading(true)

      const updates = {
        // On n'a plus besoin de l'id ici, car il sera dans la condition .eq()
        username,
        description,
        updated_at: new Date().toISOString(),
      }

      // ✅ CORRECTION : Remplacer .upsert() par .update() avec une condition .eq()
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id) // On spécifie quelle ligne mettre à jour

      if (error) {
        throw error
      }
      
      alert('Profil mis à jour avec succès !')
    } catch (error: any) {
      alert('Erreur lors de la mise à jour du profil.')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center p-8 text-gray-300">Chargement...</div>
  if (!user) return <div className="text-center p-8 text-gray-300">Veuillez vous connecter pour voir cette page.</div>

  // --- MODIFICATION DU DESIGN ---
  return (
    <div className="max-w-2xl mx-auto mt-10">
      {/* Effet Glassmorphism pour la carte principale */}
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-8">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">
          Paramètres du Profil
        </h1>
        <form onSubmit={handleUpdateProfile}>
          <div className="space-y-6">
            <div>
              <label htmlFor="wallet_address" className="block text-sm font-medium text-gray-300 mb-1">
                Adresse du portefeuille
              </label>
              <input
                id="wallet_address"
                type="text"
                value={user.user_metadata.address || ''}
                disabled
                className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-gray-400 cursor-not-allowed focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Nom d'utilisateur public
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="satoshi"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Décrivez votre activité de créateur..."
              />
            </div>
          </div>
          <div className="mt-8">
            {/* Bouton avec dégradé et effets modernes */}
            <button
              type="submit"
              className="w-full font-semibold py-3 px-4 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 shadow-lg shadow-blue-500/30 hover:scale-105 transform transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
              disabled={loading}
            >
              {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}