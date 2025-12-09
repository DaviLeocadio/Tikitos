"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Loader2,
  Plus,
  Package,
  Upload,
  X,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Percent,
} from "lucide-react";
import { aparecerToast } from "@/utils/toast";

export default function CriarProdutoPage() {
  const [form, setForm] = useState({
    idCategoria: "",
    idFornecedor: "",
    nome: "",
    descricao: "",
    custo: "",
    lucro: "",
    preco: "",
    proximoId: "",
  });

  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Validação em tempo real
  const validateField = useCallback((name, value) => {
    switch (name) {
      case "nome":
        if (!value.trim()) return "Nome é obrigatório";
        if (value.length < 3) return "Nome deve ter no mínimo 3 caracteres";
        if (value.length > 100) return "Nome muito longo (máx. 100 caracteres)";
        return "";
      case "custo":
        if (!value) return "Custo é obrigatório";
        if (Number(value) <= 0) return "Custo deve ser maior que zero";
        return "";
      case "lucro":
        if (value !== "" && Number(value) < 0)
          return "Lucro não pode ser negativo";
        if (value !== "" && Number(value) > 1000) return "Lucro muito alto";
        return "";
      case "preco":
        if (!value) return "Preço é obrigatório";
        if (Number(value) <= 0) return "Preço deve ser maior que zero";
        return "";
      case "idCategoria":
        if (!value) return "Selecione uma categoria";
        return "";
      case "idFornecedor":
        if (!value) return "Selecione um fornecedor";
        return "";
      default:
        return "";
    }
  }, []);

  // Cálculos automáticos melhorados
  const calcularPreco = (custo, lucro) => {
    if (!custo || !lucro) return "";
    return (Number(custo) * (1 + Number(lucro) / 100)).toFixed(2);
  };

  const calcularLucro = (custo, preco) => {
    if (!custo || !preco || Number(custo) === 0) return "";
    return ((Number(preco) / Number(custo) - 1) * 100).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Marca o campo como tocado
    setTouched((prev) => ({ ...prev, [name]: true }));

    if (name === "idCategoria") {
      const categoria = categorias.find(
        (c) => String(c.id_categoria) === String(value)
      );
      setForm((prev) => ({
        ...prev,
        idCategoria: value,
        proximoId: categoria ? String(categoria.proximo_produto_id) : "",
      }));
      setErrors((prev) => ({
        ...prev,
        idCategoria: validateField(name, value),
      }));
      return;
    }

    if (name === "custo") {
      let newForm = { ...form, custo: value };

      // Se tem lucro definido, recalcula preço
      if (form.lucro !== "") {
        newForm.preco = calcularPreco(value, form.lucro);
      }
      // Se tem preço definido, recalcula lucro
      else if (form.preco !== "") {
        newForm.lucro = calcularLucro(value, form.preco);
      }

      setForm(newForm);
      setErrors((prev) => ({
        ...prev,
        custo: validateField(name, value),
        preco: validateField("preco", newForm.preco),
      }));
      return;
    }

    if (name === "lucro") {
      let newForm = { ...form, lucro: value };

      // Se tem custo, recalcula preço
      if (form.custo !== "") {
        newForm.preco = calcularPreco(form.custo, value);
      }

      setForm(newForm);
      setErrors((prev) => ({
        ...prev,
        lucro: validateField(name, value),
        preco: validateField("preco", newForm.preco),
      }));
      return;
    }

    if (name === "preco") {
      let newForm = { ...form, preco: value };

      // Se tem custo, recalcula lucro
      if (form.custo !== "") {
        newForm.lucro = calcularLucro(form.custo, value);
      }

      setForm(newForm);
      setErrors((prev) => ({
        ...prev,
        preco: validateField(name, value),
        lucro: validateField("lucro", newForm.lucro),
      }));
      return;
    }

    setForm({ ...form, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleImagem = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Só aceita PNG
    if (file.type !== "image/png") {
      aparecerToast("A imagem deve ser PNG.");
      return;
    }

    // Não aceita imagens grandes
    if (file.size > 5 * 1024 * 1024) {
      aparecerToast("Imagem muito grande! Máximo 5MB.");
      return;
    }

    // Carrega a imagem na memória para validar o tamanho
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      if (img.width !== img.height) {
        URL.revokeObjectURL(img.src);
        aparecerToast("A imagem deve ser quadrada (ex: 600x600).");
        return;
      }

      // Se for quadrada → aceita
      setImagem(file);
      setPreview(img.src);
    };

    img.onerror = () => {
      aparecerToast("Erro ao processar a imagem. Tente outra.");
    };
  };

  const removerImagem = () => {
    setImagem(null);
    setPreview("");
    if (preview) URL.revokeObjectURL(preview);
  };

  // Fetch categorias e fornecedores
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "http://localhost:8080/admin/meta?categorias=true&fornecedores=true",
          {
            credentials: "include",
          }
        );
        const data = await res.json();

        if (res.ok) {
          setCategorias(data.categorias || []);
          setFornecedores(data.fornecedores || []);
        } else {
          aparecerToast(
            "Erro ao carregar dados: " + (data.error || "Erro desconhecido")
          );
        }
      } catch (err) {
        console.error("Erro ao buscar meta:", err);
        aparecerToast("Erro ao conectar com o servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchMeta();
  }, []);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSubmit = async () => {
    // Validação completa
    const newErrors = {
      nome: validateField("nome", form.nome),
      custo: validateField("custo", form.custo),
      preco: validateField("preco", form.preco),
      idCategoria: validateField("idCategoria", form.idCategoria),
      idFornecedor: validateField("idFornecedor", form.idFornecedor),
    };

    setErrors(newErrors);
    setTouched({
      nome: true,
      custo: true,
      preco: true,
      idCategoria: true,
      idFornecedor: true,
    });

    // Verifica se há erros
    if (Object.values(newErrors).some((err) => err !== "")) {
      aparecerToast("Por favor, corrija os erros no formulário");
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("id_categoria", form.idCategoria);
      fd.append("id_fornecedor", form.idFornecedor);
      fd.append("nome", form.nome.trim());
      fd.append("descricao", form.descricao.trim());
      fd.append("custo", form.custo);
      fd.append("lucro", form.lucro || "0");
      fd.append("preco", form.preco);

      if (form.proximoId) fd.append("proximo_id", form.proximoId);
      if (imagem) fd.append("imagem", imagem);

      const res = await fetch("http://localhost:8080/admin/produtos", {
        credentials: "include",
        method: "POST",
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        aparecerToast("Produto criado com sucesso!");

        // Limpa o formulário
        setForm({
          idCategoria: "",
          idFornecedor: "",
          nome: "",
          descricao: "",
          custo: "",
          lucro: "",
          preco: "",
          proximoId: "",
        });
        setImagem(null);
        setPreview("");
        setErrors({});
        setTouched({});
      } else {
        aparecerToast(data.error || "Erro ao criar o produto.");
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      aparecerToast("Erro inesperado ao criar o produto.");
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = () => {
    return (
      form.nome.trim() &&
      form.custo &&
      form.preco &&
      form.idCategoria &&
      form.idFornecedor &&
      Object.values(errors).every((err) => err === "")
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen  p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="animate-spin text-[#76196c] mx-auto mb-4"
            size={48}
          />
          <p className="text-[#76196c] font-medium">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-[#C5FFAD] w-full max-w-2xl rounded-3xl shadow-2xl border-dashed border-4 border-[#d695e7] p-6 sm:p-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-[#76196c] to-[#9b2b91] text-[#CAF4B7] px-6 py-4 rounded-2xl shadow-lg mb-6">
          <Package size={24} />
          <h1 className="text-xl sm:text-2xl font-bold tracking-wide">
            Cadastro de Produto
          </h1>
        </div>

        <div className="space-y-5">
          {/* Nome */}
          <div>
            <label className="block text-[#76196c] font-semibold mb-2">
              Nome do Produto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="nome"
              value={form.nome}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-[#9BF377] text-[#4F6940] p-3 rounded-xl border-1 transition-all ${
                touched.nome && errors.nome
                  ? " border-red-400 focus:ring-2 focus:ring-red-300"
                  : " border-[#d695e7] focus:ring-2 focus:ring-[#76196c]"
              }`}
              placeholder="Ex: Boneco Tikito Premium"
            />
            {touched.nome && errors.nome && (
              <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                <AlertCircle size={14} />
                <span>{errors.nome}</span>
              </div>
            )}
          </div>

          {/* Categoria e Fornecedor */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#76196c] font-semibold mb-2">
                Categoria <span className="text-red-500">*</span>
              </label>
              <select
                name="idCategoria"
                value={form.idCategoria}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 bg-[#9BF377] text-[#4F6940] rounded-xl border-1 transition-all ${
                  touched.idCategoria && errors.idCategoria
                    ? "border-red-400 focus:ring-2 focus:ring-red-300"
                    : "border-[#d695e7] focus:ring-2 focus:ring-[#76196c]"
                }`}
              >
                <option value="">Selecione...</option>
                {categorias.map((c) => (
                  <option key={c.id_categoria} value={c.id_categoria}>
                    {c.nome_categoria}
                  </option>
                ))}
              </select>
              {touched.idCategoria && errors.idCategoria && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle size={14} />
                  <span>{errors.idCategoria}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-[#76196c] font-semibold mb-2">
                Fornecedor <span className="text-red-500">*</span>
              </label>
              <select
                name="idFornecedor"
                value={form.idFornecedor}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full p-3 bg-[#9BF377] text-[#4F6940] rounded-xl border-1 transition-all ${
                  touched.idFornecedor && errors.idFornecedor
                    ? "border-red-400 focus:ring-2 focus:ring-red-300"
                    : "border-[#d695e7] focus:ring-2 focus:ring-[#76196c]"
                }`}
              >
                <option value="">Selecione...</option>
                {fornecedores.map((f) => (
                  <option key={f.id_fornecedor} value={f.id_fornecedor}>
                    {f.nome}
                  </option>
                ))}
              </select>
              {touched.idFornecedor && errors.idFornecedor && (
                <div className="flex items-center gap-1 text-red-500 text-sm mt-1">
                  <AlertCircle size={14} />
                  <span>{errors.idFornecedor}</span>
                </div>
              )}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-[#76196c] font-semibold mb-2">
              Descrição
            </label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              className="w-full p-3 bg-[#9BF377] text-[#4F6940] rounded-xl border-1 border-[#d695e7] focus:ring-2 focus:ring-[#76196c] transition-all resize-none"
              rows={3}
              placeholder="Descreva as características do produto..."
              maxLength={500}
            ></textarea>
            <div className="text-right text-xs text-[#4F6940] mt-1">
              {form.descricao.length}/500 caracteres
            </div>
          </div>

          {/* Valores Financeiros */}
          <div className="bg-[#EBC7F5] p-4 rounded-2xl">
            <h3 className="text-[#76196c] font-bold mb-3 flex items-center gap-2">
              <DollarSign size={18} />
              Informações Financeiras
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[#76196c] font-semibold mb-2 text-sm">
                  Custo <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#76226D]">
                    R$
                  </span>
                  <input
                    type="number"
                    name="custo"
                    value={form.custo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    step="0.01"
                    min="0"
                    className={`w-full bg-[#D695E7] text-[#76226D] pl-10 pr-3 py-3 rounded-xl border-1 transition-all ${
                      touched.custo && errors.custo
                        ? " border-red-400 focus:ring-2 focus:ring-red-300"
                        : " border-[#d695e7] focus:ring-2 focus:ring-[#76196c]"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {touched.custo && errors.custo && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} />
                    <span>{errors.custo}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#76196c] font-semibold mb-2 text-sm">
                  Lucro (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="lucro"
                    value={form.lucro}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    step="0.01"
                    min="0"
                    className={`w-full bg-[#D695E7] text-[#76226D] pr-8 pl-3 py-3 rounded-xl border-1 transition-all ${
                      touched.lucro && errors.lucro
                        ? " border-red-400 focus:ring-2 focus:ring-red-300"
                        : " border-[#d695e7] focus:ring-2 focus:ring-[#76196c]"
                    }`}
                    placeholder="0.00"
                  />
                  <Percent
                    size={16}
                    className="absolute right-3 top-3.5 text-gray-500"
                  />
                </div>
                {touched.lucro && errors.lucro && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} />
                    <span>{errors.lucro}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#76196c] font-semibold mb-2 text-sm">
                  Preço Final <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-[#76226D]">
                    R$
                  </span>
                  <input
                    type="number"
                    name="preco"
                    value={form.preco}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    step="0.01"
                    min="0"
                    className={`w-full bg-[#D695E7] text-[#76226D] pl-10 pr-3 py-3 rounded-xl border-1 transition-all font-semibold ${
                      touched.preco && errors.preco
                        ? " border-red-400 focus:ring-2 focus:ring-red-300"
                        : " border-[#d695e7] focus:ring-2 focus:ring-[#76196c]"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {touched.preco && errors.preco && (
                  <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                    <AlertCircle size={12} />
                    <span>{errors.preco}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Upload de Imagem */}
          <div>
            <label className="block text-[#76196c] font-semibold mb-2">
              Imagem do Produto
            </label>

            {!preview ? (
              <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-[#d695e7] rounded-2xl cursor-pointer hover:bg-[#E5B8F1] transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-[#76196c]" />
                  <p className="mb-2 text-sm text-[#76196c] font-medium">
                    Clique para fazer upload
                  </p>
                  <p className="text-xs text-[#4F6940]">
                    PNG (máx. 5MB)
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/png"
                  onChange={handleImagem}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-w-xs h-48 object-cover rounded-2xl border-dashed border-4 border-[#d695e7] shadow-lg"
                />
                <button
                  type="button"
                  onClick={removerImagem}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Botão Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting || !isFormValid()}
            className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-2xl shadow-xl transition-all transform ${
              submitting || !isFormValid()
                ? "bg-[#75BA51] text-[#76196C] cursor-not-allowed"
                : "bg-gradient-to-r from-[#75ba51] to-[#5a9940] hover:from-[#5a9940] hover:to-[#4f6940] text-white hover:scale-[1.02] active:scale-[0.98]"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Criando Produto...
              </>
            ) : (
              <>
                <Plus size={20} />
                Criar Produto
              </>
            )}
          </button>

          {/* Indicador de campos obrigatórios */}
          <p className="text-center text-sm text-[#4F6940] mt-4">
            <span className="text-red-500">*</span> Campos obrigatórios
          </p>
        </div>
      </div>
    </div>
  );
}
