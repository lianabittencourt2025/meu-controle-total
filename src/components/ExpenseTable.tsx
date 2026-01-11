import { useFinance } from "@/contexts/FinanceContext";
import { Expense } from "@/types/finance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExpenseStatusEditor } from "./ExpenseStatusEditor";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ExpenseTableProps {
  expenses: Expense[];
  showType?: boolean;
}

export function ExpenseTable({ expenses, showType = false }: ExpenseTableProps) {
  const { removeExpense, getClientById } = useFinance();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhuma despesa cadastrada
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Descrição</TableHead>
            <TableHead>Categoria</TableHead>
            {showType && <TableHead>Tipo</TableHead>}
            <TableHead>Vencimento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Status / Fonte</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">{expense.description}</TableCell>
              <TableCell>
                <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs">
                  {expense.category}
                </span>
              </TableCell>
              {showType && (
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs ${
                    expense.type === 'business' ? 'bg-primary/10 text-primary' : 'bg-accent text-accent-foreground'
                  }`}>
                    {expense.type === 'business' ? 'Empresa' : 'Pessoal'}
                  </span>
                </TableCell>
              )}
              <TableCell>
                {format(new Date(expense.dueDate), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell className="text-right font-medium text-expense">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell>
                <ExpenseStatusEditor 
                  expenseId={expense.id}
                  currentStatus={expense.status}
                  currentSourceId={expense.paymentSourceId}
                />
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => removeExpense(expense.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
