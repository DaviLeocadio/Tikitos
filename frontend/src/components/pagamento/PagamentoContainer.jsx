"use client";
import { useState } from "react";
import MetodoDePagamento from "@/components/pagamento/MetodoDePagmento";
import { ChevronRight, Gift, GiftIcon } from "lucide-react";
import { BiGift } from "react-icons/bi";
import { BsGift, BsGiftFill } from "react-icons/bs";
import CartaoContainer from "./CartaoContainer";
import PixContainer from "./PixContainer";
import DinheiroContainer from "./DinheiroContainer";
import FinalizarPagamentoButton from "./FinalizarPagamentoButton";
import InputCPFMask from "../InputCPFMask";

export default function PagamentoContainer() {
  const [metodoPag, setMetodoPag] = useState("débito");
  const [embalagem, setEmbalagem] = useState(false);
  const [cpf, setCpf] = useState("");

  const fidelidade = Math.random(0, 10);

  function renderFidelidade() {
    const itens = [];

    for (let i = 1; i <= 10; i++) {
      if (i <= fidelidade) {
        itens.push(
          <BsGiftFill
            key={i}
            color="#b478ab"
            size={40}
            className="transition pb-1"
          />
        );
      } else {
        itens.push(
          <BsGift
            key={i}
            color="#b478ab"
            size={25}
            className="transition pb-1"
          />
        );
      }
    }

    return itens;
  }

  return (
    <div>
      <div className="flex w-full pt-0 pb-5 justify-between">
        {/* substituir por imagem com lemonade display */}
        <h1 className="text-2xl font-bold text-roxo flex flex-col">
          <span>página de</span>
          <span>pagamento</span>
        </h1>

        <FinalizarPagamentoButton pagamento={metodoPag} cpf={cpf} />
      </div>

      <div className="py-3">
        <div className="flex justify-between">
          <h3 className="text-lg font-bold text-verdefolha">
            Método de pagamento:
          </h3>

          <button
            onClick={() => setEmbalagem(!embalagem)}
            className="transition cursor-pointer"
          >
            <h3 className="flex items-center gap-2 m-0">
              <span className="text-lg font-bold text-verdefolha">
                Embalagem
              </span>
              <span className="text-md font-semibold text-[#569a33]">
                (R$1,50):
              </span>
              <span>
                {embalagem ? (
                  <BsGift
                    color="#b478ab"
                    size={25}
                    className="transition pb-1"
                  />
                ) : (
                  <BsGiftFill
                    color="#b478ab"
                    size={25}
                    className="transition pb-1"
                  />
                )}
              </span>
            </h3>
          </button>
        </div>
        <MetodoDePagamento metodoPag={metodoPag} setMetodoPag={setMetodoPag} />
        <div className="flex 2xl:min-h-80 flex-col md:flex-row">
          <div className="w-full md:w-2/3">
            {metodoPag == "débito" && <CartaoContainer />}
            {metodoPag == "crédito" && <CartaoContainer />}
            {metodoPag == "pix" && <PixContainer />}
            {metodoPag == "dinheiro" && <DinheiroContainer />}
          </div>
          <div className="w-full md:w-1/3 pb-10">
            <h3 className="flex flex-col text-lg font-bold text-verdefolha">
              <span>Programa</span>
              <span>Fidelidade:</span>
            </h3>
            <div className="grid grid-cols-5  justify-center items-center">
              {renderFidelidade()}
            </div>
            <div className="mt-8 text-lg font-bold text-verdefolha">
              <h3>Nota Fiscal(CPF)</h3>
              <InputCPFMask
                id="cpf"
                type="text"
                className="bg-rosinha text-sm rounded-lg mt-2 p-3 ps-2 text-white"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
