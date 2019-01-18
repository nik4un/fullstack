import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { AnalyticsPage } from '../shared/interfaces';
import { Subscription } from 'rxjs';
import { Chart } from 'chart.js';
import { AnalyticsService } from '../shared/services/analytics.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('revenue') revenueRef: ElementRef;
  @ViewChild('order') orderRef: ElementRef;

  average: number;
  pending = true;
  aSub: Subscription;

  constructor(private analyticsService: AnalyticsService) { }

  ngAfterViewInit() {
    // формируем объкт конфигурации графика для выручки
    const revenueConfig: any = {
      label: 'Выручка',
      color: 'rgb(255, 99, 132)'
    };
    // формируем объкт конфигурации графика для заказов
    const orderConfig: any = {
      label: 'Заказы',
      color: 'rgb(54, 162, 235)'
    };

    this.aSub =  this.analyticsService.getAnalytics().subscribe((data: AnalyticsPage) => {
      this.average = data.average;
      // заносим данные для графика
      // горизонтальная ось - даты
      revenueConfig.labels = data.chart.map((item) => item.label);
      orderConfig.labels = data.chart.map((item) => item.label);
      // вертикальная ось - выручка / заказы по дням
      revenueConfig.data = data.chart.map((item) => item.revenue);
      orderConfig.data = data.chart.map((item) => item.order);

      // получаем сонтекст графика Canvas
      const revenueCtx = this.revenueRef.nativeElement.getContext('2d');
      const orderCtx = this.orderRef.nativeElement.getContext('2d');
      // задаем высоту палитры
      revenueCtx.canvas.height = '300px';
      orderCtx.canvas.height = '300px';

      // отрисовывем график
      new Chart(revenueCtx, createChartConfig(revenueConfig));
      new Chart(orderCtx, createChartConfig(orderConfig));

      this.pending = false;
    });
  }

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }
}

// функция, создающая щбъект конфигурации для chart.js
function createChartConfig({labels, data, label, color}) {
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets: [
        {
          label, data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  };
}
