/*
'use client';

import { useState } from 'react';
import { Legacy, Story } from '../../lib/firestoreService';
import styles from './LegacyDetail.module.css';

interface StoriesSectionProps {
  legacy: Legacy;
  stories: Story[];  // ← NUEVO
  onStoryAdded: (story: any) => void;
  onStoryDeleted: (storyId: string) => void;
}

export default function StoriesSection({ legacy, stories, onStoryAdded, onStoryDeleted }: StoriesSectionProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className={styles.storiesSection}>
      <div className={styles.sectionHeader}>
        <h3>Historias del Legado</h3>
        <p>Preserva las historias y anécdotas de tu familia</p>
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          + Agregar Historia
        </button>
      </div>

      {showForm ? (
        <div className={styles.formContainer}>
          <h4>Nueva Historia</h4>
          <p>Formulario para agregar historias - En desarrollo</p>
          <div className={styles.formActions}>
            <button className={styles.primaryButton}>Guardar Historia</button>
            <button 
              className={styles.secondaryButton}
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : stories.length > 0 ? (
        <div className={styles.storiesList}>
          {stories.map((story) => (
            <div key={story.id} className={styles.storyCard}>
              <h4>{story.title}</h4>
              <p>{story.content.substring(0, 100)}...</p>
              <span className={styles.storyDate}>
                {story.date ? new Date(story.date).toLocaleDateString() : 'Sin fecha'}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📖</div>
          <h4>No hay historias aún</h4>
          <p>Comienza agregando la primera historia a este legado familiar.</p>
        </div>
      )}
    </div>
  );
}
*X1*/
/*
'use client';

import { useState } from 'react';
import { Legacy, Story } from '../../lib/firestoreService';
import { createStory } from '../../lib/firestoreService';
import styles from './LegacyDetail.module.css';

interface StoriesSectionProps {
  legacy: Legacy;
  stories: Story[];
  onStoryAdded: (story: Story) => void;
  onStoryDeleted: (storyId: string) => void;
}

export default function StoriesSection({ legacy, stories, onStoryAdded, onStoryDeleted }: StoriesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    location: '',
    people: [''],
    tags: ['']
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field: 'people' | 'tags', index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addField = (field: 'people' | 'tags') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeField = (field: 'people' | 'tags', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const storyId = await createStory({
        legacyId: legacy.id!,
        title: formData.title,
        content: formData.content,
        date: formData.date,
        location: formData.location,
        people: formData.people.filter(p => p.trim()),
        tags: formData.tags.filter(t => t.trim()),
        userId: legacy.userId
      });
      
      onStoryAdded({ id: storyId, ...formData, legacyId: legacy.id!, userId: legacy.userId });
      setShowForm(false);
      setFormData({ title: '', content: '', date: '', location: '', people: [''], tags: [''] });
    } catch (error) {
      alert('Error guardando historia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.storiesSection}>
      <div className={styles.sectionHeader}>
        <h3>📖 Historias del Legado ({stories.length})</h3>
        <p>Preserva las historias y anécdotas de tu familia</p>
        <button 
          className={styles.addButton}
          onClick={() => setShowForm(true)}
        >
          + Nueva Historia
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className={styles.storyForm}>
          <h4>✍️ Nueva Historia</h4>
          
          <div className={styles.formGroup}>
            <label>Título *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Ej: Mi primer amor"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Historia Completa *</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Cuéntame todo lo que recuerdas..."
              rows={5}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Fecha</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Lugar</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Ej: Monterrey, NL"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Personas</label>
            {formData.people.map((person, index) => (
              <div key={index} className={styles.arrayField}>
                <input
                  type="text"
                  value={person}
                  onChange={(e) => handleArrayChange('people', index, e.target.value)}
                  placeholder={`Persona ${index + 1}`}
                />
                {formData.people.length > 1 && (
                  <button type="button" onClick={() => removeField('people', index)}>×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addField('people')}>+ Agregar Persona</button>
          </div>

          <div className={styles.formGroup}>
            <label>Etiquetas</label>
            {formData.tags.map((tag, index) => (
              <div key={index} className={styles.arrayField}>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                  placeholder={`#amor, #familia`}
                />
                {formData.tags.length > 1 && (
                  <button type="button" onClick={() => removeField('tags', index)}>×</button>
                )}
              </div>
            ))}
            <button type="button" onClick={() => addField('tags')}>+ Agregar Etiqueta</button>
          </div>

          <div className={styles.formActions}>
            <button type="submit" disabled={loading} className={styles.primaryButton}>
              {loading ? 'Guardando...' : '📝 Guardar Historia'}
            </button>
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              className={styles.secondaryButton}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : stories.length > 0 ? (
        <div className={styles.storiesGrid}>
          {stories.map((story) => (
            <div key={story.id} className={styles.storyCard}>
              <h4>{story.title}</h4>
              <p>{story.content.substring(0, 100)}...</p>
              <div className={styles.storyMeta}>
                <span>📅 {story.date ? new Date(story.date).toLocaleDateString() : 'Sin fecha'}</span>
                {story.location && <span>📍 {story.location}</span>}
              </div>
              <div className={styles.storyTags}>
                {story.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i}>#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📖</div>
          <h4>¡Comienza tu legado!</h4>
          <p>Agrega la primera historia familiar</p>
        </div>
      )}
    </div>
  );
}
*X2*/
/*
'use client';

import { useState } from 'react';
import { Legacy, Story } from '../../lib/firestoreService';
import { createStory } from '../../lib/firestoreService';
import styles from './LegacyDetail.module.css';

interface StoriesSectionProps {
  legacy: Legacy;
  stories: Story[];
  onStoryAdded: (story: Story) => void;
  onStoryDeleted: (storyId: string) => void;
}

export default function StoriesSection({ legacy, stories, onStoryAdded, onStoryDeleted }: StoriesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', content: '', date: '', location: '', people: [''], tags: ['']
  });
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);  // ← PAGINADOR
  const storiesPerPage = 3;  // ← 3 por página

  // ← TODO EL FORMULARIO MISMO (no cambia)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field: 'people' | 'tags', index: number, value: string) => {
    const newArray = [...formData[field]]; newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addField = (field: 'people' | 'tags') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeField = (field: 'people' | 'tags', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const storyId = await createStory({
        legacyId: legacy.id!, title: formData.title, content: formData.content,
        date: formData.date, location: formData.location,
        people: formData.people.filter(p => p.trim()),
        tags: formData.tags.filter(t => t.trim()), userId: legacy.userId
      });
      onStoryAdded({ id: storyId, ...formData, legacyId: legacy.id!, userId: legacy.userId });
      setShowForm(false); setFormData({ title: '', content: '', date: '', location: '', people: [''], tags: [''] });
      setCurrentPage(1);  // ← VUELVE A PÁGINA 1
    } catch (error) { alert('Error guardando historia'); } finally { setLoading(false); }
  };

  // ← PAGINADOR
  const indexOfLast = currentPage * storiesPerPage;
  const indexOfFirst = indexOfLast - storiesPerPage;
  const currentStories = stories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(stories.length / storiesPerPage);

  const goToPage = (page: number) => { setCurrentPage(page); };

  return (
    <div className={styles.storiesSection}>
      <div className={styles.sectionHeader}>
        <h3>📖 Historias del Legado ({stories.length})</h3>
        <p>Página {currentPage} de {totalPages}</p>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          + Nueva Historia
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className={styles.storyForm}>
          {/* ← FORMULARIO MISMO - NO CAMBIA }
          <h4>✍️ Nueva Historia</h4>
          <div className={styles.formGroup}><label>Título *</label><input name="title" value={formData.title} onChange={handleInputChange} required /></div>
          <div className={styles.formGroup}><label>Historia Completa *</label><textarea name="content" value={formData.content} onChange={handleInputChange} rows={5} required /></div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}><label>Fecha</label><input type="date" name="date" value={formData.date} onChange={handleInputChange} /></div>
            <div className={styles.formGroup}><label>Lugar</label><input name="location" value={formData.location} onChange={handleInputChange} /></div>
          </div>
          <div className={styles.formGroup}><label>Personas</label>{formData.people.map((person, i) => (<div key={i} className={styles.arrayField}><input value={person} onChange={(e) => handleArrayChange('people', i, e.target.value)} /><button type="button" onClick={() => removeField('people', i)}>×</button></div>))}<button type="button" onClick={() => addField('people')}>+ Agregar Persona</button></div>
          <div className={styles.formGroup}><label>Etiquetas</label>{formData.tags.map((tag, i) => (<div key={i} className={styles.arrayField}><input value={tag} onChange={(e) => handleArrayChange('tags', i, e.target.value)} /><button type="button" onClick={() => removeField('tags', i)}>×</button></div>))}<button type="button" onClick={() => addField('tags')}>+ Agregar Etiqueta</button></div>
          <div className={styles.formActions}><button type="submit" disabled={loading} className={styles.primaryButton}>{loading ? 'Guardando...' : '📝 Guardar Historia'}</button><button type="button" onClick={() => setShowForm(false)} className={styles.secondaryButton}>Cancelar</button></div>
        </form>
      ) : stories.length > 0 ? (
        <>
          <div className={styles.storiesGrid}>
            {currentStories.map((story) => (
              <div key={story.id} className={styles.storyCard}>
                <h4>{story.title}</h4>
                <p>{story.content.substring(0, 100)}...</p>
                <div className={styles.storyMeta}>
                  <span>📅 {story.date ? new Date(story.date).toLocaleDateString() : 'Sin fecha'}</span>
                  {story.location && <span>📍 {story.location}</span>}
                </div>
                <div className={styles.storyTags}>
                  {story.tags?.slice(0, 3).map((tag, i) => <span key={i}>#{tag}</span>)}
                </div>
              </div>
            ))}
          </div>

          {/* ← PAGINADOR NUEVO }
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
        <div className={styles.emptyState}><div className={styles.emptyIcon}>📖</div><h4>¡Comienza tu legado!</h4><p>Agrega la primera historia familiar</p></div>
      )}
    </div>
  );
}*X3*/

'use client';

import { useState } from 'react';
import { Legacy, Story } from '../../lib/firestoreService';
import { createStory } from '../../lib/firestoreService';
import styles from './LegacyDetail.module.css';

interface StoriesSectionProps {
  legacy: Legacy;
  stories: Story[];
  onStoryAdded: (story: Story) => void;
  onStoryDeleted: (storyId: string) => void;
}

export default function StoriesSection({ legacy, stories, onStoryAdded, onStoryDeleted }: StoriesSectionProps) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', content: '', date: '', location: '', people: [''], tags: ['']
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');  // ← BUSCADOR NUEVO
  const [currentPage, setCurrentPage] = useState(1);
  const storiesPerPage = 3;  // ← LIMITADO A 3 (tu deseo)

  // ← BUSCADOR REAL TIME: Filtra por título/content/date
  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (story.date && story.date.includes(searchTerm))
  );

  // ← PAGINADOR SOBRE FILTRADOS
  const indexOfLast = currentPage * storiesPerPage;
  const indexOfFirst = indexOfLast - storiesPerPage;
  const currentStories = filteredStories.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStories.length / storiesPerPage);

  const goToPage = (page: number) => { setCurrentPage(page); };

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (field: 'people' | 'tags', index: number, value: string) => {
    const newArray = [...formData[field]]; newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addField = (field: 'people' | 'tags') => {
    setFormData({ ...formData, [field]: [...formData[field], ''] });
  };

  const removeField = (field: 'people' | 'tags', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try {
      const storyId = await createStory({
        legacyId: legacy.id!, title: formData.title, content: formData.content,
        date: formData.date, location: formData.location,
        people: formData.people.filter(p => p.trim()),
        tags: formData.tags.filter(t => t.trim()), userId: legacy.userId
      });
      onStoryAdded({ id: storyId, ...formData, legacyId: legacy.id!, userId: legacy.userId });
      setShowForm(false); setFormData({ title: '', content: '', date: '', location: '', people: [''], tags: [''] });
      setCurrentPage(1); setSearchTerm('');  // ← RESET BUSCADOR
    } catch (error) { alert('Error guardando historia'); } finally { setLoading(false); }
  };

  return (
    <div className={styles.storiesSection}>
      <div className={styles.sectionHeader}>
        <h3>📖 Historias del Legado ({filteredStories.length})</h3>
        <p>Página {currentPage} de {totalPages}</p>
        <button className={styles.addButton} onClick={() => setShowForm(true)}>
          + Nueva Historia
        </button>
      </div>

      {/* ← BUSCADOR NUEVO */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="🔍 Buscar por título, contenido o fecha..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
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
      {showForm ? (
        <form onSubmit={handleSubmit} className={styles.storyForm}>
          <h4>✍️ Nueva Historia</h4>
          <div className={styles.formGroup}><label>Título *</label><input name="title" value={formData.title} onChange={handleInputChange} required /></div>
          <div className={styles.formGroup}><label>Historia Completa *</label><textarea name="content" value={formData.content} onChange={handleInputChange} rows={5} required /></div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}><label>Fecha</label><input type="date" name="date" value={formData.date} onChange={handleInputChange} /></div>
            <div className={styles.formGroup}><label>Lugar</label><input name="location" value={formData.location} onChange={handleInputChange} /></div>
          </div>
          <div className={styles.formGroup}><label>Personas</label>{formData.people.map((person, i) => (<div key={i} className={styles.arrayField}><input value={person} onChange={(e) => handleArrayChange('people', i, e.target.value)} /><button type="button" onClick={() => removeField('people', i)}>×</button></div>))}<button type="button" onClick={() => addField('people')}>+ Agregar Persona</button></div>
          <div className={styles.formGroup}><label>Etiquetas</label>{formData.tags.map((tag, i) => (<div key={i} className={styles.arrayField}><input value={tag} onChange={(e) => handleArrayChange('tags', i, e.target.value)} /><button type="button" onClick={() => removeField('tags', i)}>×</button></div>))}<button type="button" onClick={() => addField('tags')}>+ Agregar Etiqueta</button></div>
          <div className={styles.formActions}><button type="submit" disabled={loading} className={styles.primaryButton}>{loading ? 'Guardando...' : '📝 Guardar Historia'}</button><button type="button" onClick={() => setShowForm(false)} className={styles.secondaryButton}>Cancelar</button></div>
        </form>
      ) : filteredStories.length > 0 ? (
        <>
          <div className={styles.storiesGrid}>
            {currentStories.map((story) => (
              <div key={story.id} className={styles.storyCard}>
                <h4>{story.title}</h4>
                <p>{story.content.substring(0, 100)}...</p>
                <div className={styles.storyMeta}>
                  <span>📅 {story.date ? new Date(story.date).toLocaleDateString() : 'Sin fecha'}</span>
                  {story.location && <span>📍 {story.location}</span>}
                </div>
                <div className={styles.storyTags}>
                  {story.tags?.slice(0, 3).map((tag, i) => <span key={i}>#{tag}</span>)}
                </div>
              </div>
            ))}
          </div>

        </>
      ) : (
        <div className={styles.emptyState}><div className={styles.emptyIcon}>📖</div><h4>¡Comienza tu legado!</h4><p>Agrega la primera historia familiar</p></div>
      )}
    </div>
  );
}