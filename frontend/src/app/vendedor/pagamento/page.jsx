"use client";
import AtalhosDiv from "@/components/atalhos/atalhosDiv";
import Carrinho from "@/components/carrinho/carrinho";
import PagamentoContainer from "@/components/pagamento/PagamentoContainer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";
import { voltarCarrinho } from "@/utils/carrinho";
import Link from "next/link";
import { useEffect, useState } from "react";
import CarrinhoSidebar from "@/components/carrinho/carrinho-sidebar";

export default function Pagamento() {
  return (
    <>
      <CarrinhoSidebar  isPagamento={true} />
      <div className="flex md:h-auto  2xl:h-[90vh] pt-0">
        <div className="py-2 border-[3px] border-dashed border-[#B478AB] rounded-[50px] bg-[#c5ffad] p-10 m-5 w-full lg:w-1/2 2xl:w-3/4 min-h-[80vh]">
          <header className="flex py-5 items-center">
            <SidebarTrigger />
            <Link
              href={"/vendedor/pdv"}
              className="text-[#569a33] font-bold flex transition hover:bg-verdefundo rounded-sm pe-4"
            >
              <ChevronLeft />
              Voltar
            </Link>
          </header>

          <PagamentoContainer />
        </div>
        <Carrinho isPagamento={true} />
      </div>
      <AtalhosDiv />
    </>
  );
}
