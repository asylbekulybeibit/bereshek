import { Routes } from '@angular/router';
import { DebtorsListComponent } from './components/debtors-list/debtors-list.component';
import { DebtorFormComponent } from './components/debtor-form/debtor-form.component';

export const DEBTORS_ROUTES: Routes = [
  {
    path: '',
    component: DebtorsListComponent
  },
  {
    path: 'new',
    component: DebtorFormComponent
  }
]; 