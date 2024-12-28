import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Debtor, CreateDebtorDto } from '../models/debt.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DebtorsService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getDebtors(): Observable<Debtor[]> {
    return this.http.get<Debtor[]>(`${this.API_URL}/debtors`, {
      params: {
        relations: 'debts'
      }
    });
  }

  getDebtor(id: string): Observable<Debtor> {
    return this.http.get<Debtor>(`${this.API_URL}/debtors/${id}`, {
      params: {
        relations: 'debts'
      }
    });
  }

  createDebtor(debtor: CreateDebtorDto): Observable<Debtor> {
    return this.http.post<Debtor>(`${this.API_URL}/debtors`, debtor);
  }

  updateDebtor(id: string, debtor: Partial<Debtor>): Observable<Debtor> {
    return this.http.patch<Debtor>(`${this.API_URL}/debtors/${id}`, debtor);
  }

  deleteDebtor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/debtors/${id}`);
  }
}
