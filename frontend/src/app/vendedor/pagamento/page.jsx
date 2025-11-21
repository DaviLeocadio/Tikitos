
import AtalhosDiv from "@/components/atalhos/atalhosDiv";
import Carrinho from "@/components/carrinho/carrinho";
import PagamentoContainer from "@/components/pagamento/PagamentoContainer";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Pagamento() {
  return (
    <>
      <div className="flex lg:h-[87vh] 2xl:h-[90vh]">
        <div className=" border-[3px] border-dashed border-[#B478AB] rounded-[50px] bg-[#c5ffad] p-10 m-5 w-3/4 min-h-[80vh]">
          <header className="flex py-5 items-center">
            <SidebarTrigger />
            <Link href={"/vendedor/pdv"} className="text-[#569a33] font-bold flex transition hover:bg-verdefundo rounded-sm pe-4">
              <ChevronLeft />
              Voltar
            </Link>
          </header>

          <PagamentoContainer/>

        </div>
        <Carrinho isPagamento={true} />
      </div>
      <AtalhosDiv/>
    </>
  );
}
