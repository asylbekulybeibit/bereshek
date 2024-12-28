import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { DebtorsService } from '../../../core/services/debtors.service';
import { Debtor, Debt } from '../../../core/models/debt.model';

@Component({
  selector: 'app-debtors-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule
  ],
  template: `
    <div class="debtors-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Должники</mat-card-title>
          <button mat-raised-button color="primary" routerLink="/debtors/new">
            Добавить должника
          </button>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Поиск должника</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Введите имя или фамилию" #input>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <table mat-table [dataSource]="dataSource" matSort>
            <!-- Name Column -->
            <ng-container matColumnDef="fullName">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Имя</th>
              <td mat-cell *matCellDef="let debtor">
                {{debtor.firstName}} {{debtor.lastName}}
                <mat-icon *ngIf="debtor.isProblematic" 
                         color="warn" 
                         class="problematic-icon"
                         matTooltip="Проблемный клиент">
                  warning
                </mat-icon>
              </td>
            </ng-container>

            <!-- Total Debt Column -->
            <ng-container matColumnDef="totalDebt">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Общий долг</th>
              <td mat-cell *matCellDef="let debtor">{{debtor.totalDebt | currency:'RUB':'symbol-narrow':'1.0-0'}}</td>
            </ng-container>

            <!-- Latest Debt Date Column -->
            <ng-container matColumnDef="latestDebtDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Дата последнего долга</th>
              <td mat-cell *matCellDef="let debtor">
                {{getLatestDebtDate(debtor.debts) | date:'dd.MM.yyyy'}}
              </td>
            </ng-container>

            <!-- Due Date Column -->
            <ng-container matColumnDef="dueDate">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Дата возврата</th>
              <td mat-cell *matCellDef="let debtor">
                {{getNextDueDate(debtor.debts) | date:'dd.MM.yyyy'}}
                <mat-icon *ngIf="hasOverdueDebts(debtor.debts)" 
                         color="warn"
                         matTooltip="Есть просроченные долги">
                  schedule
                </mat-icon>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Действия</th>
              <td mat-cell *matCellDef="let debtor">
                <button mat-icon-button color="primary" [routerLink]="['/debtors', debtor.id]">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="accent" [routerLink]="['/debts/new']" [queryParams]="{debtorId: debtor.id}">
                  <mat-icon>add</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>

            <!-- Row shown when there is no matching data. -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="5">
                <ng-container *ngIf="input.value">
                  Нет должников, соответствующих поиску "{{input.value}}"
                </ng-container>
                <ng-container *ngIf="!input.value">
                  Нет должников
                </ng-container>
              </td>
            </tr>
          </table>

          <mat-paginator [pageSizeOptions]="[5, 10, 25]"
                        showFirstLastButtons
                        aria-label="Выберите страницу">
          </mat-paginator>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .debtors-container {
      padding: 20px;
    }

    mat-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
    }

    .mat-column-actions {
      width: 100px;
      text-align: center;
    }

    .problematic-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
      vertical-align: middle;
      margin-left: 4px;
    }

    .mat-mdc-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .mat-mdc-no-data-row {
      text-align: center;
      padding: 16px;
    }
  `]
})
export class DebtorsListComponent implements OnInit {
  displayedColumns: string[] = ['fullName', 'totalDebt', 'latestDebtDate', 'dueDate', 'actions'];
  dataSource: MatTableDataSource<Debtor>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private debtorsService: DebtorsService) {
    this.dataSource = new MatTableDataSource<Debtor>([]);
  }

  ngOnInit(): void {
    this.loadDebtors();
  }

  loadDebtors(): void {
    this.debtorsService.getDebtors().subscribe({
      next: (debtors) => {
        this.dataSource.data = debtors;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        
        // Настройка фильтрации
        this.dataSource.filterPredicate = (data: Debtor, filter: string) => {
          const searchStr = (data.firstName + ' ' + data.lastName).toLowerCase();
          return searchStr.includes(filter.toLowerCase());
        };

        // Настройка сортировки
        this.dataSource.sortingDataAccessor = (item: Debtor, property: string) => {
          switch(property) {
            case 'fullName': return item.firstName + ' ' + item.lastName;
            case 'latestDebtDate': return this.getLatestDebtDate(item.debts)?.getTime() || 0;
            case 'dueDate': return this.getNextDueDate(item.debts)?.getTime() || 0;
            default: return (item as any)[property];
          }
        };
      },
      error: (error) => {
        console.error('Error loading debtors:', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getLatestDebtDate(debts: Debt[]): Date | null {
    if (!debts || debts.length === 0) return null;
    const dates = debts.map(debt => typeof debt.borrowDate === 'string' ? new Date(debt.borrowDate) : debt.borrowDate);
    return new Date(Math.max(...dates.map(date => date.getTime())));
  }

  getNextDueDate(debts: Debt[]): Date | null {
    if (!debts || debts.length === 0) return null;
    const unpaidDebts = debts.filter(debt => !debt.isPaid);
    if (unpaidDebts.length === 0) return null;
    const dates = unpaidDebts.map(debt => typeof debt.dueDate === 'string' ? new Date(debt.dueDate) : debt.dueDate);
    return new Date(Math.min(...dates.map(date => date.getTime())));
  }

  hasOverdueDebts(debts: Debt[]): boolean {
    if (!debts || debts.length === 0) return false;
    const now = new Date();
    return debts.some(debt => {
      if (!debt.isPaid) {
        const dueDate = typeof debt.dueDate === 'string' ? new Date(debt.dueDate) : debt.dueDate;
        return dueDate < now;
      }
      return false;
    });
  }
} 