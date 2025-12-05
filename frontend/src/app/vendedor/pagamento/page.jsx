"use client";
import AtalhosDiv from "@/components/atalhos/atalhosDiv";
import Carrinho from "@/components/carrinho/carrinho";
import PagamentoContainer from "@/components/pagamento/PagamentoContainer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import CarrinhoSidebar from "@/components/carrinho/carrinho-sidebar";

export default function Pagamento() {
  return (
    <>
      <div className="flex flex-col min-h-screen scale-[0.90] origin-top"> {/* >>> redução proporcional */}
        <CarrinhoSidebar isPagamento={true} />

        {/* Container principal reduzido */}
        <div className="flex-1 flex flex-col pb-10 lg:pb-16">
          <div className="grid gap-3 grid-cols-1 lg:grid-cols-2 flex-1 px-4 pt-4">
            
            {/* ========================== Coluna Pagamento ========================== */}
            <div className="flex flex-col border-[2px] border-dashed border-[#B478AB] rounded-[35px] bg-[#c5ffad] p-4 lg:p-6 overflow-y-auto text-sm">
              
              <header className="flex py-2 items-center gap-2 flex-shrink-0">
                <div className="lg:hidden">
                  <SidebarTrigger />
                </div>
                <Link
                  href={"/vendedor/pdv"}
                  className="text-[#569a33] font-bold flex items-center gap-1 transition hover:bg-verdefundo rounded px-1.5 py-0.5"
                >
                  <ChevronLeft size={17} />
                  <span className="hidden sm:inline">Voltar</span>
                </Link>
              </header>

              <PagamentoContainer />
            </div>

            {/* ========================== Coluna Carrinho (Desktop) ========================== */}
            <div className="hidden lg:flex items-start text-sm">
              <Carrinho isPagamento={true} />
            </div>

          </div>
        </div>

        {/* Atalhos fundo */}
        <div className="lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:z-10 px-10 py-3">
          <AtalhosDiv />
        </div>
      </div>
    </>
  );
}
