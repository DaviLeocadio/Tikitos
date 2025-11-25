"use client";

import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Componentes de Table inline
const Table = ({ className, ...props }) => (
  <div className="relative w-full overflow-auto">
    <table className={`w-full caption-bottom text-sm ${className}`} {...props} />
  </div>
);

const TableHeader = ({ className, ...props }) => (
  <thead className={`[&_tr]:border-b ${className}`} {...props} />
);

const TableBody = ({ className, ...props }) => (
  <tbody className={`[&_tr:last-child]:border-0 ${className}`} {...props} />
);

const TableRow = ({ className, ...props }) => (
  <tr
    className={`border-b transition-colors hover:bg-muted/50 ${className}`}
    {...props}
  />
);

const TableHead = ({ className, ...props }) => (
  <th
    className={`h-12 px-4 text-left align-middle font-medium ${className}`}
    {...props}
  />
);

const TableCell = ({ className, ...props }) => (
  <td className={`p-4 align-middle ${className}`} {...props} />
);

// Modal de Editar Desconto
function ModalEditarDesconto({ produto, open, onClose, onSalvar }) {
  const [desconto, setDesconto] = useState(produto?.desconto || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setDesconto(produto?.desconto || 0);
  }, [produto]);

  const handleSalvar = async () => {
    setLoading(true);
    await onSalvar(produto.id_produto, desconto);
    setLoading(false);
    onClose();
  };

  const precoComDesconto = produto?.preco * (1 - desconto / 100);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#e8c5f1] border-3 border-[#924187] border-dashed rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#76196c] font-extrabold text-xl">
            Editar Desconto
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#8c3e82] font-semibold">Produto:</p>
            <p className="text-lg font-bold text-[#76196c]">{produto?.nome}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-[#8c3e82] font-semibold">Preço Original:</p>
              <p className="text-lg font-bold text-[#4f6940]">
                R$ {produto?.preco?.toFixed(2).replace('.', ',')}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#8c3e82] font-semibold">Preço com Desconto:</p>
              <p className="text-lg font-bold text-[#569a33]">
                R$ {precoComDesconto?.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#8c3e82] font-semibold block mb-2">
              Desconto (%):
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={desconto}
              onChange={(e) => setDesconto(Math.min(100, Math.max(0, Number(e.target.value))))}
              className="w-full p-3 rounded-lg border-2 border-[#b478ab] text-[#76196c] font-bold text-lg focus:outline-none focus:border-[#76196c]"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              className="flex-1 bg-[#9bf377] text-[#4f6940] hover:bg-[#75ba51] font-bold"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#76196c] text-white hover:bg-[#924187] font-bold"
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

// Modal de Pedido ao Fornecedor
function ModalPedidoFornecedor({ produto, open, onClose, onSalvar }) {
  const [quantidade, setQuantidade] = useState(10);
  const [fornecedorId, setFornecedorId] = useState("");
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      buscarFornecedores();
    }
  }, [open]);

  const buscarFornecedores = async () => {
    try {
      const response = await fetch("http://localhost:8080/gerente/fornecedores", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setFornecedores(data.fornecedores || []);
      }
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
    }
  };

  const handleSalvar = async () => {
    if (!fornecedorId) {
      alert("Selecione um fornecedor!");
      return;
    }
    
    setLoading(true);
    await onSalvar(produto.id_produto, fornecedorId, quantidade);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#c5ffad] border-3 border-[#569a33] border-dashed rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#4f6940] font-extrabold text-xl">
            Fazer Pedido ao Fornecedor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-[#4f6940] font-semibold">Produto:</p>
            <p className="text-lg font-bold text-[#569a33]">{produto?.nome}</p>
          </div>

          <div>
            <p className="text-sm text-[#4f6940] font-semibold">Estoque Atual:</p>
            <p className="text-lg font-bold text-[#924187]">{produto?.estoque} unidades</p>
          </div>

          <div>
            <label className="text-sm text-[#4f6940] font-semibold block mb-2">
              Fornecedor:
            </label>
            <select
              value={fornecedorId}
              onChange={(e) => setFornecedorId(e.target.value)}
              className="w-full p-3 rounded-lg border-2 border-[#569a33] text-[#4f6940] font-semibold focus:outline-none focus:border-[#4f6940]"
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map((f) => (
                <option key={f.id_fornecedor} value={f.id_fornecedor}>
                  {f.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-[#4f6940] font-semibold block mb-2">
              Quantidade:
            </label>
            <input
              type="number"
              min="1"
              value={quantidade}
              onChange={(e) => setQuantidade(Math.max(1, Number(e.target.value)))}
              className="w-full p-3 rounded-lg border-2 border-[#569a33] text-[#4f6940] font-bold text-lg focus:outline-none focus:border-[#4f6940]"
            />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              className="flex-1 bg-white text-[#4f6940] hover:bg-gray-100 font-bold border-2 border-[#569a33]"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#569a33] text-white hover:bg-[#4f6940] font-bold"
              onClick={handleSalvar}
              disabled={loading}
            >
              {loading ? "Processando..." : "Fazer Pedido"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function GerenteProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [categorias, setCategorias] = useState([]);
  
  // Modals
  const [modalDesconto, setModalDesconto] = useState({ open: false, produto: null });
  const [modalPedido, setModalPedido] = useState({ open: false, produto: null });

  useEffect(() => {
    buscarProdutos();
  }, []);

  const buscarProdutos = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/gerente/produtos", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        setProdutos(data.produtosFormatados || []);
        
        // Extrai categorias únicas
        const cats = [...new Set(data.produtosFormatados.map(p => p.categoria.nome))];
        setCategorias(cats);
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarDesconto = async (idProduto, desconto) => {
    try {
      const response = await fetch(`http://localhost:8080/gerente/produtos/${idProduto}/desconto`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desconto }),
      });

      if (response.ok) {
        await buscarProdutos();
        alert("Desconto atualizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao salvar desconto:", error);
      alert("Erro ao salvar desconto!");
    }
  };

  const handleFazerPedido = async (idProduto, idFornecedor, quantidade) => {
    try {
      const response = await fetch("http://localhost:8080/gerente/pedidos", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_produto: idProduto,
          id_fornecedor: idFornecedor,
          quantidade,
        }),
      });

      if (response.ok) {
        await buscarProdutos();
        alert("Pedido realizado com sucesso!");
      }
    } catch (error) {
      console.error("Erro ao fazer pedido:", error);
      alert("Erro ao fazer pedido!");
    }
  };

  // Colunas da tabela
  const columns = [
    {
      accessorKey: "id_produto",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 font-bold hover:text-[#924187]"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
            <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`}></i>
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="font-semibold text-[#76196c]">#{row.getValue("id_produto")}</div>
      ),
    },
    {
      accessorKey: "nome",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 font-bold hover:text-[#924187]"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Produto
            <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`}></i>
          </button>
        );
      },
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-[#4f6940]">{row.getValue("nome")}</p>
          <p className="text-sm text-gray-600">{row.original.descricao}</p>
        </div>
      ),
    },
    {
      accessorKey: "categoria.nome",
      header: "Categoria",
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-[#e8c5f1] text-[#76196c] rounded-full text-xs font-semibold">
          {row.original.categoria.nome}
        </span>
      ),
    },
    {
      accessorKey: "preco",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 font-bold hover:text-[#924187]"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Preço
            <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`}></i>
          </button>
        );
      },
      cell: ({ row }) => (
        <div className="font-bold text-[#569a33]">
          R$ {Number(row.getValue("preco")).toFixed(2).replace('.', ',')}
        </div>
      ),
    },
    {
      accessorKey: "estoque",
      header: ({ column }) => {
        return (
          <button
            className="flex items-center gap-2 font-bold hover:text-[#924187]"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Estoque
            <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`}></i>
          </button>
        );
      },
      cell: ({ row }) => {
        const estoque = row.getValue("estoque");
        return (
          <span className={`font-bold ${estoque < 10 ? 'text-red-600' : 'text-[#569a33]'}`}>
            {estoque}
            {estoque < 10 && ' ⚠️'}
          </span>
        );
      },
    },
    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const produto = row.original;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => setModalDesconto({ open: true, produto })}
              className="px-3 py-1 bg-[#76196c] text-white rounded-lg text-sm font-semibold hover:bg-[#924187] transition"
              title="Editar desconto"
            >
              <i className="bi bi-percent"></i>
            </button>
            <button
              onClick={() => setModalPedido({ open: true, produto })}
              className="px-3 py-1 bg-[#569a33] text-white rounded-lg text-sm font-semibold hover:bg-[#4f6940] transition"
              title="Fazer pedido"
            >
              <i className="bi bi-box-seam"></i>
            </button>
          </div>
        );
      },
    },
  ];

  // Filtragem customizada
  const produtosFiltrados = produtos.filter((p) => {
    const matchCategoria = categoriaFiltro === "todas" || p.categoria.nome === categoriaFiltro;
    const matchStatus = 
      statusFiltro === "todos" ||
      (statusFiltro === "ativo" && p.status === "ativo") ||
      (statusFiltro === "inativo" && p.status === "inativo") ||
      (statusFiltro === "baixo" && p.estoque < 10);
    return matchCategoria && matchStatus;
  });

  const table = useReactTable({
    data: produtosFiltrados,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e5f5] to-[#e8f5e8] p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c]">
            Gerenciar Produtos
          </h1>
          <p className="text-lg text-[#8c3e82] mt-1">
            {produtosFiltrados.length} produtos encontrados
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border-3 border-dashed border-[#b478ab] p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-[#76196c] block mb-2">
                Buscar produto
              </label>
              <div className="relative">
                <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#b478ab]"></i>
                <input
                  type="text"
                  placeholder="Nome, código ou descrição..."
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-[#b478ab] focus:outline-none focus:border-[#76196c]"
                />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label className="text-sm font-semibold text-[#76196c] block mb-2">
                Categoria
              </label>
              <select
                value={categoriaFiltro}
                onChange={(e) => setCategoriaFiltro(e.target.value)}
                className="w-full p-2 rounded-lg border-2 border-[#b478ab] focus:outline-none focus:border-[#76196c]"
              >
                <option value="todas">Todas</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-semibold text-[#76196c] block mb-2">
                Status
              </label>
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="w-full p-2 rounded-lg border-2 border-[#b478ab] focus:outline-none focus:border-[#76196c]"
              >
                <option value="todos">Todos</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
                <option value="baixo">Estoque Baixo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-xl border-3 border-dashed border-[#b478ab] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#e8c5f1]">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-[#76196c]">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#76196c]"></div>
                        <span className="text-[#8c3e82]">Carregando produtos...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-[#f0e5f5]/30"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      <i className="bi bi-inbox text-4xl text-[#b478ab] opacity-50"></i>
                      <p className="text-lg font-semibold text-[#8c3e82] mt-2">
                        Nenhum produto encontrado
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-between p-4 border-t border-[#b478ab]/30">
            <div className="text-sm text-[#8c3e82]">
              Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} a{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                produtosFiltrados.length
              )}{" "}
              de {produtosFiltrados.length} produtos
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="border-[#b478ab] text-[#76196c] hover:bg-[#e8c5f1]"
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="border-[#b478ab] text-[#76196c] hover:bg-[#e8c5f1]"
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ModalEditarDesconto
        produto={modalDesconto.produto}
        open={modalDesconto.open}
        onClose={() => setModalDesconto({ open: false, produto: null })}
        onSalvar={handleSalvarDesconto}
      />

      <ModalPedidoFornecedor
        produto={modalPedido.produto}
        open={modalPedido.open}
        onClose={() => setModalPedido({ open: false, produto: null })}
        onSalvar={handleFazerPedido}
      />
    </div>
  );
}