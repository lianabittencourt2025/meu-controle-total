import { useFinance } from "@/contexts/FinanceContext";
import { StatCard } from "@/components/StatCard";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { TrendingDown, CheckCircle, Clock, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PersonalPage() {
  const { getPersonalSummary, expenses } = useFinance();
  
  const summary = getPersonalSummary();
  const personalExpenses = expenses.filter(e => e.type === 'personal');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Pessoal</h1>
          <p className="text-muted-foreground mt-1">Suas despesas pessoais</p>
        </div>
        <ExpenseForm type="personal" triggerLabel="Nova Despesa" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <CardHeader>
          <CardTitle>Despesas Pessoais</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseTable expenses={personalExpenses} />
        </CardContent>
      </Card>
    </div>
  );
}
