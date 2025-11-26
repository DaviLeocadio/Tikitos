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
    <div className="flex flex-col min-h-screen">
      <CarrinhoSidebar isPagamento={true} />
      
      {/* Container principal com altura calculada */}
      <div className="flex-1 flex flex-col lg:pb-20">
        <div className="grid gap-5 grid-cols-1 lg:grid-cols-2 flex-1 px-5 pt-5">
          {/* Coluna de Pagamento */}
          <div className="flex flex-col border-[3px] border-dashed border-[#B478AB] rounded-[50px] bg-[#c5ffad] p-5 lg:p-10 overflow-y-auto">
            <header className="flex py-3 items-center gap-2 flex-shrink-0">
              <div className="lg:hidden">
                <SidebarTrigger />
              </div>
              <Link
                href={"/vendedor/pdv"}
                className="text-[#569a33] font-bold flex items-center transition hover:bg-verdefundo rounded-sm px-2 py-1"
              >
                <ChevronLeft size={20} />
                <span className="hidden sm:inline">Voltar</span>
              </Link>
            </header>

            {/* Container de pagamento com scroll */}
            <div className="flex-1 overflow-y-auto">
              <PagamentoContainer />
            </div>
          </div>

          {/* Coluna do Carrinho - Desktop apenas */}
          <div className="hidden lg:flex items-start">
            <Carrinho isPagamento={true} />
          </div>
        </div>
      </div>

      {/* Atalhos fixos na parte inferior */}
      <div className="lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:z-10 px-17 py-5">
        <AtalhosDiv />
      </div>
    </div>
  );
}