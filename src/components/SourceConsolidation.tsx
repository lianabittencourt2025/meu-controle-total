import { useFinance } from "@/contexts/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export function SourceConsolidation() {
  const { clients, expenses, incomes } = useFinance();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calculate totals per client/source
  const sourceData = clients.map(client => {
    const totalIncome = incomes
      .filter(i => i.clientId === client.id)
      .reduce((sum, i) => sum + i.amount, 0);

    const totalAllocated = expenses
      .filter(e => e.paymentSourceId === client.id)
      .reduce((sum, e) => sum + e.amount, 0);

    const available = totalIncome - totalAllocated;

    return {
      client,
      totalIncome,
      totalAllocated,
      available,
    };
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="w-5 h-5 text-primary" />
          Consolidado por Fonte de Receita
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sourceData.map(({ client, totalIncome, totalAllocated, available }) => (
            <div 
              key={client.id} 
              className="p-3 rounded-lg bg-muted/50 border border-border/50"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{client.name}</h4>
                <span className={`text-sm font-medium ${available >= 0 ? 'text-income' : 'text-expense'}`}>
                  {available >= 0 ? '+' : ''}{formatCurrency(available)} disponível
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Recebido: </span>
                  <span className="text-income font-medium">{formatCurrency(totalIncome)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Alocado: </span>
                  <span className="text-expense font-medium">{formatCurrency(totalAllocated)}</span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-expense transition-all duration-300"
                  style={{ width: `${totalIncome > 0 ? Math.min((totalAllocated / totalIncome) * 100, 100) : 0}%` }}
                />
              </div>
            </div>
          ))}

          {sourceData.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma fonte de receita cadastrada
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
