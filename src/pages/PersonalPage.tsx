import { useFinance } from "@/contexts/FinanceContext";
import { StatCard } from "@/components/StatCard";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { MonthSelector } from "@/components/MonthSelector";
import { TrendingDown, CheckCircle, Clock, Save, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";

const personalCategories = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Lazer",
  "Educação",
  "Cartão de crédito",
  "Poupança",
  "Outros"
];

export default function PersonalPage() {
  const { 
    getTotalSummary, 
    getPersonalSummary, 
    filteredExpenses,
    selectedMonth,
    setSelectedMonth
  } = useFinance();
  
  const totalSummary = getTotalSummary();
  const summary = getPersonalSummary();
  const personalExpenses = filteredExpenses.filter(e => e.type === 'personal');

  // Group expenses by category
  const expensesByCategory = useMemo(() => {
    const grouped: Record<string, typeof personalExpenses> = {};
    personalCategories.forEach(cat => {
      const catExpenses = personalExpenses.filter(e => e.category === cat);
      if (catExpenses.length > 0) {
        grouped[cat] = catExpenses;
      }
    });
    // Add "Outros" for any uncategorized
    const uncategorized = personalExpenses.filter(
      e => !personalCategories.includes(e.category)
    );
    if (uncategorized.length > 0) {
      grouped["Outros"] = [...(grouped["Outros"] || []), ...uncategorized];
    }
    return grouped;
  }, [personalExpenses]);

  const categoriesWithExpenses = Object.keys(expensesByCategory);

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

      {/* Disponível Pessoal Card */}
      <Card className="border-l-4 border-l-primary">
        <CardHeader className="pb-2 p-4 sm:p-6 sm:pb-2">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Disponível Pessoal
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <p className={`text-2xl sm:text-3xl font-display font-bold ${totalSummary.personalBalance >= 0 ? 'text-income' : 'text-danger'}`}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSummary.personalBalance)}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Saques ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSummary.totalWithdrawals)}) - Despesas pagas ({new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalSummary.personalPaidExpenses)})
          </p>
        </CardContent>
      </Card>

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

      {/* Expenses by Category Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="all" className="flex-shrink-0">
            <span className="hidden sm:inline">Todas</span>
            <span className="sm:hidden">Todas</span>
            <span className="ml-1 text-xs opacity-70">({personalExpenses.length})</span>
          </TabsTrigger>
          {categoriesWithExpenses.map(category => (
            <TabsTrigger key={category} value={category} className="flex-shrink-0">
              <span className="text-xs sm:text-sm">{category}</span>
              <span className="ml-1 text-xs opacity-70">({expensesByCategory[category].length})</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                <span>Todas as Despesas</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    personalExpenses.reduce((sum, e) => sum + e.amount, 0)
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <ExpenseTable expenses={personalExpenses} />
            </CardContent>
          </Card>
        </TabsContent>

        {categoriesWithExpenses.map(category => (
          <TabsContent key={category} value={category}>
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                      expensesByCategory[category].reduce((sum, e) => sum + e.amount, 0)
                    )}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <ExpenseTable expenses={expensesByCategory[category]} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
