import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ConditionItem } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConditionService {
  constructor(private http: HttpClient) {}

  async getConditions(): Promise<ConditionItem[]> {
    const res = await firstValueFrom(
      this.http.get<ConditionItem[]>(`${environment.apiUrl}/api/conditions`)
    );
    return res ?? [];
  }
}
