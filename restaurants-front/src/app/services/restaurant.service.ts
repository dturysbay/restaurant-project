import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurant } from '../models/restaurant.model';
import { MenuItem } from '../models/menu-item.model';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private base = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getAll(cuisine?: string): Observable<Restaurant[]> {
    const url = cuisine
      ? `${this.base}/restaurants?cuisine=${cuisine}`
      : `${this.base}/restaurants`;
    return this.http.get<Restaurant[]>(url);
  }

  getById(id: string): Observable<Restaurant> {
    return this.http.get<Restaurant>(`${this.base}/restaurants/${id}`);
  }

  getMenu(restaurantId: string): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(`${this.base}/restaurants/${restaurantId}/menu`);
  }
}
