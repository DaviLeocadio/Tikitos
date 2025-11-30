"use client";

import { useEffect, useState } from "react";
import {
  useProdutos,
  ModalEditarDesconto,
  ModalPedidoFornecedor,
  ProdutosFilters,
  ProdutosTable,
  GetColumns,
} from "@/components/gerente/produtos";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";

export default function GerenteProdutos() {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");

  // Modals
  const [modalDesconto, setModalDesconto] = useState({
    open: false,
    produto: null,
  });
  const [modalPedido, setModalPedido] = useState({
    open: false,
    produto: null,
  });

  // Hook customizado
  const {
    produtos,
    categorias,
    loading,
    handleSalvarDesconto,
    handleFazerPedido,
    buscarProdutos,
  } = useProdutos();

  // Colunas da tabela
  const columns = GetColumns({ setModalDesconto, setModalPedido });

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
    const produto = produtos.find((p) => p.id_produto == idProduto);
    if (produtoNome && idProduto) {
      setGlobalFilter(produtoNome);
      console.log(produto);
      setModalPedido({
        open: true,
        produto: produto,
      });
    }
  }, [produtos]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#DDF1D4] to-verdeclaro p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c]">
            <SidebarTrigger /> Gerenciar Produtos
          </h1>
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
      <ModalEditarDesconto
        produto={modalDesconto.produto}
        open={modalDesconto.open}
        onClose={() => {
          setModalDesconto({ open: false, produto: null });
          buscarProdutos();
        }}
        onSalvar={handleSalvarDesconto}
      />

      <ModalPedidoFornecedor
        produto={modalPedido.produto}
        open={modalPedido.open}
        onClose={() => {
          setModalPedido({ open: false, produto: null });
          buscarProdutos();
        }}
        onSalvar={handleFazerPedido}
      />
    </div>
  );
}
