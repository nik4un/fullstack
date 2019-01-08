import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Order } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  constructor(private http: HttpClient) { }

  // для формирования get запроса на получение списка заказов нам необходимо добавить query-параметры для фильтрации
  // (для пагинации отображения данных)
  fetch(params: any = {}): Observable<Order[]> {
    // query-параметры добавляем с помощью класса HttpParams вторым параметром (options) get запроса
    return this.http.get<Order[]>('/api/order', {
      params: new HttpParams({
        fromObject: params
      })
    });
  }

  create(order: Order): Observable<Order> {
    return this.http.post<Order>('/api/order', order);
  }
}
