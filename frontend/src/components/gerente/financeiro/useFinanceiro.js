"use client";

import { aparecerToast } from "@/utils/toast";
import { useState, useEffect, useRef, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// 🔧 Formatar data sem problemas de timezone
const formatarDataLocal = (data) => {
  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};

export default function useFinanceiro() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const periodo = searchParams.get("periodo") || "mes";
  // Don't default immediately: keep raw as null when not present so we can initialize URL once
  const dataInicioRaw = searchParams.get("dataInicio");
  const dataInicio = useMemo(() => (dataInicioRaw ? new Date(dataInicioRaw) : null), [dataInicioRaw]);
  const filtroStatus = searchParams.get("status") || "todos";

  const [despesas, setDespesas] = useState([]);
  const [fluxoCaixa, setFluxoCaixa] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);

  const montadoRef = useRef(false);

  const calcularIntervalo = (periodoAtual, data) => {
    const d = new Date(data);
    let inicio, fim;

    switch (periodoAtual) {
      case "semana": {
        const dia = d.getDay();
        const diff = d.getDate() - dia + (dia === 0 ? -6 : 1);
        const inicioSemana = new Date(d);
        inicioSemana.setDate(diff);
        inicio = new Date(inicioSemana);
        fim = new Date(inicio);
        fim.setDate(fim.getDate() + 6);
        break;
      }

      case "mes":
        inicio = new Date(d.getFullYear(), d.getMonth(), 1);
        fim = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        break;

      case "dia":
        inicio = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        fim = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        break;

      default:
        inicio = new Date(d.getFullYear(), d.getMonth(), 1);
        fim = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }

    inicio.setHours(0, 0, 0, 0);
    fim.setHours(23, 59, 59, 999);

    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    if (fim > hoje) fim = hoje;

    return { inicio, fim };
  };

  const validarData = (periodoAtual, dataAtual) => {
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    const { inicio } = calcularIntervalo(periodoAtual, dataAtual);

    if (inicio > hoje) {
      aparecerToast("Não é possível visualizar períodos que começam no futuro!");
      return false;
    }

    return true;
  };

  const buscarDados = async (periodoAtual, dataAtual, statusOverride) => {
    if (!validarData(periodoAtual, dataAtual)) {
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const { inicio, fim } = calcularIntervalo(periodoAtual, dataAtual);

      // ✅ CORREÇÃO: Usar formatarDataLocal e adicionar +1 dia na data final
      const dataInicioStr = formatarDataLocal(inicio);
      
      // ⚡ IMPORTANTE: Adicionar 1 dia porque BETWEEN é inclusivo
      const fimMaisUmDia = new Date(fim);
      fimMaisUmDia.setDate(fimMaisUmDia.getDate() + 1);
      const dataFimStr = formatarDataLocal(fimMaisUmDia);

      console.log("📅 Enviando para backend:", { dataInicioStr, dataFimStr, filtroStatus });

      const queryParams = new URLSearchParams({
        dataInicio: dataInicioStr,
        dataFim: dataFimStr,
      });
      
      // ✅ Incluir status na query apenas se não for "todos". permite override para chamadas imediatas
      const statusParaUsar = typeof statusOverride !== "undefined" ? statusOverride : filtroStatus;
      if (statusParaUsar && statusParaUsar !== "todos") {
        queryParams.set("status", statusParaUsar);
      }

      // Buscar despesas
      const resDespesas = await fetch(
        `http://localhost:8080/gerente/gastos?${queryParams.toString()}`,
        { credentials: "include" }
      );

      if (resDespesas.ok) {
        const dataRes = await resDespesas.json();
        setDespesas(dataRes.gastos || []);
      } else {
        console.error("Erro despesas:", resDespesas.status);
        setDespesas([]);
      }

      // Buscar fluxo de caixa
      const resFluxo = await fetch(
        `http://localhost:8080/gerente/caixa?${queryParams.toString()}`,
        { credentials: "include" }
      );

      if (resFluxo.ok) {
        const dataRes = await resFluxo.json();
        setFluxoCaixa(dataRes.caixaData || []);
      } else {
        console.error("Erro fluxo caixa:", resFluxo.status);
        setFluxoCaixa([]);
      }

      // Buscar vendas
      const resVendas = await fetch(
        `http://localhost:8080/gerente/vendas?${queryParams.toString()}`,
        { credentials: "include" }
      );

      if (resVendas.ok) {
        const dataRes = await resVendas.json();
        setVendas(dataRes.vendas || []);
      } else {
        console.error("Erro vendas:", resVendas.status);
        setVendas([]);
      }

    } catch (error) {
      console.error("Erro geral ao buscar dados:", error);
      aparecerToast("Erro ao buscar dados financeiros!");
    } finally {
      setLoading(false);
    }
  };

  const handleAdicionarDespesa = async (despesaData) => {
    try {
      const response = await fetch("http://localhost:8080/gerente/gastos", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(despesaData),
      });

      if (response.ok) {
        aparecerToast("Despesa adicionada com sucesso!");
        buscarDados(periodo, dataInicio);
      } else {
        aparecerToast("Erro ao adicionar despesa!");
      }
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      aparecerToast("Erro ao adicionar despesa!");
    }
  };

  const handleExcluirDespesa = async (idDespesa) => {
    try {
      const response = await fetch(
        `http://localhost:8080/gerente/gastos/${idDespesa}`,
        { method: "DELETE", credentials: "include" }
      );

      if (response.ok) {
        aparecerToast("Despesa excluída com sucesso!");
        buscarDados(periodo, dataInicio);
      } else {
        aparecerToast("Erro ao excluir despesa!");
      }
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
      aparecerToast("Erro ao excluir despesa!");
    }
  };

  const handleMarcarComoPago = async (despesa) => {
    try {
      const response = await fetch(
        `http://localhost:8080/gerente/gastos/${despesa.id_despesa}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "pago",
            data_pag: formatarDataLocal(new Date()),
          }),
        }
      );

      if (response.ok) {
        aparecerToast("Despesa marcada como paga!");
        buscarDados(periodo, dataInicio);
      } else {
        aparecerToast("Erro ao atualizar despesa!");
      }
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);
      aparecerToast("Erro ao atualizar despesa!");
    }
  };

  const mudarPeriodo = (novoPeriodo) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("periodo", novoPeriodo);
    params.set("dataInicio", new Date().toISOString());
    router.push(`?${params.toString()}`);
  };

  const navegar = (direcao) => {
    const nova = new Date(dataInicio);

    switch (periodo) {
      case "semana":
        nova.setDate(nova.getDate() + direcao * 7);
        break;
      case "mes":
        nova.setMonth(nova.getMonth() + direcao);
        break;
      case "dia":
        nova.setDate(nova.getDate() + direcao);
        break;
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("dataInicio", nova.toISOString());
    router.push(`?${params.toString()}`);
  };

  const mudarFiltroStatus = (novoStatus) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", novoStatus);
    router.push(`?${params.toString()}`);
    // Disparar busca imediata com o novo status sem depender do useEffect
    try {
      buscarDados(periodo, dataInicio, novoStatus);
    } catch (err) {
      console.error("Erro ao buscar dados após mudar status:", err);
    }
  };

  // ✅ CORREÇÃO: useEffect que dispara buscarDados quando período ou data mudam (usar a string estável dataInicioRaw)
  // Inicializar query params caso não existam — evita loop quando a página carrega sem queries
  useEffect(() => {
    if (!dataInicioRaw) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("periodo", periodo);
      params.set("dataInicio", new Date().toISOString());
      if (!params.get("status")) params.set("status", "todos");
      // Use replace para não empilhar histórico
      router.replace(`?${params.toString()}`);
      return;
    }

    if (dataInicio) {
      buscarDados(periodo, dataInicio);
    }
  }, [periodo, dataInicioRaw]);

  return {
    despesas,
    fluxoCaixa,
    vendas,
    loading,
    periodo,
    dataInicio,
    filtroStatus,
    buscarDados,
    mudarPeriodo,
    navegar,
    mudarFiltroStatus,
    handleAdicionarDespesa,
    handleExcluirDespesa,
    handleMarcarComoPago,
  };
}