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
console.log(vendedor)
  const handleConfirmar = async () => {

    if (!vendedor?.id_usuario) {
      aparecerToast("Vendedor inválido!");
      return;
    }

    setLoading(true);
    try {
      const endpoint = isInativo
        ? `http://localhost:8080/admin/gerentes/${vendedor.id_usuario}/ativar`
        : `http://localhost:8080/admin/gerentes/${vendedor.id_usuario}/desativar`;

      const method = isInativo ? "POST" : "DELETE";

      const response = await fetch(endpoint, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        aparecerToast(
          isInativo
            ? "Integrante reativado com sucesso!"
            : "Integrante desativado com sucesso!"
        );
        await onSalvar();
        onClose();
      } else {
        const error = await response.json();
        aparecerToast(
          error.error || "Erro ao atualizar status do integrante!"
        );
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      aparecerToast("Erro ao atualizar status do integrante!");
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
            {isInativo ? "Reativar Integrante?" : "Desativar Integrante?"}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-3">
          <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300">
            <p className="text-sm text-gray-600 font-semibold mb-2">
              Integrante:
            </p>
            <p className="text-lg font-bold text-[#76196c]">
              {vendedor?.nome}
            </p>
            <p className="text-xs text-gray-500 mt-1">{vendedor?.email}</p>
          </div>

          <div
            className={`${
              isInativo
                ? "bg-[#569a33]/10 border-[#569a33]"
                : "bg-[#ff6b35]/10 border-[#ff6b35]"
            } border-2 border-dashed rounded-lg p-3`}
          >
            <div className="flex gap-2">
              <AlertCircle
                size={20}
                className={isInativo ? "text-[#569a33]" : "text-[#ff6b35]"}
              />
              <p className="text-sm font-semibold text-gray-700">
                {isInativo
                  ? "O integrante poderá fazer login e acessar suas vendas novamente."
                  : "O integrante não poderá fazer login. Suas informações serão mantidas."}
              </p>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="mt-6">
          <AlertDialogCancel
            className={`${
              isInativo
                ? "bg-white text-[#4f6940] hover:bg-gray-100 border-[#569a33]"
                : "bg-white text-[#ff6b35] hover:bg-gray-100 border-[#ff6b35]"
            } border-2 font-bold cursor-pointer`}
            disabled={loading}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={`${
              isInativo
                ? "bg-[#569a33] text-white hover:bg-[#4f6940]"
                : "bg-[#ff6b35] text-white hover:bg-[#e55a2b]"
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
