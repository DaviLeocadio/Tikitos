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

import { OctagonAlert, CircleCheckBig } from "lucide-react";

import React, { useEffect, useState } from "react";
import {
  adicionarAoCarrinho,
  obterCarrinho,
  removerDoCarrinho,
} from "@/utils/carrinho.js";
import { aparecerToast } from "@/utils/toast";

const getId = (p) =>
  p?.id ??
  p?._id ??
  p?.codigo ??
  p?.sku ??
  (typeof p?.nome === "string" ? p.nome : undefined);

export default function CardProduto({ produto }) {
  const [cardSelecionado, setCardSelecionado] = useState(false);
  const [inativo, setInativo] = useState(false);
  const [estoqueBaixo, setEstoqueBaixo] = useState(false);
  const [categoria, setCategoria] = useState();

  // NOVO — usado apenas visualmente, sem alterar lógica
  const esgotado =
    Number.parseInt(produto?.estoque ?? produto?.quantidade ?? -1, 10) <= 0;

  const isInteractiveElement = (el) => {
    if (!el || !el.closest) return false;
    return Boolean(
      el.closest(
        "button, a, input, textarea, select, svg, i, [role='button'], [data-ignore-card-click]"
      )
    );
  };

  const handleClickCard = (e) => {
    if (e && typeof e.button === "number" && e.button !== 0) return;
    if (e && isInteractiveElement(e.target)) return;
    e?.stopPropagation?.();

    try {
      const id = getId(produto);
      if (!id) return;

      // Mantido igual, sem alteração de lógica
      const estoqueNum = Number.parseInt(produto?.estoque ?? produto?.quantidade ?? -1, 10);
      if (!Number.isNaN(estoqueNum) && estoqueNum <= 0) {
        const triggerId = `estoque-trigger-${produto.id_produto ?? id}`;
        const triggerEl = document.getElementById(triggerId);
        if (triggerEl) {
          triggerEl.click();
          return;
        }
        return aparecerToast("Produto esgotado");
      }

      if (cardSelecionado) {
        removerDoCarrinho(produto.id_produto);
        setCardSelecionado(false);
      } else {
        if (inativo) {
          return aparecerToast("Produto Inativo");
        }
        adicionarAoCarrinho(produto);
        setCardSelecionado(true);
      }
    } catch (err) { }
  };

  const myId = getId(produto);

  useEffect(() => {
    let mounted = true;

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

    checkCarrinho();

    const onStorage = (ev) => {
      try {
        if (!ev.key || ev.key === "carrinho") checkCarrinho();

        if (ev.key === "cart") {
          const raw = localStorage.getItem("cart");
          let parsed = [];
          try {
            parsed = JSON.parse(raw) || [];
          } catch (err) { }

          const ids = new Set(parsed.map((p) => getId(p)).filter(Boolean));
          const existe = myId ? ids.has(myId) : false;
          if (mounted) setCardSelecionado(Boolean(existe));
        }
      } catch (err) { }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("carrinhoAtualizado", checkCarrinho);

    const buscarCategoria = async () => {
      const response = await fetch(
        `http://localhost:8080/vendedor/categorias/${produto.id_produto}`,
        { method: "GET", credentials: "include" }
      );

      if (response.ok) {
        const data = await response.json();
        return setCategoria(data.categoriaProduto.nome);
      }
    };

    buscarCategoria();

    const verfificarEstoque = async () => {
      const response = await fetch(
        "http://localhost:8080/vendedor/estoque-baixo",
        { method: "GET", credentials: "include" }
      );

      if (response.ok) {
        const data = await response.json();

        const produtosComEstoqueBaixo = Array.isArray(
          data?.produtosComEstoqueBaixo
        )
          ? data.produtosComEstoqueBaixo
          : [];

        const produtoEstoque = produtosComEstoqueBaixo.filter(
          (p) => p.id_produto === produto.id_produto
        );

        if (produtoEstoque.length > 0) setEstoqueBaixo(true);
      }
    };

    verfificarEstoque();

    return () => {
      mounted = false;
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("carrinhoAtualizado", checkCarrinho);
    };
  }, [myId]);

  const categorias = {
    Pelúcias: "/img/categorias/pelucia_categoria.png",
    Musical: "/img/categorias/musical_categoria.png",
    "Fantasia e Aventura": "/img/categorias/fantasia_categoria.png",
    Movimento: "/img/categorias/movimento_categoria.png",
    Jogos: "/img/categorias/jogos_categoria.png",
    Construção: "/img/categorias/construcao_categoria.png",
    Veículos: "/img/categorias/veiculo_categoria.png",
    Bonecos: "/img/categorias/bonecos_categoria.png",
  };

  useEffect(() => {
    if (produto.status == "inativo") return setInativo(true);
  }, []);

  return (
    <Card
      className={`group min-w-53 shadow-none gap-0 pt-0 pb-0 border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-2 transition cursor-pointer
      ${cardSelecionado
          ? "bg-[#C8FDB4] shadow-md hover:shadow-lg"
          : "bg-[#D8F1DC] hover:bg-[#C8FDB4]"
        }

      /* 🔥 esgotado AGORA fica com o mesmo visual do produto INATIVO */
      ${inativo || esgotado ? "grayscale-80 opacity-85" : ""}
      `}
      onClick={handleClickCard}
    >

      <CardHeader className="pt-3 px-6 flex items-center flex-row justify-between gap-2 font-semibold text-sm">
        <div className="flex flex-col align-center">
          <h3 className="text-[#8C3E82] text-[12px] tracking-tighter">
            {produto.nome}
          </h3>

          {parseInt(produto.desconto) !== 0 ? (
            <p className="text-[12px]">
              <span className="line-through text-[#c97fda] opacity-75">
                {produto.precoFormatado}
              </span>{" "}
              <span className="text-red-700">
                {produto.precoFormatadoComDesconto}
              </span>
            </p>
          ) : (
            <p className="text-[#c97fda] text-[12px]">
              {produto.precoFormatado}
            </p>
          )}
        </div>

        <div className="w-11 h-full flex justify-between items-center gap-2">

          {/* INFO */}
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <i className="bi bi-info-circle-fill text-[16px] text-[#569a33] hover:scale-95 transition cursor-pointer"></i>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs text-center">
                <p>Informações</p><p>do produto</p>
              </TooltipContent>
            </Tooltip>

            <AlertDialogContent className="bg-[#edd5f4] flex items-center">
              <AlertDialogCancel
                className="
    p-1
    w-10 h-10
    bg-transparent
    border-none
    outline-none
    shadow-none
    ring-0
    absolute
    top-2 right-2
    flex items-center justify-center
    cursor-pointer
    transition
    hover:bg-[#EBC7F5]
    text-[#73806A]
    hover:text-[#73806A]
  "
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </AlertDialogCancel>
              <AlertDialogHeader className="items-center">
                <AlertDialogTitle className="flex flex-col justify-center items-center">
                  <img className="h-25" src={`${categorias[categoria]}`} alt="categoria" />
                  <div className="flex flex-col justify-center items-center text-sm/6">
                    <h4 className="text-[14px] text-[#75BA51]">CATEGORIA</h4>
                    <h1 className="font-bold mt-[-7px] text-[20px] text-[#76196c]">{categoria}</h1>
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[15px] text-center">
                  {produto.descricao}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="sm:justify-center">
                {/* <AlertDialogCancel className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold hover:bg-[#65745A] hover:text-[#caf4b7] border-none outline-none ring-0 focus:border-none focus:outline-none focus:ring-0">
                  Fechar
                </AlertDialogCancel> */}
                {/* <button className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold">
                  Relatar erro
                </button> */}
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* ESTOQUE */}
          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <i
                    id={`estoque-trigger-${produto.id_produto ?? myId}`}
                    className={`bi bi-exclamation-circle-fill text-[16px] hover:scale-95 transition cursor-pointer ${estoqueBaixo ? "text-[#76196c]" : "text-[#4f6940]"
                      }`}
                  ></i>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs text-center">
                <p>Classificação</p><p>de estoque</p>
              </TooltipContent>
            </Tooltip>

            <AlertDialogContent className="bg-[#edd5f4] flex justify-center items-center">
              <AlertDialogCancel
                className="
    p-1
    w-10 h-10
    bg-transparent
    border-none
    outline-none
    shadow-none
    ring-0
    absolute
    top-2 right-2
    flex items-center justify-center
    cursor-pointer
    transition
    hover:bg-[#EBC7F5]
    text-[#73806A]
    hover:text-[#73806A]
  "
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </AlertDialogCancel>


              <AlertDialogHeader className="items-center">
                <AlertDialogTitle>
                  <div
                    className={`mb-2 mx-auto flex h-16 w-16 items-center justify-center rounded-full 
                      ${estoqueBaixo ? "bg-destructive/10" : "bg-[#9ad979]"}`}
                  >
                    {estoqueBaixo ? (
                      <OctagonAlert className="h-7 w-7 text-destructive" />
                    ) : (
                      <CircleCheckBig className="h-7 w-7 text-[#4f6940]" />
                    )}
                  </div>

                  <div className="flex flex-col justify-center items-center text-sm/6">
                    <h4 className="text-[14px] text-[#76196c]">SITUAÇÃO DO</h4>
                    <h1 className="font-bold mt-[-7px] text-[20px] text-[#6aa949]">
                      estoque
                    </h1>
                  </div>

                  <p className={`flex flex-col items-center pt-2 text-center ${estoqueBaixo ? "text-destructive" : "text-[#4f6940]"}`}>
                    <span className="text-3xl font-bold">
                      {esgotado ? "ESGOTADO" : produto.estoque}
                    </span>
                    <span className="text-sm">
                      {esgotado ? "Sem estoque disponível" : "Unidades disponíveis"}
                    </span>
                  </p>

                </AlertDialogTitle>

                <AlertDialogFooter className="sm:justify-center">
                  {/* <AlertDialogCancel className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold hover:bg-[#65745A] hover:text-[#caf4b7] border-none outline-none ring-0">
                    Fechar
                  </AlertDialogCancel> */}





                  {/* <button className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold">
                    Relatar defeito
                  </button> */}
                </AlertDialogFooter>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>

        </div>
      </CardHeader>

      <div className="flex justify-center items-center h-full">
        <CardContent className="mt-1 text-[13px] text-muted-foreground px-4 max-w-90 w-full h-full">
          <img
            className="p-0 flex align-end w-full h-full object-contain transform transition group-hover:scale-108 duration-400 ease-out"
            src={produto.imagem}
          />
        </CardContent>
      </div>
    </Card>
  );
}
