// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Providers } from './providers'
import { Footer } from '@/components/layout/Footer' // Ajout du footer pour une structure complète

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tipso - Soutenez vos créateurs',
  description: 'Une plateforme de dons Web3 pour les créateurs de contenu.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      {/* --- CORRECTIONS CSS ---
        1. h-dvh : Assure que le conteneur prend 100% de la hauteur dynamique de la fenêtre.
        2. flex flex-col : Structure la page verticalement pour que le footer soit poussé en bas.
        3. bg-gradient... : Applique le fond moderne.
      */}
      <body className={inter.className + " flex flex-col bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-950 text-gray-200 h-dvh"}>
        <Providers>
          <Header />
          {/* La classe flex-grow permet au contenu principal de prendre tout l'espace disponible */}
          <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}