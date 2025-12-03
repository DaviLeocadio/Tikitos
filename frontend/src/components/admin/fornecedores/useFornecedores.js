"use client";
import { aparecerToast } from "@/utils/toast";
import { useState, useEffect } from "react";

export default function useFornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Buscar Lista ---
  const buscarFornecedores = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/admin/fornecedores", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        // Garante que seja um array para não quebrar o map
        setFornecedores(data || []);
      } else {
        console.error("Falha na resposta da API");
      }
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      aparecerToast("Erro ao carregar lista de fornecedores.", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Salvar (Criar ou Editar) ---
  const handleSalvarFornecedor = async (fornecedorData) => {
    try {
      // Verifica se existe ID para decidir entre CRIAR (POST) ou EDITAR (PUT)
      const id = fornecedorData.id_fornecedor;
      const method = id ? "PUT" : "POST";
      const url = id 
        ? `http://localhost:8080/admin/fornecedores/${id}`
        : `http://localhost:8080/admin/fornecedores`;

      const response = await fetch(url, {
        method: method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedorData),
      });

      const result = await response.json();

      if (response.ok) {
        await buscarFornecedores(); // Atualiza a lista
        aparecerToast(id ? "Fornecedor atualizado!" : "Fornecedor cadastrado com sucesso!", "success");
        return true; // Retorna sucesso para fechar o modal
      } else {
        aparecerToast(result.error || "Erro ao salvar fornecedor.", "error");
        return false;
      }
    } catch (error) {
      console.error("Erro ao salvar fornecedor:", error);
      aparecerToast("Erro de conexão ao salvar.", "error");
      return false;
    }
  };

  // --- Excluir / Desativar ---
  const handleExcluirFornecedor = async (idFornecedor) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/fornecedores/${idFornecedor}`,
        {
          method: "DELETE", // Ou PUT se for apenas mudar status para inativo
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        await buscarFornecedores();
        aparecerToast("Fornecedor removido/desativado com sucesso!", "success");
      } else {
        aparecerToast("Erro ao excluir fornecedor.", "error");
      }
    } catch (error) {
      console.error("Erro ao excluir fornecedor:", error);
      aparecerToast("Erro de conexão ao excluir.", "error");
    }
  };

  // Carrega ao montar o componente
  useEffect(() => {
    buscarFornecedores();
  }, []);

  return {
    fornecedores,
    loading,
    buscarFornecedores,
    handleSalvarFornecedor,
    handleExcluirFornecedor
  };
}