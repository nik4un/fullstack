import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { Order } from '../../shared/interfaces';
import { MaterialService, ModalInstance } from '../../shared/classes/material.service';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.css']
})
export class HistoryListComponent implements AfterViewInit, OnDestroy {

  @Input() orders: Order[];
  @ViewChild('modal') modalRef: ElementRef;
  modal: ModalInstance;
  selectedOrder: Order;

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  computePrice(order: Order): number {
    return order.list.reduce((acc, el) => acc + el.cost * el.quantity, 0);
  }

  onSelectOrder(order) {
    this.selectedOrder = order;
    this.modal.open();
  }

  onCancel() {
    this.modal.close();
  }

}
