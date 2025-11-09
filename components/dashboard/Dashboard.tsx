'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import styles from './Dashboard.module.css';
import DashboardSidebar from './DashboardSidebar';
import DashboardHeader from './DashboardHeader';
import MyLegacies from './MyLegacies';
import CreateLegacy from './CreateLegacy';
import Profile from './Profile';
import Analytics from './Analytics';

type DashboardView = 'legacies' | 'create' | 'profile' | 'analytics';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeView, setActiveView] = useState<DashboardView>('legacies');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const renderActiveView = () => {
    switch (activeView) {
      case 'legacies':
        return <MyLegacies />;
      case 'create':
        return <CreateLegacy />;
      case 'profile':
        return <Profile />;
      case 'analytics':
        return <Analytics />;
      default:
        return <MyLegacies />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <DashboardSidebar 
  activeView={activeView}
  setActiveView={setActiveView}
  isOpen={isSidebarOpen}        // ← ESTE DEBE CAMBIAR
  onClose={() => setIsSidebarOpen(false)}
/>
      
      <div className={styles.mainContent}>
        <DashboardHeader 
          user={user}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
        
        <div className={styles.content}>
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
}