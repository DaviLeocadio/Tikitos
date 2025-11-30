"use client";
import { CheckCircle, Trash } from "lucide-react";

export function GetColumns({ setDialogExcluir, setDialogMarcarPago }) {
  return [
    {
      accessorKey: "descricao",
      enableGlobalFilter: true,
      header: "Descrição",
      cell: ({ row }) => (
        <div className="font-semibold text-[#4f6940]">{row.getValue("descricao")}</div>
      ),
    },
    

    {
      accessorKey: "preco",
      header: ({ column }) => (
        <div
          role="button"
          tabIndex={0}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') column.toggleSorting(column.getIsSorted() === 'asc'); }}
          className="flex items-center gap-2 font-bold hover:text-[#924187] cursor-pointer"
        >
          Valor
          <i
            className={`bi bi-arrow-${
              column.getIsSorted() === "asc" ? "up" : "down"
            }-short text-lg`}
          />
        </div>
      ),
      cell: ({ row }) => {
        const preco = parseFloat(row.getValue("preco"));
        return (
          <div className="font-bold text-[#ff6b6b]">
            R$ {preco.toFixed(2).replace(".", ",")}
          </div>
        );
      },
    },

    {
      accessorKey: "data_adicionado",
      header: ({ column }) => (
        <div
          role="button"
          tabIndex={0}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') column.toggleSorting(column.getIsSorted() === 'asc'); }}
          className="flex items-center gap-2 font-bold hover:text-[#924187] cursor-pointer"
        >
          Data Adicionado
          <i
            className={`bi bi-arrow-${
              column.getIsSorted() === "asc" ? "up" : "down"
            }-short text-lg`}
          />
        </div>
      ),
      cell: ({ row }) => {
        const data = new Date(row.getValue("data_adicionado"));
        return <div className="text-gray-600">{data.toLocaleDateString("pt-BR")}</div>;
      },
    },

    {
      accessorKey: "data_pag",
      header: "Data Pagamento",
      cell: ({ row }) => {
        const data = row.getValue("data_pag");
        return (
          <div className="text-gray-600">
            {data ? new Date(data).toLocaleDateString("pt-BR") : "-"}
          </div>
        );
      },
    },

    {
      accessorKey: "status",
      header: ({ column }) => (
        <div
          role="button"
          tabIndex={0}
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') column.toggleSorting(column.getIsSorted() === 'asc'); }}
          className="flex items-center gap-2 font-bold hover:text-[#924187] cursor-pointer"
        >
          Status
          <i
            className={`bi bi-arrow-${
              column.getIsSorted() === "asc" ? "up" : "down"
            }-short text-lg`}
          />
        </div>
      ),
      cell: ({ row }) => {
        const status = row.getValue("status");
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              status === "pago"
                ? "bg-green-100 text-green-700"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {status === "pago" ? "Pago" : "Pendente"}
          </span>
        );
      },
    },

    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const despesa = row.original;

        return (
          <div className="flex gap-2">
            {despesa.status === "pendente" && (
              <button
                onClick={() =>
                  setDialogMarcarPago({ open: true, despesa })
                }
                className="px-3 py-1 bg-[#569a33] text-white rounded-lg text-sm font-semibold hover:bg-[#4f6940] transition cursor-pointer"
                title="Marcar como pago"
              >
                <CheckCircle size={16} />
              </button>
            )}
            <button
              onClick={() =>
                setDialogExcluir({
                  open: true,
                  id: despesa.id_despesa,
                })
              }
              className="px-3 py-1 bg-[#ff6b6b] text-white rounded-lg text-sm font-semibold hover:bg-[#ff5252] transition cursor-pointer"
              title="Excluir"
            >
              <Trash size={16} />
            </button>
          </div>
        );
      },
    },
  ];
}

export default GetColumns;
