import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  constructor(private http: HttpClient) {}

  // получить все категории
  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/category');
  }

  // Получить категорию по id
  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`/api/category/${id}`);
  }
}
