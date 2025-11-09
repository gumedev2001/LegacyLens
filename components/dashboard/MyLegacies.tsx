 'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // <- AGREGAR ESTE IMPORT
import { useAuth } from '../../contexts/AuthContext';
import { getUserLegacies, Legacy } from '../../lib/firestoreService';
import styles from './DashboardSections.module.css';

export default function MyLegacies() {
  const { user } = useAuth();
  const router = useRouter(); // <- AGREGAR ESTA LÍNEA
  const [legacies, setLegacies] = useState<Legacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadLegacies();
    }
  }, [user]);

  const loadLegacies = async () => {
    try {
      setLoading(true);
      const userLegacies = await getUserLegacies(user!.uid);
      setLegacies(userLegacies);
    } catch (error: any) {
      console.error('Error cargando legados:', error);
      setError('Error al cargar los legados');
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'active':
        return { text: 'Activo', class: styles.statusActive };
      case 'draft':
        return { text: 'Borrador', class: styles.statusDraft };
      case 'completed':
        return { text: 'Completado', class: styles.statusCompleted };
      default:
        return { text: status, class: styles.statusActive };
    }
  };

  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Mis Legados Familiares</h2>
          <p>Gestiona y visualiza todos tus legados creados</p>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Cargando tus legados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Mis Legados Familiares</h2>
          <p>Gestiona y visualiza todos tus legados creados</p>
        </div>
        <div className={styles.errorState}>
          <p>{error}</p>
          <button onClick={loadLegacies} className={styles.retryButton}>
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Mis Legados Familiares</h2>
        <p>Gestiona y visualiza todos tus legados creados</p>
        <div className={styles.legacyCount}>
          {legacies.length} legado{legacies.length !== 1 ? 's' : ''} encontrado{legacies.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className={styles.legaciesGrid}>
        {legacies.map(legacy => {
          const statusInfo = getStatusDisplay(legacy.status);
          return (
            <div key={legacy.id} className={styles.legacyCard}>
              <div className={styles.legacyHeader}>
                <h3>{legacy.title}</h3>
                <span className={`${styles.status} ${statusInfo.class}`}>
                  {statusInfo.text}
                </span>
              </div>
              <p className={styles.legacyDescription}>
                {legacy.description || 'Sin descripción'}
              </p>
              <div className={styles.legacyMeta}>
                <span>👤 {legacy.familyMember || 'No especificado'}</span>
                <span>⏳ {legacy.era || 'No especificado'}</span>
                <span>🔒 {legacy.privacy === 'private' ? 'Privado' : legacy.privacy === 'family' ? 'Familiar' : 'Público'}</span>
              </div>
              <div className={styles.legacyStats}>
                <span>📖 {legacy.storiesCount} historias</span>
                <span>📸 {legacy.photosCount} fotos</span>
                <span>📅 Creado: {legacy.createdAt.toLocaleDateString()}</span>
              </div>
              <div className={styles.legacyActions}>
                <button 
                  className={styles.primaryButton}
                  onClick={() => router.push(`/dashboard/legacy/${legacy.id}`)}
                >
                  Gestionar Contenido
                </button>
                <button 
                  className={styles.secondaryButton}
                  onClick={() => router.push(`/dashboard/legacy/${legacy.id}?tab=info`)}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {legacies.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>No tienes legados creados</h3>
          <p>Comienza creando tu primer legado familiar para preservar tus historias.</p>
          <button 
            className={styles.ctaButton}
            onClick={() => router.push('/dashboard?view=create')}
          >
            Crear Mi Primer Legado
          </button>
        </div>
      )}
    </div>
  );
}