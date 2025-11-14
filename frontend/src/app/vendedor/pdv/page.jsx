"use client";
import CardProduto from "@/components/cards/cardProdutos.jsx";
import AtalhosDiv from "@/components/atalhos/atalhosDiv";
import InputWithAdornmentDemo from "@/components/input-07";
import Carrinho from "@/components/carrinho/carrinho";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";

export default function PDV() {
  const [query, setQuery] = useState('')
  const [produtos, setProdutos] = useState([]);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    const buscarProdutos = async () => {
      setLoading(true)
      fetch("http://localhost:8080/vendedor/produtos", {
        method: "GET",
        credentials: "include",
        headers: { "Content-type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => setListaProdutos(data.produtosFormatados || []))
        .catch((err) => console.error("Erro ao buscar os produtos", err))
        .finally(() => setLoading(false))
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
        { name: 'descricao', weight: 0.2 }
      ],
      includeMatches: true,
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


  return (
    <>
      <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
        <div className="">
          <div className="grid gap-5 grid-cols-1 md:grid-cols-1">
            <div className="flex m-5 gap-2 items-center">
              <SidebarTrigger />
              <InputWithAdornmentDemo query={query} setQuery={setQuery}></InputWithAdornmentDemo>
            </div>
          </div>

          <div className="grid gap-5 grid-cols-1 x-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-1 ">
            <div className="grid gap-5 grid-cols-1 x-sm:grid-cols- sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 overflow-y-scroll lg:max-h-108 p-5 pt-0 ms-1">
              {loading ? (
                <h1>Loading</h1>
              ) : produtos && produtos.length === 0 && !loading ? (
                "Nenhum produto encontrado"
              ) : (produtos.map((produto) => (
                <CardProduto
                  key={produto.item.id_produto}
                  produto={produto.item}
                  match={produto.matches}
                ></CardProduto>
                // <h1> corinthians</h1>
              ))
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center content-center">
          <div className="flex items-center content-center">
            <Carrinho></Carrinho>
          </div>
        </div>
      </div>

      <AtalhosDiv></AtalhosDiv>
    </>
  );
}
