import CardDemo from "@/components/card-01";
import styles from "./carrinho.module.css";
import { useEffect, useState, useRef } from "react";
import {
  obterCarrinho,
  calcularTotal,
  obterQuantidade,
  limparCarrinho,
  voltarCarrinho
} from "@/utils/carrinho.js";
import CarrinhoCard from "@/components/carrinho/CarrinhoCard.jsx";
import { BrushCleaning } from "lucide-react";

export default function Carrinho() {
  const [carrinho, setCarrinho] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(null);
  const [desconto, setDesconto] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [scroll, setScroll] = useState(false);

  // Atalhos
  const handleKeyDown = (event) => {
    if (event.keyCode === 45) return limparCarrinho();
    if(event.keyCode === 113) return voltarCarrinho(carrinho);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    setLoading(true);
    const checkCarrinho = () => {
      const carrinho = obterCarrinho();
      setCarrinho(carrinho);
      setTotal(calcularTotal());
      setQuantidade(obterQuantidade());
    };

    checkCarrinho();
    setLoading(false);

    const handleStorage = (e) => {
      // Atualiza ao mudar entre abas
      if (e.key === "carrinhoAtualizado") checkCarrinho();
    };

    const handleCustom = () => checkCarrinho(); // Atualiza na mesma aba

    window.addEventListener("storage", handleStorage);
    window.addEventListener("carrinhoAtualizado", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("carrinhoAtualizado", handleCustom);
      document.removeEventListener("keydown", handleKeyDown);
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

    const itemOffsetTop = item.offsetTop;
    const itemHeight = item.offsetHeight;
    const carrinhoHeight = carrinho.offsetHeight;

    const scrollTop = itemOffsetTop - carrinhoHeight / 2 + itemHeight / 10;

    carrinho.scrollTo({
      top: scrollTop,
      behavior: "smooth",
    });

    if (carrinho.scrollHeight > carrinho.clientHeight) {
      setScroll(true);
    } else {
      setScroll(false);
    }
  }, [carrinho]);

  function animateBrush() {

    const element = document.getElementById('brushElement');
    const brushKeyframes = [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-45deg)' },
      { transform: 'rotate(45deg)' },
      { transform: 'rotate(-30deg)' },
      { transform: 'rotate(30deg)' },
      { transform: 'rotate(0deg)' }
    ]; const timingOptions = {
      duration: 1000,
      iterations: 1,
      easing: 'ease-in-out',
      fill: 'forwards'
    };
    element.animate(brushKeyframes, timingOptions);
  }

  const handleResetarCarrinho = () => {
    animateBrush();
    setTimeout(() => {
      limparCarrinho();
    }, 500)
  };


  return (
    <>
      <div className="grid grid-cols-7 mt-5">
        <div className="flex col-span-5 bg-[#E5B8F1] border-[3px] border-dashed border-[#B478AB] rounded-[50px] text-[#8c3e82] text-sm font-semibold p-5 min-h-124 max-h-124">
          <div className="flex w-full flex-col justify-between">
            <div className="flex w-full flex-col gap-1">
              <div className="flex justify-between w-full px-3">
                <div className="flex flex-row gap-2 text-center justify-center items-center">
                  <i className="bi bi-cart4 text-[20px]"></i>
                  <p>Carrinho</p>
                </div>
                <div className="flex flex-row gap-2 text-center justify-center items-center">
                  <BrushCleaning
                    size={20}
                    id="brushElement"
                    onClick={handleResetarCarrinho}
                    className={`text-[25px] cursor-pointer ${styles.brush_animate}
                    ${carrinho.length==0 ? 'pointer-events-none' : ''}`}
                  />
                </div>
              </div>

              <div
                ref={carrinhoRef}
                id="carrinho"
                className={`flex flex-col gap-3 overflow-y-scroll max-h-53 pt-0 ms-1 ${scroll ? "pe-6" : "pe-0"
                  }`}
              >
                {loading ? (
                  <h1> Carregando carrinho...</h1>
                ) : carrinho && carrinho.length == 0 ? (
                  <p> Adicione produtos no baú da felicidade!</p>
                ) : (
                  carrinho.map((produto) => {
                    return (
                      <CarrinhoCard
                        key={produto.id_produto}
                        produto={produto}
                        id={produto.id_produto}
                        ref={(el) =>
                          (itemRefs.current[produto.id_produto] = el)
                        }
                      />
                    );
                  })
                )}
              </div>
            </div>

            <div className="px-1">
              <CardDemo
                quantidade={quantidade}
                subtotal={total}
                desconto={desconto}
                setDesconto={setDesconto}
              ></CardDemo>
              <div className="bg-[#c5ffad] border-[3px] border-dashed border-[#75ba51] rounded-[50px] mt-4 py-2 px-5 text-[#8c3e82] text-sm font-semibold">
                <h3>
                  Total: R${" "}
                  {Number(total * (1 - desconto / 100))
                    .toFixed(2)
                    .replace(".", ",")}
                </h3>
              </div>
              <button className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold w-full h-13 flex gap-3 justify-center items-center transform transition-all duration-300 ease-out group-hover:scale-110 hover:bg-[#74816b] hover:scale-97">
                <h3>Avançar para o pagamento</h3>
                <i className="bi bi-arrow-right-circle-fill text-[25px]"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="items-center col-span-2 hidden lg:flex">
          <div>
            <img
              className="m-0 pr-3"
              src="/img/pdv/carrinho_criancas.png"
              alt="Logo"
            />
          </div>
        </div>
      </div>
    </>
  );
}
