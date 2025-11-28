"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { adicionarAoCarrinho, obterCarrinho } from "@/utils/carrinho.js";
import ModalInformacoesProduto from "@/components/cards/ModalInformacoesProduto";
import ModalEstoque from "@/components/cards/ModalEstoque";

const getId = (p) =>
  p?.id ??
  p?._id ??
  p?.codigo ??
  p?.sku ??
  (typeof p?.nome === "string" ? p.nome : undefined);

let globalSubscribers = [];

function subscribeToCarrinhoUpdate(callback) {
  globalSubscribers.push(callback);

  return () => {
    globalSubscribers = globalSubscribers.filter((fn) => fn !== callback);
  };
}

function emitCarrinhoUpdate() {
  globalSubscribers.forEach((fn) => fn());
}

const removerDoCarrinho = (produto) => {
  const id = getId(produto);
  const carrinho = obterCarrinho() || [];
  const novo = carrinho.filter((p) => getId(p) !== id);

  localStorage.setItem("carrinho", JSON.stringify(novo));
  localStorage.setItem("carrinhoAtualizado", Date.now());

  window.dispatchEvent(new Event("carrinhoAtualizado"));
  emitCarrinhoUpdate();

  return novo;
};

export default function CardProduto({ produto }) {
  const [cardSelecionado, setCardSelecionado] = useState(false);

  const myId = getId(produto);

  const check = () => {
    const ids = new Set((obterCarrinho() || []).map((p) => getId(p)));
    setCardSelecionado(ids.has(myId));
  };

  useEffect(() => {
    check(); // inicial

    const unsub = subscribeToCarrinhoUpdate(check);

    const handleStorage = (e) => {
      if (e.key === "carrinhoAtualizado") check();
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      unsub();
      window.removeEventListener("storage", handleStorage);
    };
  }, [myId]);

  const handleAdd = (e) => {
    if (e.target.closest("button, i, svg")) return;

    if (cardSelecionado) {
      removerDoCarrinho(produto);
    } else {
      adicionarAoCarrinho(produto);
    }

    emitCarrinhoUpdate();
  };

  const categorias = [
    { categoria: "Pelúcias", img: "/img/categorias/pelucia_categoria.png" },
    { categoria: "Musical", img: "/img/categorias/musical_categoria.png" },
    {
      categoria: "Fantasia e Aventura",
      img: "/img/categorias/fantasia_categoria.png",
    },
    { categoria: "Movimento", img: "/img/categorias/movimento_categoria.png" },
    { categoria: "Jogos", img: "/img/categorias/jogos_categoria.png" },
    {
      categoria: "Construção",
      img: "/img/categorias/construcao_categoria.png",
    },
    { categoria: "Veículos", img: "/img/categorias/veiculo_categoria.png" },
    { categoria: "Bonecos", img: "/img/categorias/bonecos_categoria.png" },
  ];

  return (
    <Card
      className={`group min-w-53 shadow-none gap-0 pt-0 pb-0 border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-2 transition 
        ${
          cardSelecionado
            ? "bg-[#C8FDB4] shadow-md hover:shadow-lg"
            : "bg-[#D8F1DC] hover:bg-[#C8FDB4]"
        }`}
      onClick={handleAdd}
    >
      <CardHeader className="pt-3 px-6 flex items-center flex-row justify-between gap-2 font-semibold text-sm">
        <div className="flex flex-col align-center">
          <h3 className="text-[#8C3E82] text-[12px] tracking-tighter">
            {produto.nome}
          </h3>
          {parseInt(produto.desconto) !== 0 ? (
            <>
              <p className=" text-[12px] ">
                <span className="line-through text-[#c97fda] opacity-75">
                  {produto.precoFormatado}
                </span>{" "}
                <span className="no-line-through text-red-700">
                  {produto.precoFormatadoComDesconto}
                </span>
              </p>
            </>
          ) : (
            <p className="text-[#c97fda] text-[12px]">
              {produto.precoFormatado}
            </p>
          )}
        </div>

        <div className="w-11 h-full flex justify-between items-center gap-2">
          <ModalInformacoesProduto produto={produto} />
          <ModalEstoque produto={produto} />
        </div>
      </CardHeader>

      <div className="flex justify-center items-center">
        <CardContent className="mt-1 text-[13px] text-muted-foreground px-4 max-w-90">
          <img
            className="p-0 flex align-end w-full h-full object-contain transform transition group-hover:scale-108 duration-400 ease-out"
            src={produto.imagem}
          />
        </CardContent>
      </div>
    </Card>
  );
}
