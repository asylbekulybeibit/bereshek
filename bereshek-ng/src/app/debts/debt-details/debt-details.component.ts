import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';

import { DebtorsService } from '../../core/services/debtors.service';
import { Debtor, Debt, DebtStatus } from '../../core/models/debt.model';

@Component({
  selector: 'app-debt-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
    MatTooltipModule,
    MatDividerModule
  ],
  template: `
    <div class="details-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            {{ debtor ? debtor.firstName + ' ' + debtor.lastName : 'Загрузка...' }}
            <mat-chip-set *ngIf="hasOverdueDebts()">
              <mat-chip color="warn" selected>Есть просроченные долги</mat-chip>
            </mat-chip-set>
          </mat-card-title>
          <mat-card-subtitle>
            Общая сумма: {{ getTotalDebt() | currency:'KZT':'symbol-narrow':'1.0-0' }}
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <div class="contact-info">
            <p>
              <mat-icon>phone</mat-icon>
              <strong>Телефон:</strong> {{ debtor?.phone }}
            </p>
            <p *ngIf="debtor?.whatsapp">
              <mat-icon>whatsapp</mat-icon>
              <strong>WhatsApp:</strong> {{ debtor?.whatsapp }}
            </p>
          </div>

          <h3>История долгов</h3>
          <mat-list>
            <mat-list-item *ngFor="let debt of sortedDebts()" class="debt-list-item">
              <div class="debt-item">
                <div class="debt-info">
                  <div class="debt-header">
                    <h4>{{ debt.amount | currency:'KZT':'symbol-narrow':'1.0-0' }}</h4>
                    <span class="debt-status" [class]="debt.status">
                      {{ getStatusText(debt.status) }}
                    </span>
                  </div>
                  <p *ngIf="debt.description" class="debt-description">{{ debt.description }}</p>
                  <div class="debt-dates">
                    <span>
                      <mat-icon>event</mat-icon>
                      Создан: {{ debt.createdAt | date:'dd.MM.yyyy' }}
                    </span>
                    <span [class.overdue]="isOverdue(parseDate(debt.dueDate))">
                      <mat-icon>event_available</mat-icon>
                      Срок: {{ debt.dueDate | date:'dd.MM.yyyy' }}
                    </span>
                  </div>
                </div>
              </div>
              <mat-divider></mat-divider>
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .details-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }

    .contact-info {
      margin: 20px 0;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;

      p {
        margin: 8px 0;
        display: flex;
        align-items: center;
        gap: 8px;

        mat-icon {
          color: rgba(0, 0, 0, 0.54);
        }
      }
    }

    .debt-list-item {
      margin-bottom: 16px;
    }

    .debt-item {
      width: 100%;
      padding: 16px 0;

      .debt-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        h4 {
          margin: 0;
          font-size: 1.2em;
          font-weight: 500;
        }
      }

      .debt-status {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9em;
        
        &.ACTIVE {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        &.OVERDUE {
          background-color: #ffebee;
          color: #c62828;
        }
        
        &.PAID {
          background-color: #e3f2fd;
          color: #1565c0;
        }
      }

      .debt-description {
        margin: 8px 0;
        color: rgba(0, 0, 0, 0.87);
      }

      .debt-dates {
        display: flex;
        justify-content: space-between;
        color: rgba(0, 0, 0, 0.54);
        font-size: 0.9em;
        margin-top: 8px;

        span {
          display: flex;
          align-items: center;
          gap: 4px;

          &.overdue {
            color: #f44336;
          }

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 12px;
    }
  `]
})
export class DebtDetailsComponent implements OnInit {
  debtor?: Debtor;

  constructor(
    private route: ActivatedRoute,
    private debtorsService: DebtorsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadDebtor(params['id']);
      }
    });
  }

  loadDebtor(id: string): void {
    this.debtorsService.getDebtor(id).subscribe({
      next: (debtor) => {
        this.debtor = debtor;
      },
      error: (error) => {
        console.error('Error loading debtor:', error);
      }
    });
  }

  getTotalDebt(): number {
    if (!this.debtor?.debts) return 0;
    return this.debtor.debts.reduce((total, debt) => total + debt.amount, 0);
  }

  parseDate(dateStr: string): Date {
    return new Date(dateStr);
  }

  isOverdue(date: Date): boolean {
    return date < new Date();
  }

  hasOverdueDebts(): boolean {
    if (!this.debtor?.debts) return false;
    return this.debtor.debts.some(debt => 
      debt.status === 'OVERDUE' || 
      (debt.status === 'ACTIVE' && this.isOverdue(this.parseDate(debt.dueDate)))
    );
  }

  getStatusText(status: DebtStatus): string {
    const statusTexts: Record<DebtStatus, string> = {
      'ACTIVE': 'Активен',
      'OVERDUE': 'Просрочен',
      'PAID': 'Оплачен'
    };
    return statusTexts[status];
  }

  sortedDebts(): Debt[] {
    if (!this.debtor?.debts) return [];
    return [...this.debtor.debts].sort((a, b) => {
      const statusOrder: Record<DebtStatus, number> = {
        'OVERDUE': 0,
        'ACTIVE': 1,
        'PAID': 2
      };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }
}
