import { Routes } from '@angular/router';
import { DebtDetailsComponent } from './debt-details/debt-details.component';
import { DebtFormComponent } from './debt-form/debt-form.component';

export const DEBTS_ROUTES: Routes = [
  {
    path: 'new',
    component: DebtFormComponent
  },
  {
    path: ':id',
    component: DebtDetailsComponent
  }
]; 