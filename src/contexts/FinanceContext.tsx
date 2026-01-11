import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Client, Income, Expense, Investment, FinancialSummary, PaymentStatus } from '@/types/finance';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

interface FinanceContextType {
  clients: Client[];
  incomes: Income[];
  expenses: Expense[];
  investments: Investment[];
  filteredIncomes: Income[];
  filteredExpenses: Expense[];
  filteredInvestments: Investment[];
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  removeClient: (id: string) => void;
  addIncome: (income: Omit<Income, 'id' | 'createdAt'>) => void;
  removeIncome: (id: string) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  updateExpenseStatus: (id: string, status: PaymentStatus, paymentSourceId?: string) => void;
  removeExpense: (id: string) => void;
  addInvestment: (investment: Omit<Investment, 'id' | 'createdAt'>) => void;
  removeInvestment: (id: string) => void;
  getBusinessSummary: () => FinancialSummary;
  getPersonalSummary: () => FinancialSummary;
  getTotalSummary: () => FinancialSummary;
  getClientById: (id: string) => Client | undefined;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const generateId = () => Math.random().toString(36).substr(2, 9);

// Sample data for demonstration
const sampleClients: Client[] = [
  { id: '1', name: 'Usina', createdAt: new Date() },
  { id: '2', name: 'Campo Grande', createdAt: new Date() },
  { id: '3', name: 'Mercado', createdAt: new Date() },
];

const sampleIncomes: Income[] = [
  { id: '1', description: 'Serviço mensal', amount: 3500, clientId: '1', paymentDate: new Date(), category: 'Serviços', createdAt: new Date() },
  { id: '2', description: 'Projeto especial', amount: 1200, clientId: '2', paymentDate: new Date(), category: 'Projetos', createdAt: new Date() },
  { id: '3', description: 'Consultoria', amount: 800, clientId: '3', paymentDate: new Date(), category: 'Consultoria', createdAt: new Date() },
];

const sampleExpenses: Expense[] = [
  { id: '1', description: 'Internet empresa', amount: 150, category: 'Infraestrutura', dueDate: new Date(), status: 'paid', paymentSourceId: '1', type: 'business', createdAt: new Date() },
  { id: '2', description: 'DAS MEI', amount: 67, category: 'Impostos', dueDate: new Date(), status: 'unpaid', type: 'business', createdAt: new Date() },
  { id: '3', description: 'Aluguel', amount: 1200, category: 'Moradia', dueDate: new Date(), status: 'paid', paymentSourceId: '1', type: 'personal', createdAt: new Date() },
  { id: '4', description: 'Energia', amount: 280, category: 'Moradia', dueDate: new Date(), status: 'unpaid', type: 'personal', createdAt: new Date() },
  { id: '5', description: 'Reserva emergência', amount: 500, category: 'Poupança', dueDate: new Date(), status: 'saved', paymentSourceId: '2', type: 'personal', createdAt: new Date() },
];

const sampleInvestments: Investment[] = [
  { id: '1', description: 'Novo equipamento', amount: 800, category: 'Equipamentos', date: new Date(), createdAt: new Date() },
];

// Helper function to check if a date is within a month
const isInMonth = (date: Date, monthDate: Date): boolean => {
  const start = startOfMonth(monthDate);
  const end = endOfMonth(monthDate);
  return isWithinInterval(new Date(date), { start, end });
};

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [clients, setClients] = useState<Client[]>(sampleClients);
  const [incomes, setIncomes] = useState<Income[]>(sampleIncomes);
  const [expenses, setExpenses] = useState<Expense[]>(sampleExpenses);
  const [investments, setInvestments] = useState<Investment[]>(sampleInvestments);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  // Filtered data by selected month
  const filteredIncomes = useMemo(() => {
    return incomes.filter(income => isInMonth(income.paymentDate, selectedMonth));
  }, [incomes, selectedMonth]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => isInMonth(expense.dueDate, selectedMonth));
  }, [expenses, selectedMonth]);

  const filteredInvestments = useMemo(() => {
    return investments.filter(investment => isInMonth(investment.date, selectedMonth));
  }, [investments, selectedMonth]);

  const addClient = useCallback((client: Omit<Client, 'id' | 'createdAt'>) => {
    setClients(prev => [...prev, { ...client, id: generateId(), createdAt: new Date() }]);
  }, []);

  const removeClient = useCallback((id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  }, []);

  const addIncome = useCallback((income: Omit<Income, 'id' | 'createdAt'>) => {
    setIncomes(prev => [...prev, { ...income, id: generateId(), createdAt: new Date() }]);
  }, []);

  const removeIncome = useCallback((id: string) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    setExpenses(prev => [...prev, { ...expense, id: generateId(), createdAt: new Date() }]);
  }, []);

  const updateExpenseStatus = useCallback((id: string, status: PaymentStatus, paymentSourceId?: string) => {
    setExpenses(prev => prev.map(e => 
      e.id === id ? { ...e, status, paymentSourceId } : e
    ));
  }, []);

  const removeExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const addInvestment = useCallback((investment: Omit<Investment, 'id' | 'createdAt'>) => {
    setInvestments(prev => [...prev, { ...investment, id: generateId(), createdAt: new Date() }]);
  }, []);

  const removeInvestment = useCallback((id: string) => {
    setInvestments(prev => prev.filter(i => i.id !== id));
  }, []);

  const getClientById = useCallback((id: string) => {
    return clients.find(c => c.id === id);
  }, [clients]);

  const calculateSummary = useCallback((type?: 'business' | 'personal'): FinancialSummary => {
    const typeFilteredExpenses = type 
      ? filteredExpenses.filter(e => e.type === type)
      : filteredExpenses;

    const totalIncome = type === 'personal' ? 0 : filteredIncomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpenses = typeFilteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const totalInvestments = type === 'personal' ? 0 : filteredInvestments.reduce((sum, i) => sum + i.amount, 0);
    
    const paidExpenses = typeFilteredExpenses
      .filter(e => e.status === 'paid')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const unpaidExpenses = typeFilteredExpenses
      .filter(e => e.status === 'unpaid')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const savedExpenses = typeFilteredExpenses
      .filter(e => e.status === 'saved')
      .reduce((sum, e) => sum + e.amount, 0);

    // Calculate expenses by payment source
    const expensesBySource: Record<string, number> = {};
    typeFilteredExpenses.forEach(e => {
      if (e.paymentSourceId) {
        expensesBySource[e.paymentSourceId] = (expensesBySource[e.paymentSourceId] || 0) + e.amount;
      }
    });

    const businessExpenses = filteredExpenses
      .filter(e => e.type === 'business')
      .reduce((sum, e) => sum + e.amount, 0);
    
    const personalExpenses = filteredExpenses
      .filter(e => e.type === 'personal')
      .reduce((sum, e) => sum + e.amount, 0);

    const businessBalance = totalIncome - businessExpenses - totalInvestments;
    const personalBalance = businessBalance - personalExpenses;

    return {
      totalIncome,
      totalExpenses,
      totalInvestments,
      paidExpenses,
      unpaidExpenses,
      savedExpenses,
      availableBalance: totalIncome - paidExpenses - totalInvestments,
      businessBalance,
      personalBalance,
      expensesBySource,
    };
  }, [filteredIncomes, filteredExpenses, filteredInvestments]);

  const getBusinessSummary = useCallback(() => calculateSummary('business'), [calculateSummary]);
  const getPersonalSummary = useCallback(() => calculateSummary('personal'), [calculateSummary]);
  const getTotalSummary = useCallback(() => calculateSummary(), [calculateSummary]);

  return (
    <FinanceContext.Provider value={{
      clients,
      incomes,
      expenses,
      investments,
      filteredIncomes,
      filteredExpenses,
      filteredInvestments,
      selectedMonth,
      setSelectedMonth,
      addClient,
      removeClient,
      addIncome,
      removeIncome,
      addExpense,
      updateExpenseStatus,
      removeExpense,
      addInvestment,
      removeInvestment,
      getBusinessSummary,
      getPersonalSummary,
      getTotalSummary,
      getClientById,
    }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
}
