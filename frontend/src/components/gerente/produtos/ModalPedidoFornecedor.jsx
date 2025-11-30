"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Package, TrendingUp, DollarSign, Calendar, CheckCircle } from "lucide-react";
import { aparecerToast } from "@/utils/toast";

// Modal de Pedido ao Fornecedor
export default function ModalPedidoFornecedor({
  produto,
  open,
  onClose,
  onSalvar,
}) {
  const [quantidade, setQuantidade] = useState(10);
  const [dataPag, setDataPag] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState("pendente");
  const [loading, setLoading] = useState(false);
  const [dialogSucesso, setDialogSucesso] = useState(false);

  // Resetar campos quando abrir o modal
  useEffect(() => {
    if (open) {
      setQuantidade(10);
      setDataPag(new Date().toISOString().split('T')[0]);
      setStatus("pendente");
    }
  }, [open]);

  const custoUnitario = produto?.custo ? parseFloat(produto.custo.replace('R$', '').replace(',', '.').trim()) : 0;
  const custoTotal = custoUnitario * quantidade;
  const novoEstoque = (produto?.estoque || 0) + quantidade;

  const handleSalvar = async () => {
    if (!produto?.id_produto) {
      aparecerToast("Produto inválido!");
      return;
    }

    if (quantidade < 1) {
      aparecerToast("A quantidade deve ser maior que zero!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/gerente/produtos/${produto.id_produto}/pedido`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quantidade,
            data_pag: new Date(dataPag).toLocaleDateString('pt-BR'),
            status,
          }),
        }
      );

      if (response.ok) {
        setDialogSucesso(true);
        if (onSalvar) {
          await onSalvar();
        }
      } else {
        const error = await response.json();
        aparecerToast(error.error || "Erro ao fazer pedido!");
      }
    } catch (error) {
      console.error("Erro ao fazer pedido:", error);
      aparecerToast("Erro ao fazer pedido!");
    } finally {
      setLoading(false);
    }
  };

  const handleFecharSucesso = () => {
    setDialogSucesso(false);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg bg-gradient-to-br from-[#c5ffad] to-[#e8f5e8] border-3 border-[#569a33] border-dashed rounded-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#4f6940] font-extrabold text-2xl flex items-center gap-2">
              <Package className="text-[#569a33]" />
              Fazer Pedido ao Fornecedor
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Card Info do Produto */}
            <div className="bg-white rounded-xl p-4 border-2 border-[#569a33] border-dashed">
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Produto
                  </p>
                  <p className="text-xl font-bold text-[#569a33]">
                    {produto?.nome}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Estoque Atual
                    </p>
                    <p className="text-lg font-bold text-[#924187] flex items-center gap-1">
                      <Package size={16} />
                      {produto?.estoque} un
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                      Custo Unitário
                    </p>
                    <p className="text-lg font-bold text-[#569a33] flex items-center gap-1">
                      <DollarSign size={16} />
                      {produto?.custo}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
                    Fornecedor
                  </p>
                  <p className="text-base font-bold text-[#4f6940]">
                    {produto?.fornecedor}
                  </p>
                </div>
              </div>
            </div>

            {/* Quantidade */}
            <div>
              <label className="text-sm text-[#4f6940] font-semibold mb-2 flex items-center gap-2">
                <TrendingUp size={16} />
                Quantidade a Pedir:
              </label>
              <input
                type="number"
                min="1"
                value={quantidade}
                onChange={(e) =>
                  setQuantidade(Math.max(1, Number(e.target.value)))
                }
                className="w-full p-3 rounded-lg border-2 border-[#569a33] text-[#4f6940] font-bold text-lg focus:outline-none focus:border-[#4f6940] focus:ring-2 focus:ring-[#569a33]/20 transition cursor-pointer"
              />
            </div>

            {/* Status e Data de Pagamento */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-[#4f6940] font-semibold block mb-2">
                  Status:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-[#569a33] text-[#4f6940] font-semibold focus:outline-none focus:border-[#4f6940] cursor-pointer"
                >
                  <option value="pendente">Pendente</option>
                  <option value="pago">Pago</option>
                </select>
              </div>

              <div>
                <label className="text-sm text-[#4f6940] font-semibold mb-2 flex items-center gap-2">
                  <Calendar size={16} />
                  Data Pagamento:
                </label>
                <input
                  type="date"
                  value={dataPag}
                  onChange={(e) => setDataPag(e.target.value)}
                  className="w-full p-3 rounded-lg border-2 border-[#569a33] text-[#4f6940] font-semibold focus:outline-none focus:border-[#4f6940] cursor-pointer"
                />
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="bg-gradient-to-r from-[#569a33] to-[#4f6940] rounded-xl p-5 text-white">
              <p className="text-sm font-semibold opacity-90 mb-3 uppercase tracking-wide">
                Resumo do Pedido
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Quantidade:</span>
                  <span className="text-xl font-bold">{quantidade} unidades</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Custo Total:</span>
                  <span className="text-2xl font-bold">
                    R$ {custoTotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="border-t border-white/30 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Novo Estoque:</span>
                    <span className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp size={20} />
                      {novoEstoque} unidades
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <div className="flex gap-3 w-full">
              <Button
                variant="secondary"
                className="flex-1 bg-white text-[#4f6940] hover:bg-gray-100 font-bold border-2 border-[#569a33] cursor-pointer transition"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-[#569a33] text-white hover:bg-[#4f6940] font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all"
                onClick={handleSalvar}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processando...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    Confirmar Pedido
                  </span>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de Sucesso */}
      <AlertDialog open={dialogSucesso} onOpenChange={setDialogSucesso}>
        <AlertDialogContent className="bg-gradient-to-br from-[#c5ffad] to-[#e8f5e8] border-3 border-[#569a33] border-dashed rounded-3xl">
          <AlertDialogHeader>
            <div className="flex justify-center mb-4">
              <div className="bg-[#569a33] rounded-full p-4">
                <CheckCircle size={48} className="text-white" />
              </div>
            </div>
            <AlertDialogTitle className="text-[#4f6940] font-extrabold text-2xl text-center">
              Pedido Realizado com Sucesso!
            </AlertDialogTitle>
            <div className="space-y-2 text-center">
              <div className="text-[#4f6940] font-semibold text-lg">
                {quantidade} unidades de <span className="font-bold text-[#569a33]">{produto?.nome}</span>
              </div>
              <div className="text-gray-600 font-semibold">
                Estoque atualizado para <span className="font-bold text-[#924187]">{novoEstoque} unidades</span>
              </div>
              <div className="bg-white rounded-lg p-3 mt-3 border-2 border-[#569a33] border-dashed">
                <div className="text-sm text-gray-500 font-semibold">Custo Total</div>
                <div className="text-2xl font-bold text-[#569a33]">
                  R$ {custoTotal.toFixed(2).replace(".", ",")}
                </div>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="w-full bg-[#569a33] text-white hover:bg-[#4f6940] font-bold cursor-pointer text-lg py-6 rounded-xl"
              onClick={handleFecharSucesso}
            >
              Fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}