"use client";
import { useState, useEffect } from "react";

export default function VendasPage() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroData, setFiltroData] = useState("todos");
  const [vendaDetalhes, setVendaDetalhes] = useState(null);
  const [vendaParaExcluir, setVendaParaExcluir] = useState(null);

  useEffect(() => {
    fetchVendas();
  }, []);

  const fetchVendas = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:8080/vendedor/vendas", {
        credentials: "include",
      });

      const data = await response.json();
      console.log("RETORNO:", data);

      const listaNormalizada = (data.vendas || []).map((v) => ({
        id: v.id_venda,
        vendedor_id: v.id_usuario,
        data: v.data_venda,
        tipo_pagamento: v.tipo_pagamento,
        valor_total: v.total,
      }));

      setVendas(listaNormalizada);
    } catch (error) {
      console.error("Erro ao buscar vendas:", error);
      setVendas([]);
    } finally {
      setLoading(false);
    }
  };

  const excluirVenda = async () => {
    if (!vendaParaExcluir) return;

    try {
      const response = await fetch(
        `http://localhost:8080/vendas/${vendaParaExcluir.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setVendas(vendas.filter((v) => v.id !== vendaParaExcluir.id));
        setVendaParaExcluir(null);
      }
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
    }
  };

  const vendasFiltradas = vendas.filter((venda) => {
    const dataVenda = new Date(venda.data);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    let passaFiltroData = true;
    if (filtroData === "hoje") {
      passaFiltroData = dataVenda >= hoje;
    } else if (filtroData === "semana") {
      const semanaAtras = new Date(hoje);
      semanaAtras.setDate(hoje.getDate() - 7);
      passaFiltroData = dataVenda >= semanaAtras;
    } else if (filtroData === "mes") {
      const mesAtras = new Date(hoje);
      mesAtras.setMonth(hoje.getMonth() - 1);
      passaFiltroData = dataVenda >= mesAtras;
    }

    const busca = searchTerm.toLowerCase();
    const passaBusca =
      busca === "" ||
      venda.id.toString().includes(busca) ||
      venda.vendedor_id.toString().includes(busca);

    return passaFiltroData && passaBusca;
  });

  const totalVendas = vendasFiltradas.reduce(
    (sum, v) => sum + parseFloat(v.valor_total),
    0
  );

  const quantidadeVendas = vendasFiltradas.length;
  const ticketMedio =
    quantidadeVendas > 0 ? totalVendas / quantidadeVendas : 0;

  return (
    <div className="min-h-screen bg-[#DDF1D4] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-5xl font-black text-[#8c3e82] tracking-tight">
            Controle de Vendas
          </h1>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#E5B8F1] border-[3px] border-dashed border-[#B478AB] rounded-[50px] p-6">
            <p className="text-sm font-semibold text-[#8c3e82]">Faturamento</p>
            <h2 className="text-4xl font-black text-[#924187]">
              R$ {totalVendas.toFixed(2).replace(".", ",")}
            </h2>
          </div>

          <div className="bg-[#c5ffad] border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-6">
            <p className="text-sm font-semibold text-[#8c3e82]">Vendas</p>
            <h2 className="text-4xl font-black text-[#65745A]">
              {quantidadeVendas}
            </h2>
          </div>

          <div className="bg-[#D8F1DC] border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-6">
            <p className="text-sm font-semibold text-[#8c3e82]">Ticket Médio</p>
            <h2 className="text-4xl font-black text-[#924187]">
              R$ {ticketMedio.toFixed(2).replace(".", ",")}
            </h2>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-[#E5B8F1] border-[3px] border-dashed border-[#B478AB] rounded-[50px] p-6">
          <h3 className="text-lg font-bold text-[#8c3e82]">Filtros de Busca</h3>

          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <input
              type="text"
              placeholder="Buscar por ID da venda ou vendedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-[#924187]/50 border-[2px] border-[#B478AB] rounded-[25px] text-[#DDF1D4]"
            />

            <select
              value={filtroData}
              onChange={(e) => setFiltroData(e.target.value)}
              className="w-full md:w-48 px-4 py-3 bg-[#924187]/50 border-[2px] border-[#B478AB] rounded-[25px] text-[#DDF1D4]"
            >
              <option value="todos">Todas as vendas</option>
              <option value="hoje">Hoje</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mês</option>
            </select>
          </div>

          <p className="text-xs text-[#8c3e82] mt-3 font-medium">
            Mostrando {vendasFiltradas.length} de {vendas.length} vendas
          </p>
        </div>

        {/* Lista de Vendas */}
        <div className="bg-[#c5ffad] border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-6">
          <h3 className="text-lg font-bold text-[#8c3e82] mb-4">
            Histórico de Vendas
          </h3>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-10 w-10 animate-spin border-4 border-[#924187] border-r-transparent rounded-full"></div>
              <p className="mt-4 text-[#8c3e82] font-semibold">
                Carregando vendas...
              </p>
            </div>
          ) : vendasFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <i className="bi bi-cart-x text-[48px] text-[#B478AB] mb-4"></i>
              <p className="text-[#8c3e82] font-semibold">
                Nenhuma venda encontrada
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {vendasFiltradas.map((venda) => (
                <div
                  key={venda.id}
                  className="bg-[#D8F1DC] border-[3px] border-dashed border-[#75ba51] rounded-[40px] p-5 hover:bg-[#C8FDB4] transition"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="bg-[#924187] text-[#DDF1D4] px-3 py-1 rounded-[20px] text-sm font-bold">
                        #{venda.id}
                      </span>

                      <p className="text-sm text-[#8c3e82] mt-2">
                        Data:{" "}
                        {new Date(venda.data).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-sm text-[#8c3e82]">
                        Pagamento: {venda.tipo_pagamento}
                      </p>
                      <p className="text-sm text-[#8c3e82]">
                        Vendedor #{venda.vendedor_id}
                      </p>
                    </div>

                    <div className="bg-[#924187] border-[2px] border-[#9D4E92] rounded-[25px] px-6 py-3">
                      <p className="text-xs text-[#c5ffad] font-semibold">
                        Valor Total
                      </p>
                      <p className="text-2xl font-black text-[#DDF1D4]">
                        R$
                        {parseFloat(venda.valor_total)
                          .toFixed(2)
                          .replace(".", ",")}
                      </p>
                    </div>
                  </div>

                  <div className="flex mt-3 gap-2">
                    <button
                      onClick={() => setVendaDetalhes(venda)}
                      className="p-3 bg-[#924187] hover:bg-[#B478AB] text-[#DDF1D4] rounded-[20px]"
                    >
                      Ver detalhes
                    </button>

                    <button
                      onClick={() => setVendaParaExcluir(venda)}
                      className="p-3 bg-[#924187] hover:bg-[#B478AB] text-[#DDF1D4] rounded-[20px]"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de Detalhes */}
        {vendaDetalhes && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
               onClick={() => setVendaDetalhes(null)}>
            <div
              className="bg-[#E5B8F1] border-[3px] border-dashed border-[#B478AB] rounded-[50px] max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-black text-[#8c3e82] mb-4">
                Venda #{vendaDetalhes.id}
              </h3>

              <p className="text-[#8c3e82]">
                Data:{" "}
                {new Date(vendaDetalhes.data).toLocaleString("pt-BR")}
              </p>

              <p className="text-[#8c3e82]">
                Pagamento: {vendaDetalhes.tipo_pagamento}
              </p>

              <p className="text-[#8c3e82] mb-4">
                Vendedor #{vendaDetalhes.vendedor_id}
              </p>

              <div className="bg-[#924187] text-[#DDF1D4] rounded-[25px] p-4">
                <p className="text-xs text-[#c5ffad]">Valor Total</p>
                <p className="text-3xl font-black">
                  R$
                  {parseFloat(vendaDetalhes.valor_total)
                    .toFixed(2)
                    .replace(".", ",")}
                </p>
              </div>

              <button
                onClick={() => setVendaDetalhes(null)}
                className="mt-4 w-full py-3 bg-[#924187] text-[#DDF1D4] rounded-[20px]"
              >
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Confirmação */}
        {vendaParaExcluir && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setVendaParaExcluir(null)}
          >
            <div
              className="bg-[#E5B8F1] border-[3px] border-dashed border-[#B478AB] rounded-[50px] max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-black text-[#8c3e82] mb-3">
                Confirmar Exclusão
              </h3>

              <p className="text-[#8c3e82] mb-6">
                A venda <strong>#{vendaParaExcluir.id}</strong> será removida
                permanentemente.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setVendaParaExcluir(null)}
                  className="flex-1 px-4 py-3 bg-[#c5ffad] border-[2px] border-[#75ba51] rounded-[25px] text-[#8c3e82] font-bold"
                >
                  Cancelar
                </button>

                <button
                  onClick={excluirVenda}
                  className="flex-1 px-4 py-3 bg-[#924187] border-[2px] border-[#9D4E92] rounded-[25px] text-[#DDF1D4] font-bold"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
