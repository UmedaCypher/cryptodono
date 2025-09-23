// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "./providers"; // <-- Importer le Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
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
        <Providers> {/* <-- Ouvrir le Provider ici */}
          <Header />
          <main className="flex-grow container mx-auto p-8">
            {children}
          </main>
          <Footer />
        </Providers> {/* <-- Fermer le Provider ici */}
      </body>
    </html>
  );
}