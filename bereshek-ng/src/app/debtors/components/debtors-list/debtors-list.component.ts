import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, Sort, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { DebtorsService } from '../../../core/services/debtors.service';
import { Debtor, Debt, DebtStatus } from '../../../core/models/debt.model';

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
    MatExpansionModule,
    MatDividerModule,
    FormsModule
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  template: `
    <div class="debtors-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Должники</mat-card-title>
          <div class="header-actions">
            <button mat-raised-button color="primary" routerLink="/debtors/new">
              <mat-icon>person_add</mat-icon>
              Добавить должника
            </button>
          </div>
        </mat-card-header>

        <mat-card-content>
          <mat-form-field appearance="outline" class="search-field">
            <mat-label>Поиск должника</mat-label>
            <mat-icon matPrefix>search</mat-icon>
            <input matInput (keyup)="applyFilter($event)" placeholder="Введите имя или телефон" #input>
          </mat-form-field>

          <table mat-table [dataSource]="dataSource" matSort class="mat-elevation-z8"
                 multiTemplateDataRows>
            <!-- ФИО Column -->
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> ФИО </th>
              <td mat-cell *matCellDef="let debtor">
                {{ debtor.firstName }} {{ debtor.lastName }}
                <mat-chip-set *ngIf="hasOverdueDebts(debtor.debts)">
                  <mat-chip color="warn" selected>!</mat-chip>
                </mat-chip-set>
              </td>
            </ng-container>

            <!-- Контакты Column -->
            <ng-container matColumnDef="contacts">
              <th mat-header-cell *matHeaderCellDef> Контакты </th>
              <td mat-cell *matCellDef="let debtor">
                <div class="contacts-container">
                  <div class="contact-item">
                    <mat-icon>phone</mat-icon>
                    {{ debtor.phone }}
                  </div>
                  <div class="contact-item whatsapp" *ngIf="debtor.whatsapp">
                    <img src="assets/whatsapp-icon.svg" class="whatsapp-icon" alt="WhatsApp"/>
                    {{ debtor.whatsapp }}
                  </div>
                </div>
              </td>
            </ng-container>

            <!-- Активные долги Column -->
            <ng-container matColumnDef="activeDebt">
              <th mat-header-cell *matHeaderCellDef mat-sort-header> Активные долги </th>
              <td mat-cell *matCellDef="let debtor" class="total-debt">
                {{ getActiveDebtsTotal(debtor.debts) | currency:'KZT':'symbol-narrow':'1.0-0' }}
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Действия </th>
              <td mat-cell *matCellDef="let debtor">
                <button mat-icon-button color="primary" 
                        [routerLink]="['/debts/new']" 
                        [queryParams]="{debtorId: debtor.id}"
                        matTooltip="Добавить долг">
                  <mat-icon>add</mat-icon>
                </button>
                <button mat-icon-button color="accent"
                        (click)="$event.stopPropagation()"
                        [routerLink]="['/debtors', debtor.id]"
                        matTooltip="Просмотреть детали">
                  <mat-icon>visibility</mat-icon>
                </button>
                <button mat-icon-button color="warn"
                        (click)="$event.stopPropagation()"
                        [routerLink]="['/debtors', debtor.id, 'edit']"
                        matTooltip="Редактировать">
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>

            <!-- Expanded Content Column -->
            <ng-container matColumnDef="expandedDetail">
              <td mat-cell *matCellDef="let debtor" [attr.colspan]="displayedColumns.length">
                <div class="debtor-detail"
                     [@detailExpand]="debtor == expandedElement ? 'expanded' : 'collapsed'">
                  <div class="active-debts-list">
                    <h3>Активные долги</h3>
                    <div class="debts-grid">
                      <div *ngFor="let debt of getActiveDebts(debtor.debts)" class="debt-item mat-elevation-z2">
                        <div class="debt-header">
                          <span class="debt-amount">{{ debt.amount | currency:'KZT':'symbol-narrow':'1.0-0' }}</span>
                          <span class="debt-status" [class]="debt.status">
                            <mat-icon [class]="debt.status">
                              {{ debt.status === 'ACTIVE' ? 'schedule' : 'warning' }}
                            </mat-icon>
                            {{ getStatusText(debt.status) }}
                          </span>
                        </div>

                        <div class="debt-dates">
                          <div class="date-item">
                            <mat-icon>event</mat-icon>
                            <div class="date-info">
                              <span class="date-label">Взят:</span>
                              <span class="date-value">{{ debt.createdAt | date:'dd.MM.yyyy' }}</span>
                            </div>
                          </div>
                          <div class="date-item" [class.overdue]="isOverdue(parseDate(debt.dueDate))">
                            <mat-icon>event_available</mat-icon>
                            <div class="date-info">
                              <span class="date-label">Срок возврата:</span>
                              <span class="date-value">{{ debt.dueDate | date:'dd.MM.yyyy' }}</span>
                            </div>
                          </div>
                        </div>

                        <p *ngIf="debt.description" class="debt-description">
                          <mat-icon>description</mat-icon>
                          {{ debt.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let debtor; columns: displayedColumns;"
                class="debtor-row"
                [class.expanded-row]="expandedElement === debtor"
                (click)="expandedElement = expandedElement === debtor ? null : debtor">
            </tr>
            <tr mat-row *matRowDef="let row; columns: ['expandedDetail']" class="detail-row"></tr>

            <!-- Row shown when there is no matching data. -->
            <tr class="mat-row" *matNoDataRow>
              <td class="mat-cell" colspan="4">
                Нет должников, соответствующих поиску "{{input.value}}"
              </td>
            </tr>
          </table>

          <mat-paginator [pageSizeOptions]="[10, 25, 50]"
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

    .header-actions {
      margin-left: auto;
    }

    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }

    table {
      width: 100%;
    }

    tr.detail-row {
      height: 0;
    }

    tr.debtor-row:not(.expanded-row):hover {
      background: whitesmoke;
      cursor: pointer;
    }

    tr.debtor-row:not(.expanded-row):active {
      background: #efefef;
    }

    .debtor-row td {
      border-bottom-width: 0;
    }

    .debtor-detail {
      overflow: hidden;
    }

    .active-debts-list {
      padding: 24px;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 16px 24px;

      h3 {
        margin: 0 0 16px 0;
        color: rgba(0, 0, 0, 0.87);
        font-size: 1.1em;
      }

      .debts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
        
        .debt-item {
          background: white;
          border-radius: 8px;
          padding: 16px;
          transition: transform 0.2s, box-shadow 0.2s;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }

          .debt-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;

            .debt-amount {
              font-size: 1.3em;
              font-weight: 500;
            }

            .debt-status {
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 6px 12px;
              border-radius: 16px;
              font-size: 0.9em;
              
              mat-icon {
                font-size: 18px;
                width: 18px;
                height: 18px;
              }

              &.ACTIVE {
                background-color: #e3f2fd;
                color: #1565c0;

                mat-icon {
                  color: #1565c0;
                }
              }
              
              &.OVERDUE {
                background-color: #fce4ec;
                color: #c2185b;

                mat-icon {
                  color: #c2185b;
                }
              }
            }
          }

          .debt-dates {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 12px;

            .date-item {
              display: flex;
              align-items: center;
              gap: 8px;
              color: rgba(0, 0, 0, 0.7);

              mat-icon {
                color: rgba(0, 0, 0, 0.54);
                font-size: 18px;
                width: 18px;
                height: 18px;
              }

              .date-info {
                display: flex;
                flex-direction: column;

                .date-label {
                  font-size: 0.8em;
                  color: rgba(0, 0, 0, 0.54);
                }

                .date-value {
                  font-weight: 500;
                }
              }

              &.overdue {
                color: #f44336;

                mat-icon {
                  color: #f44336;
                }

                .date-label {
                  color: #f44336;
                }
              }
            }
          }

          .debt-description {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin: 12px 0 0 0;
            padding-top: 12px;
            border-top: 1px solid rgba(0, 0, 0, 0.12);
            color: rgba(0, 0, 0, 0.7);
            font-size: 0.9em;

            mat-icon {
              color: rgba(0, 0, 0, 0.54);
              font-size: 18px;
              width: 18px;
              height: 18px;
            }
          }
        }
      }
    }

    .contacts-container {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .contact-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(0, 0, 0, 0.87);

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          color: rgba(0, 0, 0, 0.54);
        }

        &.whatsapp {
          color: #128C7E;

          .whatsapp-icon {
            width: 20px;
            height: 20px;
          }
        }
      }
    }

    .total-debt {
      font-weight: 500;
      color: #1976d2;
    }
  `]
})
export class DebtorsListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'contacts', 'activeDebt', 'actions'];
  dataSource: MatTableDataSource<Debtor>;
  expandedElement: Debtor | null = null;
  error = '';
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private debtorsService: DebtorsService) {
    this.dataSource = new MatTableDataSource<Debtor>([]);
  }

  ngOnInit(): void {
    this.loadDebtors();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.dataSource.sortingDataAccessor = (item: Debtor, property: string) => {
      switch(property) {
        case 'name':
          return item.firstName + ' ' + item.lastName;
        case 'activeDebt':
          return this.getActiveDebtsTotal(item.debts);
        default:
          return (item as any)[property];
      }
    };

    this.dataSource.filterPredicate = (data: Debtor, filter: string) => {
      const searchStr = (data.firstName + ' ' + data.lastName + ' ' + data.phone + ' ' + (data.whatsapp || '')).toLowerCase();
      return searchStr.includes(filter.toLowerCase());
    };
  }

  loadDebtors(): void {
    this.debtorsService.getDebtors().subscribe({
      next: (debtors) => {
        console.log('Loaded debtors with debts:', debtors);
        this.dataSource.data = debtors;
      },
      error: (error) => {
        console.error('Error loading debtors:', error);
        this.error = error.error?.message || 'An error occurred while loading debtors';
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

  getActiveDebts(debts: Debt[]): Debt[] {
    if (!debts || !Array.isArray(debts)) return [];
    return debts.filter(debt => debt.status === 'ACTIVE' || debt.status === 'OVERDUE');
  }

  getActiveDebtsTotal(debts: Debt[]): number {
    if (!debts || !Array.isArray(debts)) return 0;
    return debts
      .filter(debt => debt.status === 'ACTIVE' || debt.status === 'OVERDUE')
      .reduce((sum, debt) => {
        const amount = typeof debt.amount === 'string' ? parseFloat(debt.amount) : debt.amount;
        return sum + (amount || 0);
      }, 0);
  }

  hasOverdueDebts(debts: Debt[]): boolean {
    return debts?.some(debt => 
      debt.status === 'OVERDUE' || 
      (debt.status === 'ACTIVE' && new Date(debt.dueDate) < new Date())
    ) || false;
  }

  parseDate(dateStr: string): Date {
    return new Date(dateStr);
  }

  isOverdue(date: Date | null): boolean {
    if (!date) return false;
    return date < new Date();
  }

  getStatusText(status: DebtStatus): string {
    const statusTexts: Record<DebtStatus, string> = {
      'ACTIVE': 'Активен',
      'OVERDUE': 'Просрочен',
      'PAID': 'Оплачен'
    };
    return statusTexts[status];
  }

  deleteDebtor(id: string): void {
    if (confirm('Are you sure you want to delete this debtor?')) {
      this.debtorsService.deleteDebtor(id).subscribe({
        next: () => {
          this.dataSource.data = this.dataSource.data.filter(debtor => debtor.id !== id);
        },
        error: (error) => {
          this.error = error.error?.message || 'An error occurred while deleting the debtor';
        }
      });
    }
  }
} 