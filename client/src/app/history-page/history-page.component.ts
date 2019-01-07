import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MaterialService, ModalInstance } from '../shared/classes/material.service';

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.css']
})
export class HistoryPageComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('tooltip') tooltipRef: ElementRef;
  isFilterVisible = false;
  tooltip: ModalInstance;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef);
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
  }

}
