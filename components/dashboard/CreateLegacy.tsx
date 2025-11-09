'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createLegacy } from '../../lib/firestoreService';
import { useRouter } from 'next/navigation';
import styles from './DashboardSections.module.css';

export default function CreateLegacy() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    familyMember: '',
    era: '',
    privacy: 'private' as 'private' | 'family' | 'public'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Debes estar autenticado para crear un legado');
      return;
    }

    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createLegacy({
        ...formData,
        userId: user.uid
      });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        familyMember: '',
        era: '',
        privacy: 'private'
      });
      
      alert('¡Legado creado exitosamente! Ahora puedes comenzar a agregar historias y fotos.');
      
      // Redirigir a la lista de legados
      router.push('/dashboard?view=legacies');
      
    } catch (error: any) {
      console.error('Error creando legado:', error);
      setError(error.message || 'Error al crear el legado. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Crear Nuevo Legado</h2>
        <p>Comienza a preservar las historias de tu familia</p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Título del Legado *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Historia de mi Abuelo Manuel"
            required
            disabled={isLoading}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe brevemente este legado familiar..."
            rows={3}
            disabled={isLoading}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="familyMember">Miembro Familiar</label>
            <input
              type="text"
              id="familyMember"
              name="familyMember"
              value={formData.familyMember}
              onChange={handleChange}
              placeholder="Ej: Abuelo, Madre, Tío..."
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="era">Época o Años</label>
            <input
              type="text"
              id="era"
              name="era"
              value={formData.era}
              onChange={handleChange}
              placeholder="Ej: Años 50, Infancia, Actualidad..."
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="privacy">Privacidad</label>
          <select
            id="privacy"
            name="privacy"
            value={formData.privacy}
            onChange={handleChange}
            disabled={isLoading}
          >
            <option value="private">Privado (solo yo)</option>
            <option value="family">Compartido con familia</option>
            <option value="public">Público (en biblioteca)</option>
          </select>
        </div>

        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Creando Legado...' : 'Crear Legado'}
        </button>
      </form>
    </div>
  );
}