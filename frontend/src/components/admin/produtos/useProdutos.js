"use client";
import { aparecerToast } from "@/utils/toast";
import { useState, useEffect } from "react";

export default function useProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarProdutos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/admin/produtos", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setProdutos(data.produtosFormatados || []);

        // Extrai categorias únicas
        const cats = [...new Set(data.produtosFormatados.map((p) => p.categoria.nome))];
        setCategorias(cats);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditarProduto = async (idProduto, dataProduto) => {
    try {
      let response;

      if (dataProduto instanceof FormData) {
        // enviar multipart/form-data (contém arquivo)
        response = await fetch(`http://localhost:8080/admin/produtos/${idProduto}`, {
          method: 'PUT',
          body: dataProduto,
          credentials: 'include'
        });
      } else {
        response = await fetch(`http://localhost:8080/admin/produtos/${idProduto}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataProduto),
          credentials: 'include'
        });
      }

      if (response.ok) {
        await buscarProdutos();
        aparecerToast("Produto atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
      aparecerToast("Erro ao atualizar produto!");
    }
  }


  useEffect(() => {
    buscarProdutos();
  }, []);

  return {
    produtos,
    categorias,
    loading,
    handleEditarProduto,
    buscarProdutos,
  };
}
