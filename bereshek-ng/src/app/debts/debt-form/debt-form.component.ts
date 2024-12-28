import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { DebtorsService } from '../../core/services/debtors.service';
import { DebtsService } from '../../core/services/debts.service';
import { Debtor, CreateDebtDto } from '../../core/models/debt.model';

@Component({
  selector: 'app-debt-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Добавить долг</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="debtForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Должник</mat-label>
              <mat-select formControlName="debtorId">
                <mat-option *ngFor="let debtor of debtors" [value]="debtor.id">
                  {{debtor.firstName}} {{debtor.lastName}}
                </mat-option>
              </mat-select>
              <mat-error *ngIf="debtForm.get('debtorId')?.hasError('required')">
                Выберите должника
              </mat-error>
            </mat-form-field>

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
              <mat-label>Дата взятия</mat-label>
              <input matInput [matDatepicker]="borrowPicker" formControlName="borrowDate">
              <mat-datepicker-toggle matSuffix [for]="borrowPicker"></mat-datepicker-toggle>
              <mat-datepicker #borrowPicker></mat-datepicker>
              <mat-error *ngIf="debtForm.get('borrowDate')?.hasError('required')">
                Дата взятия обязательна
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
              <mat-error *ngIf="debtForm.get('description')?.hasError('required')">
                Описание обязательно
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="debtForm.invalid">
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

    mat-card {
      margin-bottom: 20px;
    }

    mat-card-header {
      margin-bottom: 20px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
    }
  `]
})
export class DebtFormComponent implements OnInit {
  debtForm: FormGroup;
  debtors: Debtor[] = [];

  constructor(
    private fb: FormBuilder,
    private debtorsService: DebtorsService,
    private debtsService: DebtsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const now = new Date();
    this.debtForm = this.fb.group({
      debtorId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      borrowDate: [now, Validators.required],
      dueDate: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadDebtors();
    
    // Если есть параметр debtorId в URL, устанавливаем его в форму
    const debtorId = this.route.snapshot.queryParamMap.get('debtorId');
    if (debtorId) {
      this.debtForm.patchValue({ debtorId: Number(debtorId) });
    }
  }

  loadDebtors(): void {
    this.debtorsService.getDebtors().subscribe({
      next: (debtors) => {
        this.debtors = debtors;
      },
      error: (error) => {
        console.error('Error loading debtors:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.debtForm.valid) {
      const debt: CreateDebtDto = {
        ...this.debtForm.value,
        borrowDate: this.debtForm.value.borrowDate.toISOString(),
        dueDate: this.debtForm.value.dueDate.toISOString(),
        isPaid: false,
        isOverdue: false
      };

      this.debtsService.createDebt(debt).subscribe({
        next: () => {
          this.router.navigate(['/debtors', debt.debtorId]);
        },
        error: (error) => {
          console.error('Error creating debt:', error);
        }
      });
    }
  }
}
