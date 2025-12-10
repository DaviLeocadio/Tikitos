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

import InputCNPJMask from "@/components/inputMasks/InputCNPJMask";
import InputTelefoneFixoMask from "@/components/inputMasks/InputTelefoneFixoMask";
import { aparecerToast } from "@/utils/toast";

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

    const telefoneLimpo = (fornecedorInfo.telefone || "").replace(/\D/g, "");

    // Validações por campo com mensagens específicas
    if (!fornecedorInfo.nome || !fornecedorInfo.nome.trim()) {
      aparecerToast("Preencha o nome!");
      setLoading(false);
      return;
    }

    const cnpjLimpo = (fornecedorInfo.cnpj || "").replace(/\D/g, "");
    if (!fornecedorInfo.cnpj || cnpjLimpo.length < 14) {
      aparecerToast("Preencha o CNPJ!");
      setLoading(false);
      return;
    }

    if (!fornecedorInfo.email || !fornecedorInfo.email.includes("@")) {
      aparecerToast("Preencha um email válido!");
      setLoading(false);
      return;
    }

    if (!telefoneLimpo) {
      aparecerToast("Preencha o telefone!");
      setLoading(false);
      return;
    }

    if (!fornecedorInfo.endereco || !fornecedorInfo.endereco.trim()) {
      aparecerToast("Preencha o endereço!");
      setLoading(false);
      return;
    }

    if (!fornecedorInfo.cidade || !fornecedorInfo.cidade.trim()) {
      aparecerToast("Preencha a cidade!");
      setLoading(false);
      return;
    }

    if (!fornecedorInfo.estado || !fornecedorInfo.estado.trim()) {
      aparecerToast("Preencha o estado!");
      setLoading(false);
      return;
    }

    // Verifica se o telefone foi digitado por completo
    if (isCelular) {
      if (telefoneLimpo.length < 11) {
        aparecerToast("Telefone incompleto!");
        setLoading(false);
        return;
      }
    } else {
      if (telefoneLimpo.length < 10) {
        aparecerToast("Telefone incompleto!");
        setLoading(false);
        return;
      }
    }

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

  const raw = (fornecedorInfo.telefone || "").replace(/\D/g, "");
  const isCelular = raw.length >= 11 && raw[2] === "9";


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
              placeholder="Novo Fornecedor"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={fornecedorInfo.nome}
              onChange={handleChange}
              required
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
            <InputCNPJMask
              type="text"
              id="cnpj"
              name="cnpj"
              placeholder="00.000.000/0000-00"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={fornecedorInfo.cnpj}
              onChange={handleChange}
              required
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
                placeholder="fornecedor@email.com"
                className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                value={fornecedorInfo.email}
                onChange={handleChange}
                required
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
              {
                isCelular ? (
                  <InputTelefoneMask
                    type="text"
                    id="telefone"
                    name="telefone"
                    placeholder="(99) 99999-9999"
                    className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                    value={fornecedorInfo.telefone}
                    onChange={handleChange}
                    required
                  />
                ) : (
                  <InputTelefoneFixoMask
                    type="text"
                    id="telefone"
                    name="telefone"
                    placeholder="(99) 9999-9999"
                    className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                    value={fornecedorInfo.telefone}
                    onChange={handleChange}
                    required
                  />
                )
              }


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
              placeholder="Rua das Flores, 123"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={fornecedorInfo.endereco}
              onChange={handleChange}
              required
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
                placeholder="São Paulo"
                className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                value={fornecedorInfo.cidade}
                onChange={handleChange}
                required
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
                placeholder="SP"
                maxLength={2}
                className="text-md font-semibold uppercase focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
                value={fornecedorInfo.estado}
                onChange={handleChange}
                required
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