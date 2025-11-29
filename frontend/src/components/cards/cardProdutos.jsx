import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip_one";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { OctagonAlert } from "lucide-react";

import React, { useEffect, useState } from "react";
import { adicionarAoCarrinho, obterCarrinho,removerDoCarrinho } from "@/utils/carrinho.js";

const getId = (p) =>
  p?.id ?? p?._id ?? p?.codigo ?? p?.sku ?? (typeof p?.nome === "string" ? p.nome : undefined);

export default function CardProduto({ produto }) {
  const [cardSelecionado, setCardSelecionado] = useState(false);
  const [categoria, setCategoria] = useState();
  const [estoqueBaixo, setEstoqueBaixo] = useState(false);

  const isInteractiveElement = (el) => {
    if (!el || !el.closest) return false;
    return Boolean(
      el.closest(
        "button, a, input, textarea, select, svg, i, [role='button'], [data-ignore-card-click]"
      )
    );
  };

  const handleAdd = (e) => {
    // só responde a clique primário (botão esquerdo)
    if (e && typeof e.button === "number" && e.button !== 0) return;

    // evita que cliques em controles internos (ícones/botões) toggleiem o card
    if (e && isInteractiveElement(e.target)) return;

    e?.stopPropagation?.();

    try {
      const id = getId(produto);
      if (!id) return;

      // Usa o estado local como fonte da verdade para toggle:
      if (cardSelecionado) {
        // já selecionado -> remover
        removerDoCarrinho(produto);
        setCardSelecionado(false);
      } else {
        // não selecionado -> adicionar
        adicionarAoCarrinho(produto);
        setCardSelecionado(true);
      }

      // notifica outros componentes/cards que o carrinho mudou
      try {
        window.dispatchEvent(new CustomEvent("carrinho:update"));
      } catch (err) {
        // noop
      }
    } catch (err) {
      // noop
    }
  };

  useEffect(() => {
    let mounted = true;
    const myId = getId(produto);

    const checkCarrinho = () => {
      try {
        const carrinho = obterCarrinho() || [];
        const ids = new Set(carrinho.map((p) => getId(p)).filter(Boolean));
        const existe = myId ? ids.has(myId) : false;
        if (mounted) setCardSelecionado(Boolean(existe));
      } catch (err) {
        if (mounted) setCardSelecionado(false);
      }
    };

    // checa inicialmente
    checkCarrinho();

    // atualiza ao mudar localStorage (outras abas) e ao receber evento custom
    const onStorage = (ev) => {
      if (!ev.key || ev.key === "carrinho") checkCarrinho();
    };

    window.addEventListener("storage", handleStorage);

    estoqueProdutos();
    categoriaProdutos();
    return () => {
      unsub();
      window.removeEventListener("storage", handleStorage);
    };
  }, [myId]);

  

  const categorias = [
    { categoria: "Pelúcias", img: "/img/categorias/pelucia_categoria.png" },
    { categoria: "Musical", img: "/img/categorias/musical_categoria.png" },
    { categoria: "Fantasia e Aventura", img: "/img/categorias/fantasia_categoria.png" },
    { categoria: "Movimento", img: "/img/categorias/movimento_categoria.png" },
    { categoria: "Jogos", img: "/img/categorias/jogos_categoria.png" },
    { categoria: "Construção", img: "/img/categorias/construcao_categoria.png" },
    { categoria: "Veículos", img: "/img/categorias/veiculo_categoria.png" },
    { categoria: "Bonecos", img: "/img/categorias/bonecos_categoria.png" },
  ];

    // function Highlight({ text, matches }) {
  //   if (!matches || matches.length === 0) return text;

  //   const nomeMatch = matches.find(m => m.key === "nome");
  //   if (!nomeMatch) return text;

  //   // Pega o MAIOR intervalo (mais longo)
  //   let best = nomeMatch.indices.reduce((a, b) => {
  //     const lenA = a[1] - a[0];
  //     const lenB = b[1] - b[0];
  //     return lenB > lenA ? b : a;
  //   });

  //   const [start, end] = best;

  //   return (
  //     <>
  //       {text.slice(0, start)}
  //       <mark className="px-1 bg-lime-300 font-bold">
  //         {text.slice(start, end + 1)}
  //       </mark>
  //       {text.slice(end + 1)}
  //     </>
  //   );
  // }

  return (
    <Card
      // ALTERAÇÃO APLICADA AQUI: Estilização condicional para hover/seleção
      className={`group min-w-53 shadow-none gap-0 pt-0 pb-0 border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-2 transition 
        ${cardSelecionado 
          ? "bg-[#C8FDB4] shadow-md hover:shadow-lg" // SELECIONADO: Fundo destacado + feedback de hover por sombra
          : "bg-[#D8F1DC] hover:bg-[#C8FDB4]"       // NÃO SELECIONADO: Fundo normal + feedback de hover por destaque de cor
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
          {/* PRIMEIRO ÍCONE: Informações */}
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <i className="bi bi-info-circle-fill text-[16px] text-[#569a33] hover:scale-95 transition cursor-pointer"></i>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-xs text-xs text-center"
              >
                <p>Informações</p>
                <p>do produto</p>
              </TooltipContent>
            </Tooltip>

            <AlertDialogContent className="bg-[#edd5f4]">
              <AlertDialogHeader className="items-center">
                <AlertDialogTitle className="flex flex-col justify-center items-center">
                  <img
                    className="h-25"
                    src="/img/categorias/bonecos_categoria.png"
                    alt="categoria"
                  />
                  <div className="flex flex-col justify-center items-center text-sm/6">
                    <h4 className="text-[14px] text-[#75BA51]">CATEGORIA</h4>
                    <h1 className="font-bold mt-[-7px] text-[20px] text-[#76196c]">Bonecos</h1>
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[15px] text-center">
                  Aqui você pode mostrar dados adicionais sobre o produto, como
                  composição, validade, descrição etc.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-2 sm:justify-center">
                <AlertDialogCancel className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold w-50 h-13 flex gap-3 justify-center items-center transform transition-all duration-300 ease-out group-hover:scale-110 hover:bg-[#74816b] hover:scale-97">Fechar</AlertDialogCancel>
                <button className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold w-50 h-13 flex gap-3 justify-center items-center transform transition-all duration-300 ease-out group-hover:scale-110 hover:bg-[#74816b] hover:scale-97">Relatar erro</button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* SEGUNDO ÍCONE: Classificação de Estoque */}
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <i className="bi bi-exclamation-circle-fill text-[16px] text-[#4f6940] hover:scale-95 transition cursor-pointer"></i>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="max-w-xs text-xs text-center"
              >
                <p>Classificação</p>
                <p>de estoque</p>
              </TooltipContent>
            </Tooltip>

            <AlertDialogContent className="bg-[#edd5f4]">
              <AlertDialogHeader className="items-center">
                <AlertDialogTitle>
                  <div className="mb-2 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
                    <OctagonAlert className="h-7 w-7 text-destructive" />
                  </div>
                  Situação do Estoque
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[15px] text-center">
                  Aqui você pode informar a classificação do estoque, níveis
                  críticos, previsão de reposição, etc.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-2 sm:justify-center">
                <AlertDialogCancel className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold w-30 h-13 flex gap-3 justify-center items-center transform transition-all duration-300 ease-out group-hover:scale-110 hover:bg-[#74816b] hover:scale-97">Fechar</AlertDialogCancel>
                <button className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold w-40 h-13 flex gap-3 justify-center items-center transform transition-all duration-300 ease-out group-hover:scale-110 hover:bg-[#74816b] hover:scale-97">Relatar defeito</button>
                <button className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold w-40 h-13 flex gap-3 justify-center items-center transform transition-all duration-300 ease-out group-hover:scale-110 hover:bg-[#74816b] hover:scale-97">Lista de espera</button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
