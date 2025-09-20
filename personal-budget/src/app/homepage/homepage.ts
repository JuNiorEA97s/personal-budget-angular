import { AfterViewInit, Component, ElementRef, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { BudgetService, BudgetItem } from '../services/budget.service';

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss'
})
export class Homepage implements AfterViewInit {
  @ViewChild('chartCanvas', { static: false }) canvasRef?: ElementRef<HTMLCanvasElement>;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private budget: BudgetService) {}

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const items: BudgetItem[] = await this.budget.getBudget().toPromise();

    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { Chart } = await import('chart.js/auto');

    const labels = items.map(i => i.title);
    const values = items.map(i => i.budget);

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels,
        datasets: [{ data: values }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } }
      }
    });
  }
}

