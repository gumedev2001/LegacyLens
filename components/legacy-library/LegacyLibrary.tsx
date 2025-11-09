'use client';

import { useState, useEffect } from 'react';
import styles from './LegacyLibrary.module.css';

type Legacy = {
  id: string;
  title: string;
  description: string;
  image: string;
  creator: string;
  storiesCount: number;
  photosCount: number;
  createdAt: string;
  tags: string[];
};

export default function LegacyLibrary() {
  const [legacies, setLegacies] = useState<Legacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchLegacies();
  }, []);

  const fetchLegacies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/legacies');
      const result = await response.json();
      
      if (result.success) {
        setLegacies(result.data);
      } else {
        setError('Error al cargar los legados');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'Todos' },
    { id: 'family', label: 'Familia' },
    { id: 'travel', label: 'Viajes' },
    { id: 'food', label: 'Cocina' },
    { id: 'love', label: 'Amor' },
    { id: 'history', label: 'Historia' }
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredLegacies = legacies.filter(legacy => {
    if (activeFilter === 'all') return true;
    return legacy.tags.some(tag => 
      tag.toLowerCase().includes(activeFilter.toLowerCase())
    );
  });

  if (loading) {
    return (
      <section className={styles.librarySection}>
        <div className={styles.container}>
          <div className={styles.loading}>
            <p>Cargando legados familiares...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.librarySection}>
        <div className={styles.container}>
          <div className={styles.error}>
            <p>{error}</p>
            <button 
              onClick={fetchLegacies}
              className={styles.ctaButton}
              style={{ marginTop: '1rem' }}
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.librarySection} id="biblioteca">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Biblioteca de Legados</h2>
          <p className={styles.subtitle}>
            Descubre cómo otras familias están preservando sus historias más preciadas
          </p>
        </div>

        <div className={styles.filters}>
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`${styles.filterButton} ${
                activeFilter === filter.id ? styles.active : ''
              }`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className={styles.legaciesGrid}>
          {filteredLegacies.map(legacy => (
            <div key={legacy.id} className={styles.legacyCard}>
              <div className={styles.imagePlaceholder}>
                {legacy.title.split(' ').map(word => word[0]).join('')}
              </div>
              <div className={styles.cardContent}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{legacy.title}</h3>
                  <div className={styles.stats}>
                    <div className={styles.stat}>📖 {legacy.storiesCount}</div>
                    <div className={styles.stat}>📸 {legacy.photosCount}</div>
                  </div>
                </div>
                <p className={styles.cardDescription}>{legacy.description}</p>
                <div className={styles.creator}>
                  <div className={styles.creatorAvatar}>
                    {getInitials(legacy.creator)}
                  </div>
                  <span>Creado por {legacy.creator}</span>
                </div>
                <div className={styles.tags}>
                  {legacy.tags.map(tag => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>¿Listo para crear tu propio legado?</h3>
          <p>Únete a nuestra comunidad y comienza a preservar tus historias familiares hoy mismo.</p>
          <button className={styles.ctaButton}>
            Comenzar Mi Legado
          </button>
        </div>
      </div>
    </section>
  );
}