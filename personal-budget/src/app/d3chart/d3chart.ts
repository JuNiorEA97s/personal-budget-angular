import { AfterViewInit, Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { DataService, BudgetItem } from '../services/data.service';

@Component({
  selector: 'pb-d3chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './d3chart.html',
  styleUrl: './d3chart.scss',
  host: { 'ngSkipHydration': '' }
})
export class D3Chart implements AfterViewInit {
  private readonly platformId = inject(PLATFORM_ID);
  constructor(private data: DataService) {}

  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    const d3: typeof import('d3') = await import('d3');
    const items: BudgetItem[] = await firstValueFrom(this.data.getBudget());

    const width = 420, height = 260, margin = { top: 10, right: 10, bottom: 30, left: 40 };

    const svg = d3.select<SVGSVGElement, unknown>('#d3-bar')
      .attr('width', width)
      .attr('height', height);

    const x = d3.scaleBand<string>()
      .domain(items.map((d: BudgetItem) => d.title))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(items, (d: BudgetItem) => d.budget) ?? 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll<SVGRectElement, BudgetItem>('rect')
      .data(items)
      .join('rect')
      .attr('x', (d: BudgetItem) => x(d.title)!)
      .attr('y', (d: BudgetItem) => y(d.budget))
      .attr('width', () => x.bandwidth())
      .attr('height', (d: BudgetItem) => y(0) - y(d.budget));

    // Keep axis callbacks untyped to avoid D3 generic mismatches
    const xAxis = (g: any) => g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    const yAxis = (g: any) => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5));

    svg.append('g').call(xAxis);
    svg.append('g').call(yAxis);
  }
}
