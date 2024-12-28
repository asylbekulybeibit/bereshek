import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },
  {
    path: 'debtors',
    loadChildren: () => import('./debtors/debtors.routes').then(m => m.DEBTORS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'debts',
    loadChildren: () => import('./debts/debts.routes').then(m => m.DEBTS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'debtors',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'debtors'
  }
];
