"use client";
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

  

  useEffect(() => {
    buscarVendedores();
  }, []);

  return {
    vendedores,
    loading,
  };
}
