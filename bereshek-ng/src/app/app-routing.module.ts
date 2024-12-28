import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebtFormComponent } from './debts/debt-form/debt-form.component';

const routes: Routes = [
  {
    path: 'debtors',
    loadChildren: () => import('./debtors/debtors.module').then(m => m.DebtorsModule)
  },
  {
    path: 'debts/new',
    component: DebtFormComponent
  },
  {
    path: '',
    redirectTo: 'debtors',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 