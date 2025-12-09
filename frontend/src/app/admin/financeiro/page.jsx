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
import { CheckCircle, ChevronLeft, ChevronRight, Trash } from "lucide-react";
import InputDataMask from "@/components/inputMasks/InputDataMask";
import ModalAdicionarDespesa from "@/components/admin/financeiro/ModalAdicionarDespesa";

// Formata números para moeda BRL: R$ XXX.XXX,XX
function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "R$ 0,00";

  if (typeof value === "string" && value.includes("R$")) return value;

  let num = value;
  if (typeof value === "string") {
    const cleaned = value.replace(/\./g, "").replace(/,/g, ".").replace(/[^0-9.\-]/g, "");
    num = parseFloat(cleaned);
  } else {
    num = parseFloat(value);
  }

  if (isNaN(num)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num);
}

// Componente de Paginação Reutilizável
const Paginacao = ({ paginaAtual, totalPaginas, onMudarPagina, variant = "roxo" }) => {
  const gerarPaginas = () => {
    const paginas = [];
    const maxPaginas = 5;

    let inicio = Math.max(1, paginaAtual - Math.floor(maxPaginas / 2));
    let fim = Math.min(totalPaginas, inicio + maxPaginas - 1);

    if (fim - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fim - maxPaginas + 1);
    }

    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }

    return paginas;
  };

  if (totalPaginas <= 1) return null;

  const corAtiva = variant === "verde" ? "bg-[#569a33] text-white" : "bg-[#76196c] text-white";
  const corInativa = variant === "verde"
    ? "bg-white border-2 border-[#569a33] text-[#569a33] hover:bg-[#e8f5e8]"
    : "bg-white border-2 border-[#76196c] text-[#76196c] hover:bg-[#f0e5f5]";
  const corBotoes = variant === "verde"
    ? "bg-white border-2 border-[#569a33] text-[#569a33] hover:bg-[#e8f5e8]"
    : "bg-white border-2 border-[#76196c] text-[#76196c] hover:bg-[#f0e5f5]";

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        onClick={() => onMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1}
        className={`p-2 rounded-lg ${corBotoes} disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer`}
      >
        <ChevronLeft size={20} />
      </button>

      {gerarPaginas().map((pagina) => (
        <button
          key={pagina}
          onClick={() => onMudarPagina(pagina)}
          className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${paginaAtual === pagina ? corAtiva : corInativa
            }`}
        >
          {pagina}
        </button>
      ))}

      <button
        onClick={() => onMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
        className={`p-2 rounded-lg ${corBotoes} disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default function AdminFinanceiro() {
  const [loading, setLoading] = useState(true);
  const [dialogExcluir, setDialogExcluir] = useState({ open: false, id: null });
  const [totalVendas, setTotalVendas] = useState(0);
  const [despesas, setDespesas] = useState([]);
  const [fluxoCaixa, setFluxoCaixa] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [caixa, setCaixa] = useState([]);
  const [despesasPendentes, setDespesasPendentes] = useState();
  const [despesasPagas, setDespesasPagas] = useState();
  const [dialogMarcarPago, setDialogMarcarPago] = useState({
    open: false,
    despesa: null,
  });

  // Estados de paginação
  const [paginaDespesas, setPaginaDespesas] = useState(1);
  const [paginaCaixa, setPaginaCaixa] = useState(1);
  const itensPorPagina = 10;

  const buildUrlWithFilters = (baseUrl) => {
    const p = new URLSearchParams();
    if (filterStartDate) p.append("dataInicio", filterStartDate);
    if (filterEndDate) p.append("dataFim", filterEndDate);
    return p.toString() ? `${baseUrl}?${p.toString()}` : baseUrl;
  };

  useEffect(() => {
    // helper to append date filters
    const params = (baseUrl) => {
      const p = new URLSearchParams();
      if (filterStartDate) p.append("dataInicio", filterStartDate);
      if (filterEndDate) p.append("dataFim", filterEndDate);
      return p.toString() ? `${baseUrl}?${p.toString()}` : baseUrl;
    };

    const totalVendasFetch = async () => {
      try {
        const response = await fetch(buildUrlWithFilters("http://localhost:8080/admin/vendasTotais"), {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          console.log("Não foi possivel visualizar total de produtos");
          return;
        }

        const data = await response.json();

        setTotalVendas(data.valorTotal);
        console.log(data);
      } catch (error) {
        console.error("Erro ao disponibilizar o total de vendas");
      } finally {
        setLoading(false);
      }
    };

    const despesasPendentesFetch = async () => {
      try {
        const response = await fetch(buildUrlWithFilters("http://localhost:8080/admin/despesas-pendentes"), { method: "GET", credentials: "include" });

        if (!response.ok) {
          console.log(
            "Não foi possivel visualizar total de despesas pendentes"
          );
          return;
        }

        const data = await response.json();

        setDespesasPendentes(data.valorDespesas);
        console.log(data);
      } catch (error) {
        console.error("Erro ao disponibilizar o total de vendas");
      } finally {
        setLoading(false);
      }
    };

    const despesasPagasFetch = async () => {
      try {
        const response = await fetch(buildUrlWithFilters("http://localhost:8080/admin/despesas-pagas"), { method: "GET", credentials: "include" });

        if (!response.ok) {
          console.log("Não foi possivel visualizar total de despesas pagas");
          return;
        }

        const data = await response.json();

        setDespesasPagas(data.valorDespesas);
        console.log(data);
      } catch (error) {
        console.error("Erro ao disponibilizar o total de vendas");
      } finally {
        setLoading(false);
      }
    };

    const listagemDespesasFetch = async () => {
      try {
        const response = await fetch(buildUrlWithFilters("http://localhost:8080/admin/despesas"), { method: "GET", credentials: "include" });

        if (!response.ok) {
          console.log("Não foi possivel visualizar total de despesas");
          return;
        }

        const data = await response.json();

        setDespesas(data.despesasListadas);
        console.log(data);
      } catch (error) {
        console.error("Erro ao disponibilizar o total de vendas");
      } finally {
        setLoading(false);
      }
    };

    const listagemCaixaFetch = async () => {
      try {
        const response = await fetch(buildUrlWithFilters("http://localhost:8080/admin/caixa"), { method: "GET", credentials: "include" });

        if (!response.ok) {
          console.log("Não foi possivel visualizar total de caixa");
          return;
        }

        const data = await response.json();

        setCaixa(data.caixaListado);
        console.log(data);
      } catch (error) {
        console.error("Erro ao disponibilizar o total de vendas");
      } finally {
        setLoading(false);
      }
    };

    listagemCaixaFetch();
    listagemDespesasFetch();
    despesasPagasFetch();
    despesasPendentesFetch();
    totalVendasFetch();
  }, [filterStartDate, filterEndDate]);

  // inicializar filtros de data com últimos 30 dias
  useEffect(() => {
    const hoje = new Date();
    const end = hoje.toISOString().split("T")[0];
    const startDate = new Date(hoje);
    startDate.setDate(startDate.getDate() - 30);
    const start = startDate.toISOString().split("T")[0];
    setFilterStartDate(start);
    setFilterEndDate(end);
  }, []);

  useEffect(() => {
    calcularResumo();
  }, [despesas, fluxoCaixa]);

  const pagarDespesa = async (idDespesa) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/despesas/${idDespesa}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) return;

      // Recarregar despesas após pagamento
      const responseList = await fetch(buildUrlWithFilters("http://localhost:8080/admin/despesas"), {
        method: "GET",
        credentials: "include",
      });

      if (responseList.ok) {
        const data = await responseList.json();
        setDespesas(data.despesasListadas);
      }
    } catch (err) {
      console.error("Erro ao pagar despesa", err);
    } finally {
      setDialogMarcarPago({ open: false, despesa: null });
    }
  };

  const confirmarExcluir = async () => {
    try {
      const response = await fetch(`http://localhost:8080/admin/despesas/${dialogExcluir.id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        console.error("Erro ao excluir despesa", response.status);
        return;
      }

      // Recarregar lista de despesas
      const responseList = await fetch(buildUrlWithFilters("http://localhost:8080/admin/despesas"), {
        method: "GET",
        credentials: "include",
      });

      if (responseList.ok) {
        const data = await responseList.json();
        setDespesas(data.despesasListadas);
      }
    } catch (err) {
      console.error("Erro ao excluir despesa", err);
    } finally {
      setDialogExcluir({ open: false, id: null });
    }
  };

  const calcularResumo = () => {
    const totalDespesass = despesas
      .filter((d) => d.status === "pago")
      .reduce((acc, d) => acc + parseFloat(d.preco), 0);

    const despesasPendentess = despesas
      .filter((d) => d.status === "pendente")
      .reduce((acc, d) => acc + parseFloat(d.preco), 0);

    const totalVendass = fluxoCaixa.reduce(
      (acc, f) => acc + parseFloat(f.valor_total || 0),
      0
    );

    setResumo({
      totalDespesass,
      despesasPendentess,
      totalVendass,
      saldo: totalVendass - totalDespesass,
    });
  };

  const despesasFiltradas = despesas.filter((d) => {
    if (filtroStatus === "todos") return true;
    return d.status === filtroStatus;
  });

  // Calcular paginação para despesas
  const totalPaginasDespesas = Math.ceil(despesasFiltradas.length / itensPorPagina);
  const indiceFinalDespesas = paginaDespesas * itensPorPagina;
  const indiceInicialDespesas = indiceFinalDespesas - itensPorPagina;
  const despesasPaginadas = despesasFiltradas.slice(indiceInicialDespesas, indiceFinalDespesas);

  // Calcular paginação para caixa
  const totalPaginasCaixa = Math.ceil(caixa.length / itensPorPagina);
  const indiceFinalCaixa = paginaCaixa * itensPorPagina;
  const indiceInicialCaixa = indiceFinalCaixa - itensPorPagina;
  const caixaPaginado = caixa.slice(indiceInicialCaixa, indiceFinalCaixa);

  // Reset página ao mudar filtro
  useEffect(() => {
    setPaginaDespesas(1);
  }, [filtroStatus]);

  return (
    <div className="min-h-screen bg-gradient-to-br to-[#f0e5f5] p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c]">
              Financeiro
            </h1>
            <p className="text-lg text-[#8c3e82] mt-1">
              Gestão de despesas e fluxo de caixa
            </p>
          </div>

          <div className="flex gap-5 flex-wrap ">
            {/* Filtros de período (início/fim) */}
            <div className="flex items-center gap-3 justify-end">
              <label className="text-sm text-[#76196c] font-semibold">De</label>
              <input
                type="date"
                value={filterStartDate}
                onChange={(e) => setFilterStartDate(e.target.value)}
                className="p-2 rounded-lg border-2 border-[#b478ab]"
              />
              <label className="text-sm text-[#76196c] font-semibold">Até</label>
              <input
                type="date"
                value={filterEndDate}
                onChange={(e) => setFilterEndDate(e.target.value)}
                className="p-2 rounded-lg border-2 border-[#b478ab]"
              />
            </div>

            <button
              onClick={() => setModalAberto(true)}
              className="bg-[#569a33] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4f6940] transition flex items-center gap-2 cursor-pointer"
            >
              <i className="bi bi-plus-circle text-xl"></i>
              Nova Despesa
            </button>
          </div>
        </div>

        {/* Cards de Resumo */}
        {resumo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-verdefundo rounded-xl border-3 border-dashed border-[#569a33] p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-roxo mb-1">
                    Total de vendas
                  </p>
                  <p className="text-3xl font-bold text-roxo">
                    {formatCurrency(totalVendas)}
                  </p>
                </div>
                <i className="bi bi-arrow-up-circle text-3xl text-roxo"></i>
              </div>
            </div>

            <div className="bg-roxo rounded-xl border-3 border-dashed border-text-roxoescuro p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-lilasclaro mb-1">
                    Despesas pagas
                  </p>
                  <p className="text-3xl font-bold text-lilasclaro">
                    {formatCurrency(despesasPagas)}
                  </p>
                </div>
                <i className="bi bi-arrow-down-circle text-3xl text-lilasclaro"></i>
              </div>
            </div>

            <div className="bg-verdefundo rounded-xl border-3 border-dashed border-[#569a33] p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-roxo mb-1">
                    A Pagar
                  </p>
                  <p className="text-3xl font-bold text-roxo">
                    {formatCurrency(despesasPendentes)}
                  </p>
                </div>
                <i className="bi bi-clock-history text-3xl text-roxo"></i>
              </div>
            </div>

            <div className="bg-roxo rounded-xl border-3 border-dashed border-text-roxoescuro p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-lilasclaro mb-1">
                    Saldo
                  </p>
                  <p
                    className={`text-3xl font-bold ${resumo.saldo >= 0 ? "text-lilasclaro" : "text-lilasclaro"
                      }`}
                  >
                    {formatCurrency((Number(totalVendas) || 0) - (Number(despesasPagas) || 0))}

                  </p>
                </div>
                <i className="bi bi-wallet2 text-3xl text-lilasclaro"></i>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Despesas */}
        <div className="bg-white rounded-xl border-3 border-dashed border-[#b478ab] overflow-hidden">
          <div className="p-5 bg-[#e8c5f1] border-b-2 border-[#b478ab]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-[#76196c]">Despesas</h2>

              <div className="flex gap-2">
                {["todos", "pago", "pendente"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFiltroStatus(status)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition cursor-pointer ${filtroStatus === status
                      ? "bg-[#76196c] text-white"
                      : "bg-white text-[#76196c] hover:bg-[#f0e5f5]"
                      }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f0e5f5]">
                <tr>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Descrição
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Fornecedor
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Valor
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Data Adicionado
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Data Pagamento
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Status
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#76196c]"></div>
                        <span className="text-[#8c3e82]">Carregando...</span>
                      </div>
                    </td>
                  </tr>
                ) : despesasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      <i className="bi bi-inbox text-4xl text-[#b478ab] opacity-50"></i>
                      <p className="text-lg font-semibold text-[#8c3e82] mt-2">
                        Nenhuma despesa encontrada
                      </p>
                    </td>
                  </tr>
                ) : (
                  despesasPaginadas.map((despesa) => (
                    <tr
                      key={despesa.id_despesa}
                      className="border-b bg-[#f0e5f5]  border-[#b478ab]/30 hover:bg-[#f0e5f5]/30"
                    >
                      <td className="p-4 font-semibold text-[#4f6940]">
                        {despesa.descricao}
                      </td>
                      <td className="p-4 text-gray-600">
                        {despesa.fornecedor || "--"}
                      </td>
                      <td className="p-4 font-bold text-[#ff6b6b]">
                        {formatCurrency((parseFloat(despesa.preco)))}
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(despesa.data_adicionado).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="p-4 text-gray-600">
                        {despesa.data_pag
                          ? new Date(despesa.data_pag).toLocaleDateString(
                            "pt-BR"
                          )
                          : "-"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${despesa.status === "pago"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                            }`}
                        >
                          {despesa.status === "pago" ? "Pago" : "Pendente"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {despesa.status === "pendente" && (
                            <button
                              onClick={() =>
                                setDialogMarcarPago({ open: true, despesa })
                              }
                              className="px-3 py-1 bg-[#569a33] text-white rounded-lg text-sm font-semibold hover:bg-[#4f6940] transition cursor-pointer"
                              title="Marcar como pago"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}

                          <button
                            onClick={() => setDialogExcluir({ open: true, id: despesa.id_despesa })}
                            className="px-3 py-1 bg-[#ff6b6b] text-white rounded-lg text-sm font-semibold hover:bg-[#ff5252] transition cursor-pointer"
                            title="Excluir"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação Despesas */}
          {despesasFiltradas.length > 0 && (
            <div className="p-4 bg-[#f0e5f5]/30 border-t border-[#b478ab]/30">
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#76196c] font-semibold">
                  Mostrando {indiceInicialDespesas + 1} a{" "}
                  {Math.min(indiceFinalDespesas, despesasFiltradas.length)} de{" "}
                  {despesasFiltradas.length} despesas
                </p>
                <Paginacao
                  paginaAtual={paginaDespesas}
                  totalPaginas={totalPaginasDespesas}
                  onMudarPagina={setPaginaDespesas}
                />
              </div>
            </div>
          )}
        </div>

        {/* Fluxo de Caixa Diário */}
        <div className="bg-white rounded-xl border-3 border-dashed border-[#569a33] overflow-hidden">
          <div className="p-5 bg-[#e8f5e8] border-b-2 border-[#569a33]">
            <h2 className="text-xl font-bold text-[#569a33]">
              Fluxo de Caixa Diário
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e8f5e8]">
                <tr>
                  <th className="p-3 text-left text-[#569a33] font-bold">
                    Data
                  </th>
                  <th className="p-3 text-left text-[#569a33] font-bold">
                    Valor Final
                  </th>
                  <th className="p-3 text-left text-[#569a33] font-bold">
                    Quantidade de Caixas
                  </th>
                </tr>
              </thead>
              <tbody>
                {caixaPaginado.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center">
                      <i className="bi bi-inbox text-4xl text-[#569a33] opacity-50"></i>
                      <p className="text-lg font-semibold text-[#4f6940] mt-2">
                        Nenhum registro de caixa encontrado
                      </p>
                    </td>
                  </tr>
                ) : (
                  caixaPaginado.map((fluxo, index) => (
                    <tr key={index} className="border-b border-[#569a33]/20 hover:bg-[#e8f5e8]/30">
                      <td className="p-3 font-semibold text-[#4f6940]">
                        {fluxo.data
                          ? new Date(fluxo.data).toLocaleDateString("pt-BR")
                          : fluxo.abertura
                          ? new Date(fluxo.abertura).toLocaleDateString("pt-BR")
                          : "--"}
                      </td>
                      <td className="p-3 font-bold text-[#569a33]">
                          {formatCurrency(parseFloat(fluxo.valor_total) || parseFloat(fluxo.valor_final) || 0)}
                      </td>
                      
                      <td className="p-3">
                        {(() => {
                          const statusLower = (fluxo.status || "").toString().toLowerCase();
                          const statusClass =
                            statusLower === "fechado"
                              ? "bg-red-100 text-red-700"
                              : statusLower === "aberto"
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-700";
                          return (
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}>
                              {fluxo.status || (fluxo.caixas ? `${fluxo.caixas} caixas` : "--")}
                            </span>
                          );
                        })()}
                      </td>
                      
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação Caixa */}
          {caixa.length > 0 && (
            <div className="p-4 bg-[#e8f5e8]/30 border-t border-[#569a33]/30">
              <div className="flex justify-between items-center">
                <p className="text-sm text-[#569a33] font-semibold">
                  Mostrando {indiceInicialCaixa + 1} a{" "}
                  {Math.min(indiceFinalCaixa, caixa.length)} de{" "}
                  {caixa.length} registros
                </p>
                <Paginacao
                  paginaAtual={paginaCaixa}
                  totalPaginas={totalPaginasCaixa}
                  onMudarPagina={setPaginaCaixa}
                  variant="verde"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <ModalAdicionarDespesa
        open={modalAberto}
        onClose={() => setModalAberto(false)}
      />

      {/* Dialog Marcar como Pago */}
      <Dialog
        open={dialogMarcarPago.open}
        onOpenChange={(open) => setDialogMarcarPago({ open, despesa: null })}
      >
        <DialogContent className="sm:max-w-md bg-white border-3 border-[#569a33] border-dashed rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#569a33] font-extrabold text-xl">
              Marcar como Pago
            </DialogTitle>
          </DialogHeader>
          <p className="text-[#4f6940] font-semibold py-4">
            Deseja marcar esta despesa como paga? A data de pagamento será
            definida como hoje.
          </p>
          <DialogFooter className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold cursor-pointer"
              onClick={() =>
                setDialogMarcarPago({ open: false, despesa: null })
              }
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#569a33] text-white hover:bg-[#4f6940] font-bold cursor-pointer"
              onClick={() => pagarDespesa(dialogMarcarPago.despesa.id_despesa)}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Excluir */}
      <Dialog
        open={dialogExcluir.open}
        onOpenChange={(open) => setDialogExcluir({ open, id: null })}
      >
        <DialogContent className="sm:max-w-md bg-[#F1B8E8] border-2 border-[#c61f1f] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#c61f1f] font-extrabold text-xl">
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <p className="text-[#c61f1f] font-semibold py-4">
            Tem certeza que deseja excluir esta despesa? Esta ação não pode ser
            desfeita.
          </p>
          <DialogFooter className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 bg-[#C5FFAD] text-gray-700 hover:bg-[#C5FFAD] font-bold"
              onClick={() => setDialogExcluir({ open: false, id: null })}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#c61f1f] text-[#F1B8E8] hover:bg-[#ff5252] font-bold"
              onClick={confirmarExcluir}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}