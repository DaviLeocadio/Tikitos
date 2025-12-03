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

export default function ModalEditarProduto({
  produto,
  open,
  onClose,
  onSalvar,
}) {
  const [produtoInfo, setProdutoInfo] = useState({
    idCategoria: null,
    idFornecedor: null,
    nome: "",
    descricao: "",
    categoria: "",
    custo: "",
    lucro: "",
    imagem: "",
  });
  const [loading, setLoading] = useState(false);

  // Calcula o preço automaticamente baseado em custo e lucro
  const calcularPreco = (custo, lucro) => {
    const custoNum = parseFloat(custo) || 0;
    const lucroNum = parseFloat(lucro) || 0;
    return (custoNum * (1 + lucroNum / 100)).toFixed(2);
  };

  const precoCalculado = calcularPreco(produtoInfo.custo, produtoInfo.lucro);

  useEffect(() => {
    if (produto && open) {
      setProdutoInfo({
        idCategoria: produto.categoria?.id_categoria || null,
        idFornecedor: produto.id_fornecedor || null,
        nome: produto.nome || "",
        descricao: produto.descricao || "",
        categoria: produto.categoria?.nome || "",
        custo: produto.custo?.toString() || "",
        lucro: produto.lucro?.toString() || "",
        imagem: produto.imagem || "",
      });
    }
  }, [produto, open]);

  const handleSalvar = async () => {
    // Validação básica
    if (!produtoInfo.nome.trim()) {
      alert("O nome do produto é obrigatório");
      return;
    }

    if (!produtoInfo.custo || parseFloat(produtoInfo.custo) < 0) {
      alert("O custo deve ser um valor válido");
      return;
    }

    if (!produtoInfo.lucro || parseFloat(produtoInfo.lucro) < 0) {
      alert("O lucro deve ser um valor válido");
      return;
    }

    setLoading(true);
    
    // Prepara os dados para enviar ao backend
    // Converte undefined para null para evitar erro no MySQL
    const dadosParaEnviar = {
      idCategoria: produtoInfo.idCategoria || null,
      idFornecedor: produtoInfo.idFornecedor || null,
      nome: produtoInfo.nome.trim(),
      descricao: produtoInfo.descricao?.trim() || null,
      custo: parseFloat(produtoInfo.custo),
      lucro: parseFloat(produtoInfo.lucro),
      imagem: produtoInfo.imagem?.trim() || null,
    };

    try {
      await onSalvar(produto.id_produto, dadosParaEnviar);
      console.log("Dados enviados:", dadosParaEnviar);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar o produto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    // Validação para campos numéricos
    if (name === "custo" || name === "lucro") {
      // Permite apenas números e ponto decimal
      if (value !== "" && !/^\d*\.?\d*$/.test(value)) {
        return;
      }
    }

    setProdutoInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#e8c5f1] border-3 border-[#924187] border-dashed rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#76196c] font-extrabold text-xl">
            Editar Produto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <div className="mb-2 flex flex-col">
            <label
              htmlFor="nome"
              className="text-sm text-[#569a33] font-semibold"
            >
              Nome: <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={produtoInfo.nome}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label
              htmlFor="descricao"
              className="text-sm text-[#569a33] font-semibold"
            >
              Descrição:
            </label>
            <textarea
              id="descricao"
              name="descricao"
              rows="3"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro resize-none"
              value={produtoInfo.descricao}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label
              htmlFor="categoria"
              className="text-sm text-[#569a33] font-semibold"
            >
              Categoria:
            </label>
            <input
              type="text"
              id="categoria"
              name="categoria"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-gray-200 px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro cursor-not-allowed"
              value={produtoInfo.categoria}
              disabled
              title="A categoria não pode ser alterada aqui"
            />
            <span className="text-xs text-gray-600 mt-1">
              Para alterar a categoria, use o campo apropriado
            </span>
          </div>

          <div className="mb-2 flex flex-col">
            <label
              htmlFor="custo"
              className="text-sm text-[#569a33] font-semibold"
            >
              Custo (R$): <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="custo"
              name="custo"
              placeholder="0.00"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={produtoInfo.custo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label
              htmlFor="lucro"
              className="text-sm text-[#569a33] font-semibold"
            >
              Lucro (%): <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="lucro"
              name="lucro"
              placeholder="0.00"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={produtoInfo.lucro}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label className="text-sm text-[#569a33] font-semibold">
              Preço Calculado (R$):
            </label>
            <div className="text-lg font-bold text-[#76196c] bg-gray-100 px-2 py-1 rounded-lg border-1 border-dashed border-[#924187]">
              R$ {precoCalculado}
            </div>
            <span className="text-xs text-gray-600 mt-1">
              Calculado automaticamente: Custo × (1 + Lucro/100)
            </span>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="imagem"
              className="text-sm text-[#569a33] font-semibold"
            >
              Imagem (URL):
            </label>
            <input
              type="text"
              id="imagem"
              name="imagem"
              placeholder="https://exemplo.com/imagem.jpg"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={produtoInfo.imagem}
              onChange={handleChange}
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              className="flex-1 bg-[#9bf377] text-[#4f6940] hover:bg-[#75ba51] font-semibold cursor-pointer"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#76196c] text-white hover:bg-[#924187] font-semibold cursor-pointer"
              onClick={handleSalvar}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}