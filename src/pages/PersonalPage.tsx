import { useFinance } from "@/contexts/FinanceContext";
import { StatCard } from "@/components/StatCard";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { MonthSelector } from "@/components/MonthSelector";
import { TrendingDown, CheckCircle, Clock, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PersonalPage() {
  const { 
    getPersonalSummary, 
    filteredExpenses,
    selectedMonth,
    setSelectedMonth
  } = useFinance();
  
  const summary = getPersonalSummary();
  const personalExpenses = filteredExpenses.filter(e => e.type === 'personal');

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Pessoal</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Suas despesas pessoais</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <MonthSelector currentMonth={selectedMonth} onMonthChange={setSelectedMonth} />
          <ExpenseForm type="personal" triggerLabel="Nova Despesa" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Total Despesas"
          value={summary.totalExpenses}
          icon={TrendingDown}
          variant="expense"
        />
        <StatCard
          title="Pago"
          value={summary.paidExpenses}
          icon={CheckCircle}
          variant="income"
        />
        <StatCard
          title="A Pagar"
          value={summary.unpaidExpenses}
          icon={Clock}
          variant="expense"
        />
        <StatCard
          title="Guardado"
          value={summary.savedExpenses}
          icon={Save}
          variant="saved"
        />
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-base sm:text-lg">Despesas Pessoais</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <ExpenseTable expenses={personalExpenses} />
        </CardContent>
      </Card>
    </div>
  );
}
