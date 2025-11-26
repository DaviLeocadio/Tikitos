"use client";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Modal de Pedido ao Fornecedor
export default function ModalPedidoFornecedor({ produto, open, onClose, onSalvar }) {
  const [quantidade, setQuantidade] = useState(10);
  const [fornecedorId, setFornecedorId] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      buscarFornecedores();
    }
  }, [open]);

  const buscarFornecedores = async () => {
    try {
      const response = await fetch("http://localhost:8080/gerente/fornecedores", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setFornecedores(data.fornecedores || []);
      }
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
    }
  };

  const handleSalvar = async () => {
    if (!fornecedorId) {
      alert("Selecione um fornecedor!");
      return;
    }
    
    setLoading(true);
    await onSalvar(produto.id_produto, fornecedorId, quantidade);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#c5ffad] border-3 border-[#569a33] border-dashed rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#4f6940] font-extrabold text-xl">
            Fazer Pedido ao Fornecedor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#4f6940] font-semibold">Produto:</p>
            <p className="text-lg font-bold text-[#569a33]">{produto?.nome}</p>
          </div>

          <div>
            <p className="text-sm text-[#4f6940] font-semibold">Estoque Atual:</p>
            <p className="text-lg font-bold text-[#924187]">{produto?.estoque} unidades</p>
          </div>

          <div>
            <label className="text-sm text-[#4f6940] font-semibold block mb-2">
              Fornecedor:
            </label>
            <select
              value={fornecedorId}
              onChange={(e) => setFornecedorId(e.target.value)}
              className="w-full p-3 rounded-lg border-2 border-[#569a33] text-[#4f6940] font-semibold focus:outline-none focus:border-[#4f6940]"
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map((f) => (
                <option key={f.id_fornecedor} value={f.id_fornecedor}>
                  {f.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[#4f6940] font-semibold block mb-2">
              Quantidade:
            </label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))}
              className="w-full p-3 rounded-lg border-2 border-[#569a33] text-[#4f6940] font-bold text-lg focus:outline-none focus:border-[#4f6940]"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              className="flex-1 bg-white text-[#4f6940] hover:bg-gray-100 font-bold border-2 border-[#569a33]"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#569a33] text-white hover:bg-[#4f6940] font-bold"
              onClick={handleSalvar}
              disabled={loading}
            >
              {loading ? "Processando..." : "Fazer Pedido"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}