'use client';

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './DashboardSections.module.css';

export default function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || ''
  });

  const handleSave = () => {
    // Aquí iría la lógica para actualizar el perfil en Firebase
    setIsEditing(false);
    alert('Perfil actualizado correctamente');
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>Mi Perfil</h2>
        <p>Gestiona tu información personal y preferencias</p>
      </div>

      <div className={styles.profileCard}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
          </div>
          <div className={styles.profileInfo}>
            <h3>{user?.displayName || 'Usuario'}</h3>
            <p>{user?.email}</p>
            <span className={styles.memberSince}>
              Miembro desde {user?.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'recientemente'}
            </span>
          </div>
          <button 
            className={styles.editButton}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>

        {isEditing ? (
          <div className={styles.editForm}>
            <div className={styles.formGroup}>
              <label htmlFor="displayName">Nombre para mostrar</label>
              <input
                type="text"
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                placeholder="Tu nombre completo"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Correo electrónico</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                disabled
              />
              <small>El email no se puede modificar</small>
            </div>
            <button className={styles.saveButton} onClick={handleSave}>
              Guardar Cambios
            </button>
          </div>
        ) : (
          <div className={styles.profileStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>2</span>
              <span className={styles.statLabel}>Legados Creados</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>7</span>
              <span className={styles.statLabel}>Historias Guardadas</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>15</span>
              <span className={styles.statLabel}>Fotos Subidas</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}