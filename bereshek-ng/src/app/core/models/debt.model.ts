export interface Debtor {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp?: string;
  debts: Debt[];
}

export interface CreateDebtorDto {
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp?: string;
}

export type DebtStatus = 'ACTIVE' | 'OVERDUE' | 'PAID';

export interface Debt {
  id: string;
  amount: number;
  createdAt: string;
  dueDate: string;
  description?: string;
  status: DebtStatus;
  debtorId: string;
}

export interface CreateDebtDto {
  amount: number;
  dueDate: string;
  description?: string;
  debtorId: string;
} 