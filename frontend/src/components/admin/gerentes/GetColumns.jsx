"use client";

export default function GetColumns({ setModalGerente, setModalDesativar, setModalTransfer }) {
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
          Gerente
          <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`} />
        </button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[120px] truncate">
          <p className="font-semibold truncate text-[#4f6940]">{row.getValue("nome")}</p>
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
      accessorKey: "nome_empresa",
      header: "Empresa",
      cell: ({ row }) => (
        <div className="">
          <span className="px-2 py-1 text-[#76196c] text-xs font-normal block">
            {row.original.nome_empresa}
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
        const gerente = row.original

        return (
          <div className="flex gap-2">
            <button
              onClick={() => setModalGerente({ open: true, gerente})}
              className="px-3 py-1 bg-[#76196c] text-white rounded-lg text-sm font-semibold hover:bg-[#924187] transition cursor-pointer"
              title="Editar gerente"
            >
              <i className="bi bi-person"></i>
            </button>
            <button
              onClick={() => setModalTransfer && setModalTransfer({ open: true, funcionario: gerente })}
              className="px-3 py-1 bg-[#3b82f6] text-white rounded-lg text-sm font-semibold hover:bg-[#2563eb] transition cursor-pointer"
              title="Transferir funcionário"
            >
              <i className="bi bi-arrow-left-right"></i>
            </button>
            <button
              onClick={() => setModalDesativar({ open: true, gerente})}
              className={`px-3 py-1 text-white rounded-lg text-sm font-semibold transition cursor-pointer ${gerente.status === "ativo"
                  ? "bg-[#ff6b35] hover:bg-[#e55a2b]"
                  : "bg-[#569a33] hover:bg-[#4f6940]"
                }`}
              title={gerente.status === "ativo" ? "Desativar gerente" : "Reativar gerente"}
            >
              <i className={`bi bi-power ${gerente.status === "ativo" ? "" : ""}`}></i>
            </button>
          </div>
        );
      },
    },
  ];
}
