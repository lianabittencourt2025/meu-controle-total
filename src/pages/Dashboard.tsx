import { useFinance } from "@/contexts/FinanceContext";
import { StatCard } from "@/components/StatCard";
import { SourceConsolidation } from "@/components/SourceConsolidation";
import { ExpenseTable } from "@/components/ExpenseTable";
import { MonthSelector } from "@/components/MonthSelector";
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Wallet,
  Building2,
  User,
  CheckCircle,
  Clock,
  Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const { 
    getTotalSummary, 
    getBusinessSummary, 
    getPersonalSummary, 
    filteredExpenses,
    selectedMonth,
    setSelectedMonth
  } = useFinance();
  
  const totalSummary = getTotalSummary();
  const businessSummary = getBusinessSummary();
  const personalSummary = getPersonalSummary();

  const recentExpenses = filteredExpenses
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Visão geral das suas finanças</p>
        </div>
        <MonthSelector currentMonth={selectedMonth} onMonthChange={setSelectedMonth} />
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Recebido"
          value={totalSummary.totalIncome}
          subtitle="Receitas da empresa"
          icon={TrendingUp}
          variant="income"
        />
        <StatCard
          title="Total Despesas"
          value={totalSummary.totalExpenses}
          subtitle="Empresa + Pessoal"
          icon={TrendingDown}
          variant="expense"
        />
        <StatCard
          title="Investimentos"
          value={totalSummary.totalInvestments}
          subtitle="Na empresa"
          icon={PiggyBank}
          variant="investment"
        />
        <StatCard
          title="Saldo Disponível"
          value={totalSummary.availableBalance}
          subtitle="Após pagos"
          icon={Wallet}
          variant="balance"
        />
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5 text-primary" />
              Caixa Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold text-foreground">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(businessSummary.businessBalance)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Receita - Despesas empresa - Investimentos
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent-foreground">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="w-5 h-5 text-accent-foreground" />
              Disponível Pessoal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-display font-bold text-foreground">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(personalSummary.personalBalance)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Caixa empresa - Despesas pessoais
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pago</p>
                <p className="text-2xl font-display font-bold text-success">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSummary.paidExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-danger-light flex items-center justify-center">
                <Clock className="w-6 h-6 text-danger" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">A Pagar</p>
                <p className="text-2xl font-display font-bold text-danger">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSummary.unpaidExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-warning-light flex items-center justify-center">
                <Save className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Guardado</p>
                <p className="text-2xl font-display font-bold text-saved">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSummary.savedExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Source Consolidation */}
      <SourceConsolidation />

      {/* Recent Expenses */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          <ExpenseTable expenses={recentExpenses} showType />
        </CardContent>
      </Card>
    </div>
  );
}
