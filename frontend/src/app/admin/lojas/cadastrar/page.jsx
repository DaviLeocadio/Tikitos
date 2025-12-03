"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Store,
  MapPin,
  UserPlus,
  CheckCircle,
  ArrowRight,
  Briefcase,
  UserCheck,
  Loader2,
  AlertCircle,
  Building2,
  Users,
} from "lucide-react";
import { aparecerToast } from "@/utils/toast";

// --- CONFIG ---
const API_BASE = "http://localhost:8080/admin";

// --- UI COMPONENTS (TIKITOS STYLE) ---

const TikitosCard = ({ children, title, icon: Icon, className = "" }) => (
  <div
    className={`bg-white rounded-2xl border-2 border-dashed border-purple-200 shadow-[0_0_15px_rgba(124,58,237,0.1)] hover:border-roxo transition-all duration-300 p-6 ${className}`}
  >
    {(title || Icon) && (
      <div className="flex items-center gap-3 mb-4 border-b border-purple-50 pb-3">
        {Icon && (
          <div className="p-2 bg-purple-100 text-roxo    rounded-lg">
            <Icon size={20} />
          </div>
        )}
        {title && <h3 className="text-lg font-bold text-gray-800">{title}</h3>}
      </div>
    )}
    {children}
  </div>
);

const TikitosInput = ({ label, error, ...props }) => (
  <div className="flex flex-col gap-1 mb-4 w-full">
    {label && (
      <label className="text-xs font-bold text-roxo uppercase tracking-wide ml-1">
        {label}
      </label>
    )}
    <input
      className={`
        w-full px-4 py-3 rounded-xl border-2 outline-none transition-all font-medium text-gray-700
        ${
          error
            ? "border-red-400 bg-red-50 focus:border-red-500"
            : "border-purple-100 bg-purple-50/50 focus:border-roxo focus:bg-purple-50 focus:shadow-[0_0_0_4px_rgba(124,58,237,0.1)]"
        }
        disabled:opacity-60 disabled:cursor-not-allowed
      `}
      {...props}
    />
    {error && (
      <span className="text-xs text-red-500 font-semibold ml-1">{error}</span>
    )}
  </div>
);

const TikitosButton = ({
  children,
  variant = "primary",
  loading,
  className = "",
  ...props
}) => {
  const baseStyle =
    "px-6 py-3 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 shadow-md active:scale-95 disabled:opacity-70 disabled:pointer-events-none";
  const variants = {
    primary: "bg-roxo text-white hover:bg-roxoescuro hover:shadow-purple-200",
    success:
      "bg-[#10B981] text-white hover:bg-[#059669] hover:shadow-green-200",
    outline:
      "bg-white text-purple-600 border-2 border-purple-200 hover:border-purple-500 hover:bg-purple-50",
    ghost:
      "bg-transparent text-gray-500 hover:text-purple-600 hover:bg-purple-50",
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : children}
    </button>
  );
};

// --- MAIN PAGE COMPONENT ---

export default function NovaLojaPage() {
  const router = useRouter();
  const params = useSearchParams();

  const passo = params.get("step");
  const idEmpresa = params.get("id_empresa");

  // -- STATES --
  const [step, setStep] = useState(1); // 1: Filial Info, 2: Gerente
  const [loading, setLoading] = useState(false);
  const [createdFilialId, setCreatedFilialId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [vendores, setVendedores] = useState([]);
  const [gerentes, setGerentes] = useState([]);

  useEffect(() => {
    if (idEmpresa && passo && (passo == 1 || passo == 2)) {
      setStep(2);
      setCreatedFilialId(idEmpresa);
    }
  }, [params]);
  // Form States
  const [filialForm, setFilialForm] = useState({
    nome: "",
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
    complemento: "",
  });

  // Manager Selection State
  const [managerOption, setManagerOption] = useState("create"); // 'transfer', 'promote', 'create'
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [managerForm, setManagerForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    data_nasc: "",
    perfil: "gerente",
    endereco: {
      logradouro: "",
      numero: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: "",
    },
  });

  const [managerAddress, setManagerAddress] = useState({
    cep: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
    uf: "",
  });

  const handleCepSearch = async (cepValue, targetStateSetter) => {
    const cleanCep = cepValue.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      setLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          targetStateSetter((prev) => ({
            ...prev,
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
          }));
          aparecerToast("Endereço encontrado! 🗺️");
        } else {
          aparecerToast("CEP não encontrado.");
        }
      } catch (err) {
        aparecerToast("Erro ao buscar CEP.");
      } finally {
        setLoading(false);
      }
    }
  };

  // -- HANDLERS STEP 1: FILIAL --

  const handleFilialChange = (e) => {
    const { name, value } = e.target;
    setFilialForm((prev) => ({ ...prev, [name]: value }));
    if (name === "cep" && value.replace(/\D/g, "").length === 8) {
      handleCepSearch(value, setFilialForm);
    }
  };

  const submitFilial = async () => {
    if (!filialForm.nome || !filialForm.cep || !filialForm.numero) {
      aparecerToast("Preencha os campos obrigatórios da filial.");
      return;
    }

    setLoading(true);
    try {
      // Cria a filial primeiro
      const res = await fetch(`${API_BASE}/filiais`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          nome: filialForm.nome,
          tipo: "filial",
          status: "ativo",
          endereco: {
            cep: filialForm.cep,
            logradouro: filialForm.logradouro,
            numero: filialForm.numero,
            bairro: filialForm.bairro,
            cidade: filialForm.cidade,
            uf: filialForm.uf,
            complemento: filialForm.complemento,
          },
        }),
      });

      if (!res.ok) throw new Error("Falha ao criar filial");

      const data = await res.json();
      setCreatedFilialId(data.id || 123); // Fallback ID se a API mock não retornar
      console.log(data);
      aparecerToast("Filial criada! Agora defina o gerente.");

      // Carregar funcionários para o próximo passo
      await fetchEmployees();

      setStep(2);
    } catch (error) {
      aparecerToast("Erro ao criar filial. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // -- HANDLERS STEP 2: GERENTE --

  const handleManagerFormChange = (e) => {
    const { name, value } = e.target;
    setManagerForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleManagerAddressChange = (e) => {
    const { name, value } = e.target;
    setManagerAddress((prev) => ({ ...prev, [name]: value }));
    if (name === "cep" && value.replace(/\D/g, "").length === 8) {
      handleCepSearch(value, setManagerAddress);
    }
  };

  const submitManagerLogic = async () => {
    if (!createdFilialId) return;

    setLoading(true);
    let url = "";
    let payload = {};

    try {
      if (managerOption === "create") {
        url = `${API_BASE}/filiais/${createdFilialId}/gerentes`;

        // Merge address into manager object
        payload = {
          ...managerForm,
          endereco: { ...managerAddress },
        };

        // Validação básica do form novo
        if (!payload.nome || !payload.email || !payload.cpf)
          throw new Error("Preencha os dados do gerente.");
      } else if (managerOption === "transfer") {
        if (!selectedEmployeeId) throw new Error("Selecione um funcionário.");
        url = `${API_BASE}/filiais/${createdFilialId}/transferir-funcionario`;
        payload = { idUsuario: parseInt(selectedEmployeeId) };
      } else if (managerOption === "promote") {
        if (!selectedEmployeeId) throw new Error("Selecione um funcionário.");
        url = `${API_BASE}/filiais/${createdFilialId}/transferir-funcionario`;
        payload = {
          idUsuario: parseInt(selectedEmployeeId),
          perfil: "gerente",
        };
      }

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Falha na operação do gerente");

      aparecerToast("Tudo pronto! Redirecionando...");
      setTimeout(() => router.push(`/lojas/${createdFilialId}`), 1500);
    } catch (error) {
      aparecerToast(error.message || "Erro ao processar gerente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const resVendedores = await fetch(`${API_BASE}/vendedores`, {
          credentials: "include",
        });
        const dataVendedores = await resVendedores.json();
        setVendedores(dataVendedores);

        const resGerentes = await fetch(`${API_BASE}/gerentes`, {
          credentials: "include",
        });
        const dataGerentes = await resGerentes.json();
        setGerentes(dataGerentes.gerentes);
      } catch (err) {
        console.log(err);
      }
    };
    buscarDados();
  }, []);

  // -- RENDER --

  return (
    <div className="min-h-screen  p-6 md:p-12 font-sans text-gray-800">
      {/* HEADER */}
      <div className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-roxo mb-2 tracking-tight">
            Nova Unidade Tikitos
          </h1>
          <p className="text-gray-500 font- ">
            Vamos expandir o império de diversão! 🚀
          </p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 p-3 rounded-full">
          <div
            className={`h-3 w-3 rounded-full ${
              step >= 1 ? "bg-[#10B981]" : "bg-gray-300"
            }`}
          />
          <div
            className={`h-1 w-12 rounded-full ${
              step >= 2 ? "bg-[#10B981]" : "bg-gray-200"
            }`}
          />
          <div
            className={`h-3 w-3 rounded-full ${
              step >= 2 ? "bg-[#10B981]" : "bg-gray-300"
            }`}
          />
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* STEP 1: DADOS DA FILIAL */}
        {step === 1 && (
          <div className="animate-fade-in">
            <TikitosCard title="Dados da Estrutura" icon={Building2}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <TikitosInput
                    label="Nome da Filial"
                    name="nome"
                    placeholder="Ex: Unidade Centro - Shopping X"
                    value={filialForm.nome}
                    onChange={handleFilialChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <TikitosInput
                    label="Tipo"
                    value="Filial"
                    disabled
                    className="text-gray-900 bg-gray-100 w-full px-4 py-3 rounded-xl border-2   outline-none transition-all font-medium
                    disabled:opacity-60"
                  />
                  <TikitosInput
                    label="Status"
                    value="Ativo"
                    disabled
                    className=" text-[#10B981] font-bold bg-green-50 w-full px-4 py-3 rounded-xl border-2 border-[#10B981]   outline-none transition-all
                    disabled:opacity-60"
                  />
                </div>
              </div>
            </TikitosCard>

            <div className="h-6"></div>

            <TikitosCard title="Localização" icon={MapPin}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1">
                  <TikitosInput
                    label="CEP"
                    name="cep"
                    placeholder="00000-000"
                    maxLength={9}
                    value={filialForm.cep}
                    onChange={handleFilialChange}
                  />
                </div>
                <div className="md:col-span-3">
                  <TikitosInput
                    label="Logradouro"
                    name="logradouro"
                    value={filialForm.logradouro}
                    onChange={handleFilialChange}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <TikitosInput
                  label="Número"
                  name="numero"
                  placeholder="123"
                  value={filialForm.numero}
                  onChange={handleFilialChange}
                />
                <div className="md:col-span-2">
                  <TikitosInput
                    label="Bairro"
                    name="bairro"
                    value={filialForm.bairro}
                    onChange={handleFilialChange}
                    readOnly
                  />
                </div>
                <TikitosInput
                  label="UF"
                  name="uf"
                  value={filialForm.uf}
                  onChange={handleFilialChange}
                  readOnly
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <TikitosInput
                  label="Cidade"
                  name="cidade"
                  value={filialForm.cidade}
                  onChange={handleFilialChange}
                  readOnly
                />
                <TikitosInput
                  label="Complemento (Opcional)"
                  name="complemento"
                  placeholder="Sala 04, Bloco B"
                  value={filialForm.complemento}
                  onChange={handleFilialChange}
                />
              </div>
            </TikitosCard>

            <div className="mt-8 flex justify-end">
              <TikitosButton onClick={submitFilial} loading={loading}>
                Criar Filial e Avançar <ArrowRight size={18} />
              </TikitosButton>
            </div>
          </div>
        )}

        {/* STEP 2: GERENTE */}
        {step === 2 && (
          <div className="animate-slide-up">
            <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-3 mb-6">
              <CheckCircle size={20} />
              <p>
                Filial <strong>{filialForm.nome}</strong> criada com sucesso!
                Agora, quem vai mandar nela?
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Escolha a origem do Gerente:
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Opção A */}
              <button
                onClick={() => setManagerOption("transfer")}
                className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                  managerOption === "transfer"
                    ? "border-roxo bg-purple-50 shadow-md ring-2 ring-purple-200"
                    : "border-gray-200 hover:border-purple-100 bg-white"
                }`}
              >
                <div className="mb-2 p-2 bg-blue-100 text-blue-600 rounded-lg w-fit">
                  <Briefcase size={20} />
                </div>
                <h4 className="font-bold text-gray-800">Transferir</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Mover um gerente existente.
                </p>
              </button>

              {/* Opção B */}
              <button
                onClick={() => setManagerOption("promote")}
                className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                  managerOption === "promote"
                    ? "border-roxo bg-purple-50 shadow-md ring-2 ring-purple-200"
                    : "border-gray-200 hover:border-purple-300 bg-white"
                }`}
              >
                <div className="mb-2 p-2 bg-orange-100 text-orange-600 rounded-lg w-fit">
                  <UserCheck size={20} />
                </div>
                <h4 className="font-bold text-gray-800">Promover</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Elevar funcionário a gerente.
                </p>
              </button>

              {/* Opção C */}
              <button
                onClick={() => setManagerOption("create")}
                className={`p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden ${
                  managerOption === "create"
                    ? "border-roxo bg-purple-50 shadow-md ring-2 ring-purple-200"
                    : "border-gray-200 hover:border-purple-300 bg-white"
                }`}
              >
                <div className="mb-2 p-2 bg-green-100 text-green-600 rounded-lg w-fit">
                  <UserPlus size={20} />
                </div>
                <h4 className="font-bold text-gray-800">Novo Cadastro</h4>
                <p className="text-sm text-gray-500 mt-1">
                  Contratar alguém novo.
                </p>
              </button>
            </div>

            {/* FORMULÁRIO DINÂMICO BASEADO NA OPÇÃO */}
            <TikitosCard className="animate-fade-in">
              {(managerOption === "transfer" ||
                managerOption === "promote") && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-roxo" />
                    <h3 className="font-bold text-lg">
                      Selecione o Colaborador
                    </h3>
                  </div>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl border-2 border-purple-100 bg-white focus:border-roxo outline-none appearance-none"
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      value={selectedEmployeeId}
                    >
                      <option value="">-- Escolha da lista --</option>
                      {(managerOption == "transfer" ? gerentes : vendores).map(
                        (emp) => (
                          <option key={emp.id} value={emp.id}>
                            {emp.nome} - {emp.perfil.charAt(0).toUpperCase() + emp.perfil.slice(1) || "Funcionário"} (ID:{" "}
                            {emp.id_usuario})
                          </option>
                        )
                      )}
                    </select>
                    <div className="absolute right-4 top-4 pointer-events-none text-roxo">
                      ▼
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 italic">
                    {managerOption === "promote"
                      ? 'O perfil do usuário será atualizado para "gerente" automaticamente.'
                      : "O usuário manterá seu perfil atual."}
                  </p>
                </div>
              )}

              {managerOption === "create" && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <UserPlus className="text-roxo" />
                    <h3 className="font-bold text-lg">Dados do Novo Gerente</h3>
                  </div>

                  {/* Dados Pessoais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TikitosInput
                      label="Nome Completo"
                      name="nome"
                      value={managerForm.nome}
                      onChange={handleManagerFormChange}
                    />
                    <TikitosInput
                      label="Email"
                      name="email"
                      type="email"
                      value={managerForm.email}
                      onChange={handleManagerFormChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <TikitosInput
                      label="CPF"
                      name="cpf"
                      placeholder="000.000.000-00"
                      value={managerForm.cpf}
                      onChange={handleManagerFormChange}
                    />
                    <TikitosInput
                      label="Telefone"
                      name="telefone"
                      value={managerForm.telefone}
                      onChange={handleManagerFormChange}
                    />
                    <TikitosInput
                      label="Data Nasc."
                      name="data_nasc"
                      type="date"
                      value={managerForm.data_nasc}
                      onChange={handleManagerFormChange}
                    />
                  </div>

                  <div className="my-4 border-t border-dashed border-gray-200"></div>

                  {/* Endereço Gerente */}
                  <h4 className="text-sm font-bold text-roxo uppercase mb-2">
                    Endereço Residencial
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <TikitosInput
                      label="CEP"
                      name="cep"
                      value={managerAddress.cep}
                      onChange={handleManagerAddressChange}
                      maxLength={9}
                    />
                    <div className="md:col-span-3">
                      <TikitosInput
                        label="Logradouro"
                        name="logradouro"
                        value={managerAddress.logradouro}
                        onChange={handleManagerAddressChange}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <TikitosInput
                      label="Número"
                      name="numero"
                      value={managerAddress.numero}
                      onChange={handleManagerAddressChange}
                    />
                    <TikitosInput
                      label="Bairro"
                      name="bairro"
                      value={managerAddress.bairro}
                      onChange={handleManagerAddressChange}
                    />
                    <TikitosInput
                      label="Cidade"
                      name="cidade"
                      value={managerAddress.cidade}
                      onChange={handleManagerAddressChange}
                    />
                    <TikitosInput
                      label="UF"
                      name="uf"
                      value={managerAddress.uf}
                      onChange={handleManagerAddressChange}
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 flex justify-between items-center pt-4 border-t border-dashed border-purple-100">
                <span className="text-sm text-gray-400">Quase lá...</span>
                <TikitosButton
                  onClick={submitManagerLogic}
                  variant="success"
                  loading={loading}
                >
                  Finalizar Cadastro <CheckCircle size={18} />
                </TikitosButton>
              </div>
            </TikitosCard>
          </div>
        )}
      </div>
    </div>
  );
}
