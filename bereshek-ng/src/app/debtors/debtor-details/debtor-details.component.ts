import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { DebtorsService, Debtor } from '../../core/services/debtors.service';
import { DebtsService, Debt } from '../../core/services/debts.service';

@Component({
  selector: 'app-debtor-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule
  ],
  templateUrl: './debtor-details.component.html',
  styleUrl: './debtor-details.component.scss'
})
export class DebtorDetailsComponent implements OnInit {
  debtor?: Debtor;
  debts: Debt[] = [];
  displayedColumns: string[] = ['amount', 'description', 'dueDate', 'status', 'actions'];
  loading = true;
  error = '';

  constructor(
    private debtorsService: DebtorsService,
    private debtsService: DebtsService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const debtorId = Number(this.route.snapshot.paramMap.get('id'));
    if (debtorId) {
      this.loadDebtor(debtorId);
      this.loadDebts(debtorId);
    }
  }

  loadDebtor(id: number): void {
    this.debtorsService.getDebtor(id).subscribe({
      next: (debtor) => {
        this.debtor = debtor;
        this.loading = false;
      },
      error: (error) => {
        this.error = error.error?.message || 'An error occurred while loading the debtor';
        this.loading = false;
      }
    });
  }

  loadDebts(debtorId: number): void {
    this.debtsService.getDebtsByDebtor(debtorId).subscribe({
      next: (debts) => {
        this.debts = debts;
      },
      error: (error) => {
        this.error = error.error?.message || 'An error occurred while loading debts';
      }
    });
  }

  deleteDebtor(): void {
    if (!this.debtor || !confirm('Are you sure you want to delete this debtor?')) {
      return;
    }

    this.debtorsService.deleteDebtor(this.debtor.id).subscribe({
      next: () => {
        this.router.navigate(['/debtors']);
      },
      error: (error) => {
        this.error = error.error?.message || 'An error occurred while deleting the debtor';
      }
    });
  }

  markDebtAsPaid(debtId: number): void {
    this.debtsService.markAsPaid(debtId).subscribe({
      next: (updatedDebt) => {
        this.debts = this.debts.map(debt => 
          debt.id === debtId ? updatedDebt : debt
        );
      },
      error: (error) => {
        this.error = error.error?.message || 'An error occurred while updating the debt';
      }
    });
  }

  deleteDebt(debtId: number): void {
    if (!confirm('Are you sure you want to delete this debt?')) {
      return;
    }

    this.debtsService.deleteDebt(debtId).subscribe({
      next: () => {
        this.debts = this.debts.filter(debt => debt.id !== debtId);
      },
      error: (error) => {
        this.error = error.error?.message || 'An error occurred while deleting the debt';
      }
    });
  }
}
