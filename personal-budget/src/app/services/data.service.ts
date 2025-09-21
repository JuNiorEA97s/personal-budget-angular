import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, shareReplay, map, tap } from 'rxjs';

export interface BudgetItem { title: string; budget: number; }

@Injectable({ providedIn: 'root' })
export class DataService {
  private cache: BudgetItem[] | null = null;
  private inflight$?: Observable<BudgetItem[]>;

  constructor(private http: HttpClient) {}

  getBudget(): Observable<BudgetItem[]> {
    if (this.cache) return of(this.cache);
    if (this.inflight$) return this.inflight$;
    this.inflight$ = this.http.get<{ myBudget: BudgetItem[] }>('/assets/budget.json').pipe(
      map(res => res.myBudget),
      tap(items => { this.cache = items; this.inflight$ = undefined; }),
      shareReplay(1)
    );
    return this.inflight$;
  }
}
