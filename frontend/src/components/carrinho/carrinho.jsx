"use client";
import CardDemo from "@/components/card-01";
import styles from "./carrinho.module.css";
import { useEffect, useState, useRef } from "react";
import {
  obterCarrinho,
  calcularTotal,
  obterQuantidade,
  limparCarrinho,
  voltarCarrinho,
} from "@/utils/carrinho.js";
import CarrinhoCard from "@/components/carrinho/CarrinhoCard.jsx";
import { BrushCleaning } from "lucide-react";

export default function Carrinho({ isPagamento = false }) {
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(null);
  const [desconto, setDesconto] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [scroll, setScroll] = useState(false);
  const [embalagem, setEmbalagem] = useState(false);

  useEffect(() => {
    setLoading(true);

    const embalagemStorage = JSON.parse(localStorage.getItem("embalagem"));
    setEmbalagem(!!embalagemStorage);

    const checkCarrinho = () => {
      const carrinho = obterCarrinho();
      setCarrinho(carrinho);
      setTotal(calcularTotal());
      setQuantidade(obterQuantidade());
      localStorage.setItem("total", calcularTotal().toFixed(2));
    };

    checkCarrinho();
    setLoading(false);

    window.addEventListener("storage", (e) => {
      if (e.key === "carrinhoAtualizado") checkCarrinho();
    });
    window.addEventListener("carrinhoAtualizado", checkCarrinho);

    return () => {
      window.removeEventListener("storage", checkCarrinho);
      window.removeEventListener("carrinhoAtualizado", checkCarrinho);
    };
  }, []);

  const carrinhoRef = useRef(null);
  const itemRefs = useRef({});

  useEffect(() => {
    const ultimoId = localStorage.getItem("ultimoProdutoAdicionado");
    if (!ultimoId) return;

    const carrinho = carrinhoRef.current;
    const item = itemRefs.current[ultimoId];
    if (!carrinho || !item) return;

    carrinho.scrollTo({
      top: item.offsetTop - carrinho.offsetHeight / 2 + item.offsetHeight / 10,
      behavior: "smooth",
    });

    setScroll(carrinho.scrollHeight > carrinho.clientHeight);
  }, [carrinho]);

  function animateBrush() {
    const el = document.getElementById("brushElement");
    el.animate([
      { transform: "rotate(0deg)" },
      { transform: "rotate(-40deg)" },
      { transform: "rotate(40deg)" },
      { transform: "rotate(0deg)" },
    ], { duration: 800, easing: "ease-in-out" });
  }

  const handleResetarCarrinho = () => {
    animateBrush();
    setTimeout(limparCarrinho, 400);
  };

  return (
    <div
      className={`hidden lg:grid grid-cols-7 
      ${isPagamento ? "h-[96vh]" : "md:h-[100%]"}`}
    >

      {/* 🟣 CARRINHO */}
      <div className="flex col-span-5 bg-[#E5B8F1] border-[3px] border-dashed border-[#B478AB] rounded-[50px] text-[#8c3e82] text-sm font-semibold p-5 min-h-full">

        <div className={`flex w-full h-full ${isPagamento ? "max-h-[480]" : ""} flex-col gap-3`}>

          {/* HEADER */}
          <div className="flex justify-between w-full px-3 h-1/12 2xl:h-1/15">
            <div className="flex flex-row gap-2 items-center">
              <i className="bi bi-cart4 text-[20px]"></i>
              <p>Carrinho</p>
            </div>

            <BrushCleaning
              size={20}
              id="brushElement"
              onClick={handleResetarCarrinho}
              className={`${carrinho.length === 0 ? "opacity-30 pointer-events-none" : "cursor-pointer"}`}
            />
          </div>

          <div
            ref={carrinhoRef}
            id="carrinho"
            className={`flex flex-col gap-3 overflow-y-scroll px-1 flex-1 overflow-hidden
            ${scroll ? "pe-6" : "pe-1"} 
            ${isPagamento ? "max-h-[50vh]" : "h-[60vh]"}
          `}>
            {loading ? (
              <h3>Carregando...</h3>
            ) : carrinho.length === 0 ? (
              <p>Adicione produtos no baú da felicidade!</p>
            ) : (
              carrinho.map((p) => (
                <CarrinhoCard
                  key={p.id_produto}
                  produto={p}
                  ref={(el) => (itemRefs.current[p.id_produto] = el)}
                />
              ))
            )}
          </div>

          {/* TOTAL + BOTÃO */}
          <div className={`flex flex-col gap-2 mt-auto ${isPagamento ? "h-2/12" : ""}`}>
            <CardDemo
              quantidade={quantidade}
              subtotal={total}
              desconto={desconto}
              setDesconto={setDesconto}
            />

            <div className="bg-[#c5ffad] border-[3px] border-dashed border-[#75ba51] rounded-[50px] py-2 px-5">
              <h3>
                Total: R$
                {embalagem
                  ? (total * (1 - desconto / 100) + 1.5).toFixed(2).replace(".", ",")
                  : (total * (1 - desconto / 100)).toFixed(2).replace(".", ",")}
              </h3>
            </div>

            {!isPagamento && (
              <button
                onClick={() => (window.location.href = "/vendedor/pagamento")}
                className="bg-[#65745A] text-[#caf4b7] py-3 rounded-[40px]">
                Avançar para pagamento
              </button>
            )}
          </div>

        </div>
      </div>

      {/* IMAGEM LATERAL */}
      <div className="col-span-2 flex items-center">
        <img src="/img/pdv/carrinho_criancas.png" className="pr-3" />
      </div>
    </div>
  );
}
