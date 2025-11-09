import './globals.css'
import type { Metadata } from 'next'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import ScrollToTop from '../components/layout/ScrollToTop'
import { AuthProvider } from '../contexts/AuthContext'

export const metadata: Metadata = {
  title: 'LegacyLens - Preserva tus Historias Familiares',
  description: 'Convierte los recuerdos en un legado eterno con nuestra plataforma de preservación familiar.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Header />
          <main>
            {children}
          </main>
          <Footer />
          <ScrollToTop />
        </AuthProvider>
      </body>
    </html>
  )
}