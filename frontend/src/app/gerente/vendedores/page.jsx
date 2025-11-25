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

export default function GerenteVendedores() {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFiltro, setStatusFiltro] = useState("todos");


  useEffect(() => {
    buscarVendedores();
  }, []);

  const buscarVendedores = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/gerente/vendedores", {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });


      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setVendedores(data || []);
      }
    } catch (error) {
      console.error("Erro ao buscar vendedores:", error);
    } finally {
      setLoading(false);
    }
  };




  // Colunas da tabela
  const columns = [
    {
      accessorKey: "id_usuario",
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
        <div className="font-semibold text-[#76196c]">#{row.getValue("id_usuario")}</div>
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
            Vendedor
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
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="px-2 py-1 bg-[#e8c5f1] text-[#76196c] rounded-full text-xs font-semibold">
          {row.original.email}
        </span>
      ),
    },
    {
      accessorKey: "cpf",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center gap-2 font-bold hover:text-[#924187]"

          >
            CPF

          </div>
        );
      },
      cell: ({ row }) => (
        <div className="font-bold text-[#569a33]">
          {console.log(row)}
          {row.original.cpf}
        </div>
      ),
    },
    {
      accessorKey: "telefone",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center gap-2 font-bold hover:text-[#924187]"

          >
            Telefone

          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <span className={`font-bold text-[#569a33]`}>
            {row.original.telefone}
          </span>
        );
      },
    },
    {
      accessorKey: "endereco",
      header: () => {
        return (
          <div
            className="flex items-center gap-2 font-bold hover:text-[#924187]"
          >
            Endereço
          </div>
        );
      },
      cell: ({ row }) => {
        return (
          <span className={`font-bold text-[#569a33]`}>
            {row.original.endereco}
          </span>
        );
      },
    },
    {
      accessorKey: "data_nasc",
      header: ({ column }) => {
        return (
          <div
            className="flex items-center gap-2 font-bold hover:text-[#924187]"
          >
            Data de nascimento

          </div>
        );
      },
      cell: ({ row }) => {
        const dataNasc = new Date(row.original.data_nasc)
        return (
          <span className={`font-bold text-[#569a33]`}>
            {dataNasc.toLocaleDateString("pt-BR", { timeZone: "UTC" })}
          </span>
        );
      },
    },
    // {
    //   id: "actions",
    //   header: "Ações",
    //   cell: ({ row }) => {
    //     const produto = row.original;
    //     return (
    //       <div className="flex gap-2">
    //         <button
    //           onClick={() => setModalDesconto({ open: true, produto })}
    //           className="px-3 py-1 bg-[#76196c] text-white rounded-lg text-sm font-semibold hover:bg-[#924187] transition"
    //           title="Editar desconto"
    //         >
    //           <i className="bi bi-percent"></i>
    //         </button>
    //         <button
    //           onClick={() => setModalPedido({ open: true, vendedores })}
    //           className="px-3 py-1 bg-[#569a33] text-white rounded-lg text-sm font-semibold hover:bg-[#4f6940] transition"
    //           title="Fazer pedido"
    //         >
    //           <i className="bi bi-box-seam"></i>
    //         </button>
    //       </div>
    //     );
    //   },
    // },

  ];

  // Filtragem customizada
  const vendedoresFiltrados = vendedores.filter((v) => {
    const matchStatus =
      statusFiltro === "todos" ||
      (statusFiltro === "ativo" && v.status === "ativo") ||
      (statusFiltro === "inativo" && v.status === "inativo")
    return matchStatus;
  });

  const table = useReactTable({
    data: vendedoresFiltrados,
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
            Gerenciar Vendedores
          </h1>
          <p className="text-lg text-[#8c3e82] mt-1">
            {vendedores.length} vendedores encontrados
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border-3 border-dashed border-[#b478ab] p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Busca */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-[#76196c] block mb-2">
                Buscar vendedor
              </label>
              <div className="relative">
                <i className="bi bi-search absolute left-3 top-1/2 -translate-y-1/2 text-[#b478ab]"></i>
                <input
                  type="text"
                  placeholder="Nome, CPF ou Email"
                  value={globalFilter ?? ""}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border-2 border-[#b478ab] focus:outline-none focus:border-[#76196c]"
                />
              </div>
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
                        <span className="text-[#8c3e82]">Carregando vendedores...</span>
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
                        Nenhum vendedor encontrado
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
                vendedoresFiltrados.length
              )}{" "}
              de {vendedoresFiltrados.length} vendedores
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


    </div>
  );
}