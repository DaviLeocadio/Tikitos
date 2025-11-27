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

export default function ModalInformacoesProduto({ produto }) {
  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <i className="bi bi-info-circle-fill text-[16px] text-[#569a33] hover:scale-95 transition cursor-pointer"></i>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs text-center">
          <p>Informações</p>
          <p>do produto</p>
        </TooltipContent>
      </Tooltip>

      <AlertDialogContent className="bg-[#edd5f4]">
        <AlertDialogHeader className="items-center">
          <AlertDialogTitle className="flex flex-col justify-center items-center">
            <img className="h-25" src="/img/categorias/bonecos_categoria.png" />
            <div className="flex flex-col justify-center items-center text-sm/6">
              <h4 className="text-[14px] text-[#75BA51]">CATEGORIA</h4>
              <h1 className="font-bold mt-[-7px] text-[20px] text-[#76196c]">
                {produto?.categoria || "Bonecos"}
              </h1>
            </div>
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-center">
            {produto?.descricao || "Aqui você pode mostrar dados adicionais sobre o produto."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-2 sm:justify-center">
          <AlertDialogCancel className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold">
            Fechar
          </AlertDialogCancel>
          <button className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold">
            Relatar erro
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
