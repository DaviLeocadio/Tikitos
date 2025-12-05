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
import { aparecerToast } from "@/utils/toast";

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

  const [imagemFile, setImagemFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const calcularPreco = (custo, lucro) => {
    const c = parseFloat(custo) || 0;
    const l = parseFloat(lucro) || 0;
    return (c * (1 + l / 100)).toFixed(2);
  };

  const precoCalculado = calcularPreco(produtoInfo.custo, produtoInfo.lucro);
  useEffect(() => {
    if (produto && open) {
      const resolveImage = (p) => {
        if (!p) return "";
        if (p.startsWith("/img")) return p; // FRONT
        if (p.startsWith("http")) return p; // URL completa
        return "/" + p.replace(/^\/+/, ""); // fallback
      };

      const imgFull = resolveImage(produto.imagem);

      setProdutoInfo({
        idCategoria: produto.categoria?.id_categoria || null,
        idFornecedor: produto.id_fornecedor || null,
        nome: produto.nome || "",
        descricao: produto.descricao || "",
        categoria: produto.categoria?.nome || "",
        custo: produto.custo?.toString() || "",
        lucro: produto.lucro?.toString() || "",
        imagem: imgFull,
      });

      console.log("Produto recebido no modal:", produto);

      setPreview(imgFull);
      setImagemFile(null);
    }
  }, [produto, open]);

 const handleSalvar = async () => {
  console.log("ID do produto dentro do modal:", produto?.id_produto);

  if (!produtoInfo.nome.trim())
    return aparecerToast("O nome é obrigatório");
  if (!produtoInfo.custo || parseFloat(produtoInfo.custo) < 0)
    return aparecerToast("Custo inválido");
  if (!produtoInfo.lucro || parseFloat(produtoInfo.lucro) < 0)
    return aparecerToast("Lucro inválido");

  setLoading(true);

  try {
    const id = produto.id_produto;

    let dados;

    if (imagemFile) {
      dados = new FormData();
      dados.append("nome", produtoInfo.nome.trim());
      dados.append("descricao", produtoInfo.descricao || "");
      dados.append("id_categoria", produtoInfo.idCategoria || "");
      dados.append("id_fornecedor", produtoInfo.idFornecedor || "");
      dados.append("custo", produtoInfo.custo || "0");
      dados.append("lucro", produtoInfo.lucro || "0");
      dados.append("imagem", imagemFile);
    } 
    
    else {
      dados = {
        idCategoria: produtoInfo.idCategoria || null,
        idFornecedor: produtoInfo.idFornecedor || null,
        nome: produtoInfo.nome.trim(),
        descricao: produtoInfo.descricao?.trim() || null,
        custo: parseFloat(produtoInfo.custo),
        lucro: parseFloat(produtoInfo.lucro),
      };
    }

    await onSalvar(id, dados);

    onClose();
  } catch (e) {
    console.error("Erro ao salvar produto:", e);
    aparecerToast("Erro ao salvar");
  } finally {
    setLoading(false);
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    if (
      (name === "custo" || name === "lucro") &&
      value !== "" &&
      !/^\d*\.?\d*$/.test(value)
    )
      return;

    setProdutoInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "image/png")
      return aparecerToast("A imagem deve ser PNG.");
    if (file.size > 5 * 1024 * 1024) return aparecerToast("Máximo 5MB.");

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    img.onload = () => {
      if (img.width !== img.height) {
        URL.revokeObjectURL(url);
        return aparecerToast("A imagem deve ser quadrada.");
      }

      setImagemFile(file);
      setPreview(url);
    };
  };

  const removerImagem = () => {
    if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    setImagemFile(null);
    setPreview(produtoInfo.imagem || "");
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-[#e8c5f1] border-3 border-[#924187] border-dashed rounded-3xl">
        <style>{`
          .scroll-edit::-webkit-scrollbar { width: 8px; }
          .scroll-edit::-webkit-scrollbar-track { background: transparent; }
          .scroll-edit::-webkit-scrollbar-thumb { background: #924187; border-radius: 10px; }
        `}</style>

        <DialogHeader>
          <DialogTitle className="text-[#76196c] font-extrabold text-xl">
            Editar Produto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 scroll-edit">
          <div className="flex flex-col">
            <label className="text-sm text-[#569a33] font-semibold">
              Nome:
            </label>
            <input
              type="text"
              name="nome"
              value={produtoInfo.nome}
              onChange={handleChange}
              className="text-md font-semibold text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border border-dashed border-roxoescuro"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-[#569a33] font-semibold">
              Descrição:
            </label>
            <textarea
              name="descricao"
              value={produtoInfo.descricao}
              rows="3"
              onChange={handleChange}
              className="text-md font-semibold text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border border-dashed border-roxoescuro resize-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-[#569a33] font-semibold">
              Categoria:
            </label>
            <input
              type="text"
              value={produtoInfo.categoria}
              disabled
              className="text-md font-semibold text-[#76196c] bg-gray-200 px-2 py-1 rounded-lg border border-dashed border-roxoescuro"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-[#569a33] font-semibold">
              Custo (R$):
            </label>
            <input
              type="text"
              name="custo"
              value={produtoInfo.custo}
              onChange={handleChange}
              className="text-md font-semibold text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border border-dashed border-roxoescuro"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-[#569a33] font-semibold">
              Lucro (%):
            </label>
            <input
              type="text"
              name="lucro"
              value={produtoInfo.lucro}
              onChange={handleChange}
              className="text-md font-semibold text-[#76196c] bg-verdeclaro px-2 py-1 rounded-lg border border-dashed border-roxoescuro"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-[#569a33] font-semibold">
              Preço Calculado:
            </label>
            <div className="text-lg font-bold text-[#76196c] bg-gray-100 px-2 py-1 rounded-lg border border-dashed border-[#924187]">
              R$ {precoCalculado}
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-[#569a33] font-semibold">
              Imagem:
            </label>

            <div className="w-72 h-72 border-4 border-dashed border-[#d695e7] rounded-2xl bg-[#f4e1fa] flex items-center justify-center overflow-hidden relative shadow-md">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <div className="text-[#76196c] opacity-50">Sem imagem</div>
              )}

              {preview && (
                <button
                  onClick={removerImagem}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                >
                  ✕
                </button>
              )}
            </div>

            <label className="mt-3 cursor-pointer border-2 border-dashed border-[#d695e7] bg-[#fef5ff] p-3 rounded-xl text-center text-[#76196c] hover:bg-[#f7e7fb]">
              Selecionar nova imagem (PNG)
              <input
                type="file"
                accept="image/png"
                onChange={handleFile}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-[#9bf377] text-[#4f6940]"
            >
              Cancelar
            </Button>

            <Button
              onClick={() => handleSalvar()}
              disabled={loading}
              className="flex-1 bg-[#76196c] text-white"
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
