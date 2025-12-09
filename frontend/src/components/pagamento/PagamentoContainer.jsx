"use client";
import { useState, useEffect } from "react";
import MetodoDePagamento from "@/components/pagamento/MetodoDePagmento";
import CartaoContainer from "./CartaoContainer";
import PixContainer from "./PixContainer";
import DinheiroContainer from "./DinheiroContainer";
import FinalizarPagamentoButton from "./FinalizarPagamentoButton";
import InputCPFMask from "../inputMasks/InputCPFMask";

export default function PagamentoContainer() {
  const [metodoPag, setMetodoPag] = useState("débito");
  const [embalagem, setEmbalagem] = useState(false);
  const [cpf, setCpf] = useState("");
  const [fidelidade, setFidelidade] = useState(0);

  // Gera fidelidade aleatória ao montar o componente
  useEffect(() => {
    const pontosAleatorios = Math.floor(Math.random() * 11); // 0 a 10
    setFidelidade(pontosAleatorios);
  }, []);

  useEffect(() => {
     localStorage.setItem("embalagem", JSON.stringify(embalagem));
  }, [embalagem])

  function renderFidelidade() {
    const itens = [];

    for (let i = 1; i <= 10; i++) {
      if (i <= fidelidade) {
        itens.push(
          <i
            key={i}
            className="bi bi-gift-fill text-[#b478ab] text-2xl sm:text-3xl transition-all"
          />
        );
      } else {
        itens.push(
          <i
            key={i}
            className="bi bi-gift text-[#b478ab] text-xl sm:text-2xl transition-all opacity-40"
          />
        );
      }
    }

    return itens;
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-roxo flex flex-col leading-[0.9]">
          <span>Página de</span>
          <span>pagamento</span>
        </h1>

        <FinalizarPagamentoButton
          pagamento={metodoPag}
          cpf={cpf}
          embalagem={embalagem}
        />
      </div>

      {/* Método de pagamento e embalagem */}
      <div className="flex flex-col gap-3 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2">
          <h3 className="text-lg sm:text-xl font-bold text-verdefolha">
            Método de pagamento:
          </h3>

          <button
            onClick={() => setEmbalagem(!embalagem)}
            className="flex items-center gap-2 transition cursor-pointer hover:scale-105 active:scale-95 px-5"
          >
            <span className="text-base sm:text-lg font-bold text-verdefolha">
              Embalagem
            </span>
            <span className="text-sm sm:text-md font-semibold text-[#569a33]">
              (R$1,50)
            </span>
            <i
              className={`bi ${embalagem ? "bi-gift-fill" : "bi-gift"
                } text-[#b478ab] text-xl sm:text-2xl transition-all`}
            />
          </button>
        </div>

        <MetodoDePagamento metodoPag={metodoPag} setMetodoPag={setMetodoPag} />
      </div>


      <div className="">
        {/* Container de pagamento e fidelidade */}
        <div className="flex flex-col lg:flex-row">
          {/* Área do método de pagamento selecionado */}
          <div className="flex-1 min-h-[200px]">
            {metodoPag === "débito" && <CartaoContainer />}
            {metodoPag === "crédito" && <CartaoContainer />}
            {metodoPag === "pix" && <PixContainer />}
            {metodoPag === "dinheiro" && <DinheiroContainer />}
          </div>

          {/* Sidebar - Fidelidade e CPF */}
          <div className="lg:w-1/3 h-full flex flex-col items-center justify-center my-auto pb-5">
            {/* Programa Fidelidade */}
            <h3 className="text-lg sm:text-xl font-bold text-verdefolha mb-3">
              Programa Fidelidade
            </h3>
            <div className="grid grid-cols-5 gap-2 justify-center items-center">
              {renderFidelidade()}
            </div>
            <p className="text-center mt-3 text-verdefolha font-semibold">
              {fidelidade}/10 presentes
            </p>
          </div>
        </div>
        <div className="">
          {/* CPF para Nota Fiscal */}
          <div className="grid grid-cols-3 items-center">
            <div className="">
              <h3 className="col-span-1 text-lg sm:text-xl font-bold text-verdefolha">
                Nota Fiscal (CPF)
              </h3>
              {cpf && cpf.replace(/\D/g, '').length === 11 && (
                <p className="text-verdao text-sm flex items-center gap-1">
                  <i className="bi bi-check-circle-fill" />
                  CPF válido
                </p>
              )}
            </div>


            <InputCPFMask
              id="cpf"
              type="text"
              className="bg-rosinha text-base rounded-lg w-full py-2 px-3 text-white placeholder:text-white/60 col-span-2"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
            />
          </div>
        </div>
      </div>
    </div>
  );
}