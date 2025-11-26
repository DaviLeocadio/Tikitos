"use client";

export default function GetColumns({ setModalDesconto, setModalPedido }) {
  return [
    {
      accessorKey: "id_produto",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 font-bold hover:text-[#924187]"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          ID
          <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`} />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-semibold text-[#76196c]">
          #{row.getValue("id_produto")}
        </div>
      ),
    },

    {
      accessorKey: "nome",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 font-bold hover:text-[#924187]"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Produto
          <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`} />
        </button>
      ),
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
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 font-bold hover:text-[#924187]"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Preço
          <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`} />
        </button>
      ),
      cell: ({ row }) => (
        <div className="font-bold text-[#569a33]">
          R$ {Number(row.getValue("preco")).toFixed(2).replace(".", ",")}
        </div>
      ),
    },

    {
      accessorKey: "estoque",
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 font-bold hover:text-[#924187]"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Estoque
          <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`} />
        </button>
      ),
      cell: ({ row }) => {
        const estoque = row.getValue("estoque");
        return (
          <span className={`font-bold ${estoque < 10 ? "text-red-600" : "text-[#569a33]"}`}>
            {estoque}
            {estoque < 10 && " ⚠️"}
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
              className="px-3 py-1 bg-[#76196c] text-white rounded-lg text-sm font-semibold hover:bg-[#924187] transition cursor-pointer"
              title="Editar desconto"
            >
              <i className="bi bi-percent"></i>
            </button>

            <button
              onClick={() => setModalPedido({ open: true, produto })}
              className="px-3 py-1 bg-[#569a33] text-white rounded-lg text-sm font-semibold hover:bg-[#4f6940] transition cursor-pointer"
              title="Fazer pedido"
            >
              <i className="bi bi-box-seam"></i>
            </button>
          </div>
        );
      },
    },
  ];
}
