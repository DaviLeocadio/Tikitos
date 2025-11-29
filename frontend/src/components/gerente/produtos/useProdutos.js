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
      const response = await fetch("http://localhost:8080/gerente/produtos", {
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

  const handleSalvarDesconto = async (idProduto, desconto) => {
    try {
      const response = await fetch(
        `http://localhost:8080/gerente/produtos/${idProduto}/`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ desconto }),
        }
      );
      console.log(await response.json())
      if (response.ok) {
        await buscarProdutos();
        aparecerToast("Desconto atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar desconto:", error);
      aparecerToast("Erro ao salvar desconto!");
    }
  };

  const handleFazerPedido = async (idProduto, idFornecedor, quantidade) => {
    try {
      const response = await fetch("http://localhost:8080/gerente/pedidos", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_produto: idProduto,
          id_fornecedor: idFornecedor,
          quantidade,
        }),
      });

      if (response.ok) {
        await buscarProdutos();
        aparecerToast("Pedido realizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao fazer pedido:", error);
      aparecerToast("Erro ao fazer pedido!");
    }
  };

  useEffect(() => {
    buscarProdutos();
  }, []);

  return {
    produtos,
    categorias,
    loading,
    handleSalvarDesconto,
    handleFazerPedido,
  };
}
