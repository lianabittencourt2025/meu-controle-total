import { useFinance } from "@/contexts/FinanceContext";
import { StatCard } from "@/components/StatCard";
import { IncomeForm } from "@/components/forms/IncomeForm";
import { MonthSelector } from "@/components/MonthSelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingUp, Clock, CheckCircle, Trash2 } from "lucide-react";
import { format, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function IncomePage() {
  const { 
    filteredIncomes, 
    removeIncome, 
    getClientById,
    selectedMonth,
    setSelectedMonth
  } = useFinance();

  const today = startOfDay(new Date());

  // Separate received vs pending based on payment date
  const receivedIncomes = filteredIncomes.filter(i => startOfDay(new Date(i.paymentDate)) <= today);
  const pendingIncomes = filteredIncomes.filter(i => startOfDay(new Date(i.paymentDate)) > today);

  const totalReceived = receivedIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalPending = pendingIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalIncome = totalReceived + totalPending;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Recebimentos</h1>
          <p className="text-muted-foreground mt-1">Entradas de receita</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <MonthSelector currentMonth={selectedMonth} onMonthChange={setSelectedMonth} />
          <IncomeForm />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatCard
          title="Total Recebido"
          value={totalReceived}
          icon={CheckCircle}
          variant="income"
        />
        <StatCard
          title="A Receber"
          value={totalPending}
          icon={Clock}
          variant="pending"
        />
      </div>

      {/* Income Table */}
      <Card>
        <CardHeader>
          <CardTitle>Todos os Recebimentos</CardTitle>
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
                    <TableHead className="w-[100px]"></TableHead>
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
                          <div className="flex items-center gap-1">
                            <IncomeForm income={income} editMode={true} />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              onClick={() => removeIncome(income.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
    </div>
  );
}
