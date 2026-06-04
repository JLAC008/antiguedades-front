import { Injectable } from '@angular/core';
import { Antique } from '../models';
import { AuthService } from './auth.service';
import { MOCK_ANTIQUES, getNextAntiqueId } from './mock-data';

let antiques = [...MOCK_ANTIQUES];

@Injectable({ providedIn: 'root' })
export class AntiquesService {
  constructor(private auth: AuthService) {}

  async getAll(): Promise<Antique[]> {
    return [...antiques].map(a => ({
      ...a,
      catalog: undefined,
      catalog_id: a.catalog_id,
    }));
  }

  async getByCatalog(catalogId: string): Promise<Antique[]> {
    return antiques.filter(a => a.catalog_id === catalogId);
  }

  async getById(id: string): Promise<Antique | null> {
    return antiques.find(a => a.id === id) ?? null;
  }

  async create(antique: Partial<Antique>): Promise<Antique> {
    const user = this.auth.currentUser();
    if (!user) throw new Error('No autenticado');
    const newAntique: Antique = {
      id: getNextAntiqueId(),
      catalog_id: antique.catalog_id ?? null,
      name: antique.name ?? '',
      type: antique.type ?? 'antiguedad',
      description: antique.description ?? '',
      price: antique.price ?? 0,
      year_era: antique.year_era ?? '',
      condition: antique.condition ?? 'Bueno',
      material: antique.material ?? '',
      dimensions: antique.dimensions ?? '',
      images: antique.images ?? [],
      created_by: user.id,
      created_at: new Date().toISOString(),
    };
    antiques.unshift(newAntique);
    return newAntique;
  }

  async update(id: string, antique: Partial<Antique>): Promise<void> {
    const index = antiques.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Pieza no encontrada');
    antiques[index] = { ...antiques[index], ...antique };
  }

  async delete(id: string): Promise<void> {
    antiques = antiques.filter(a => a.id !== id);
  }

  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}
