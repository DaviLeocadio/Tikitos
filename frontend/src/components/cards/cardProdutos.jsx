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

import React from "react";
import { adicionarAoCarrinho, obterCarrinho } from "@/utils/carrinho.js";

const CardProduto = ({ produto }) => {
  const handleAdd = () => {
    adicionarAoCarrinho(produto);
    console.log(obterCarrinho());
  };

  const categorias = [
    {
      categoria: "Pelúcias",
      img: "/img/categorias/pelucia_categoria.png",
    },
    {
      categoria: "Musical",
      img: "/img/categorias/musical_categoria.png",
    },
    {
      categoria: "Fantasia e Aventura",
      img: "/img/categorias/fantasia_categoria.png",
    },
    {
      categoria: "Movimento",
      img: "/img/categorias/movimento_categoria.png",
    },
    {
      categoria: "Jogos",
      img: "/img/categorias/jogos_categoria.png",
    },
    {
      categoria: "Construção",
      img: "/img/categorias/construcao_categoria.png",
    },
    {
      categoria: "Veículos",
      img: "/img/categorias/veiculo_categoria.png",
    },
    {
      categoria: "Bonecos",
      img: "/img/categorias/bonecos_categoria.png",
    },
  ];

  return (
    <Card
      className="group min-w-53 shadow-none gap-0 pt-0 pb-0 bg-[#D8F1DC] border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-2 hover:bg-[#C8FDB4] transition"
      onClick={handleAdd}
    >
      <CardHeader className="pt-3 px-6 flex items-center flex-row justify-between gap-2 font-semibold text-sm">
        <div className="flex flex-col align-center">
          <h3 className="text-[#8C3E82] text-[12px] tracking-tighter">
            {produto.nome}
          </h3>
          <p className="text-[#c97fda] text-[12px]">{produto.precoFormatado}</p>
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

            <AlertDialogContent className="bg-[#E5B8F1]">
              <AlertDialogHeader className="items-center">
                <AlertDialogTitle className="flex flex-col justify-center items-center">
                  <img
                    className="h-25"
                    src="/img/categorias/bonecos_categoria.png"
                    alt="categoria"
                  />
                  <div className="flex flex-col justify-center items-center text-sm/6">
                    <h4 className="text-[14px] text-[#75BA51]">CATEGORIA</h4>
                    <h1 className="font-bold mt-[-5px] text-[20px] text-[#76196c]">Bonecos</h1>
                  </div>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-[15px] text-center">
                  Aqui você pode mostrar dados adicionais sobre o produto, como
                  composição, validade, descrição etc.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="mt-2 sm:justify-center">
                <AlertDialogCancel>Fechar</AlertDialogCancel>
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

            <AlertDialogContent>
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
                <AlertDialogCancel>Fechar</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>

      <div className="flex justify-center items-center">
        <CardContent className="mt-1 text-[13px] text-muted-foreground px-4 max-w-90">
          <img
            className="p-0 flex align-end w-full h-full object-contain transform transition group-hover:scale-108 duration-400 ease-out"
            src={`${produto.imagem}`}
            alt="Imagem do produto"
          />
        </CardContent>
      </div>
    </Card>
  );
};

export default CardProduto;
