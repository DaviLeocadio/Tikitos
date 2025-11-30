"use client";
import InputCPFMask from "@/components/inputMasks/InputCPFMask";
import InputDataMask from "@/components/inputMasks/InputDataMask";
import InputTelefoneMask from "@/components/inputMasks/InputTelefoneMask";
import InputCEPMask from "@/components/inputMasks/InputCEPMask";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useVendedores } from ".";

import {
  PlusCircle,
  User,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { aparecerToast } from "@/utils/toast";

export function CadastrarVendedorModal({ buscarVendedores: buscarVendedoresExterno }) {
  const [open, setOpen] = useState(false);
  const [passo, setPasso] = useState("Informações");
  const [loading, setLoading] = useState(false);
  const [dialogSucesso, setDialogSucesso] = useState(false);
  const [vendedorInfo, setVendedorInfo] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    data_nasc: "",
  });
  const [endereco, setEndereco] = useState({
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: "",
  });
  const [buscandoCep, setBuscandoCep] = useState(false);
  const { buscarVendedores: buscarVendedoresInterno } = useVendedores();
  
  // Usa a função externa se fornecida, caso contrário usa a interna
  const buscarVendedores = buscarVendedoresExterno || buscarVendedoresInterno;

  // Reset ao abrir modal
  useEffect(() => {
    if (open) {
      setPasso("Informações");
      setVendedorInfo({
        nome: "",
        email: "",
        telefone: "",
        cpf: "",
        data_nasc: "",
      });
      setEndereco({
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        uf: "",
        cep: "",
      });
    }
  }, [open]);

  const handleChangeInfo = (event) => {
    const { name, value } = event.target;
    setVendedorInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeEndereco = (event) => {
    const { name, value } = event.target;
    setEndereco((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  async function buscarCep() {
    const cepLimpo = endereco.cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    setBuscandoCep(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cepLimpo}/json/`
      );
      const data = await response.json();

      if (data.erro) {
        aparecerToast("CEP não encontrado!");
        return;
      }

      setEndereco((prev) => ({
        ...prev,
        logradouro: data.logradouro || "",
        bairro: data.bairro || "",
        cidade: data.localidade || "",
        uf: data.uf || "",
      }));
    } catch (error) {
      console.error("Erro ao consultar CEP:", error);
      aparecerToast("Erro ao buscar CEP!");
    } finally {
      setBuscandoCep(false);
    }
  }

  useEffect(() => {
    const cepLimpo = endereco.cep.replace(/\D/g, "");
    if (cepLimpo.length === 8) {
      buscarCep();
    }
  }, [endereco.cep]);

  // Validação do primeiro passo
  const validarPrimeiroPasso = () => {
    if (!vendedorInfo.nome.trim()) {
      aparecerToast("Por favor, preencha o nome!");
      return false;
    }
    if (!vendedorInfo.email.trim()) {
      aparecerToast("Por favor, preencha o email!");
      return false;
    }
    if (!vendedorInfo.email.includes("@")) {
      aparecerToast("Por favor, insira um email válido!");
      return false;
    }
    if (
      !vendedorInfo.telefone ||
      vendedorInfo.telefone.replace(/\D/g, "").length < 10
    ) {
      aparecerToast("Por favor, preencha um telefone válido!");
      return false;
    }
    if (
      !vendedorInfo.cpf ||
      vendedorInfo.cpf.replace(/\D/g, "").length !== 11
    ) {
      aparecerToast("Por favor, preencha um CPF válido!");
      return false;
    }
    if (
      !vendedorInfo.data_nasc ||
      vendedorInfo.data_nasc.replace(/\D/g, "").length !== 8
    ) {
      aparecerToast("Por favor, preencha a data de nascimento!");
      return false;
    }
    return true;
  };

  // Validação do segundo passo
  const validarSegundoPasso = () => {
    if (!endereco.cep || endereco.cep.replace(/\D/g, "").length !== 8) {
      aparecerToast("Por favor, preencha um CEP válido!");
      return false;
    }
    if (!endereco.logradouro.trim()) {
      aparecerToast("Por favor, preencha o logradouro!");
      return false;
    }
    if (!endereco.numero.trim()) {
      aparecerToast("Por favor, preencha o número!");
      return false;
    }
    if (!endereco.bairro.trim()) {
      aparecerToast("Por favor, preencha o bairro!");
      return false;
    }
    if (!endereco.cidade.trim()) {
      aparecerToast("Por favor, preencha a cidade!");
      return false;
    }
    if (!endereco.uf.trim()) {
      aparecerToast("Por favor, preencha o UF!");
      return false;
    }
    return true;
  };

  const handleContinuar = () => {
    if (validarPrimeiroPasso()) {
      setPasso("Endereço");
    }
  };

  const handleSalvar = async () => {
    if (!validarSegundoPasso()) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/gerente/vendedores", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nome: vendedorInfo.nome,
          email: vendedorInfo.email,
          telefone: vendedorInfo.telefone,
          cpf: vendedorInfo.cpf,
          data_nasc: vendedorInfo.data_nasc,
          endereco: {
            logradouro: endereco.logradouro,
            numero: endereco.numero,
            complemento: endereco.complemento,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            uf: endereco.uf,
            cep: endereco.cep,
          },
        }),
      });

      if (response.ok) {
        setDialogSucesso(true);
        setOpen(false);
        await buscarVendedores();
      } else {
        const error = await response.json();
        aparecerToast(error.error || "Erro ao cadastrar vendedor!");
      }
    } catch (error) {
      console.error("Erro ao cadastrar vendedor:", error);
      aparecerToast("Erro ao cadastrar vendedor!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="cursor-pointer text-roxo bg-verdefundo/50 hover:bg-verdefundo hover:text-roxo border-3 py-5 w-full border-dashed border-roxo rounded-2xl"
          >
            <PlusCircle /> Cadastrar Vendedor
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] border-3 border-dashed border-roxoescuro rounded-xl bg-[#DDF1D4] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-roxoescuro flex items-center gap-2 text-xl">
              {passo === "Informações" ? (
                <>
                  <User className="text-[#569a33]" />
                  Dados Pessoais
                </>
              ) : (
                <>
                  <MapPin className="text-[#569a33]" />
                  Endereço
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {passo === "Informações"
                ? "Preencha as informações pessoais do vendedor"
                : "Preencha o endereço do vendedor"}
            </DialogDescription>
          </DialogHeader>

          {/* PASSO 1: Informações */}
          {passo === "Informações" && (
            <div className="space-y-3">
              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="nome"
                  className="text-sm text-[#569a33] font-semibold mb-1"
                >
                  Nome Completo: *
                </label>
                <input
                  type="text"
                  id="nome"
                  name="nome"
                  placeholder="Ex: João Silva Santos"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                  value={vendedorInfo?.nome}
                  onChange={handleChangeInfo}
                />
              </div>

              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm text-[#569a33] font-semibold mb-1"
                >
                  Email: *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="vendedor@email.com"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                  value={vendedorInfo?.email}
                  onChange={handleChangeInfo}
                />
              </div>

              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="telefone"
                  className="text-sm text-[#569a33] font-semibold mb-1"
                >
                  Telefone: *
                </label>
                <InputTelefoneMask
                  type="text"
                  id="telefone"
                  name="telefone"
                  placeholder="(11) 98765-4321"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                  value={vendedorInfo?.telefone}
                  onChange={handleChangeInfo}
                />
              </div>

              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="cpf"
                  className="text-sm text-[#569a33] font-semibold mb-1"
                >
                  CPF: *
                </label>
                <InputCPFMask
                  type="text"
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                  value={vendedorInfo?.cpf}
                  onChange={handleChangeInfo}
                />
              </div>

              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="data_nasc"
                  className="text-sm text-[#569a33] font-semibold mb-1"
                >
                  Data de Nascimento: *
                </label>
                <InputDataMask
                  type="text"
                  id="data_nasc"
                  name="data_nasc"
                  placeholder="DD/MM/AAAA"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                  value={vendedorInfo?.data_nasc}
                  onChange={handleChangeInfo}
                />
              </div>

              <p className="text-xs text-gray-600 italic mt-2">
                * Campos obrigatórios
              </p>
            </div>
          )}

          {/* PASSO 2: Endereço */}
          {passo === "Endereço" && (
            <div className="space-y-3">
              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="cep"
                  className="text-sm text-[#569a33] font-semibold mb-1"
                >
                  CEP: *
                </label>
                <InputCEPMask
                  type="text"
                  id="cep"
                  name="cep"
                  placeholder="00000-000"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                  value={endereco?.cep}
                  onChange={handleChangeEndereco}
                />
                {buscandoCep && (
                  <div className="text-xs text-[#569a33] mt-1 flex items-center gap-1">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-[#569a33]"></div>
                    Buscando CEP...
                  </div>
                )}
              </div>

              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="logradouro"
                  className="text-sm text-[#569a33] font-semibold mb-1"
                >
                  Logradouro: *
                </label>
                <input
                  type="text"
                  id="logradouro"
                  name="logradouro"
                  placeholder="Rua, Avenida..."
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                  value={endereco?.logradouro}
                  onChange={handleChangeEndereco}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="mb-2 flex flex-col">
                  <label
                    htmlFor="numero"
                    className="text-sm text-[#569a33] font-semibold mb-1"
                  >
                    Número: *
                  </label>
                  <input
                    type="text"
                    id="numero"
                    name="numero"
                    placeholder="123"
                    className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                    value={endereco?.numero}
                    onChange={handleChangeEndereco}
                  />
                </div>

                <div className="mb-2 flex flex-col">
                  <label
                    htmlFor="complemento"
                    className="text-sm text-[#569a33] font-semibold mb-1"
                  >
                    Complemento:
                  </label>
                  <input
                    type="text"
                    id="complemento"
                    name="complemento"
                    placeholder="Apto, Bloco..."
                    className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                    value={endereco?.complemento}
                    onChange={handleChangeEndereco}
                  />
                </div>
              </div>

              <div className="mb-2 flex flex-col">
                <label
                  htmlFor="bairro"
                  className="text-sm text-[#569a33] font-semibold mb-1"
                >
                  Bairro: *
                </label>
                <input
                  type="text"
                  id="bairro"
                  name="bairro"
                  placeholder="Centro"
                  className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                  value={endereco?.bairro}
                  onChange={handleChangeEndereco}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="mb-2 flex flex-col col-span-2">
                  <label
                    htmlFor="cidade"
                    className="text-sm text-[#569a33] font-semibold mb-1"
                  >
                    Cidade: *
                  </label>
                  <input
                    type="text"
                    id="cidade"
                    name="cidade"
                    placeholder="São Paulo"
                    className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text"
                    value={endereco?.cidade}
                    onChange={handleChangeEndereco}
                  />
                </div>

                <div className="mb-2 flex flex-col">
                  <label
                    htmlFor="uf"
                    className="text-sm text-[#569a33] font-semibold mb-1"
                  >
                    UF: *
                  </label>
                  <input
                    type="text"
                    id="uf"
                    name="uf"
                    placeholder="SP"
                    maxLength={2}
                    className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-white px-3 py-2 rounded-lg border-2 border-dashed border-roxoescuro focus:border-[#569a33] cursor-text uppercase"
                    value={endereco?.uf}
                    onChange={handleChangeEndereco}
                  />
                </div>
              </div>

              <p className="text-xs text-gray-600 italic mt-2">
                * Campos obrigatórios
              </p>
            </div>
          )}

          <DialogFooter className="gap-2">
            {passo === "Informações" ? (
              <>
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="flex-1 bg-[#9bf377] text-[#4f6940] hover:bg-[#75ba51] hover:text-lime-900 font-semibold cursor-pointer"
                  >
                    Cancelar
                  </Button>
                </DialogClose>

                <Button
                  type="button"
                  className="flex-1 bg-[#76196c] text-white hover:bg-[#924187] hover:text-white font-semibold cursor-pointer"
                  onClick={handleContinuar}
                >
                  Continuar
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-white text-[#4f6940] hover:bg-gray-100 font-semibold cursor-pointer border-2 border-[#569a33]"
                  onClick={() => setPasso("Informações")}
                  disabled={loading}
                >
                  Voltar
                </Button>

                <Button
                  type="button"
                  className="flex-1 bg-[#569a33] text-white hover:bg-[#4f6940] font-semibold cursor-pointer"
                  onClick={handleSalvar}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Salvando...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle size={18} />
                      Cadastrar
                    </span>
                  )}
                </Button>
              </>
            )}
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
              Vendedor Cadastrado com Sucesso!
            </AlertDialogTitle>
            <div className="text-center space-y-2">
              <div className="text-[#4f6940] font-semibold text-lg">
                <span className="font-bold text-[#569a33]">
                  {vendedorInfo.nome}
                </span>{" "}
                foi cadastrado
              </div>
              <div className="bg-white rounded-lg p-3 mt-3 border-2 border-[#569a33] border-dashed space-y-1">
                <div className="text-sm text-gray-600">
                  Email:{" "}
                  <span className="font-bold text-[#76196c]">
                    {vendedorInfo.email}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  CPF:{" "}
                  <span className="font-bold text-[#76196c]">
                    {vendedorInfo.cpf}
                  </span>
                </div>
              </div>
              <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200 mt-3">
                <AlertCircle size={14} className="inline mr-1" />
                Senha padrão: <strong>deve_mudar</strong>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              className="w-full bg-[#569a33] text-white hover:bg-[#4f6940] font-bold cursor-pointer text-lg py-6 rounded-xl"
              onClick={() => setDialogSucesso(false)}
            >
              Fechar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
