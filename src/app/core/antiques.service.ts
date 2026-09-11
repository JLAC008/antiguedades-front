import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Antique } from '../models';
import { environment } from '../../environments/environment';

function resolveImages(antique: Antique): Antique {
  if (antique.images) {
    antique.images = antique.images.map(img =>
      img.startsWith('http') || img.startsWith('data:') || img.startsWith('assets/') || img.startsWith('/assets/')
        ? img
        : `${environment.apiUrl}${img}`
    );
  }
  return antique;
}

@Injectable({ providedIn: 'root' })
export class AntiquesService {
  constructor(private http: HttpClient) {}

  async getAll(search?: string, type?: string, subcategory?: string, detail?: string, condition?: string): Promise<Antique[]> {
    let params: any = {};
    if (search) params.search = search;
    if (type) params.type = type;
    if (subcategory) params.subcategory = subcategory;
    if (detail) params.detail = detail;
    if (condition) params.condition = condition;
    const res = await firstValueFrom(
      this.http.get<Antique[]>(`${environment.apiUrl}/api/antiques`, { params })
    );
    return (res ?? []).map(resolveImages);
  }

  async getByCatalog(catalogId: string): Promise<Antique[]> {
    const all = await this.getAll();
    return all.filter(a => a.catalog_id === catalogId);
  }

  async getById(id: string): Promise<Antique | null> {
    try {
      const res = await firstValueFrom(
        this.http.get<Antique>(`${environment.apiUrl}/api/antiques/${id}`)
      );
      return resolveImages(res);
    } catch {
      return null;
    }
  }

  async create(antique: Partial<Antique>): Promise<Antique> {
    const res = await firstValueFrom(
      this.http.post<Antique>(`${environment.apiUrl}/api/antiques`, antique)
    );
    return res;
  }

  async update(id: string, antique: Partial<Antique>): Promise<void> {
    await firstValueFrom(
      this.http.put(`${environment.apiUrl}/api/antiques/${id}`, antique)
    );
  }

  async delete(id: string): Promise<void> {
    await firstValueFrom(
      this.http.delete(`${environment.apiUrl}/api/antiques/${id}`)
    );
  }

  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const res: any = await firstValueFrom(
      this.http.post(`${environment.apiUrl}/api/upload`, formData)
    );
    return res.url.startsWith('http') ? res.url : `${environment.apiUrl}${res.url}`;
  }
}
