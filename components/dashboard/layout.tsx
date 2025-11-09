'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import styles from '../../components/dashboard/Dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState('legacies');

  // Determinar la vista activa basada en la ruta
  useEffect(() => {
    if (pathname.includes('/dashboard/legacy/')) {
      setActiveView('legacies');
    } else if (pathname.includes('/dashboard?view=create')) {
      setActiveView('create');
    }
  }, [pathname]);

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.dashboard}>
      <DashboardSidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className={styles.mainContent}>
        <DashboardHeader 
          user={user}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
}