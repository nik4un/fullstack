import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter, OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { Filter } from '../../shared/interfaces';
import { MaterialDatepicker, MaterialService } from '../../shared/classes/material.service';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.css']
})
export class HistoryFilterComponent implements AfterViewInit, OnDestroy {

  @Output() changeFilter = new EventEmitter<Filter>();
  @ViewChild('start') startRef: ElementRef;
  @ViewChild('end') endRef: ElementRef;

  start: MaterialDatepicker;
  end: MaterialDatepicker;
  order: number;
  isValid = true;

  constructor() { }

  validate() {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return;
    }

    this.isValid = this.start.date < this.end.date;

  }

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this)); // поскольку
    // мы передаём параметр с ключевым словом this, необходимо его забаиндить
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this));
  }

  ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }

  submitFilter() {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order;
    }
    if (this.start.date) {
      filter.start = this.start.date;
    }
    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.changeFilter.emit(filter);
  }

}
