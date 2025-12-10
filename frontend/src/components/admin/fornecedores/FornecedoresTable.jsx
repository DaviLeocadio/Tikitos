
"use client";
import { memo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "./TableInline"; // Certifique-se que o caminho está correto

const FornecedoresTable = memo(function FornecedoresTable({
  data,
  columns,
  loading,
  globalFilter,
  setGlobalFilter,
  sorting,
  setSorting
}) {
  // Função customizada para filtrar por múltiplos campos de FORNECEDOR
  const fuzzyFilter = (row, columnId, value) => {
    const searchText = value.toLowerCase();

    // Buscar em campos relevantes do fornecedor
    const id = String(row.original.id_fornecedor || "").toLowerCase();
    const nome = (row.original.nome || "").toLowerCase();
    const cnpj = (row.original.cnpj || "").toLowerCase();
    const email = (row.original.email || "").toLowerCase();
    const cidade = (row.original.cidade || "").toLowerCase();
    const status = (row.original.status || "").toLowerCase();

    return (
      id.includes(searchText) ||
      nome.includes(searchText) ||
      cnpj.includes(searchText) ||
      email.includes(searchText) ||
      cidade.includes(searchText) ||
      status.includes(searchText)
    );
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    state: {
      sorting,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  });

  return (
    <div className="bg-[#C5FFAD] rounded-xl border-3 border-dashed border-[#b478ab] overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-[#e8c5f1]">
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="hover:bg-transparent">
                {hg.headers.map((h) => (
                  <TableHead key={h.id} className="text-[#76196c]">
                    {flexRender(h.column.columnDef.header, h.getContext())}
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
                    <span className="text-[#8c3e82]">Carregando fornecedores...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`${row.index % 2 === 0
                      ? "bg-[#C5FFAD]"   // linha PAR
                      : "bg-[#9BF377]"   // linha ÍMPAR
                    } hover:!bg-[#75BA51]/50`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <i className="bi bi-truck text-4xl text-[#b478ab] opacity-50"></i>
                  <p className="text-lg font-semibold text-[#8c3e82] mt-2">
                    Nenhum fornecedor encontrado
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="bg-[#EBC7F5] flex items-center justify-between p-4 border-t border-[#b478ab]/30">
        <div className="text-sm text-[#8c3e82]">
          Mostrando {table.getRowModel().rows.length > 0 ? table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1 : 0} a{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          de {table.getFilteredRowModel().rows.length} fornecedores
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="border-[#b478ab] text-[#76196c] hover:bg-[#e8c5f1] cursor-pointer"
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="border-[#b478ab] text-[#76196c] hover:bg-[#e8c5f1] cursor-pointer"
          >
            Próxima
          </Button>
        </div>
      </div>
    </div>
  );
});

export default FornecedoresTable;