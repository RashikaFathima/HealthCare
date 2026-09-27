import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ChartData } from '../../../core/models';

Chart.register(...registerables);

/**
 * Thin, reusable wrapper around Chart.js so feature components never touch
 * the Chart.js API directly. Pass `type` ('line' | 'bar') and `data`
 * (categories + one or more series) from any *.mock.ts-backed service.
 */
@Component({
  selector: 'app-chart-panel',
  standalone: true,
  template: `<div class="chart-host" [style.height.px]="height"><canvas #canvasRef></canvas></div>`,
  styles: [`.chart-host { position: relative; width: 100%; }`]
})
export class ChartPanelComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input({ required: true }) type: 'line' | 'bar' = 'line';
  @Input() data: ChartData | null = null;
  @Input() height = 260;
  @Input() colors: string[] = ['#2563EB', '#06B6D4', '#F59E0B', '#10B981', '#EF4444'];

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  ngAfterViewInit(): void {
    this.render();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.canvasRef) {
      this.render();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private render(): void {
    if (!this.data || !this.canvasRef) return;
    this.chart?.destroy();

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.06)';
    const textColor = isDark ? '#94A3B8' : '#64748B';

    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: this.type,
      data: {
        labels: this.data.categories,
        datasets: this.data.series.map((s, i) => ({
          label: s.label,
          data: s.data,
          borderColor: this.colors[i % this.colors.length],
          backgroundColor: this.type === 'bar' ? this.colors[i % this.colors.length] + 'CC' : this.colors[i % this.colors.length] + '22',
          borderRadius: this.type === 'bar' ? 6 : 0,
          tension: 0.35,
          fill: this.type === 'line',
          pointRadius: this.type === 'line' ? 3 : 0
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: this.data.series.length > 1, labels: { color: textColor } }
        },
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor } },
          y: { grid: { color: gridColor }, ticks: { color: textColor }, beginAtZero: true }
        }
      }
    });
  }
}
