import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Debt, CreateDebtDto } from '../models/debt.model';

@Injectable({
  providedIn: 'root'
})
export class DebtsService {
  private readonly API_URL = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getDebts(): Observable<Debt[]> {
    return this.http.get<Debt[]>(`${this.API_URL}/debts`);
  }

  getDebt(id: number): Observable<Debt> {
    return this.http.get<Debt>(`${this.API_URL}/debts/${id}`);
  }

  createDebt(debt: CreateDebtDto): Observable<Debt> {
    return this.http.post<Debt>(`${this.API_URL}/debts`, debt);
  }

  updateDebt(id: number, debt: Partial<Debt>): Observable<Debt> {
    return this.http.patch<Debt>(`${this.API_URL}/debts/${id}`, debt);
  }

  deleteDebt(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/debts/${id}`);
  }
}
