import { useFinance } from "@/contexts/FinanceContext";
import { ClientForm } from "@/components/forms/ClientForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Users, TrendingUp } from "lucide-react";

export default function ClientsPage() {
  const { clients, incomes, expenses, removeClient } = useFinance();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getClientStats = (clientId: string) => {
    const totalIncome = incomes
      .filter(i => i.clientId === clientId)
      .reduce((sum, i) => sum + i.amount, 0);

    const allocatedExpenses = expenses
      .filter(e => e.paymentSourceId === clientId)
      .reduce((sum, e) => sum + e.amount, 0);

    return { totalIncome, allocatedExpenses };
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">Fontes de receita da empresa</p>
        </div>
        <ClientForm />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-3xl font-display font-bold">{clients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-income-light flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-income" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-3xl font-display font-bold text-income">
                  {formatCurrency(incomes.reduce((sum, i) => sum + i.amount, 0))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients List */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum cliente cadastrado
            </div>
          ) : (
            <div className="grid gap-4">
              {clients.map((client) => {
                const stats = getClientStats(client.id);
                const available = stats.totalIncome - stats.allocatedExpenses;

                return (
                  <div 
                    key={client.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-lg">
                          {client.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Recebido: <span className="text-income">{formatCurrency(stats.totalIncome)}</span>
                          {' • '}
                          Alocado: <span className="text-expense">{formatCurrency(stats.allocatedExpenses)}</span>
                          {' • '}
                          Disponível: <span className={available >= 0 ? 'text-income' : 'text-expense'}>
                            {formatCurrency(available)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeClient(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
