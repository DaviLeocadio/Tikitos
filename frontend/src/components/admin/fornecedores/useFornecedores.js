"use client";
import { aparecerToast } from "@/utils/toast";
import { useState, useEffect } from "react";

export default function useFornecedores() {
  // Inicializa com array vazio para evitar erro de .filter na renderização inicial
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Função de Busca ---
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
        
        // BLINDAGEM: Verifica o formato da resposta
        if (Array.isArray(data)) {
            setFornecedores(data);
        } else if (data && Array.isArray(data.fornecedores)) {
            // Caso a API retorne { fornecedores: [...] }
            setFornecedores(data.fornecedores);
        } else if (data && Array.isArray(data.data)) {
             // Caso a API retorne { data: [...] }
            setFornecedores(data.data);
        } else {
            console.warn("API retornou formato inesperado:", data);
            setFornecedores([]); // Garante array vazio em caso de formato estranho
        }
      } else {
        console.error("Erro na resposta da API:", response.status);
        setFornecedores([]);
      }
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      setFornecedores([]);
    } finally {
      setLoading(false);
    }
  };

  // --- Função de Salvar (Criação e Edição) ---
  const handleSalvarFornecedor = async (fornecedorData) => {
    try {
      // Verifica se existe ID para decidir o método
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
        await buscarFornecedores(); // Recarrega a lista
        aparecerToast(id ? "Fornecedor atualizado!" : "Fornecedor cadastrado!", "success");
        return true; // Retorna true para fechar o modal
      } else {
        aparecerToast(result.error || "Erro ao salvar fornecedor.", "error");
        return false;
      }
    } catch (error) {
      console.error("Erro ao salvar:", error);
      aparecerToast("Erro de conexão ao salvar.", "error");
      return false;
    }
  };

  // --- Função de Excluir ---
  const handleExcluirFornecedor = async (idFornecedor) => {
    try {
      const response = await fetch(
        `http://localhost:8080/admin/fornecedores/${idFornecedor}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        await buscarFornecedores();
        aparecerToast("Fornecedor removido com sucesso!", "success");
      } else {
        const err = await response.json();
        aparecerToast(err.error || "Erro ao excluir fornecedor.", "error");
      }
    } catch (error) {
      console.error("Erro ao excluir:", error);
      aparecerToast("Erro de conexão ao excluir.", "error");
    }
  };

  // Carrega lista ao montar
  useEffect(() => {
    buscarFornecedores();
  }, []);

  return {
    fornecedores, // Garantido ser um array
    loading,
    buscarFornecedores,
    handleSalvarFornecedor,
    handleExcluirFornecedor
  };
}   