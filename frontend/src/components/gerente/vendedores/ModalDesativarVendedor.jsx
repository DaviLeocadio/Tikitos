"use client";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { AlertCircle, CheckCircle, Power, PowerOff } from "lucide-react";
import { aparecerToast } from "@/utils/toast";

export default function ModalDesativarVendedor({
  vendedor,
  open,
  onClose,
  onSalvar,
}) {
  const [loading, setLoading] = useState(false);
  const isInativo = vendedor?.status === "inativo";

  const handleConfirmar = async () => {
    if (!vendedor?.id_usuario) {
      aparecerToast("Vendedor inválido!");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isInativo
        ? `http://localhost:8080/gerente/vendedores/${vendedor.id_usuario}/reativar`
        : `http://localhost:8080/gerente/vendedores/${vendedor.id_usuario}/desativar`;

      const method = isInativo ? "POST" : "DELETE";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        aparecerToast(
          isInativo
            ? "Vendedor reativado com sucesso!"
            : "Vendedor desativado com sucesso!"
        );
        await onSalvar();
        onClose();
      } else {
        const error = await response.json();
        aparecerToast(
          error.error || "Erro ao atualizar status do vendedor!"
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      aparecerToast("Erro ao atualizar status do vendedor!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent
        className={`${
          isInativo
            ? "bg-gradient-to-br from-[#c5ffad] to-[#e8f5e8] border-3 border-[#569a33]"
            : "bg-gradient-to-br from-[#ffe8d1] to-[#ffd9b3] border-3 border-[#ff6b35]"
        } border-dashed rounded-3xl`}
      >
        <AlertDialogHeader>
          <div className="flex justify-center mb-4">
            <div
              className={`${
                isInativo ? "bg-[#569a33]" : "bg-[#ff6b35]"
              } rounded-full p-4`}
            >
              {isInativo ? (
                <Power size={48} className="text-white" />
              ) : (
                <PowerOff size={48} className="text-white" />
              )}
            </div>
          </div>
          <AlertDialogTitle
            className={`${
              isInativo ? "text-[#4f6940]" : "text-[#ff6b35]"
            } font-extrabold text-2xl text-center`}
          >
            {isInativo ? "Reativar Vendedor?" : "Desativar Vendedor?"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div className=" rounded-lg p-4">
            <p className="text-sm text-[#9D4E92] font-semibold mb-2">
              Vendedor:
            </p>
            <p className="text-lg font-bold text-[#76196c]">
              {vendedor?.nome}
            </p>
            <p className="text-xs text-[#9D4E92] mt-1">{vendedor?.email}</p>
          </div>

          <div
            className={`${
              isInativo
                ? "bg-[#569a33]/10 border-[#569a33]"
                : "bg-[#ff6b35]/10 border-[#ff6b35]"
            } border-2 rounded-lg p-3`}
          >
            <div className="flex gap-2">
              <AlertCircle
                size={20}
                className={isInativo ? "text-[#569a33]" : "text-[#ff6b35]"}
              />
              <p className="text-sm font-semibold text-[#ff6b35]">
                {isInativo
                  ? "O vendedor poderá fazer login e acessar suas vendas novamente."
                  : "O vendedor não poderá fazer login. Suas informações serão mantidas."}
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            className={`${
              isInativo
                ? "bg-white text-[#4f6940] hover:bg-gray-100 border-[#569a33]"
                : "bg-[#C5FFAD] text-[#559637] hover:bg-[#559637] hover:text-[#C5FFAD] border-[#92EF6C]"
            } border-2 font-bold cursor-pointer`}
            disabled={loading}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={`${
              isInativo
                ? "bg-[#569a33] text-[#C5FFAD] hover:bg-[#4f6940]"
                : "bg-[#ff6b35] text-[#C5FFAD] hover:bg-[#e55a2b]"
            } font-bold cursor-pointer`}
            onClick={handleConfirmar}
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                {isInativo ? "Reativando..." : "Desativando..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {isInativo ? (
                  <>
                    <Power size={16} />
                    Reativar
                  </>
                ) : (
                  <>
                    <PowerOff size={16} />
                    Desativar
                  </>
                )}
              </span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
