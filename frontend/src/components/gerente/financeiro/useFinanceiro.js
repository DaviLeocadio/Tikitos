"use client";
import { aparecerToast } from "@/utils/toast";
import { useState, useEffect, useRef } from "react";

export default function useFinanceiro() {
  const [despesas, setDespesas] = useState([]);
  const [fluxoCaixa, setFluxoCaixa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState("mes");
  const [dataInicio, setDataInicio] = useState(new Date());
  const montadoRef = useRef(false);

  const calcularIntervalo = (periodoAtual, data) => {
    const d = new Date(data);
    let inicio, fim;

    switch (periodoAtual) {
      case "semana":
        // Volta para segunda-feira da semana atual
        const dia = d.getDay();
        const diff = d.getDate() - dia + (dia === 0 ? -6 : 1);
        const dataCopia = new Date(d);
        dataCopia.setDate(diff);
        inicio = new Date(dataCopia);
        fim = new Date(inicio);
        fim.setDate(fim.getDate() + 6);
        break;

      case "mes":
        inicio = new Date(d.getFullYear(), d.getMonth(), 1);
        fim = new Date(d.getFullYear(), d.getMonth() + 1, 0);
        break;

      case "ano":
        inicio = new Date(d.getFullYear(), 0, 1);
        fim = new Date(d.getFullYear(), 11, 31);
        break;

      default:
        inicio = new Date(d.getFullYear(), d.getMonth(), 1);
        fim = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    }

    inicio.setHours(0, 0, 0, 0);
    fim.setHours(23, 59, 59, 999);

    return { inicio, fim };
  };

  const validarData = (periodAtual, dataAtual) => {
    const hoje = new Date();
    hoje.setHours(23, 59, 59, 999);

    const { inicio, fim } = calcularIntervalo(periodAtual, dataAtual);

    // Restrição: não permitir datas futuras (fim não pode ser depois de hoje)
    if (inicio > hoje) {
      aparecerToast("Não é possível visualizar períodos que começam no futuro!");
      return false;
    }

    return true;
  };

  const buscarDados = async (periodoAtual, dataAtual) => {
    // Validar início não esteja no futuro (permite clamping do fim)
    if (!validarData(periodoAtual, dataAtual)) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { inicio: rawInicio, fim: rawFim } = calcularIntervalo(periodoAtual, dataAtual);
      const hoje = new Date();
      hoje.setHours(23, 59, 59, 999);

      // Clamp fim to today to avoid querying future dates (server has no future data)
      const inicio = rawInicio;
      const fim = rawFim > hoje ? hoje : rawFim;

      const queryParams = new URLSearchParams({
        dataInicio: inicio.toISOString().split("T")[0],
        dataFim: fim.toISOString().split("T")[0],
      });

      // Buscar despesas
      const resDespesas = await fetch(
        `http://localhost:8080/gerente/gastos?${queryParams.toString()}`,
        {
          credentials: "include",
        }
      );
      if (resDespesas.ok) {
        const dataRes = await resDespesas.json();
        setDespesas(dataRes.gastos || []);
      } else {
        // Provide better feedback when the request fails (e.g., 403 unauthorized)
        let msg = `Erro ao buscar despesas: ${resDespesas.status}`;
        try {
          const errJson = await resDespesas.json();
          msg += ` - ${errJson.mensagem || errJson.message || JSON.stringify(errJson)}`;
        } catch (e) {}
        console.error(msg);
        aparecerToast("Erro ao buscar despesas. Verifique autenticação.");
        setDespesas([]);
      }

      // Buscar fluxo de caixa
      const resFluxo = await fetch(
        `http://localhost:8080/gerente/caixa?${queryParams.toString()}`,
        {
          credentials: "include",
        }
      );
      if (resFluxo.ok) {
        const dataRes = await resFluxo.json();
        setFluxoCaixa(dataRes.caixaData || []);
      } else {
        let msg = `Erro ao buscar fluxo de caixa: ${resFluxo.status}`;
        try {
          const errJson = await resFluxo.json();
          msg += ` - ${errJson.mensagem || errJson.message || JSON.stringify(errJson)}`;
        } catch (e) {}
        console.error(msg);
        setFluxoCaixa([]);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
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
        {
          method: "DELETE",
          credentials: "include",
        }
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
            data_pag: new Date().toISOString().split("T")[0],
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
    setPeriodo(novoPeriodo);
    buscarDados(novoPeriodo, dataInicio);
  };

  const navegar = (direcao) => {
    const novaData = new Date(dataInicio);

    switch (periodo) {
      case "semana":
        novaData.setDate(novaData.getDate() + direcao * 7);
        break;
      case "mes":
        novaData.setMonth(novaData.getMonth() + direcao);
        break;
      case "ano":
        novaData.setFullYear(novaData.getFullYear() + direcao);
        break;
    }

    setDataInicio(novaData);
    buscarDados(periodo, novaData);
  };

  useEffect(() => {
    // Carregar dados apenas uma vez na montagem
    if (!montadoRef.current) {
      montadoRef.current = true;
      const hoje = new Date();
      buscarDados("mes", hoje);
    }
  }, []);

  useEffect(() => {
    console.log(despesas)
  }, [despesas, fluxoCaixa])

  return {
    despesas,
    fluxoCaixa,
    loading,
    periodo,
    dataInicio,
    buscarDados,
    handleAdicionarDespesa,
    handleExcluirDespesa,
    handleMarcarComoPago,
    mudarPeriodo,
    navegar,
  };
}
