import { NextResponse } from 'next/server';

// Datos mock de legados de ejemplo
const mockLegacies = [
  {
    id: '1',
    title: 'La Historia de los Rodríguez',
    description: 'Una familia que emigró desde España en los años 50 y construyó una nueva vida en América.',
    image: '/images/legacy-1.jpg',
    creator: 'María Rodríguez',
    storiesCount: 12,
    photosCount: 8,
    createdAt: '2024-01-15',
    tags: ['Emigración', 'España', 'Familia']
  },
  {
    id: '2',
    title: 'Los Viajes del Abuelo Carlos',
    description: 'Las aventuras de un marinero que recorrió el mundo en los años 60.',
    image: '/images/legacy-2.jpg',
    creator: 'Ana Martínez',
    storiesCount: 8,
    photosCount: 15,
    createdAt: '2024-02-03',
    tags: ['Viajes', 'Aventura', 'Mar']
  },
  {
    id: '3',
    title: 'Recetas de la Abuela',
    description: 'Secretos culinarios pasados por generaciones en la familia Pérez.',
    image: '/images/legacy-3.jpg',
    creator: 'Juan Pérez',
    storiesCount: 5,
    photosCount: 20,
    createdAt: '2024-01-28',
    tags: ['Cocina', 'Tradición', 'Recetas']
  },
  {
    id: '4',
    title: 'La Boda de mis Padres - 1985',
    description: 'El día que comenzó nuestra familia, capturado en cada detalle.',
    image: '/images/legacy-4.jpg',
    creator: 'Laura González',
    storiesCount: 3,
    photosCount: 25,
    createdAt: '2024-03-10',
    tags: ['Amor', 'Boda', 'Familia']
  },
  {
    id: '5',
    title: 'Nuestra Infancia en el Campo',
    description: 'Creciendo en el valle, entre animales y naturaleza.',
    image: '/images/legacy-5.jpg',
    creator: 'Carlos López',
    storiesCount: 7,
    photosCount: 12,
    createdAt: '2024-02-20',
    tags: ['Infancia', 'Campo', 'Naturaleza']
  },
  {
    id: '6',
    title: 'Historias de la Guerra Civil',
    description: 'Relatos transmitidos por los bisabuelos sobre aquellos días difíciles.',
    image: '/images/legacy-6.jpg',
    creator: 'Elena Sánchez',
    storiesCount: 10,
    photosCount: 6,
    createdAt: '2024-03-05',
    tags: ['Historia', 'Guerra', 'Memoria']
  }
];

export async function GET() {
  try {
    // Simular un delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json({
      success: true,
      data: mockLegacies,
      total: mockLegacies.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Error al cargar los legados' },
      { status: 500 }
    );
  }
}