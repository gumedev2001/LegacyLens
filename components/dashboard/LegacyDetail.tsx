'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { getLegacy, getLegacyStories, Story, Legacy } from '../../lib/firestoreService';
import StoriesSection from './StoriesSection';
import PhotosSection from './PhotosSection';
import LegacyInfo from './LegacyInfo';
import styles from './LegacyDetail.module.css';

export default function LegacyDetail() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const legacyId = params.id as string;

  const [legacy, setLegacy] = useState<Legacy | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [activeTab, setActiveTab] = useState<'stories' | 'photos' | 'info'>('stories');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (legacyId && user) {
      loadLegacyData();
    }
  }, [legacyId, user]);

  const loadLegacyData = async () => {
    try {
      setLoading(true);
      const [legacyData, storiesData] = await Promise.all([
        getLegacy(legacyId),
        getLegacyStories(legacyId)
      ]);

      if (!legacyData) {
        setError('Legado no encontrado');
        return;
      }

      if (legacyData.userId !== user!.uid) {
        setError('No tienes permisos para ver este legado');
        return;
      }

      setLegacy(legacyData);
      setStories(storiesData);
    } catch (error: any) {
      console.error('Error cargando legado:', error);
      setError('Error al cargar el legado');
    } finally {
      setLoading(false);
    }
  };

  const handleStoryAdded = (newStory: Story) => {
  setStories(prev => [newStory, ...prev]);  // ← NUEVO: AGREGA INMEDIATO
  setLegacy(prev => ({ ...prev!, storiesCount: prev!.storiesCount + 1 }));  // ← CONTADOR
};



const handlePhotoAdded = (newPhoto: Photo) => {
  setLegacy(prev => ({ ...prev!, photosCount: prev!.photosCount + 1 }));
  // ← Fotos reales después
  console.log('Foto agregada:', newPhoto);
};

  const handleStoryDeleted = (storyId: string) => {
    console.log('Historia eliminada:', storyId);
  };

  const handlePhotoDeleted = (photoId: string) => {
    console.log('Foto eliminada:', photoId);
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Cargando legado...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error}>
        <p>{error}</p>
        <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
          Volver al Dashboard
        </button>
      </div>
    );
  }

  if (!legacy) {
    return (
      <div className={styles.error}>
        <p>Legado no encontrado</p>
        <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
          Volver al Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.push('/dashboard')} className={styles.backButton}>
          ← Volver a Mis Legados
        </button>
        <h1>{legacy.title}</h1>
        <p>{legacy.description}</p>
      </header>

      <nav className={styles.tabs}>
        <button 
          className={`${styles.tab} ${activeTab === 'stories' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('stories')}
        >
          📖 Historias ({legacy.storiesCount})
        </button>
        
        <button 
          className={`${styles.tab} ${activeTab === 'photos' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('photos')}
        >
          📸 Fotos ({legacy.photosCount})
        </button>
 
        <button 
          className={`${styles.tab} ${activeTab === 'info' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('info')}
        >
          ⚙️ Información
        </button>
      </nav>

      <div className={styles.content}>
        {activeTab === 'stories' && (
          <StoriesSection 
            legacy={legacy}
            stories={stories}
            onStoryAdded={handleStoryAdded}
            onStoryDeleted={handleStoryDeleted}
          />
        )}
        {activeTab === 'photos' && (
  <PhotosSection 
    legacy={legacy}
    onPhotoAdded={handlePhotoAdded}
    onPhotoDeleted={handlePhotoDeleted}
    photos={[]}  // ← Temporal
  />
)}
        {activeTab === 'info' && (
          <LegacyInfo legacy={legacy} />
        )}
      </div>
    </div>
  );
}

