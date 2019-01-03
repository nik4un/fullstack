import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalInstance } from '../shared/interfaces';
import { MaterialService } from '../shared/classes/material.service';
import { OrderService } from './order.service';

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

  constructor(private router: Router,
              private order: OrderService) { }

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
    this.modal.close();
  }

}
