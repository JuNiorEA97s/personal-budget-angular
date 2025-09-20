import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface BudgetItem { title: string; budget: number; }

@Injectable({ providedIn: 'root' })
export class BudgetService {
  constructor(private http: HttpClient) {}
  getBudget(): Observable<BudgetItem[]> {
    return this.http.get<{ myBudget: BudgetItem[] }>('assets/budget.json')
      .pipe(map(res => res.myBudget));
  }
}
