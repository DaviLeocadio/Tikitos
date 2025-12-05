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
  calcularTotal,
} from "@/utils/carrinho";
import { aparecerToast } from "@/utils/toast";

export default function FinalizarPagamentoButton({
  pagamento,
  cpf,
  embalagem = false,
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("confirm");
  const [contador, setContador] = useState(3);
  const [buttonActive, setButtonActive] = useState(false);
  const [mensagemValidacao, setMensagemValidacao] = useState("");
  const [valorRecebido, setValorRecebido] = useState();
  const [pdfBase64, setPdfBase64] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setValorRecebido(localStorage.getItem("valorRecebido"));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Validação em tempo real
  useEffect(() => {
    const quantidadeItens = obterQuantidade();
    const cpfLimpo = cpf ? cpf.replace(/\D/g, "") : "";
    const total = calcularTotal();
    console.log(valorRecebido);
    // Reseta mensagem
    setMensagemValidacao("");

    // Validações
    if (quantidadeItens === 0) {
      setMensagemValidacao("Adicione produtos ao carrinho");
      setButtonActive(false);
      return;
    }

    if (!pagamento) {
      setMensagemValidacao("Selecione um método de pagamento");
      setButtonActive(false);
      return;
    }

    if (!cpf || cpf.trim().length === 0) {
      setMensagemValidacao("Digite o CPF para nota fiscal");
      setButtonActive(false);
      return;
    }

    if (cpfLimpo.length !== 11) {
      setMensagemValidacao("CPF deve ter 11 dígitos");
      setButtonActive(false);
      return;
    }

    if (pagamento === "dinheiro") {
      const recebido = Number(valorRecebido || 0);
      if (recebido < total) {
        setMensagemValidacao("Valor recebido insuficiente");
        setButtonActive(false);
        return;
      }
    }

    // Tudo OK
    setMensagemValidacao("");
    setButtonActive(true);
  }, [pagamento, cpf, valorRecebido]);

  const finalizarVenda = async () => {
    setStep("loading");

    const itens = obterCarrinho();

    // Validação adicional antes de enviar
    if (!itens || itens.length === 0) {
      aparecerToast("Carrinho vazio!");
      setStep("confirm");
      return;
    }

    if (!pagamento || !cpf) {
      aparecerToast("Forma de pagamento ou CPF não informado!");
      setStep("confirm");
      return;
    }

    // Remove formatação do CPF
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (cpfLimpo.length !== 11) {
      aparecerToast("CPF inválido! Deve conter 11 dígitos.");
      setStep("confirm");
      return;
    }

    // Resolve o tipo de pagamento
    const tipoPagamento =
      pagamento === "débito" || pagamento === "crédito" ? "cartao" : pagamento;

    // Calcula o total com embalagem se necessário
    const totalCarrinho = calcularTotal();
    const totalFinal = embalagem ? totalCarrinho + 1.5 : totalCarrinho;

    // Monta o payload
    const venda = {
      produtos: itens.map((item) => ({
        id_produto: item.id_produto,
        quantidade: item.quantidade,
      })),
      pagamento: {
        tipo: tipoPagamento,
        cpf: cpf,
      },
      embalagem: embalagem,
      total: totalFinal,
    };

    console.log("Payload sendo enviado:", JSON.stringify(venda, null, 2));

    function baixarPdf(base64) {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "comprovante-venda.pdf";
      a.click();

      URL.revokeObjectURL(url);
    }
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
        throw new Error(
          data.error || `Erro ${response.status}: ${response.statusText}`
        );
      }

      console.log("Venda finalizada com sucesso:", data);
      setPdfBase64(data.pdf);
      baixarPdf(data.pdf);
      setStep("success");

      // Countdown para fechar
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
      aparecerToast(`Erro ao finalizar venda: ${e.message}`);
      console.error("Erro completo:", e);
      setStep("confirm");
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={() => setOpen(true)}
        disabled={!buttonActive}
        className={`
          bg-[#4f6940] rounded-[50px] py-2 px-4 sm:px-5 
          text-[#9bf377] text-sm sm:text-base font-bold 
          flex gap-2 sm:gap-3 justify-center items-center 
          transform transition-all duration-300 ease-out 
          ${
            buttonActive
              ? "hover:bg-[#65745A] hover:scale-[0.97] cursor-pointer"
              : "pointer-events-none opacity-75 grayscale cursor-not-allowed"
          }
        `}
      >
        <h3 className="text-base sm:text-lg whitespace-nowrap">
          Finalizar pagamento
        </h3>
        <ChevronRight size={20} className="sm:w-6 sm:h-6" />
      </button>

      {/* Mensagem de validação */}
      {mensagemValidacao && (
        <p className="text-xs sm:text-sm text-[#924187] font-semibold text-right animate-pulse mx-auto">
          {mensagemValidacao}
        </p>
      )}

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
            <div className="space-y-3">
              <p className="text-[#4f6940] font-medium text-md">
                Tem certeza que deseja finalizar esta compra?
              </p>
              <div className="bg-white/50 rounded-lg p-3 text-sm">
                <p className="text-[#76196c] font-semibold">
                  Pagamento: <span className="font-normal">{pagamento}</span>
                </p>
                <p className="text-[#76196c] font-semibold">
                  CPF: <span className="font-normal">{cpf}</span>
                </p>
                {embalagem && (
                  <p className="text-[#76196c] font-semibold">
                    Embalagem:{" "}
                    <span className="font-normal">Sim (+R$1,50)</span>
                  </p>
                )}
                <p className="text-[#4f6940] font-bold mt-2">
                  Total: R${" "}
                  {(calcularTotal() + (embalagem ? 1.5 : 0))
                    .toFixed(2)
                    .replace(".", ",")}
                </p>
              </div>
            </div>
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
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-[#4f6940] text-xl font-extrabold">
                Venda concluída!
              </p>
              <p className="text-[#76196c] font-medium mt-2">
                Fechando em {contador}...
              </p>
            </div>
          )}

          <DialogFooter className="mt-4">
            {step === "confirm" && (
              <div className="flex gap-2 w-full">
                <Button
                  variant="secondary"
                  className="flex-1 bg-[#9bf377] text-[#4f6940] hover:bg-[#75ba51] cursor-pointer font-bold"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>

                <Button
                  className="flex-1 bg-[#76196c] text-white hover:bg-[#924187] cursor-pointer font-bold"
                  onClick={finalizarVenda}
                >
                  Confirmar
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
