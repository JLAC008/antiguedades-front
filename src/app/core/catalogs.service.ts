import { Injectable } from '@angular/core';
import { Catalog } from '../models';
import { AuthService } from './auth.service';
import { MOCK_CATALOGS, getNextCatalogId } from './mock-data';

let catalogs = [...MOCK_CATALOGS];

@Injectable({ providedIn: 'root' })
export class CatalogsService {
  constructor(private auth: AuthService) {}

  async getAll(): Promise<Catalog[]> {
    return catalogs.map(c => ({
      ...c,
      antiques_count: undefined,
    }));
  }

  async getById(id: string): Promise<Catalog | null> {
    return catalogs.find(c => c.id === id) ?? null;
  }

  async create(catalog: Partial<Catalog>): Promise<Catalog> {
    const user = this.auth.currentUser();
    if (!user) throw new Error('No autenticado');
    const newCatalog: Catalog = {
      id: getNextCatalogId(),
      name: catalog.name ?? '',
      description: catalog.description ?? '',
      cover_image: catalog.cover_image ?? '',
      created_by: user.id,
      created_at: new Date().toISOString(),
    };
    catalogs.unshift(newCatalog);
    return newCatalog;
  }

  async update(id: string, catalog: Partial<Catalog>): Promise<void> {
    const index = catalogs.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Catálogo no encontrado');
    catalogs[index] = { ...catalogs[index], ...catalog };
  }

  async delete(id: string): Promise<void> {
    catalogs = catalogs.filter(c => c.id !== id);
  }
}
