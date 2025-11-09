export interface Legacy {
  id?: string;
  title: string;
  description: string;
  familyMember: string;
  era: string;
  privacy: 'private' | 'family' | 'public';
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  storiesCount: number;
  photosCount: number;
  status: 'draft' | 'active' | 'completed';
}

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