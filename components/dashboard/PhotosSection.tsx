'use client';

import { useState } from 'react';
import { Legacy, Photo } from '../../lib/firestoreService';

import { uploadPhoto } from '../../lib/firestoreService';
import styles from './LegacyDetail.module.css';

interface PhotosSectionProps {
  legacy: Legacy;
  onPhotoAdded: (photo: Photo) => void;
  onPhotoDeleted: (photoId: string) => void;
}


export default function PhotosSection({ legacy, onPhotoAdded, onPhotoDeleted }: PhotosSectionProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]); // ← ¡ESTA LÍNEA!
  const photosPerPage = 6;
  // ← FILTRAR FOTOS
  // ← MOSTRAR FOTOS REALES
  
const filteredPhotos = [...(legacy.photos || []), ...photos]; // ← photos del state
  const searchedPhotos = filteredPhotos.filter(photo =>
    photo.caption?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    photo.date?.includes(searchTerm)
  );

  const indexOfLast = currentPage * photosPerPage;
  const indexOfFirst = indexOfLast - photosPerPage;
  const currentPhotos = searchedPhotos.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(searchedPhotos.length / photosPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setTimeout(() => document.querySelector('.photosGrid')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  // ← DRAG & DROP
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        try {
          const photoId = await uploadPhoto(file, legacy.id!, legacy.userId, {
            caption: '',
            date: '',
            location: '',
            people: [],
            tags: []
          });
          // ← Simular nueva foto (actualizar después)
          onPhotoAdded({ id: photoId, legacyId: legacy.id!, fileName: file.name, fileUrl: URL.createObjectURL(file), fileSize: file.size });
        } catch (error) {
          alert('Error subiendo foto');
        }
      }
    }
  };


  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  console.log('📸 SUBIENDO:', files.length, 'fotos');
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      try {
        console.log('🚀 SUBIENDO:', file.name);
        const photoId = await uploadPhoto(file, legacy.id!, legacy.userId);
        const photoUrl = URL.createObjectURL(file);
        const newPhoto = { id: photoId, legacyId: legacy.id!, fileName: file.name, fileUrl: photoUrl, fileSize: file.size, caption: '', date: '' };
        onPhotoAdded(newPhoto);
        console.log('✅ FOTO SUBIDA:', file.name);
      } catch (error) { console.error('❌ ERROR:', error); alert('Error subiendo ' + file.name); }
    }
  }
  e.target.value = '';
};

  return (
    <div className={styles.photosSection}>
      <div className={styles.sectionHeader}>
        <h3>📸 Fotos del Legado ({searchedPhotos.length})</h3>
        <p>Página {currentPage} de {totalPages}</p>
      </div>

      {/* ← BUSCADOR FIJO */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Buscar por descripción o fecha..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>


      <div className={`${styles.uploadZone} ${dragActive ? styles.dragActive : ''}`} onClick={() => { console.log('🔥 CLICK ZONE'); document.getElementById('fileInput')?.click(); }}>
        <input
          id="fileInput"
          type="file" multiple accept="image/*"
          onChange={(e) => { console.log('📸 FILES:', e.target.files); handleFileSelect(e); }}
          style={{ display: 'block', width: '100%', height: '100%', opacity: 0, position: 'absolute', cursor: 'pointer' }}
        />
        <p>🖼️ Arrastra fotos aquí o</p>
        <button type="button" className={styles.primaryButton} onClick={(e) => { e.stopPropagation(); console.log('🔥 BUTTON CLICK'); document.getElementById('fileInput')?.click(); }}>
          📁 Seleccionar Fotos
        </button>
      </div>


      {currentPhotos.length > 0 ? (
        <>
          <div className={styles.photosGrid}>
            {currentPhotos.map((photo) => (
              <div key={photo.id} className={styles.photoCard}>
                <img src={photo.fileUrl} alt={photo.caption} />
                <div className={styles.photoInfo}>
                  <p>{photo.caption || 'Sin descripción'}</p>
                  <small>📅 {photo.date || 'Sin fecha'}</small>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button onClick={() => goToPage(1)} disabled={currentPage === 1}>« Primera</button>
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>‹ Anterior</button>
              <span>{currentPage} de {totalPages}</span>
              <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente ›</button>
              <button onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>Última »</button>
            </div>
          )}
        </>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🖼️</div>
          <h4>¡Sube tus primeras fotos!</h4>
          <p>Arrastra imágenes para preservar tus recuerdos</p>
        </div>
      )}
    </div>
  );
}