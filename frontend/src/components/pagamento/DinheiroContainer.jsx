import { calcularTotal } from "@/utils/carrinho";
import { useState } from "react";

export default function DinheiroContainer() {
  const [valorRecebido, setValorRecebido] = useState('');

  function conta() {
    if (valorRecebido - calcularTotal() < 0) return 'R$0.00';
    const troco = valorRecebido - calcularTotal();
    return 'R$' + troco.toFixed(2);
  }

  return (
    <>
      <main className="flex gap-5">
        {/* Valor recebido */}
        <div className="grid gap-1">
          <h3 className="text-[var(--color-verdefolha)] font-bold">
            Valor recebido
          </h3>
          <input
            type="text"
            className="bg-rosinha rounded-lg p-2.5 text-white"
            placeholder="Valor Recebido"
            value={valorRecebido}
            onChange={(e) => setValorRecebido(e.target.value)}
          />
        </div>

        {/* Valor do troco */}
        <div className="grid gap-1">
          <h3 className="text-[var(--color-verdefolha)] font-bold">
            Valor do troco
          </h3>
          <input
            type="text"
            className="bg-rosinha rounded-lg p-2.5 text-white"
            placeholder="Valor do Troco"
            readOnly
            value={conta()}
          />
        </div>
      </main>

      {/* Imagem do dinheiro */}
      <div className="grid items-center justify-center">
        <img
          src="/img/pagamento/dinheiro_pagamento.png"
          alt="dinheiro"
          className="w-[77%] mt-4"
        />
      </div>
    </>
  );
}
