import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces';
import { tap } from 'rxjs/operators';

// добавление в параметры декоратора объекта со свойством providedIn: 'root'
// избавляет от необходимости  добавлять сервис в св-во providers в app.module
@Injectable({
  providedIn: 'root'
})
export class AuthServices {

  private token = null;

  constructor(private http: HttpClient) {}

  registration() {}

  // метод возвращает объект Observable, у которого есть поле token
  login(user: User): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('/api/auth/login', user)
      .pipe(
        // извлекаем св-во token из полученого объекта
        tap(({ token }) => {
          // помещаем полученный token в localStorage пол именем "auth-token"
          localStorage.setItem('auth-token', token);
          this.setToken(token);
        })
      );
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout() {
    this.token = null;
    localStorage.clear();
  }
}
