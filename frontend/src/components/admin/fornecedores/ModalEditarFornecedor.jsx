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

// Se você tiver um InputCNPJMask, importe aqui. Caso não, use input normal ou crie um mask.
// import InputCNPJMask from "@/components/inputMasks/InputCNPJMask";

export default function ModalEditarFornecedor({
  fornecedor,
  open,
  onClose,
  onSalvar,
}) {
  const [fornecedorInfo, setFornecedorInfo] = useState({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    status: "ativo",
  });
  const [loading, setLoading] = useState(false);

  // Efeito para preencher o formulário na edição ou limpar na criação
  useEffect(() => {
    if (open) {
      if (fornecedor) {
        // Modo Edição
        setFornecedorInfo({
          id_fornecedor: fornecedor.id_fornecedor,
          nome: fornecedor.nome || "",
          cnpj: fornecedor.cnpj || "",
          email: fornecedor.email || "",
          telefone: fornecedor.telefone || "",
          endereco: fornecedor.endereco || "",
          cidade: fornecedor.cidade || "",
          estado: fornecedor.estado || "",
          status: fornecedor.status || "ativo",
        });
      } else {
        // Modo Criação (Limpar campos)
        setFornecedorInfo({
          nome: "",
          cnpj: "",
          email: "",
          telefone: "",
          endereco: "",
          cidade: "",
          estado: "",
          status: "ativo",
        });
      }
    }
  }, [fornecedor, open]);

  const handleSalvar = async () => {
    setLoading(true);
    // Passamos o objeto completo. O Hook lá atrás decide se é POST ou PUT baseado no ID.
    await onSalvar(fornecedorInfo);
    setLoading(false);
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFornecedorInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#e8c5f1] border-3 border-[#924187] border-dashed rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#76196c] font-extrabold text-xl">
            {fornecedor ? "Editar Fornecedor" : "Novo Fornecedor"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* Nome da Empresa */}
          <div className="mb-2 flex flex-col">
            <label
              htmlFor="nome"
              className="text-sm text-[#569a33] font-semibold"
            >
              Nome da Empresa:
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={fornecedorInfo.nome}
              onChange={handleChange}
            />
          </div>

          {/* CNPJ */}
          <div className="mb-2 flex flex-col">
            <label
              htmlFor="cnpj"
              className="text-sm text-[#569a33] font-semibold"
            >
              CNPJ:
            </label>
            {/* Se tiver InputCNPJMask use ele, senão use input text normal */}
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              placeholder="00.000.000/0000-00"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={fornecedorInfo.cnpj}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm text-[#569a33] font-semibold"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                value={fornecedorInfo.email}
                onChange={handleChange}
              />
            </div>

            {/* Telefone */}
            <div className="flex flex-col">
              <label
                htmlFor="telefone"
                className="text-sm text-[#569a33] font-semibold"
              >
                Telefone:
              </label>
              <InputTelefoneMask
                type="text"
                id="telefone"
                name="telefone"
                className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                value={fornecedorInfo.telefone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Endereço */}
          <div className="flex flex-col">
            <label
              htmlFor="endereco"
              className="text-sm text-[#569a33] font-semibold"
            >
              Endereço:
            </label>
            <input
              type="text"
              id="endereco"
              name="endereco"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={fornecedorInfo.endereco}
              onChange={handleChange}
            />
          </div>

          {/* Cidade e Estado */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 flex flex-col">
              <label
                htmlFor="cidade"
                className="text-sm text-[#569a33] font-semibold"
              >
                Cidade:
              </label>
              <input
                type="text"
                id="cidade"
                name="cidade"
                className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                value={fornecedorInfo.cidade}
                onChange={handleChange}
              />
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="estado"
                className="text-sm text-[#569a33] font-semibold"
              >
                UF:
              </label>
              <input
                type="text"
                id="estado"
                name="estado"
                maxLength={2}
                className="text-md font-semibold uppercase focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                value={fornecedorInfo.estado}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status (Visível apenas na edição para desativar) */}
          {fornecedor && (
            <div className="flex flex-col">
              <label
                htmlFor="status"
                className="text-sm text-[#569a33] font-semibold"
              >
                Status:
              </label>
              <select
                id="status"
                name="status"
                className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                value={fornecedorInfo.status}
                onChange={handleChange}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          )}
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