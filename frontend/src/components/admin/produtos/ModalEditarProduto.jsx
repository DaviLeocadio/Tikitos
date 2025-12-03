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
    nome: "",
    descricao: "",
    categoria:"",
    custo: "",
    lucro: "",
    preco: "",
    imagem: "",
    status: "ativo",
  });
  const [loading, setLoading] = useState(false);

  console.log(produto)
  useEffect(() => {
    if (produto && open) {
      setProdutoInfo({
        nome: produto.nome || "",
        descricao: produto.descricao || "",
        categoria: produto.categoria.nome || "",
        custo: produto.custo || "",
        lucro: produto.lucro || "",
        preco: produto.preco || "",
        imagem: produto.imagem || "",
        status: produto.status || "ativo",
      });
    }
  }, [produto, open]);

  const handleSalvar = async () => {
    setLoading(true);
    await onSalvar(produto.id_produto, produtoInfo);
    setLoading(false);
    onClose();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
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

        <div className="space-y-3">
          <div className="mb-2 flex flex-col">
            <label
              htmlFor="nome"
              className="text-sm text-[#569a33] font-semibold"
            >
              Nome:
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={produtoInfo.nome}
              onChange={handleChange}
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
              type="text"
              id="descricao"
              name="descricao"
              className="text-md h-25 font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={produtoInfo.descricao}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label
              htmlFor="custo"
              className="text-sm text-[#569a33] font-semibold"
            >
              Categoria:
            </label>
            <input
              type="text"
    
              id="categoria"
              name="categoria"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={produtoInfo.categoria}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label
              htmlFor="custo"
              className="text-sm text-[#569a33] font-semibold"
            >
              Custo:
            </label>
            <input
              type="text"
              step="0.01"
              id="custo"
              name="custo"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={produtoInfo.custo}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label
              htmlFor="lucro"
              className="text-sm text-[#569a33] font-semibold"
            >
              Lucro:
            </label>
            <input
              type="text"
              step="0.01"
              id="lucro"
              name="lucro"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={produtoInfo.lucro}
              onChange={handleChange}
            />
          </div>

          <div className="mb-2 flex flex-col">
            <label
              htmlFor="preco"
              className="text-sm text-[#569a33] font-semibold"
            >
              Preço:
            </label>
            <input
              type="text"
              step="0.01"
              id="preco"
              name="preco"
              className="text-md font-semibold focus-visible:outline-none text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border-1 border-dashed border-roxoescuro"
              value={produtoInfo.preco}
              onChange={handleChange}
            />
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