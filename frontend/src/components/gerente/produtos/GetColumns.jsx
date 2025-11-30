"use client";

export default function GetColumns({ setModalDesconto, setModalPedido }) {
  return [
    {
      accessorKey: "id_produto",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 font-bold hover:text-[#924187]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <i
            className={`bi bi-arrow-${
              column.getIsSorted() === "asc" ? "up" : "down"
            }-short text-lg`}
          />
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Produto
          <i
            className={`bi bi-arrow-${
              column.getIsSorted() === "asc" ? "up" : "down"
            }-short text-lg`}
          />
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Preço
          <i
            className={`bi bi-arrow-${
              column.getIsSorted() === "asc" ? "up" : "down"
            }-short text-lg`}
          />
        </button>
      ),
      cell: ({ row }) => {
        const produto = row.original || {};
        const desconto = parseInt(produto.desconto) || 0;

        const precoFormatado = produto.precoFormatado ?? `R$ ${Number(
          row.getValue("preco") || 0
        ).toFixed(2).replace(".", ",")}`;

        const precoComDesconto =
          produto.precoFormatadoComDesconto ?? `R$ ${(
            (Number(row.getValue("preco") || 0) * (1 - desconto / 100))
          ).toFixed(2).replace(".", ",")}`;

        return desconto !== 0 ? (
          <div>
            <p className="text-[12px]">
              <span className="line-through text-[#569a33] opacity-75">
                {precoFormatado}
              </span>{" "}
              <span className="no-line-through text-red-700 font-bold">
                {precoComDesconto}
              </span>
            </p>
          </div>
        ) : (
          <div className="font-bold text-[#569a33]">
            {precoFormatado}
          </div>
        );
      },
    },

    {
      accessorKey: "estoque",
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 font-bold hover:text-[#924187]"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Estoque
          <i
            className={`bi bi-arrow-${
              column.getIsSorted() === "asc" ? "up" : "down"
            }-short text-lg`}
          />
        </button>
      ),
      cell: ({ row }) => {
        const estoque = row.getValue("estoque");
        return (
          <span
            className={`font-bold ${
              estoque <= 5
                ? "text-red-600"
                : estoque <= 10
                ? "text-orange-600"
                : estoque < 20
                ? "text-yellow-600"
                :"text-[#569a33]"
            }`}
          >
            {estoque}
            {estoque < 20 && " ⚠️"}
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
