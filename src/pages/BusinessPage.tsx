import { useFinance } from "@/contexts/FinanceContext";
import { StatCard } from "@/components/StatCard";
import { ExpenseTable } from "@/components/ExpenseTable";
import { ExpenseForm } from "@/components/forms/ExpenseForm";
import { MonthSelector } from "@/components/MonthSelector";
import { TrendingUp, TrendingDown, PiggyBank, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function BusinessPage() {
  const { 
    getBusinessSummary, 
    filteredExpenses,
    filteredIncomes,
    filteredInvestments,
    removeIncome,
    removeInvestment,
    getClientById,
    selectedMonth,
    setSelectedMonth
  } = useFinance();
  
  const summary = getBusinessSummary();
  const businessExpenses = filteredExpenses.filter(e => e.type === 'business');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Empresa</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Gestão financeira do seu MEI</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <MonthSelector currentMonth={selectedMonth} onMonthChange={setSelectedMonth} />
          <ExpenseForm type="business" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Receita Total"
          value={summary.totalIncome}
          icon={TrendingUp}
          variant="income"
        />
        <StatCard
          title="Despesas"
          value={summary.totalExpenses}
          icon={TrendingDown}
          variant="expense"
        />
        <StatCard
          title="Investimentos"
          value={summary.totalInvestments}
          icon={PiggyBank}
          variant="investment"
        />
        <StatCard
          title="Caixa Empresa"
          value={summary.businessBalance}
          icon={Wallet}
          variant="balance"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="expenses" className="w-full">
        <TabsList>
          <TabsTrigger value="expenses">Despesas ({businessExpenses.length})</TabsTrigger>
          <TabsTrigger value="income">Recebimentos ({filteredIncomes.length})</TabsTrigger>
          <TabsTrigger value="investments">Investimentos ({filteredInvestments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Despesas da Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseTable expenses={businessExpenses} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="income" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recebimentos</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredIncomes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum recebimento neste mês
                </div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Descrição</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredIncomes.map((income) => {
                        const client = getClientById(income.clientId);
                        return (
                          <TableRow key={income.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{income.description}</TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-income-light text-income text-xs font-medium">
                                {client?.name || 'N/A'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs">
                                {income.category}
                              </span>
                            </TableCell>
                            <TableCell>
                              {format(new Date(income.paymentDate), "dd/MM/yyyy", { locale: ptBR })}
                            </TableCell>
                            <TableCell className="text-right font-medium text-income">
                              {formatCurrency(income.amount)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => removeIncome(income.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="investments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Investimentos na Empresa</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredInvestments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum investimento neste mês
                </div>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Descrição</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredInvestments.map((investment) => (
                        <TableRow key={investment.id} className="hover:bg-muted/30">
                          <TableCell className="font-medium">{investment.description}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-md bg-investment-light text-investment text-xs font-medium">
                              {investment.category}
                            </span>
                          </TableCell>
                          <TableCell>
                            {format(new Date(investment.date), "dd/MM/yyyy", { locale: ptBR })}
                          </TableCell>
                          <TableCell className="text-right font-medium text-investment">
                            {formatCurrency(investment.amount)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeInvestment(investment.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
