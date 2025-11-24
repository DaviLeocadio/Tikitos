"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  limparCarrinho,
  obterCarrinho,
  obterQuantidade,
} from "@/utils/carrinho";

export default function FinalizarPagamentoButton({ pagamento, cpf }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("confirm");
  const [contador, setContador] = useState(3);
  const [buttonActive, setButtonActive] = useState(false);

  useEffect(() => {
    const quantidadeItens = obterQuantidade();
    console.log("Validação:", { quantidadeItens, pagamento, cpf, cpfLength: cpf?.length });
    
    // Validação mais robusta
    if (quantidadeItens > 0 && pagamento && cpf && cpf.trim().length >= 11) {
      setButtonActive(true);
    } else {
      setButtonActive(false);
    }
  }, [pagamento, cpf]);

  const finalizarVenda = async () => {
    setStep("loading");

    const itens = obterCarrinho();

    // Validação adicional antes de enviar
    if (!itens || itens.length === 0) {
      alert("Carrinho vazio!");
      setStep("confirm");
      return;
    }

    if (!pagamento || !cpf) {
      alert("Forma de pagamento ou CPF não informado!");
      setStep("confirm");
      return;
    }

    // Remove formatação do CPF (apenas números)
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) {
      alert("CPF inválido! Deve conter 11 dígitos.");
      setStep("confirm");
      return;
    }

    // Resolve o tipo de pagamento
    const tipoPagamento =
      pagamento === "debito" || pagamento === "credito" ? "cartao" : pagamento;

    // Monta o payload exatamente como no Postman
    const venda = {
      produtos: itens.map((item) => ({
        id_produto: item.id_produto,
        quantidade: item.quantidade,
      })),
      pagamento: {
        tipo: tipoPagamento,
        cpf: cpf, // Envia o CPF COM formatação (como no Postman)
      },
    };

    console.log("Payload sendo enviado:", JSON.stringify(venda, null, 2));

    try {
      const response = await fetch("http://localhost:8080/vendedor/vendas", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(venda),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro do servidor:", data);
        throw new Error(data.error || `Erro ${response.status}: ${response.statusText}`);
      }

      console.log("Venda finalizada com sucesso:", data);
      setStep("success");

      let n = 3;
      const interval = setInterval(() => {
        n--;
        setContador(n);
        if (n === 0) {
          clearInterval(interval);
          limparCarrinho();
          setOpen(false);
          setStep("confirm");
          setContador(3);
          window.location.href = "/vendedor/pdv";
        }
      }, 1000);

    } catch (e) {
      alert(`Erro ao finalizar venda: ${e.message}`);
      console.error("Erro completo:", e);
      setStep("confirm");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={!buttonActive}
        className={` ${
          !buttonActive ? "pointer-events-none opacity-75 grayscale-75" : ""
        }
            bg-[#4f6940] max-w-2xs rounded-[50px] mt-2 py-2 px-5 text-[#9bf377] text-sm font-bold w-full h-13 flex gap-3 justify-center items-center transform transition-all duration-400 ease-out hover:bg-[#65745A] hover:scale-97 cursor-pointer`}
      >
        <h3 className="text-lg">Finalizar pagamento</h3>
        <ChevronRight size={25} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-[#e8c5f1] border-3 border-[#924187] border-dashed rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#76196c] font-extrabold text-xl">
              {step === "confirm" && "Confirmar venda"}
              {step === "loading" && "Processando..."}
              {step === "success" && "Venda concluída!"}
            </DialogTitle>
          </DialogHeader>

          {step === "confirm" && (
            <p className="text-[#4f6940] font-medium text-md">
              Tem certeza que deseja finalizar esta compra?
            </p>
          )}

          {step === "loading" && (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-[#76196c] mx-auto"></div>
              <p className="mt-4 text-[#76196c] font-bold">
                Finalizando venda...
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-6">
              <p className="text-[#4f6940] text-xl font-extrabold">
                🎉 Venda concluída!
              </p>
              <p className="text-[#76196c] font-medium mt-2">
                Fechando em {contador}...
              </p>
            </div>
          )}

          <DialogFooter className="mt-4">
            {step === "confirm" && (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="bg-[#9bf377] text-[#4f6940] hover:bg-[#75ba51] cursor-pointer"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>

                <Button
                  className="bg-[#76196c] text-white hover:bg-[#924187] cursor-pointer"
                  onClick={finalizarVenda}
                >
                  Confirmar
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}