import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialService, ModalInstance } from '../shared/classes/material.service';
import { OrdersService } from '../shared/services/orders.service';
import { Subscription } from 'rxjs';
import { Order } from '../shared/interfaces';

const STEP = 2;

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tooltip') tooltipRef: ElementRef;
  isFilterVisible = false;
  tooltip: ModalInstance;
  orders: Order[] = [];
  oSub: Subscription;

  offset = 0;
  limit = STEP;

  loading = false;
  loadingMore = false;
  noMoreOrders = false;

  constructor(private ordersService: OrdersService) { }

  private fetch() {
    const params = {
      offset: this.offset,
      limit: this.limit
    };
    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders); // добавляем к текущему массиву заказов данные, полученные с сервера
      this.loading = false;
      this.loadingMore = false;
      this.noMoreOrders = orders.length < STEP;
    });
  }

  ngOnInit() {
    this.loading = true;
    this.fetch();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  loadMore() {
    this.offset += STEP;
    this.loadingMore = true;
    this.fetch();
  }

}
