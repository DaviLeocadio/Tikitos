"use client";
import CardProduto from "@/components/cards/cardProdutos.jsx";
import AtalhosDiv from "@/components/atalhos/atalhosDiv";
import InputWithAdornmentDemo from "@/components/input-07";
import Carrinho from "@/components/carrinho/carrinho";
import CarrinhoSidebar from "@/components/carrinho/carrinho-sidebar";
import { voltarCarrinho } from "@/utils/carrinho.js";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";

import { deleteCookie } from "cookies-next/client";

export default function PDV() {
  const [query, setQuery] = useState('')
  const [produtos, setProdutos] = useState([]);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [loading, setLoading] = useState(false)


  // Atalhos
  const handleKeyDown = async (event) => {
    if (event.keyCode === 27) {
      const response = await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        deleteCookie("nome");
        deleteCookie("email");
        deleteCookie("perfil");
        deleteCookie("empresa");

        return (window.location.href = "/");
      }
    }

    if (event.keyCode === 115)
      return (window.location.href = "/vendedor/suporte");

    if (event.keyCode === 113) return voltarCarrinho(produtos);
  };

  useEffect(() => {
    const buscarProdutos = async () => {
      setLoading(true)
      const response = await fetch("http://localhost:8080/vendedor/produtos", {
        method: "GET",
        credentials: "include",
        headers: { "Content-type": "application/json" },
      });

      if (response.status == 403) return (window.location.href = "/forbidden");
      if (response.status == 404) return;

      if (response.ok) {
        const data = await response.json();
        return setProdutos(data.produtosFormatados);
      }
    };
    buscarProdutos();
  }, []);

  useEffect(() => {
    setProdutos(listaProdutos.map(p => ({ item: p, matches: [] })));
  }, [listaProdutos])

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setProdutos(listaProdutos.map(p => ({ item: p, matches: [] })));
      return
    }
    const fuse = new Fuse(listaProdutos, {
      keys: [
        { name: 'id_produto', weight: 0.5 },
        { name: 'nome', weight: 0.3 },
        { name: 'categoria', weight: 0.25 },
        { name: 'descricao', weight: 0.2 }
      ],
      // includeMatches: true,
      threshold: 0.2,
      ignoreLocation: true,
    });


    const resultado = fuse.search(query);
    setProdutos(
      resultado.map(r => ({
        item: r.item,
        matches: r.matches
      }))
    );

  }, [query, listaProdutos]);



  // Config Atalhos
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [produtos]);

  function renderProdutos(produtosEscolhidos) {
    return produtosEscolhidos && produtosEscolhidos.length > 0
      ? produtosEscolhidos.map((produto) => {
          return (
            <CardProduto
              key={produto.id_produto}
              produto={produto}
            ></CardProduto>
          );
        })
      : "Nenhum produto encontrado";
  }

  const produtosAtivos = produtos.filter((p) => p.status == "ativo");
  const produtosInativos = produtos.filter((p) => p.status == "inativo");
  return (
    <>
    <CarrinhoSidebar />
      <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
        <div className="">
          <div className="grid gap-5 grid-cols-1 md:grid-cols-1">
            <div className="flex m-5 gap-2 items-center">
              <SidebarTrigger />
              <InputWithAdornmentDemo query={query} setQuery={setQuery}></InputWithAdornmentDemo>
            </div>
          </div>

          <div className="grid gap-5 grid-cols-1 x-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-1">
            <div className="grid gap-5 grid-cols-1 x-sm:grid-cols- sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 overflow-y-scroll max-h-108 p-5 pt-0 ms-1">
              {renderProdutos(produtosAtivos)}
              {renderProdutos(produtosInativos)}
            </div>
          </div>
        </div>
        <div className="hidden lg:flex items-center content-center">
          <div className="flex items-center content-center">
            <Carrinho></Carrinho>
          </div>
        </div>
      </div>

      <AtalhosDiv></AtalhosDiv>
    </>
  );
}
