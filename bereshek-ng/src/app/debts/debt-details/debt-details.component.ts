import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DebtorsService } from '../../core/services/debtors.service';
import { Debtor, Debt } from '../../core/models/debt.model';

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
    MatTooltipModule
  ],
  template: `
    <div class="details-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            Долги {{ debtor ? debtor.firstName + ' ' + debtor.lastName : 'Загрузка...' }}
            <mat-icon *ngIf="debtor?.isProblematic" 
                     color="warn" 
                     class="problematic-icon"
                     matTooltip="Проблемный клиент">
              warning
            </mat-icon>
          </mat-card-title>
          <mat-card-subtitle>
            Общая сумма: {{ debtor?.totalDebt | currency:'RUB':'symbol-narrow':'1.0-0' }}
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="contact-info">
            <p><strong>Телефон:</strong> {{ debtor?.phone }}</p>
            <p><strong>WhatsApp:</strong> {{ debtor?.whatsapp || 'Не указан' }}</p>
          </div>

          <h3>История долгов</h3>
          <mat-list>
            <mat-list-item *ngFor="let debt of debtor?.debts">
              <div class="debt-item">
                <div class="debt-info">
                  <h4>{{ debt.amount | currency:'RUB':'symbol-narrow':'1.0-0' }}</h4>
                  <p>{{ debt.description }}</p>
                  <p class="dates">
                    <span>Взят: {{ debt.borrowDate | date:'dd.MM.yyyy' }}</span>
                    <span>Вернуть до: {{ debt.dueDate | date:'dd.MM.yyyy' }}</span>
                  </p>
                </div>
                <div class="debt-status">
                  <mat-chip-set>
                    <mat-chip [color]="debt.isPaid ? 'primary' : (debt.isOverdue ? 'warn' : 'accent')"
                             highlighted>
                      {{ debt.isPaid ? 'Оплачен' : (debt.isOverdue ? 'Просрочен' : 'Активен') }}
                    </mat-chip>
                  </mat-chip-set>
                </div>
              </div>
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

    .problematic-icon {
      font-size: 20px;
      height: 20px;
      width: 20px;
      vertical-align: middle;
      margin-left: 8px;
    }

    .contact-info {
      margin: 20px 0;
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;

      p {
        margin: 8px 0;
      }
    }

    .debt-item {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      width: 100%;
      padding: 16px 0;
      border-bottom: 1px solid #e0e0e0;

      &:last-child {
        border-bottom: none;
      }
    }

    .debt-info {
      flex: 1;

      h4 {
        margin: 0 0 8px 0;
        font-weight: 500;
      }

      p {
        margin: 4px 0;
        color: rgba(0, 0, 0, 0.7);
      }

      .dates {
        display: flex;
        gap: 16px;
        font-size: 0.9em;
        color: rgba(0, 0, 0, 0.6);
      }
    }

    .debt-status {
      margin-left: 16px;
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
    const debtorId = Number(this.route.snapshot.paramMap.get('id'));
    if (debtorId) {
      this.loadDebtor(debtorId);
    }
  }

  loadDebtor(id: number): void {
    this.debtorsService.getDebtor(id).subscribe({
      next: (debtor) => {
        this.debtor = debtor;
      },
      error: (error) => {
        console.error('Error loading debtor:', error);
      }
    });
  }
}
