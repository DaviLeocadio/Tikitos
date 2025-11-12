"use client";
import CardProdutos from "@/components/cards/cardProdutos.jsx";
import { useEffect, useState, use } from "react";

export default function PDV() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const buscarProdutos = async () => {
      fetch("http://localhost:8080/vendedor/produtos", {
        method: "GET",
        credentials: "include",
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => setProdutos(data.produtosFormatados || []))
        .catch((err) => console.error("Erro ao buscar os produtos", err));
    };

    buscarProdutos();
    console.log(produtos)
  }, []);
  return (
    <>
      <div className="grid gap-5 grid-cols-2 md:grid-cols-2 ">
        <div className="grid gap-5 grid-cols-2 md:grid-cols-2 overflow-y-scroll max-h-110 p-5">
          {produtos && produtos.length > 0 ? (
            produtos.map((produto, index) => {
              return (
                <div key={index}>
                  <CardProdutos produtos={produto}></CardProdutos>
                </div>
              );
            })
          ) : (
            <p>Nenhum produto</p>
          )}
        </div>
      </div>
      
    </>
  );
}
