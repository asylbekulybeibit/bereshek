import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { DebtorsService } from '../../../core/services/debtors.service';

@Component({
  selector: 'app-debtor-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
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
              <mat-error *ngIf="debtorForm.get('firstName')?.errors?.['required']">
                Имя обязательно
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Фамилия</mat-label>
              <input matInput formControlName="lastName" placeholder="Введите фамилию">
              <mat-error *ngIf="debtorForm.get('lastName')?.errors?.['required']">
                Фамилия обязательна
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Телефон</mat-label>
              <input matInput 
                     formControlName="phone" 
                     placeholder="+7 (999) 999-99-99"
                     mask="+0 (000) 000-00-00"
                     [showMaskTyped]="true">
              <mat-error *ngIf="debtorForm.get('phone')?.errors?.['required']">
                Телефон обязателен
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>WhatsApp</mat-label>
              <input matInput 
                     formControlName="whatsapp" 
                     placeholder="+7 (999) 999-99-99"
                     mask="+0 (000) 000-00-00"
                     [showMaskTyped]="true">
              <mat-error *ngIf="debtorForm.get('whatsapp')?.errors?.['required']">
                Номер WhatsApp обязателен
              </mat-error>
            </mat-form-field>

            <div class="error-message" *ngIf="error">{{ error }}</div>

            <button mat-raised-button color="primary" type="submit" [disabled]="debtorForm.invalid || loading">
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
export class DebtorFormComponent {
  debtorForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private debtorsService: DebtorsService,
    private router: Router
  ) {
    this.debtorForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      phone: ['', Validators.required],
      whatsapp: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.debtorForm.invalid) return;

    this.loading = true;
    this.error = '';

    const formValue = this.debtorForm.value;
    const debtorData = {
      ...formValue,
      phone: formValue.phone.replace(/\D/g, ''),
      whatsapp: formValue.whatsapp.replace(/\D/g, '')
    };

    this.debtorsService.createDebtor(debtorData).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/debtors']);
      },
      error: (error) => {
        this.loading = false;
        console.error('Error creating debtor:', error);
        if (error.error?.message) {
          this.error = Array.isArray(error.error.message) 
            ? error.error.message.join(', ') 
            : error.error.message;
        } else {
          this.error = 'Ошибка при создании должника';
        }
      }
    });
  }
} 