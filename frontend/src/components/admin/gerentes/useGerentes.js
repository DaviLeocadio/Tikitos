"use client";
import { aparecerToast } from "@/utils/toast";
import { useState, useEffect } from "react";

export default function useVendedores() {
  const [gerentes, setGerentes] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarGerentes = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/admin/gerentes", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setGerentes(data.gerentes || []);
      }
    } catch (error) {
      console.error("Erro ao buscar vendedores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarGerente = async (idGerente, gerenteData) => {
    try {
      console.log(idGerente, gerenteData)
      const response = await fetch(
        `http://localhost:8080/admin/gerentes/${idGerente}/`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(gerenteData),
        }
      );
      console.log(await response.json());
      if (response.ok) {
        await buscarGerentes()
        aparecerToast("Vendedores atualizados com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar vendedor:", error);
      aparecerToast("Erro ao salvar vendedor!");
    }
  };

  useEffect(() => {
    buscarGerentes();
  }, []);

  return {
    gerentes,
    loading,
    handleSalvarGerente,
    buscarGerentes,
  };
}
