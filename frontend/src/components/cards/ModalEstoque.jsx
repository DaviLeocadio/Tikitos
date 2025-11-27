"use client";

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

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip_one";

import { OctagonAlert } from "lucide-react";

export default function ModalEstoque({ produto }) {
  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <i className="bi bi-exclamation-triangle-fill text-[16px] text-[#e6a700] hover:scale-95 transition cursor-pointer"></i>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs text-center">
          <p>Situação do</p>
          <p>estoque</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent className="bg-[#edd5f4]">
        <AlertDialogHeader className="items-center">
          <div className="flex justify-center mb-2">
            <OctagonAlert className="w-8 h-8 text-red-600" />
          </div>

          <AlertDialogTitle className="text-center text-[18px] text-[#76196c]">
            Classificação de Estoque
          </AlertDialogTitle>

          <AlertDialogDescription className="text-[14px] text-center">
            {produto?.estoqueClassificacao || "Aqui você pode visualizar a classificação de estoque do produto."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 sm:justify-center gap-2">
          <AlertDialogCancel className="bg-[#65745A] rounded-[50px] py-2 px-5 text-[#caf4b7] text-sm font-semibold">
            Fechar
          </AlertDialogCancel>
          <button className="bg-[#65745A] rounded-[50px] py-2 px-5 text-[#caf4b7] text-sm font-semibold">
            Relatar defeito
          </button>
          <button className="bg-[#65745A] rounded-[50px] py-2 px-5 text-[#caf4b7] text-sm font-semibold">
            Lista de espera
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
