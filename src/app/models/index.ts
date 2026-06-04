export interface Catalog {
  id: string;
  name: string;
  description: string;
  cover_image: string;
  created_by: string;
  created_at: string;
  antiques_count?: number;
}

export interface Antique {
  id: string;
  catalog_id: string | null;
  name: string;
  description: string;
  price: number;
  year_era: string;
  condition: string;
  material: string;
  dimensions: string;
  images: string[];
  created_by: string;
  created_at: string;
  catalog?: Catalog;
}

export type AntiqueCondition = 'Excelente' | 'Bueno' | 'Regular' | 'Para restaurar';

export const CONDITIONS: AntiqueCondition[] = ['Excelente', 'Bueno', 'Regular', 'Para restaurar'];
