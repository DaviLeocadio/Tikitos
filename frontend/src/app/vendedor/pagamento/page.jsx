"use client";

"use client";
import PagamentoContainer from "@/components/pagamento/PagamentoContainer";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
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

export default function Pagamento() {
  const [query, setQuery] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [produtosAtivos, setProdutosAtivos] = useState([]);
  const [produtosInativos, setProdutosInativos] = useState([]);
  const [sidebarStatus, setSidebarStatus] = useState(false);

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
        console.log(data)
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
    setProdutos(listaProdutos);
    const produtosAtivos = listaProdutos.filter((p) => p.status === "ativo");
    const produtosInativos = listaProdutos.filter((p) => p.status === "inativo");

    setProdutosInativos(produtosInativos);
    setProdutosAtivos(produtosAtivos);
  }, [listaProdutos]);

  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setProdutos(listaProdutos);
      const produtosAtivos = listaProdutos.filter((p) => p.status === "ativo");
      const produtosInativos = listaProdutos.filter((p) => p.status === "inativo");
      setProdutosInativos(produtosInativos);
      setProdutosAtivos(produtosAtivos);
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
    const encontrados = resultado.map((r) => r.item);
    setProdutos(encontrados);

    const produtosAtivos = encontrados.filter((p) => p.status === "ativo");
    const produtosInativos = encontrados.filter((p) => p.status === "inativo");
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

  const handleSidebar = () => {
    const sidebarIsOpen = getCookie('sidebar_state')
    setSidebarStatus(sidebarIsOpen);
  }

  useEffect(() => {
    handleSidebar
  }, [])

  return (
    <>
      <CarrinhoSidebar />
      
      <div className=" w-full flex flex-col h-auto lg:max-h-[96vh] mb-8 pb-10">
        <div className="w-full mt-3 mb-9">
          <div className="flex pt-0 h-auto lg:max-h-[96vh]">
            <div className="mx-5 w-full xl:w-4/5 2xl:w-3/4 ">

              <div className="flex min-w-full">
                <div className="flex w-full flex-col h-auto lg:max-h-[96vh] border-[3px] border-dashed border-[#B478AB] rounded-[50px] bg-[#c5ffad] py-5">

                  {/* Conteúdo reduzido internamente */}
                  <div className={ `text-[0.90rem] leading-tight px-10 py-3 pb-8 origin-top sm:scale-[0.88] sm:p-0 `}>
                    <header className="flex py-2 items-center gap-1 flex-shrink-0">
{/* 
                      <div className="lg:hidden" onClick={handleSidebar}>
                        <SidebarTrigger />
                      </div> */}

                      <SidebarTrigger />

                      <Link
                        href={"/vendedor/pdv"}
                        className="text-[#569a33] font-semibold flex items-center transition hover:bg-verdefundo rounded-sm px-1 py-0.5"
                      >
                        <ChevronLeft size={18} />
                        <span className="hidden sm:inline">Voltar</span>
                      </Link>
                    </header>

                    <PagamentoContainer />
                  </div>
                </div>
              </div>
            </div>
            <Carrinho isPagamento={true} />
          </div>
        </div>
        {/* <div className="h-1/9 2xl:h-1/12 px-10 pb-1 flex items-center w-ful">
          <AtalhosDiv></AtalhosDiv>
        </div> */}
      </div>
    </>
  );
}
