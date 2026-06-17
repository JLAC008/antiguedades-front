import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Catalog } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CatalogsService {
  constructor(private http: HttpClient) {}

  async getAll(): Promise<Catalog[]> {
    const res = await firstValueFrom(
      this.http.get<Catalog[]>(`${environment.apiUrl}/api/catalogs`)
    );
    return res;
  }

  async getById(id: string): Promise<Catalog | null> {
    try {
      const res = await firstValueFrom(
        this.http.get<Catalog>(`${environment.apiUrl}/api/catalogs/${id}`)
      );
      return res;
    } catch {
      return null;
    }
  }

  async create(catalog: Partial<Catalog>): Promise<Catalog> {
    const res = await firstValueFrom(
      this.http.post<Catalog>(`${environment.apiUrl}/api/catalogs`, catalog)
    );
    return res;
  }

  async update(id: string, catalog: Partial<Catalog>): Promise<void> {
    const res = await firstValueFrom(
      this.http.put(`${environment.apiUrl}/api/catalogs/${id}`, catalog)
    );
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/api/catalogs/${id}`)
    );
  }
}
