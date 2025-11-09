'use client';

import { Legacy } from '../../lib/firestoreService';
import styles from './LegacyDetail.module.css';

interface LegacyInfoProps {
  legacy: Legacy;
}

export default function LegacyInfo({ legacy }: LegacyInfoProps) {
  return (
    <div className={styles.infoSection}>
      <div className={styles.sectionHeader}>
        <h3>Información del Legado</h3>
        <p>Detalles y configuración de este legado familiar</p>
      </div>

      <div className={styles.infoGrid}>
        <div className={styles.infoCard}>
          <h4>Información Básica</h4>
          <div className={styles.infoItem}>
            <strong>Título:</strong>
            <span>{legacy.title}</span>
          </div>
          <div className={styles.infoItem}>
            <strong>Descripción:</strong>
            <span>{legacy.description || 'Sin descripción'}</span>
          </div>
          <div className={styles.infoItem}>
            <strong>Miembro Familiar:</strong>
            <span>{legacy.familyMember || 'No especificado'}</span>
          </div>
          <div className={styles.infoItem}>
            <strong>Época:</strong>
            <span>{legacy.era || 'No especificada'}</span>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h4>Configuración</h4>
          <div className={styles.infoItem}>
            <strong>Privacidad:</strong>
            <span>
              {legacy.privacy === 'private' ? 'Privado' : 
               legacy.privacy === 'family' ? 'Compartido con familia' : 'Público'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <strong>Estado:</strong>
            <span>
              {legacy.status === 'active' ? 'Activo' : 
               legacy.status === 'draft' ? 'Borrador' : 'Completado'}
            </span>
          </div>
          <div className={styles.infoItem}>
            <strong>Creado:</strong>
            <span>{legacy.createdAt.toLocaleDateString()}</span>
          </div>
          <div className={styles.infoItem}>
            <strong>Actualizado:</strong>
            <span>{legacy.updatedAt.toLocaleDateString()}</span>
          </div>
        </div>

        <div className={styles.infoCard}>
          <h4>Estadísticas</h4>
          <div className={styles.infoItem}>
            <strong>Historias:</strong>
            <span>{legacy.storiesCount}</span>
          </div>
          <div className={styles.infoItem}>
            <strong>Fotos:</strong>
            <span>{legacy.photosCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}