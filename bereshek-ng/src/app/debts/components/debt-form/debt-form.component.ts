import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Router } from '@angular/router';
import { DebtorsService } from '../../../core/services/debtors.service';
import { Debtor } from '../../../core/models/debt.model';

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
    MatSelectModule
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
              <mat-error *ngIf="debtForm.get('debtorId')?.errors?.['required']">
                Выберите должника
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Сумма</mat-label>
              <input matInput type="number" formControlName="amount" placeholder="Введите сумму">
              <mat-error *ngIf="debtForm.get('amount')?.errors?.['required']">
                Сумма обязательна
              </mat-error>
              <mat-error *ngIf="debtForm.get('amount')?.errors?.['min']">
                Сумма должна быть больше 0
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Дата взятия долга</mat-label>
              <input matInput [matDatepicker]="borrowPicker" formControlName="borrowDate">
              <mat-datepicker-toggle matSuffix [for]="borrowPicker"></mat-datepicker-toggle>
              <mat-datepicker #borrowPicker></mat-datepicker>
              <mat-error *ngIf="debtForm.get('borrowDate')?.errors?.['required']">
                Дата взятия долга обязательна
              </mat-error>
              <mat-error *ngIf="debtForm.get('borrowDate')?.errors?.['futureDate']">
                Дата взятия долга не может быть в будущем
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Дата возврата</mat-label>
              <input matInput [matDatepicker]="duePicker" formControlName="dueDate">
              <mat-datepicker-toggle matSuffix [for]="duePicker"></mat-datepicker-toggle>
              <mat-datepicker #duePicker></mat-datepicker>
              <mat-error *ngIf="debtForm.get('dueDate')?.errors?.['required']">
                Дата возврата обязательна
              </mat-error>
              <mat-error *ngIf="debtForm.get('dueDate')?.errors?.['pastDate']">
                Дата возврата должна быть в будущем
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Описание</mat-label>
              <textarea matInput formControlName="description" placeholder="Введите описание" rows="3"></textarea>
              <mat-error *ngIf="debtForm.get('description')?.errors?.['required']">
                Описание обязательно
              </mat-error>
              <mat-error *ngIf="debtForm.get('description')?.errors?.['minlength']">
                Описание должно содержать минимум 10 символов
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="error">{{ error }}</div>

            <button mat-raised-button color="primary" type="submit" [disabled]="debtForm.invalid || loading">
              {{ loading ? 'Добавление...' : 'Добавить' }}
            </button>
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

    mat-card {
      margin-bottom: 20px;
    }

    mat-card-title {
      margin-bottom: 20px;
    }

    .error-message {
      color: #f44336;
      font-size: 12px;
      margin-bottom: 16px;
    }
  `]
})
export class DebtFormComponent implements OnInit {
  debtForm: FormGroup;
  debtors: Debtor[] = [];
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private debtorsService: DebtorsService,
    private router: Router
  ) {
    this.debtForm = this.formBuilder.group({
      debtorId: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(1)]],
      borrowDate: ['', [Validators.required, this.futureDateValidator()]],
      dueDate: ['', [Validators.required, this.pastDateValidator()]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadDebtors();
  }

  loadDebtors(): void {
    this.loading = true;
    this.debtorsService.getDebtors().subscribe({
      next: (debtors) => {
        this.debtors = debtors;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading debtors:', error);
        this.error = 'Ошибка при загрузке списка должников';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.debtForm.invalid) return;

    this.loading = true;
    this.error = '';

    const formValue = this.debtForm.value;
    const debtData = {
      ...formValue,
      borrowDate: this.formatDate(formValue.borrowDate),
      dueDate: this.formatDate(formValue.dueDate)
    };

    this.debtorsService.createDebt(debtData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/debtors', formValue.debtorId]);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating debt:', error);
        if (error.error?.message) {
          this.error = Array.isArray(error.error.message) 
            ? error.error.message.join(', ') 
            : error.error.message;
        } else {
          this.error = 'Ошибка при создании долга';
        }
      }
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private futureDateValidator() {
    return (control: any) => {
      const date = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date > today ? { futureDate: true } : null;
    };
  }

  private pastDateValidator() {
    return (control: any) => {
      const date = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today ? { pastDate: true } : null;
    };
  }
} 