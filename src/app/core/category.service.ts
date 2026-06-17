import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CategoryGroup } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  async getCategories(): Promise<CategoryGroup[]> {
    const res = await firstValueFrom(
      this.http.get<CategoryGroup[]>(`${environment.apiUrl}/api/categories`)
    );
    return res ?? [];
  }
}
