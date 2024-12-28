import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DebtorsService, Debtor } from '../../core/services/debtors.service';

@Component({
  selector: 'app-debtors-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './debtors-list.component.html',
  styleUrl: './debtors-list.component.scss'
})
export class DebtorsListComponent implements OnInit {
  debtors: Debtor[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'address', 'actions'];
  loading = true;
  error = '';

  constructor(private debtorsService: DebtorsService) {}

  ngOnInit(): void {
    this.loadDebtors();
  }

  loadDebtors(): void {
    this.loading = true;
    this.error = '';

    this.debtorsService.getDebtors().subscribe({
      next: (debtors) => {
        this.debtors = debtors;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'An error occurred while loading debtors';
        this.loading = false;
      }
    });
  }

  deleteDebtor(id: number): void {
    if (confirm('Are you sure you want to delete this debtor?')) {
      this.debtorsService.deleteDebtor(id).subscribe({
        next: () => {
          this.debtors = this.debtors.filter(debtor => debtor.id !== id);
        },
        error: (error) => {
          this.error = error.error?.message || 'An error occurred while deleting the debtor';
        }
      });
    }
  }
}
