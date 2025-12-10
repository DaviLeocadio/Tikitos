import { useState } from "react";
import { ToastContainer } from "react-toastify";

export default function CartaoContainer() {
  const [senha, setSenha] = useState("");

  const handleChange = (e) => {
    const valor = e.target.value;
    if (valor.length <= 4) setSenha(valor);
  };

  return (
    <>
      <ToastContainer />

      <div className="relative aspect-[96/64] w-[100%] mx-auto p-2"> 
        <img
          src="/img/pagamento/cartao_pagamento.png"
          alt="Cartão para inserção de senha"
          className="w-full h-full object-contain rounded-xl"
        />

        <label
          htmlFor="senha-input"
          className="absolute text-lg font-bold text-verdefolha bottom-23 right-42"
        >
          Senha:
        </label>

        <input
          type="password"
          id="senha-input"
          placeholder="Insira aqui"
          className="
            focus-visible:outline-none text-lg font-bold
            text-verdefolha bg-[#ddf1d4] rounded-lg p-2
            absolute bottom-12 right-10 
            w-48 h-10
          "
          value={senha}
          onChange={handleChange}
        />
      </div>
    </>
  );
}