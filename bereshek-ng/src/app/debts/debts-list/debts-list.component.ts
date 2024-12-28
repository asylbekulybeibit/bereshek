import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { DebtsService, Debt } from '../../core/services/debts.service';

@Component({
  selector: 'app-debts-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './debts-list.component.html',
  styleUrl: './debts-list.component.scss'
})
export class DebtsListComponent implements OnInit {
  debts: Debt[] = [];
  displayedColumns: string[] = ['amount', 'description', 'dueDate', 'status', 'actions'];
  loading = true;
  error = '';

  constructor(private debtsService: DebtsService) {}

  ngOnInit(): void {
    this.loadDebts();
  }

  loadDebts(): void {
    this.loading = true;
    this.error = '';

    this.debtsService.getDebts().subscribe({
      next: (debts) => {
        this.debts = debts;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'An error occurred while loading debts';
        this.loading = false;
      }
    });
  }

  markAsPaid(id: number): void {
    this.debtsService.markAsPaid(id).subscribe({
      next: (updatedDebt) => {
        this.debts = this.debts.map(debt => 
          debt.id === id ? updatedDebt : debt
        );
      },
      error: (error) => {
        this.error = error.error?.message || 'An error occurred while updating the debt';
      }
    });
  }

  deleteDebt(id: number): void {
    if (confirm('Are you sure you want to delete this debt?')) {
      this.debtsService.deleteDebt(id).subscribe({
        next: () => {
          this.debts = this.debts.filter(debt => debt.id !== id);
        },
        error: (error) => {
          this.error = error.error?.message || 'An error occurred while deleting the debt';
        }
      });
    }
  }
}
