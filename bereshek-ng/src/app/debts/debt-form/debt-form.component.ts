import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DebtorsService } from '../../core/services/debtors.service';
import { DebtsService } from '../../core/services/debts.service';
import { Debtor } from '../../core/models/debt.model';

@Component({
  selector: 'app-debt-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>
            <ng-container *ngIf="selectedDebtor; else loading">
              Добавить долг для {{ selectedDebtor.firstName }} {{ selectedDebtor.lastName }}
            </ng-container>
            <ng-template #loading>
              <span>Загрузка...</span>
              <mat-spinner diameter="20"></mat-spinner>
            </ng-template>
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="debtForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Сумма</mat-label>
              <input matInput type="number" formControlName="amount" placeholder="Введите сумму">
              <mat-error *ngIf="debtForm.get('amount')?.hasError('required')">
                Сумма обязательна
              </mat-error>
              <mat-error *ngIf="debtForm.get('amount')?.hasError('min')">
                Сумма должна быть больше 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Дата взятия долга</mat-label>
              <input matInput [matDatepicker]="borrowPicker" formControlName="borrowDate">
              <mat-datepicker-toggle matSuffix [for]="borrowPicker"></mat-datepicker-toggle>
              <mat-datepicker #borrowPicker></mat-datepicker>
              <mat-error *ngIf="debtForm.get('borrowDate')?.hasError('required')">
                Дата взятия долга обязательна
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Дата возврата</mat-label>
              <input matInput [matDatepicker]="duePicker" formControlName="dueDate">
              <mat-datepicker-toggle matSuffix [for]="duePicker"></mat-datepicker-toggle>
              <mat-datepicker #duePicker></mat-datepicker>
              <mat-error *ngIf="debtForm.get('dueDate')?.hasError('required')">
                Дата возврата обязательна
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Описание</mat-label>
              <textarea matInput formControlName="description" placeholder="Введите описание" rows="3"></textarea>
            </mat-form-field>

            <div class="form-actions">
              <button mat-button type="button" (click)="goBack()">
                Отмена
              </button>
              <button mat-raised-button color="primary" type="submit" [disabled]="debtForm.invalid || !selectedDebtor">
                Сохранить
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .form-container {
      padding: 20px;
      max-width: 600px;
      margin: 0 auto;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }

    mat-card-title {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    textarea {
      min-height: 100px;
    }
  `]
})
export class DebtFormComponent implements OnInit {
  debtForm: FormGroup;
  selectedDebtor?: Debtor;

  constructor(
    private fb: FormBuilder,
    private debtorsService: DebtorsService,
    private debtsService: DebtsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.debtForm = this.fb.group({
      amount: ['', [Validators.required, Validators.min(1)]],
      borrowDate: [new Date(), [Validators.required]],
      dueDate: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Получаем ID должника из параметров URL
    this.route.queryParams.subscribe(params => {
      const debtorId = params['debtorId'];
      if (debtorId) {
        this.loadDebtor(debtorId);
      } else {
        // Если ID должника не указан, перенаправляем на список должников
        this.router.navigate(['/debtors']);
      }
    });
  }

  loadDebtor(id: string): void {
    this.debtorsService.getDebtor(id).subscribe({
      next: (debtor) => {
        this.selectedDebtor = debtor;
      },
      error: (error) => {
        console.error('Error loading debtor:', error);
        this.router.navigate(['/debtors']);
      }
    });
  }

  onSubmit(): void {
    if (this.debtForm.valid && this.selectedDebtor) {
      const debtData = {
        ...this.debtForm.value,
        debtorId: this.selectedDebtor.id,
        isPaid: false,
        borrowDate: this.debtForm.value.borrowDate.toISOString(),
        dueDate: this.debtForm.value.dueDate.toISOString()
      };

      this.debtsService.createDebt(debtData).subscribe({
        next: () => {
          this.router.navigate(['/debtors']);
        },
        error: (error) => {
          console.error('Error creating debt:', error);
        }
      });
    }
  }

  goBack(): void {
    if (this.selectedDebtor) {
      this.router.navigate(['/debtors', this.selectedDebtor.id]);
    } else {
      this.router.navigate(['/debtors']);
    }
  }
}
