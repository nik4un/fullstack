import { Injectable } from '@angular/core';
import { OrderPosition, Position } from '../shared/interfaces';

// этот сервис будет служить для формирования и отслеживания заказа
// на любой странице закааза
// он потребуется только на страницах order, по,у региэстрировать его
// мы будем в order-page.component
@Injectable()
export class OrderService {

  public list: OrderPosition[] = [];
  public totalCost = 0;

  add(position: Position) {
    // создаём независимый объект с независимыми данными,
    // а не объект со ссылками на существующий обект, который может меняться
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      quantity: position.quantity,
      cost: position.cost,
      _id: position._id
    });

    const candidate = this.list.find(el => el._id ===  orderPosition._id);

    if (candidate) {
      candidate.quantity += orderPosition.quantity;
    } else {
      this.list.push(orderPosition);
    }
    this.getSum();
  }

  getSum() {
    this.totalCost = this.list.reduce((acc, elem) => acc + elem.cost * elem.quantity, 0);
    console.log(this.totalCost);
  }

  remove(orderPosition: Position) {
    const idx = this.list.findIndex(p => p._id === orderPosition._id);
    this.list.splice(idx, 1);
    this.getSum();
  }

  clear() {

  }
}
