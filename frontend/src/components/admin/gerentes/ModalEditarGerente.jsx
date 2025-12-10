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
import InputTelefoneMask from "@/components/inputMasks/InputTelefoneMask";
import InputCPFMask from "@/components/inputMasks/InputCPFMask";
import InputDataMask from "@/components/inputMasks/InputDataMask";

export default function ModalEditarGerente({
  gerente,
  open,
  onClose,
  onSalvar,
}) {
  const [gerenteInfo, setGerenteInfo] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    data_nasc: "",
    endereco: "",
    status: "ativo",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (gerente && open) {
      const data = new Date(gerente.data_nasc);
      const dataNasc = data.toLocaleDateString("pt-BR");
      setGerenteInfo({
        nome: gerente.nome || "",
        email: gerente.email || "",
        telefone: gerente.telefone || "",
        cpf: gerente.cpf || "",
        data_nasc: dataNasc || "",
        endereco: gerente.endereco || "",
        status: gerente.status || "ativo",
        perfil: "gerente",
        id_empresa: gerente.id_empresa || "",
      });
    }
  }, [gerente, open]);

  const handleSalvar = async () => {
    setLoading(true);
    await onSalvar(gerente.id_usuario, gerenteInfo);
    setLoading(false);
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setGerenteInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#e8c5f1] border-3 border-[#924187] border-dashed rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#76196c] font-extrabold text-xl">
            Editar gerente
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
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-roxoescuro"
              value={gerenteInfo.nome}
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
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-roxoescuro"
              value={gerenteInfo.email}
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
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-roxoescuro"
              value={gerenteInfo.telefone}
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
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-roxoescuro"
              value={gerenteInfo.cpf}
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
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-roxoescuro"
              value={gerenteInfo.data_nasc}
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
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-roxoescuro"
              value={gerenteInfo.endereco}
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
              className="flex-1 bg-[#76196c] text-[#C5FFAD] hover:bg-[#924187] font-semibold cursor-pointer"
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
