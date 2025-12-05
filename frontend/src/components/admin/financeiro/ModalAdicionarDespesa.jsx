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
import { CheckCircle, Trash } from "lucide-react";
import InputDataMask from "@/components/inputMasks/InputDataMask";


// Modal Adicionar Despesa
export default function ModalAdicionarDespesa({ open, onClose, onSalvar }) {
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");

  const [dataPag, setDataPag] = useState("");
  const [status, setStatus] = useState("pendente");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!descricao || !preco) {
      alert("Preencha descrição e valor!");
      return;
    }

    setLoading(true);
    await onSalvar({
      descricao,
      preco: parseFloat(preco),
      data_pag: dataPag,
      status,
    });
    setLoading(false);
    setDescricao("");
    setPreco("");
    setDataPag("");
    setStatus("pendente");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#e8c5f1] border-3 border-[#924187] border-dashed rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#76196c] font-extrabold text-xl">
            Adicionar Despesa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-sm  text-[#8c3e82] font-semibold block mb-2">
                Descrição:
              </label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Conta de energia"
                className="w-full p-3 rounded-lg border-2 border-[#b478ab] text-[#76196c] font-semibold focus:outline-none focus:border-[#76196c]"
              />
            </div>
            <div>
              <label className="text-sm  text-[#8c3e82] font-semibold block mb-2">
                Valor (R$):
              </label>
              <input
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 rounded-lg border-2 border-[#b478ab] text-[#76196c] font-bold focus:outline-none focus:border-[#76196c]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#8c3e82] font-semibold block mb-2">
                Data de Pagamento:
              </label>
              <InputDataMask
                type="text"
                placeholder="25/12/1969"
                value={dataPag}
                onChange={(e) => setDataPag(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-[#b478ab] text-[#76196c] font-bold focus:outline-none focus:border-[#76196c]"
              />
            </div>

            <div>
              <label className="text-sm text-[#8c3e82] font-semibold block mb-2">
                Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-[#b478ab] text-[#76196c] font-semibold focus:outline-none focus:border-[#76196c] cursor-pointer"
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              className="flex-1 bg-[#9bf377] text-[#4f6940] hover:bg-[#75ba51] font-bold cursor-pointer"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#76196c] text-white hover:bg-[#924187] font-bold cursor-pointer"
              onClick={handleSalvar}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
