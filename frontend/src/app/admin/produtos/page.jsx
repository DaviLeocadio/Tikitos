"use client";

import { useEffect, useState } from "react";
import {
  useProdutos,
  ProdutosFilters,
  ProdutosTable,
  GetColumns,
} from "@/components/admin/produtos";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import ModalEditarProduto from "@/components/admin/produtos/ModalEditarProduto";
import ModalDesativarProduto from "@/components/admin/produtos/ModalDesativarProduto";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function AdminProduto() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  // Modals - CORRIGIDO: inicialização correta
  const [modalProduto, setModalProduto] = useState({
    open: false,
    produto: null,
  });

  const [modalDesativar, setModalDesativar] = useState({
    open: false,
    produto: null,
  });

  // Hook customizado
  const { produtos, categorias, loading, buscarProdutos, handleEditarProduto } =
    useProdutos();

  // Colunas da tabela - CORRIGIDO: passando setModalProduto ao invés de setModalDesconto
  const columns = GetColumns({
    setModalProduto,
    setModalDesativar,
  });

  // Filtragem customizada
  const produtosFiltrados = produtos.filter((p) => {
    const matchCategoria =
      categoriaFiltro === "todas" || p.categoria.nome === categoriaFiltro;
    const matchStatus =
      statusFiltro === "todos" ||
      (statusFiltro === "ativo" && p.status === "ativo") ||
      (statusFiltro === "inativo" && p.status === "inativo") ||
      (statusFiltro === "baixo" && p.estoque < 10);
    return matchCategoria && matchStatus;
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    const produtoNome = searchParams.get("produtoNome");
    const idProduto = searchParams.get("idProduto");

    if (produtoNome && idProduto && produtos.length > 0) {
      const produto = produtos.find((p) => p.id_produto == idProduto);

      if (produto) {
        setGlobalFilter(produtoNome);
      }
    }
  }, [produtos, searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DDF1D4] to-verdeclaro p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex justify-between">

            <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c]">
              <SidebarTrigger /> Gerenciar Produtos
            </h1>
            <Link
              href="/admin/produtos/cadastrar"
              className="flex gap-2 px-3 py-2 rounded-lg bg-roxo hover:bg-roxoescuro text-[#92EF6C] transition hover:scale-97">
              <PlusCircle /> Cadastrar Produto</Link>

          </div>
          <p className="text-lg text-[#8c3e82] mt-1">
            {produtosFiltrados.length} produtos encontrados
          </p>

        </div>

        {/* Filtros */}
        <ProdutosFilters
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          categoriaFiltro={categoriaFiltro}
          setCategoriaFiltro={setCategoriaFiltro}
          statusFiltro={statusFiltro}
          setStatusFiltro={setStatusFiltro}
          categorias={categorias}
        />

        {/* Tabela */}
        <ProdutosTable
          data={produtosFiltrados}
          columns={columns}
          loading={loading}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          sorting={sorting}
          setSorting={setSorting}
        />
      </div>

      {/* Modals */}
      <ModalEditarProduto
        produto={modalProduto.produto}
        open={modalProduto.open}
        onClose={() => setModalProduto({ open: false, produto: null })}
        onSalvar={handleEditarProduto}
      />

      <ModalDesativarProduto
        produto={modalDesativar.produto}
        open={modalDesativar.open}
        onClose={() => setModalDesativar({ open: false, produto: null })}
        onSalvar={buscarProdutos}
      />
    </div>
  );
}
