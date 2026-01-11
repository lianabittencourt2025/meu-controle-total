import { useState } from "react";
import { useFinance } from "@/contexts/FinanceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { PaymentStatus } from "@/types/finance";

const businessCategories = [
  "Impostos",
  "Infraestrutura",
  "Marketing",
  "Ferramentas",
  "Serviços",
  "Outros"
];

const personalCategories = [
  "Moradia",
  "Alimentação",
  "Transporte",
  "Saúde",
  "Lazer",
  "Educação",
  "Poupança",
  "Outros"
];

interface ExpenseFormProps {
  type: 'business' | 'personal';
  onSuccess?: () => void;
  triggerLabel?: string;
}

export function ExpenseForm({ type, onSuccess, triggerLabel }: ExpenseFormProps) {
  const { addExpense, clients } = useFinance();
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<PaymentStatus>("unpaid");
  const [paymentSourceId, setPaymentSourceId] = useState("");

  const categories = type === 'business' ? businessCategories : personalCategories;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount || !category || !dueDate) return;

    addExpense({
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      dueDate: new Date(dueDate),
      status,
      paymentSourceId: paymentSourceId || undefined,
      type,
    });

    setDescription("");
    setAmount("");
    setCategory("");
    setDueDate("");
    setStatus("unpaid");
    setPaymentSourceId("");
    setOpen(false);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          {triggerLabel || (type === 'business' ? 'Nova Despesa Empresa' : 'Nova Despesa Pessoal')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type === 'business' ? 'Adicionar Despesa da Empresa' : 'Adicionar Despesa Pessoal'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Aluguel, Internet, DAS..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Valor (R$)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as PaymentStatus)} required>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unpaid">Não Pago</SelectItem>
                <SelectItem value="paid">Pago</SelectItem>
                <SelectItem value="saved">Guardado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(status === 'paid' || status === 'saved') && (
            <div className="space-y-2">
              <Label>Fonte de Pagamento (Cliente)</Label>
              <Select value={paymentSourceId} onValueChange={setPaymentSourceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a fonte" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Adicionar</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
