import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip_one";
import React from "react";
import { adicionarAoCarrinho, obterCarrinho } from "@/utils/carrinho.js"

const CardProduto = ({ produto }) => {
  const handleAdd = () => {
    adicionarAoCarrinho(produto);
    console.log(obterCarrinho())
  }

  return (
    <Card
      className="group min-w-53 shadow-none gap-0 pt-0 pb-0 bg-[#D8F1DC] border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-2 hover:bg-[#C8FDB4] transition"
      onClick={handleAdd}
    >
      <CardHeader className="pt-3 px-6 flex items-center flex-row justify-between gap-2 font-semibold text-sm">
        <div className="flex flex-col align-center">
          <h3 className="text-[#8C3E82] text-[12px] tracking-tighter">{produto.nome}</h3>
          <p className="text-[#c97fda] text-[12px]">{produto.preco}</p>
        </div>

        {/* Ícones com tooltips */}
        <div className="w-11 h-full flex justify-between items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <i className="bi bi-info-circle-fill text-[16px] text-[#569a33] hover:scale-95 transition cursor-pointer"></i>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs text-center">
              <p>Informações</p>
              <p>do produto</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <i className="bi bi-exclamation-circle-fill text-[16px] text-[#4f6940] hover:scale-95 transition cursor-pointer"></i>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs text-xs text-center">
              <p>Classificação</p>
              <p>de estoque</p>
            </TooltipContent>
          </Tooltip>
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