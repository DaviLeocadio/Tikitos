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
import InputTelefoneMask from "@/components/inputMasks/InputCEPMask";
import InputCPFMask from "@/components/inputMasks/InputCPFMask";
import InputDataMask from "@/components/inputMasks/InputDataMask";

export default function ModalEditarDesconto({ vendedor, open, onClose, onSalvar }) {
  const [vendedorInfo, setVendedorInfo] = useState(vendedor);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const data = new Date(vendedor?.data_nasc);
    const dataNasc = data.toLocaleDateString("pt-BR");
    setVendedorInfo({ ...vendedor, data_nasc: dataNasc });
  }, [vendedor]);

  const handleSalvar = async () => {
    setLoading(true);
    await onSalvar(vendedor.id_usuario, vendedorInfo);
    setLoading(false);
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setVendedorInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#e8c5f1] border-3 border-[#924187] border-dashed rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#76196c] font-extrabold text-xl">
            Editar Vendedor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div className="mb-2 flex flex-col">
            <label
              htmlFor="nome"
              className="text-sm text-[#569a33]  font-semibold "
            >
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={vendedorInfo?.nome}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label
              htmlFor="email"
              className="text-sm text-[#569a33]  font-semibold "
            >
              Email:
            </label>
            <input
              type="text"
              id="email"
              name="email"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={vendedorInfo?.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2 flex flex-col">
            <label
              htmlFor="telefone"
              className="text-sm text-[#569a33]  font-semibold "
            >
              Telefone:
            </label>
            <InputTelefoneMask
              type="text"
              id="telefone"
              name="telefone"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={vendedorInfo?.telefone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2 flex flex-col">
            <label
              htmlFor="cpf"
              className="text-sm text-[#569a33]  font-semibold "
            >
              CPF:
            </label>
            <InputCPFMask
              type="text"
              id="cpf"
              name="cpf"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={vendedorInfo?.cpf}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2 flex flex-col">
            <label
              htmlFor="data_nasc"
              className="text-sm text-[#569a33]  font-semibold "
            >
              Data de Nascimento:
            </label>
            <InputDataMask
              type="data"
              id="data_nasc"
              name="data_nasc"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={vendedorInfo?.data_nasc}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="endereco"
              className="text-sm text-[#569a33]  font-semibold "
            >
              Endereço:
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={vendedorInfo?.endereco}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              className="flex-1 bg-[#9bf377] text-[#4f6940] hover:bg-[#75ba51] font-semibold cursor-pointer"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#76196c] text-white hover:bg-[#924187] font-semibold cursor-pointer"
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
