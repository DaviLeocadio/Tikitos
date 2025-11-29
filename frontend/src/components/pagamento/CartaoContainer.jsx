import { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";

export default function CartaoContainer() {
  const [senha, setSenha] = useState("");

  // Limita a senha a 6 caracteres
  const handleChange = (e) => {
    const valor = e.target.value;

    if (valor.length <= 4) {
      setSenha(valor);
    }
  };
  return (
    <>
      <ToastContainer />
      <div className="relative aspect-[96/64] min-w-full ">
        <img
          src="/img/pagamento/cartao_pagamento.png"
          alt="Cartão para inserção de senha"
          className="w-full h-full object-contain rounded-xl"
        />
        <label
          htmlFor="senha-input"
          className="text-lg font-bold text-verdefolha absolute bottom-23 right-42 z-10"
        >
          Senha:
        </label>
        <input
          type="password"
          id="senha-input"
          placeholder="Insira aqui"
          className="
          focus-visible:outline-none text-lg font-bold text-verdefolha bg-[#ddf1d4] rounded-lg p-2
          absolute 
          bottom-12 right-10 
          w-48 h-10
          z-20"
          value={senha}
          onChange={handleChange}
        />
      </div>

      {/* <div
        className="w-full max-w-[80%] max-h-[100%] aspect-[17/11] p-10 flex justify-end items-end
    bg-[url('/img/pagamento/cartao_pagamento.png')] bg-cover bg-center bg-no-repeat"
      >
        <div className="max-w-xs flex flex-col justify-center">
          <label
            htmlFor="senha-input"
            className="text-lg font-bold text-verdefolha"
          >
            Senha:
          </label>
          <input
            type="password"
            id="senha-input"
            placeholder="Insira aqui"
            className="focus-visible:outline-none text-lg font-bold text-verdefolha bg-[#ddf1d4] rounded-sm p-2"
            value={senha}
            onChange={handleChange}
          ></input>
        </div>
      </div> */}
    </>
  );
}
