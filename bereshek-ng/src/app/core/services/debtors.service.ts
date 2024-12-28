import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Debtor, CreateDebtorDto } from '../models/debt.model';

@Injectable({
  providedIn: 'root'
})
export class DebtorsService {
  private readonly API_URL = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getDebtors(): Observable<Debtor[]> {
    return this.http.get<Debtor[]>(`${this.API_URL}/debtors`);
  }

  getDebtor(id: number): Observable<Debtor> {
    return this.http.get<Debtor>(`${this.API_URL}/debtors/${id}`);
  }

  createDebtor(debtor: CreateDebtorDto): Observable<Debtor> {
    return this.http.post<Debtor>(`${this.API_URL}/debtors`, debtor);
  }

  updateDebtor(id: number, debtor: Partial<Debtor>): Observable<Debtor> {
    return this.http.patch<Debtor>(`${this.API_URL}/debtors/${id}`, debtor);
  }

  deleteDebtor(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/debtors/${id}`);
  }
}
