import { AfterViewInit, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { BudgetService, BudgetItem } from '../services/budget.service';
import { Hero } from '../hero/hero';

@Component({
  selector: 'pb-homepage',
  standalone: true,
  imports: [CommonModule, Hero],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
  host: { 'ngSkipHydration': '' }
})
export class Homepage implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  constructor(private budget: BudgetService) {}

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(async () => {
      let items: BudgetItem[] = [];
      try {
        items = await firstValueFrom(this.budget.getBudget());
      } catch {
        items = [
          { title: 'Eat out',  budget: 25 },
          { title: 'Rent',     budget: 375 },
          { title: 'Grocery',  budget: 110 },
          { title: 'Gas',      budget: 50 }
        ];
      }

      const el = document.getElementById('myChart') as HTMLCanvasElement | null;
      if (!el) return;

      const ctx = el.getContext('2d');
      if (!ctx) return;

      const { Chart } = await import('chart.js/auto');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: items.map(i => i.title),
          datasets: [{ data: items.map(i => i.budget) }]
        }
      });
    }, 0);
  }
}
