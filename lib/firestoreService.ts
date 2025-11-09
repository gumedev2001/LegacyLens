import { storage } from './firebase';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  Timestamp, 
  increment 
} from 'firebase/firestore';
import { db } from './firebase';

// ========== IMPORTS DE TYPES ==========
import { Legacy } from '../types/legacy';  // ← CORREGIDO: types (no type)

// ========== INTERFACES ==========
export interface Story {
  id?: string;
  legacyId: string;
  title: string;
  content: string;
  date?: string;
  location?: string;
  people?: string[];
  tags?: string[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Photo {
  id?: string;
  legacyId: string;
  storyId?: string;
  fileName: string;
  fileUrl: string;
  caption?: string;
  date?: string;
  location?: string;
  people?: string[];
  tags?: string[];
  userId: string;
  createdAt: Date;
  fileSize: number;
}

// ========== LEGACIES ==========
export const createLegacy = async (legacyData: Omit<Legacy, 'id' | 'createdAt' | 'updatedAt' | 'storiesCount' | 'photosCount' | 'status'>): Promise<string> => {
  try {
    const legacyWithMetadata = {
      ...legacyData,
      storiesCount: 0,
      photosCount: 0,
      status: 'active' as const,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'legacies'), legacyWithMetadata);
    return docRef.id;
  } catch (error) {
    console.error('Error creando legado:', error);
    throw new Error('No se pudo crear el legado');
  }
};

export const getUserLegacies = async (userId: string): Promise<Legacy[]> => {
  try {
    const q = query(
      collection(db, 'legacies'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const legacies: Legacy[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      legacies.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        familyMember: data.familyMember,
        era: data.era,
        privacy: data.privacy,
        userId: data.userId,
        storiesCount: data.storiesCount,
        photosCount: data.photosCount,
        status: data.status,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    return legacies;
  } catch (error) {
    console.error('Error obteniendo legados:', error);
    throw new Error('No se pudieron cargar los legados');
  }
};

export const getLegacy = async (legacyId: string): Promise<Legacy | null> => {
  try {
    const docRef = doc(db, 'legacies', legacyId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Legacy;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo legado:', error);
    throw new Error('No se pudo cargar el legado');
  }
};

export const updateLegacy = async (legacyId: string, updates: Partial<Legacy>): Promise<void> => {
  try {
    const legacyRef = doc(db, 'legacies', legacyId);
    await updateDoc(legacyRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error actualizando legado:', error);
    throw new Error('No se pudo actualizar el legado');
  }
};

export const deleteLegacy = async (legacyId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'legacies', legacyId));
  } catch (error) {
    console.error('Error eliminando legado:', error);
    throw new Error('No se pudo eliminar el legado');
  }
};

// ========== STORIES ==========
export const createStory = async (storyData: Omit<Story, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const storyWithMetadata = {
      ...storyData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'stories'), storyWithMetadata);
    await updateLegacy(storyData.legacyId, { storiesCount: increment(1) });
    return docRef.id;
  } catch (error) {
    console.error('Error creando historia:', error);
    throw new Error('No se pudo crear la historia');
  }
};

export const getLegacyStories = async (legacyId: string): Promise<Story[]> => {
  try {
    const q = query(
      collection(db, 'stories'),
      where('legacyId', '==', legacyId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const stories: Story[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        legacyId: data.legacyId,
        title: data.title,
        content: data.content,
        date: data.date,
        location: data.location,
        people: data.people || [],
        tags: data.tags || [],
        userId: data.userId,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    return stories;
  } catch (error) {
    console.error('Error obteniendo historias:', error);
    throw new Error('No se pudieron cargar las historias');
  }
};

export const updateStory = async (storyId: string, updates: Partial<Story>): Promise<void> => {
  try {
    const storyRef = doc(db, 'stories', storyId);
    await updateDoc(storyRef, { ...updates, updatedAt: Timestamp.now() });
  } catch (error) {
    console.error('Error actualizando historia:', error);
    throw new Error('No se pudo actualizar la historia');
  }
};

export const deleteStory = async (storyId: string, legacyId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'stories', storyId));
    await updateLegacy(legacyId, { storiesCount: increment(-1) });
  } catch (error) {
    console.error('Error eliminando historia:', error);
    throw new Error('No se pudo eliminar la historia');
  }
};

// ========== PHOTOS ==========
export const uploadPhoto = async (
  file: File, 
  legacyId: string, 
  userId: string, 
  metadata?: Partial<Photo>
): Promise<string> => {
  try {
    const storageRef = ref(storage, `legacies/${legacyId}/photos/${Date.now()}_${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    const photoData = {
      legacyId,
      fileName: file.name,
      fileUrl: downloadURL,
      caption: metadata?.caption || '',
      date: metadata?.date || '',
      location: metadata?.location || '',
      people: metadata?.people || [],
      tags: metadata?.tags || [],
      userId,
      fileSize: file.size,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    const docRef = await addDoc(collection(db, 'photos'), photoData);
    await updateLegacy(legacyId, { photosCount: increment(1) });
    return docRef.id;
  } catch (error) {
    console.error('Error subiendo foto:', error);
    throw new Error('No se pudo subir la foto');
  }
};

export const getLegacyPhotos = async (legacyId: string): Promise<Photo[]> => {
  try {
    const q = query(
      collection(db, 'photos'),
      where('legacyId', '==', legacyId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const photos: Photo[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      photos.push({
        id: doc.id,
        legacyId: data.legacyId,
        storyId: data.storyId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        caption: data.caption,
        date: data.date,
        location: data.location,
        people: data.people || [],
        tags: data.tags || [],
        userId: data.userId,
        fileSize: data.fileSize,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      });
    });
    return photos;
  } catch (error) {
    console.error('Error obteniendo fotos:', error);
    throw new Error('No se pudieron cargar las fotos');
  }
};

export const deletePhoto = async (photoId: string, legacyId: string, fileUrl: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'photos', photoId));
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
    await updateLegacy(legacyId, { photosCount: increment(-1) });
  } catch (error) {
    console.error('Error eliminando foto:', error);
    throw new Error('No se pudo eliminar la foto');
  }
};