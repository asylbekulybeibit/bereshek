export interface Debtor {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp: string;
  totalDebt: number;
  isProblematic: boolean;
  debts: Debt[];
}

export interface CreateDebtorDto {
  firstName: string;
  lastName: string;
  phone: string;
  whatsapp: string;
}

export interface Debt {
  id: number;
  amount: number;
  borrowDate: Date;
  dueDate: Date;
  description: string;
  isPaid: boolean;
  isOverdue: boolean;
  debtorId: number;
}

export interface CreateDebtDto {
  amount: number;
  borrowDate: string;
  dueDate: string;
  description: string;
  debtorId: number;
  isPaid?: boolean;
  isOverdue?: boolean;
} 