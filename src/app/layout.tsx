// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header"; // <-- Importer le Header
import { Footer } from "@/components/layout/Footer"; // <-- Importer le Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tipso - Soutenez vos créateurs",
  description: "Une plateforme de dons Web3 pour les créateurs de contenu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} flex flex-col min-h-screen bg-gray-50`}>
        <Header /> {/* <-- Ajouter le Header ici */}
        <main className="flex-grow container mx-auto p-8">
          {children} {/* <-- Le contenu de la page viendra ici */}
        </main>
        <Footer /> {/* <-- Ajouter le Footer ici */}
      </body>
    </html>
  );
}