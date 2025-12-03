"use client";
import CardProduto from "@/components/cards/cardProdutos.jsx";
import AtalhosDiv from "@/components/atalhos/atalhosDiv";
import InputWithAdornmentDemo from "@/components/input-07";
import Carrinho from "@/components/carrinho/carrinho";
import CarrinhoSidebar from "@/components/carrinho/carrinho-sidebar";
import { voltarCarrinho } from "@/utils/carrinho.js";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import Fuse from "fuse.js";
import { setCookie, getCookie, deleteCookie } from "cookies-next/client";
import { CardProdutoSkeleton } from "@/components/cards/cardProdutoEskeleton";



export default function PDV() {
  const [query, setQuery] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produtosAtivos, setProdutosAtivos] = useState([]);
  const [produtosInativos, setProdutosInativos] = useState([]);

  // Atalhos
  const handleKeyDown = async (event) => {
    if (event.keyCode === 113) return voltarCarrinho(listaProdutos);
  };

  useEffect(() => {
    const abrirCaixa = async () => {
      const response = await fetch("http://localhost:8080/vendedor/caixa", {
        method: "POST",
        credentials: "include",
        headers: { "Content-type": "application/json" },
      });

      if (response.status == 403) return (window.location.href = "/forbidden");
      if (response.status == 404) return;

      if (response.ok) {
        const data = await response.json();
        return setCookie("idCaixa", Number(data.novoCaixa));
      }
    };

    const idCaixa = getCookie("idCaixa");

    if (!idCaixa) {
      abrirCaixa();
    }

    const buscarProdutos = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:8080/vendedor/produtos", {
        method: "GET",
        credentials: "include",
        headers: { "Content-type": "application/json" },
      });

      if (response.status == 403) return (window.location.href = "/forbidden");
      if (response.status == 404) {
        setLoading(false);
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setListaProdutos(data.produtosFormatados);
        setLoading(false);
      }
    };

    
    buscarProdutos();
  }, []);

  useEffect(() => {
    setProdutos(listaProdutos.map((p) => ({ item: p, matches: [] })));
    const produtosAtivos = listaProdutos.filter((p) => p.status === "ativo");
    const produtosInativos = listaProdutos.filter(
      (p) => p.status === "inativo"
    );
    setProdutosInativos(produtosInativos);
    setProdutosAtivos(produtosAtivos);
  }, [listaProdutos]);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setProdutos(listaProdutos.map((p) => ({ item: p, matches: [] })));
      return;
    }
    const fuse = new Fuse(listaProdutos, {
      keys: [
        { name: "id_produto", weight: 0.5 },
        { name: "nome", weight: 0.3 },
        { name: "categoria", weight: 0.25 },
        { name: "descricao", weight: 0.2 },
      ],
      // includeMatches: true,
      threshold: 0.2,
      ignoreLocation: true,
    });

    const resultado = fuse.search(query);
    setProdutos(
      resultado.map((r) => ({
        item: r.item,
        matches: r.matches,
      }))
    );

    const produtosAtivos = produtos.filter((p) => p.status === "ativo");
    const produtosInativos = produtos.filter(
      (p) => p.status === "inativo"
    );
    setProdutosInativos(produtosInativos);
    setProdutosAtivos(produtosAtivos);

  }, [query, listaProdutos]);

  // Config Atalhos
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [listaProdutos]);

  function renderProdutos(produtosEscolhidos) {
    if (!produtosEscolhidos || produtosEscolhidos.length === 0) {
      return null;
    }

    return produtosEscolhidos.map((produto) => {
      return (
        <CardProduto key={produto.id_produto} produto={produto}></CardProduto>
      );
    });
  }

  // Verifica se não há produtos
  const nenhumProdutoEncontrado =
    !loading && produtosAtivos.length === 0 && produtosInativos.length === 0;

  return (
    <>
      <CarrinhoSidebar />
      <div className="h-screen w-full flex flex-col">
        <div className="h-9/10 2xl:h-11/12 w-full mt-5">
          <div className="flex md:h-[100%] pt-0">
            <div className="mx-5 w-full xl:w-4/5 2xl:w-3/4 h-[90%]">
              <div className="flex m-5 mt-0 gap-2 items-center">
                <SidebarTrigger />
                <InputWithAdornmentDemo
                  query={query}
                  setQuery={setQuery}
                ></InputWithAdornmentDemo>
              </div>

              <div className="grid gap-5 grid-cols-1 x-sm:grid-cols-1 sm:grid-cols-1 md:grid-cols-1">
                <div className="grid gap-5 grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 overflow-y-scroll p-5 pt-0 ms-1 sm:h-[60vh] md:h-[74vh] wrap-anywhere">
                  {loading ? (
                    // Loading com Skeleton
                    <>
                      <div className="col-span-full flex items-center gap-2 text-[#b478ab] font-bold text-lg mb-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#b478ab]"></div>
                        <span>Carregando produtos...</span>
                      </div>
                      {[...Array(6)].map((_, index) => (
                        <CardProdutoSkeleton key={index} />
                      ))}
                    </>
                  ) : nenhumProdutoEncontrado ? (
                    // Nenhum produto encontrado
                    <div className="col-span-full flex flex-col items-center justify-center text-center gap-4 py-20">
                      <i className="bi bi-inbox text-6xl text-[#b478ab] opacity-50"></i>
                      <div>
                        <h3 className="text-xl font-bold text-[#76196c]">
                          Nenhum produto encontrado
                        </h3>
                        <p className="text-[#8c3e82] mt-2">
                          {query
                            ? `Não encontramos produtos com "${query}"`
                            : "Não há produtos cadastrados no momento"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Lista de produtos
                    <>
                      {renderProdutos(produtosAtivos)}
                      {renderProdutos(produtosInativos)}
                    </>
                  )}
                </div>
              </div>
            </div>
            <Carrinho />
          </div>
        </div>
        <div className="h-1/9 2xl:h-1/12 px-10 pb-1 flex items-center w-ful">
          <AtalhosDiv></AtalhosDiv>
        </div>
      </div>
    </>
  );
}
