"use client";
import { aparecerToast } from "@/utils/toast";
import { useState, useEffect } from "react";

export default function useVendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarVendedores = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/gerente/vendedores", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setVendedores(data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar vendedores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarVendedor = async (idVendedor, vendedorData) => {
    try {
      const response = await fetch(
        `http://localhost:8080/gerente/vendedores/${idVendedor}/`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(vendedorData),
        }
      );
      console.log(await response.json());
      if (response.ok) {
        await buscarVendedores();
        aparecerToast("Vendedores atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar vendedor:", error);
      aparecerToast("Erro ao salvar vendedor!");
    }
  };

  useEffect(() => {
    buscarVendedores();
  }, []);

  return {
    vendedores,
    loading,
    handleSalvarVendedor,
    buscarVendedores
  };
}
