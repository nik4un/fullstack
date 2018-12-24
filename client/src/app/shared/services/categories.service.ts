import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category, Message } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  constructor(private http: HttpClient) {}

  // получить все категории
  fetch(): Observable<Category[]> {
    return this.http.get<Category[]>('/api/category');
  }

  // получить категорию по id
  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`/api/category/${id}`);
  }

  // создать категорию
  create(name: string, image?: File): Observable<Category> {
    const fd = new FormData();
    fd.append('name', name);
    if (image) {
      fd.append('image'/*задано в бэкенде*/, image, image.name);
    }
    return this.http.post<Category>('/api/category', fd);
  }

  // измененить категорию
  update(id: string, name: string, image?: File): Observable<Category> {
    const fd = new FormData();
    fd.append('name', name);
    if (image) {
      fd.append('image'/*задано в бэкенде*/, image, image.name);
    }
    return this.http.patch<Category>(`/api/category/${id}`, fd);
  }

  // удалить категорию
  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/category/${id}`);
  }
}
