export type PaymentStatus = 'paid' | 'unpaid' | 'saved';

export interface Client {
  id: string;
  name: string;
  createdAt: Date;
}

export interface Income {
  id: string;
  description: string;
  amount: number;
  clientId: string;
  paymentDate: Date;
  category: string;
  createdAt: Date;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  dueDate: Date;
  status: PaymentStatus;
  paymentSourceId?: string; // Client ID used as payment source
  type: 'business' | 'personal';
  createdAt: Date;
}

export interface Investment {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  createdAt: Date;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  totalInvestments: number;
  paidExpenses: number;
  unpaidExpenses: number;
  savedExpenses: number;
  availableBalance: number;
  businessBalance: number;
  personalBalance: number;
  expensesBySource: Record<string, number>;
}
