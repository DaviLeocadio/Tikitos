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
import { AlertCircle, CheckCircle, Power, PowerOff,RotateCcwKey } from "lucide-react";
import { aparecerToast } from "@/utils/toast"

export default function ModalResetarSenhaUsuario({ funcionario, open, onClose, onSalvar }) {
    const [loading, setLoading] = useState(false);
    const isInativo = false
    const handleConfirmar = async () => {
        const usuarioId = funcionario.id_usuario;
        if (!usuarioId) {
            aparecerToast("Usuário inválido!");
            return;
        }
        setLoading(true)
        try {
            const res = await fetch(`http://localhost:8080/admin/usuarios/${usuarioId}/resetar-senha`, {
                method: "PUT",
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json()
                aparecerToast(
                    data?.mensagem || "Senha resetada com sucesso");
                await onSalvar();
                onClose();
            } else {
                const error = await response.json();
                aparecerToast(error.error || "Erro ao resetar senha!");
            }
        } catch (error) {
            console.error("Erro ao resetar senha:", error);
            aparecerToast("Erro ao resetar senha do usuário!");
        } finally {
            setLoading(false);
        }

    }
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent
                className={`bg-gradient-to-br from-red-100 to-red-200 border-3 border-red-600 border-dashed rounded-3xl`}
            >
                <AlertDialogHeader>
                    <div className="flex justify-center mb-4">
                        <div
                            className={`bg-red-600 rounded-full p-4`}
                        >
                            <RotateCcwKey size={48} className="text-white" />
                        </div>
                    </div>
                    <AlertDialogTitle
                        className={`text-red-600 font-extrabold text-2xl text-center`}
                    >
                        Resetar Senha?
                    </AlertDialogTitle>
                </AlertDialogHeader>

                <div className="space-y-3">
                    <div className=" rounded-lg p-4">
                        <p className="text-sm text-[#8F3D84] font-semibold mb-2">Funcionário:</p>
                        <p className="text-lg font-bold text-[#76196c]">{funcionario?.nome}</p>
                        <p className="text-xs text-[#9D4E92] mt-1">{funcionario?.email}</p>
                    </div>

                    <div
                        className={`bg-[#ff6b35]/10 border-red-600 border-2 border-dashed rounded-lg p-3`}
                    >
                        <div className="flex gap-2">
                            <AlertCircle
                                size={20}
                                className={"text-red-600"}
                            />
                            <p className="text-sm text-red-800">
                                O funcionário não poderá mais usar a senha atual e deverá definir uma nova senha
                            </p>
                        </div>
                    </div>
                </div>

                <AlertDialogFooter className="mt-6">
                    <AlertDialogCancel
                        className={`border-2 font-bold cursor-pointer
                                 bg-[#EAFAE3] text-orange-600 border-[#ff6b35]
                                 hover:bg-[#EAFAE3] hover:text-orange-600
                                 `}
                        disabled={loading}
                    >
                        Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                        className={`bg-red-600 text-white hover:bg-red-700 font-bold cursor-pointer`}
                        onClick={handleConfirmar}
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                {"Resetando..."}
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <RotateCcwKey size={16}/>
                                Resetar
                            </span>
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}