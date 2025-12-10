"use client";

export default function GetFornecedorColumns({ setModalFornecedor, onDelete }) {
  return [
    {
      accessorKey: "id_fornecedor",
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
          #{row.getValue("id_fornecedor")}
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
          Fornecedor
          <i className={`bi bi-arrow-${column.getIsSorted() === "asc" ? "up" : "down"}-short text-lg`} />
        </button>
      ),
      cell: ({ row }) => (
        <div className="max-w-[180px] truncate">
          <p className="font-bold text-[#4f6940] truncate" title={row.getValue("nome")}>
            {row.getValue("nome")}
          </p>
        </div>
      ),
    },

    {
      accessorKey: "cnpj",
      enableGlobalFilter: true,
      header: "CNPJ",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-gray-600 font-medium">
          {row.getValue("cnpj")}
        </span>
      ),
    },

    {
      accessorKey: "email",
      header: "Contato",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <span className="text-xs text-[#76196c] font-medium flex items-center gap-1">
             <i className="bi bi-envelope"></i> {row.original.email}
          </span>
          <span className="text-xs text-gray-500 font-medium flex items-center gap-1">
             <i className="bi bi-telephone"></i> {row.original.telefone} - {row.original.telefone.length}
          </span>
        </div>
      ),
    },

    {
      accessorKey: "cidade",
      header: "Localização",
      cell: ({ row }) => {
        const cidade = row.original.cidade;
        const estado = row.original.estado;
        return (
          <div className="px-2 py-1 bg-[#e8c5f1] text-[#76196c] rounded-lg text-xs font-semibold inline-block">
            {cidade && estado ? `${cidade} - ${estado}` : "N/A"}
          </div>
        );
      },
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
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${status === 'ativo' ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <p className={`text-sm font-medium ${status === 'ativo' ? 'text-[#4f6940]' : 'text-red-600'}`}>
              {status === 'ativo' ? 'Ativo' : 'Inativo'}
            </p>
          </div>
        )
      },
    },

    {
      id: "actions",
      header: "Ações",
      cell: ({ row }) => {
        const fornecedor = row.original;

        return (
          <div className="flex gap-2">
            {/* Botão Editar */}
            <button
              onClick={() => setModalFornecedor({ open: true, fornecedor })}
              className="px-3 py-1 bg-[#76196c] text-white rounded-lg text-sm font-semibold hover:bg-[#924187] transition cursor-pointer shadow-sm"
              title="Editar fornecedor"
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            
            {/* Botão Excluir/Desativar */}
            <button
              onClick={() => {
                if (confirm(`Deseja realmente remover o fornecedor ${fornecedor.nome}?`)) {
                  onDelete(fornecedor.id_fornecedor);
                }
              }}
              className="px-3 py-1 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition cursor-pointer shadow-sm"
              title="Excluir fornecedor"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        );
      },
    },
  ];
}