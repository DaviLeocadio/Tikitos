export default function CartaoContainer() {
  return (
    <div
      className="min-w-full max-h-[100%] aspect-[17/11]  p-10 flex justify-end items-end
    bg-[url('/img/pagamento/cartao_pagamento.png')] bg-cover bg-center bg-no-repeat"
    >
      <div className="max-w-xs flex flex-col justify-center">
        <label for="senha-input" className="text-lg font-bold text-verdefolha">
          Senha:
        </label>
        <input
          type="password"
          id="senha-input"
          placeholder="Insira aqui"
          className="focus-visible:outline-none text-lg font-bold text-verdefolha bg-[#ddf1d4] rounded-sm p-3"
        ></input>
      </div>
    </div>
  );
}
