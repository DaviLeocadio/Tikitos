"use client";

import { useEffect, useRef, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
} from "@/components/ui/sheet";

import {
  obterCarrinho,
  calcularTotal,
  obterQuantidade,
  limparCarrinho,
} from "@/utils/carrinho.js";

import CarrinhoCard from "@/components/carrinho/CarrinhoCard.jsx";
import CardDemo from "@/components/card-01";

export default function CarrinhoSidebar() {
  const [open, setOpen] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(null);
  const [desconto, setDesconto] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [scroll, setScroll] = useState(false);

  const carrinhoRef = useRef(null);
  const itemRefs = useRef({});

  const atualizarCarrinho = () => {
    const c = obterCarrinho();
    setCarrinho(c);
    setTotal(calcularTotal());
    setQuantidade(obterQuantidade());
  };

  // Atualiza quando abre
  useEffect(() => {
    atualizarCarrinho();
  }, [open]);

  useEffect(() => {
    atualizarCarrinho();
  }, []);

  // Eventos entre abas
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "carrinhoAtualizado") atualizarCarrinho();
    };
    const handleCustom = () => atualizarCarrinho();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("carrinhoAtualizado", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("carrinhoAtualizado", handleCustom);
    };
  }, []);

  useEffect(() => {
    const ultimoId = localStorage.getItem("ultimoProdutoAdicionado");
    if (!ultimoId) return;
    const carrinhoEl = carrinhoRef.current;
    const item = itemRefs.current[ultimoId];
    if (!carrinhoEl || !item) return;

    // const itemOffsetTop = item.offsetTop;
    // const itemHeight = item.offsetHeight;
    // const carrinhoHeight = carrinhoEl.offsetHeight;
    // const scrollTop = itemOffsetTop - carrinhoHeight / 2 + itemHeight / 2;

    // carrinhoEl.scrollTo({ top: scrollTop, behavior: "smooth" });
    // const carrinhoElement = document.getElementById("carrinho");
    
    if (carrinhoEl.scrollHeight > carrinhoEl.clientHeight) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  }, [carrinho]);

  const handleResetarCarrinho = () => limparCarrinho();

  return (
    <>
      {/* BOTÃO FLUTUANTE PARA MOBILE */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-8 right-8 z-[500] 
          bg-[#9bf377] text-[#924187]
          rounded-full shadow-xl
          w-16 h-16 flex justify-center items-center
          text-3xl font-bold
          border-4 border-[#75ba51]
          lg:hidden
        "
      >
        <i className="bi bi-cart4"></i>
      </button>

      {/* SIDEBAR DO CARRINHO */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="
          bg-[#E5B8F1]
          border-[3px] border-dashed border-[#B478AB]
          text-[#8c3e82]
          p-4
          w-[90%] sm:w-[22rem]
          flex flex-col
          [&>button]:hidden
        "
        >
          <SheetHeader className="relative z-0">
            <SheetTitle className="text-[#8c3e82] flex justify-between items-center">
              <span className="flex items-center gap-2">
                <i className="bi bi-cart4 text-[22px]"></i>
                Carrinho
              </span>

              <i
                className={`bi bi-arrow-repeat text-[25px] cursor-pointer`}
                onClick={handleResetarCarrinho}
              ></i>
            </SheetTitle>
          </SheetHeader>

          {/* LISTA DO CARRINHO */}
          <div
            ref={carrinhoRef}
            id="carrinho"
            className={`flex flex-col gap-3 max-h-[55vh] mt-4 overflow-y-scroll ps-2 ${
              scroll ? "pe-4" : "pe-0"
            }`}
          >
            {loading ? (
              <p>Carregando...</p>
            ) : carrinho.length === 0 ? (
              <p>Adicione produtos no baú da felicidade!</p>
            ) : (
              carrinho.map((produto) => (
                <CarrinhoCard
                  key={produto.id_produto}
                  produto={produto}
                  id={produto.id_produto}
                  ref={(el) => (itemRefs.current[produto.id_produto] = el)}
                />
              ))
            )}
          </div>

          <SheetFooter className="p-0">
            {/* RESUMO / TOTAL */}
            <div className="mt-4">
              <CardDemo
                quantidade={quantidade}
                subtotal={total}
                desconto={desconto}
                setDesconto={setDesconto}
              />

              <div className="bg-[#c5ffad] border-[3px] border-dashed border-[#75ba51] rounded-[50px] mt-4 py-2 px-5 text-[#8c3e82] text-sm font-semibold">
                <h3>
                  Total: R${" "}
                  {Number(total * (1 - desconto / 100))
                    .toFixed(2)
                    .replace(".", ",")}
                </h3>
              </div>

              <button className="bg-[#65745A] rounded-[50px] mt-3 py-2 px-5 text-[#caf4b7] text-sm font-semibold w-full h-13 flex gap-3 justify-center items-center transition-all hover:bg-[#74816b]">
                <h3>Avançar para o pagamento</h3>
                <i className="bi bi-arrow-right-circle-fill text-[25px]"></i>
              </button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
