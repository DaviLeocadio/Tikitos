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

export default function ModalEditarDesconto({
  produto,
  open,
  onClose,
  onSalvar,
}) {
  const [desconto, setDesconto] = useState(produto?.desconto || 0);
  const [loading, setLoading] = useState(false);

  const descontoInicial = produto?.desconto || 0
  useEffect(() => {
    setDesconto(Number(descontoInicial).toFixed(0));
  }, [produto]);

  const handleSalvar = async () => {
    setLoading(true);
    await onSalvar(produto.id_produto, desconto);
    setLoading(false);
    onClose();
  };

  const precoComDesconto = produto?.preco * (1 - desconto / 100);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#e8c5f1] border-3 border-[#924187] border-dashed rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#76196c] font-extrabold text-xl">
            Editar Desconto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#8c3e82] font-semibold">Produto:</p>
            <p className="text-lg font-bold text-[#76196c]">{produto?.nome}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#8c3e82] font-semibold">
                Preço Original:
              </p>
              <p className="text-lg font-bold text-[#4f6940]">
                {/* R$ {produto?.preco?.toFixed(2).replace('.', ',')} */}
                {produto?.precoFormatado}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#8c3e82] font-semibold">
                Preço com Desconto:
              </p>
              <p className="text-lg font-bold text-[#569a33]">
                R$ {precoComDesconto?.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#8c3e82] font-semibold block mb-2">
              Desconto (%):
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step={1}
              value={desconto}
              onChange={(e) =>
                setDesconto(Math.min(100, Math.max(0, Number(e.target.value))))
              }
              className="w-full p-3 rounded-lg border-2 border-[#b478ab] text-[#76196c] font-bold text-lg focus:outline-none focus:border-[#76196c]"
            />
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
              disabled={loading || desconto == descontoInicial}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
