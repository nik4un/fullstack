import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalInstance, Order } from '../shared/interfaces';
import { MaterialService } from '../shared/classes/material.service';
import { OrderService } from './order.service';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.css'],
  providers: [OrderService] // регистрация сервиса
})
export class OrderPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modal') modalRef: ElementRef;
  isRoot: boolean;
  modal: ModalInstance;
  orderSub: Subscription;
  waiting = false;

  constructor(private router: Router,
              private order: OrderService,
              private orders: OrdersService) { }

  ngOnInit() {
    this.isRoot = this.router.url === '/order';
    // отслеживаем изменение url
    this.router.events.subscribe(event => {
      // при изменении роута происходит много событий, мы берем для проверки последнее
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
  }

  deletePosition(orderPosition) {
    this.order.remove(orderPosition);
  }

  complete() {
    this.modal.open();
  }

  cancel() {
    this.modal.close();
  }

  submit() {
    this.waiting = true;
    const newOrder: Order = {
      list: this.order.list.map(item => {
        // удаление в каждом элементе массива list св-ва _id
        delete item._id;
        return item;
      })
    };
    this.orderSub = this.orders.create(newOrder).subscribe(
      res => {
        MaterialService.toast(`Заказ №${res.order} успешно добавлен`);
      },
      error => {
        MaterialService.toast(error.error.message);
      },
      () => {
        this.modal.close();
        this.order.clear();
        this.waiting = false;
      }
    );

  }

}
