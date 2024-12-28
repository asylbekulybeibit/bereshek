import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DebtorsService } from '../../core/services/debtors.service';
import { CreateDebtorDto } from '../../core/models/debt.model';

@Component({
  selector: 'app-debtor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <div class="form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Добавить должника</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="debtorForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline">
              <mat-label>Имя</mat-label>
              <input matInput formControlName="firstName" placeholder="Введите имя">
              <mat-error *ngIf="debtorForm.get('firstName')?.hasError('required')">
                Имя обязательно
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Фамилия</mat-label>
              <input matInput formControlName="lastName" placeholder="Введите фамилию">
              <mat-error *ngIf="debtorForm.get('lastName')?.hasError('required')">
                Фамилия обязательна
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Телефон</mat-label>
              <input matInput formControlName="phone" placeholder="Введите номер телефона">
              <mat-error *ngIf="debtorForm.get('phone')?.hasError('required')">
                Телефон обязателен
              </mat-error>
              <mat-error *ngIf="debtorForm.get('phone')?.hasError('pattern')">
                Неверный формат телефона
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>WhatsApp</mat-label>
              <input matInput formControlName="whatsapp" placeholder="Введите номер WhatsApp">
              <mat-error *ngIf="debtorForm.get('whatsapp')?.hasError('pattern')">
                Неверный формат номера
              </mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="debtorForm.invalid">
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
export class DebtorFormComponent implements OnInit {
  debtorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private debtorsService: DebtorsService,
    private router: Router
  ) {
    this.debtorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^\+7\d{10}$/)]],
      whatsapp: ['', Validators.pattern(/^\+7\d{10}$/)]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.debtorForm.valid) {
      const debtor: CreateDebtorDto = this.debtorForm.value;
      this.debtorsService.createDebtor(debtor).subscribe({
        next: () => {
          this.router.navigate(['/debtors']);
        },
        error: (error) => {
          console.error('Error creating debtor:', error);
        }
      });
    }
  }
}
