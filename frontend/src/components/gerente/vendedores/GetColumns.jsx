"use client";

export default function GetColumns({setModalVendedor}) {
  return [
    {
      accessorKey: "id_usuario",
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
          #{row.getValue("id_usuario")}
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
          Vendedor
          <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`} />
        </button>
      ),
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-[#4f6940]">{row.getValue("nome")}</p>
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
      accessorKey: "telefone",
      header: "Telefone",
      cell: ({ row }) => (
        <span className="px-2  whitespace-nowrap py-1 bg-[#e8c5f1] text-[#76196c] rounded-full text-xs font-semibold">
          {row.original.telefone}
        </span>
      ),
    },

    {
      accessorKey: "endereco",
      header: "Endereço",
      cell: ({ row }) => (
        <div className="">
          <span className="px-2 py-1 text-[#76196c]  text-xs font-normal block">
            {row.original.endereco}
          </span>
        </div>
      ),
    },

    {
      accessorKey: "status",
      enableGlobalFilter: true,
      header: ({ column }) => (
        <button
          className="flex items-center gap-2 font-bold hover:text-[#924187]"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Status
          <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`} />
        </button>
      ),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <div>
            <p className={`text-sm ${status === 'ativo' ? 'text-[#4f6940]' : 'text-red-600'}`}>{row.original.status}</p>
          </div>
        )

      },
    },
    {
      id: "actions",
      header: "Ação",
      cell: ({ row }) => {
        const vendedor = row.original;

        return (
          <div className="flex gap-2">
            <button
              onClick={() => setModalVendedor({ open: true, vendedor })}
              className="px-3 py-1 bg-[#76196c] text-white rounded-lg text-sm font-semibold hover:bg-[#924187] transition cursor-pointer"
              title="Editar vendedor"
            >
              <i className="bi bi-person"></i>
            </button>
          </div>
        );
      },
    },
  ];
}
