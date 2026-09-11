import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Catalog } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CatalogsService {
  constructor(private http: HttpClient) {}

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

}
