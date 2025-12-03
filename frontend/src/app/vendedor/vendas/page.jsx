"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";


export default function VendasPage() {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroData, setFiltroData] = useState("todos");

  // Modais
  const [vendaDetalhes, setVendaDetalhes] = useState(null);
  const [vendaParaEstornar, setVendaParaEstornar] = useState(null);

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

  const estornarVenda = async () => {
    if (!vendaParaEstornar) return;

    try {
      const response = await fetch(
        `http://localhost:8080/vendedor/vendas/${vendaParaEstornar.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        setVendas(vendas.filter((v) => v.id !== vendaParaEstornar.id));
        setVendaParaEstornar(null);
      }
    } catch (error) {
      console.error("Erro ao estornar venda:", error);
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
    <>

      {/* MENU DA SIDEBAR */}
      <div className="grid gap-5 grid-cols-1 md:grid-cols-1">
        <div className="flex m-5 gap-2 items-center">
          <SidebarTrigger />
        </div>
      </div>

      <div className="rounded-3xl overflow-hidden px-[45px] mb-10 sm:w-[100%] ">
        <img
          src="/img/vendas/banner_vendas.png"
          className="w-full rounded-3xl"
        />
      </div>

      <div className="min-h-screen bg-[#DDF1D4] p-6">
        <div className="max-w-6xl mx-auto space-y-6">

          {/* Header */}
          {/* <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black text-[#8c3e82] md:p-1 tracking-tight">
            Controle de Vendas
          </h1>
        </div> */}

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 items-center md:grid-cols-3 gap-4">
            <div className="bg-[#E5B8F1] border-3 border-dashed border-[#75BA51] rounded-[50px] p-3">
              <p className="text-sm text-center items-center font-semibold text-[#70B64C] ">Faturamento</p>
              <h2 className="text-4xl text-center font-black items-center text-[#559637] md:text4xl sm:text-[25px] sm:p-2">
                R$ {totalVendas.toFixed(2).replace(".", ",")}
              </h2>
            </div>

            <div className="bg-[#c5ffad] border-3 border-dashed border-[#8C3E82] rounded-[50px] p-3">
              <p className="text-sm text-center font-semibold text-[#8c3e82]">Vendas</p>
              <h2 className="text-4xl text-center font-black text-[#65745A]">
                {quantidadeVendas}
              </h2>
            </div>

            <div className="bg-[#92EF6C] border-3 border-dashed border-[#B478AB] rounded-[50px] p-3">
              <p className="text-sm text-center font-semibold text-[#8c3e82]">Ticket Médio</p>
              <h2 className="text-4xl text-center font-black text-[#924187] md:text4xl sm:text-[25px] sm:p-1.5">
                R$ {ticketMedio.toFixed(2).replace(".", ",")}
              </h2>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-[#4F6940] border-[3px] border-dashed border-[#92EF6C] rounded-[50px] p-6">
            <h3 className="text-lg font-bold text-[#92EF6C]">Filtros de Busca</h3>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <input
                type="text"
                placeholder="Buscar por ID da venda ou vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-[#EBC7F5] border-[2px] border-[#C97FDA] rounded-[25px] text-[#9D4E92]"
              />

              <select
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full md:w-48 px-4 py-3 bg-[#EBC7F5] border-[2px] border-[#C97FDA] rounded-[25px] text-[#9D4E92]"
              >
                <option value="todos" className="hover!:bg-red-500 rounded-xl">Todas as vendas</option>
                <option value="hoje">Hoje</option>
                <option value="semana">Última semana</option>
                <option value="mes">Último mês</option>
              </select>
            </div>

            <p className="text-xs text-[#92EF6C] mt-3 font-medium">
              Mostrando {vendasFiltradas.length} de {vendas.length} vendas
            </p>
          </div>

          {/* Lista de Vendas */}
          <div className="bg-[#c5ffad] border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-6">
            <h3 className="text-xl font-bold text-[#8c3e82] mb-4">
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
                <p className="text-[#8c3e82] font-semibold">
                  Nenhuma venda encontrada
                </p>
              </div>
            ) : (

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
                {vendasFiltradas.map((venda) => (
                  <div
                    key={venda.id}
                    className="bg-[#E5B8F1] w-[100%] border-[#76226D] border-2 rounded-[40px] p-5 hover:bg-[#EBC7F5] transition"
                  >
                    <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
                      <div>
                        <span className="bg-[#924187] text-[#C5FFAD] px-3 py-1 rounded-[20px] text-sm font-bold">
                          #{venda.id}
                        </span>

                        <p className="text-sm text-[#569A33] font-bold mt-2">
                          Data: <span className="text-[#4F6940] font-medium "> {new Date(venda.data).toLocaleDateString("pt-BR")}</span>
                        </p>
                        <p className="text-sm text-[#569A33] font-bold">
                          Pagamento: <span className="text-[#4F6940] font-medium">{venda.tipo_pagamento}</span>
                        </p>
                        <p className="text-sm text-[#569A33] font-bold">
                          Vendedor <span className="text-[#4F6940]">#{venda.vendedor_id}</span>
                        </p>
                      </div>

                      <div className="bg-[#4EA912] rounded-[25px] px-6 py-3">
                        <p className="text-xs text-[#DDF1D4] font-semibold">
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

                      {/* Ver Detalhes */}
                      <button
                        onClick={() => setVendaDetalhes(venda)}
                        className="p-3 bg-[#76196C] hover:bg-[#8C3E82] cursor-pointer text-[#92EF6C] rounded-[20px]"
                      >
                        Ver detalhes
                      </button>

                      {/* Estornar */}
                      <button
                        onClick={() => setVendaParaEstornar(venda)}
                        className="p-3 bg-[#92EF6C] hover:bg-[#9BF377] font-semibold cursor-pointer text-[#9D4E92] rounded-[20px]"
                      >
                        {/* vai fazer muito ainda?  ah até ia, mas vc vai dormir agora? manda zapzpa quando temrinadr não vai dormir agora? senão tudo bem eu paro aqui vou ficar acordadso parar um pouco tá bom então*/}
                        Estornar
                      </button>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal: Detalhes da Venda */}
          <Dialog open={!!vendaDetalhes} onOpenChange={() => setVendaDetalhes(null)}>
            <DialogContent className="bg-[#E5B8F1] border-[3px] border-dashed border-[#559637] rounded-[50px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-[#4EA912]">
                  Venda #{vendaDetalhes?.id}
                </DialogTitle>
              </DialogHeader>

              {vendaDetalhes && (
                <>
                  <p className="text-[#8c3e82] font-bold">
                    Data: <span className="text-[#4F6940] font-semibold">{new Date(vendaDetalhes.data).toLocaleString("pt-BR")}</span>
                  </p>
                  <p className="text-[#8c3e82] font-bold">
                    Pagamento: <span className="text-[#4F6940] font-semibold">{vendaDetalhes.tipo_pagamento}</span>
                  </p>
                  <p className="text-[#8c3e82] mb-4 font-bold">
                    Vendedor <span className="text-[#4F6940]">#{vendaDetalhes.vendedor_id}</span>
                  </p>

                  <div className="bg-[#4EA912] text-[#DDF1D4] rounded-[25px] p-4">
                    <p className="text-xs text-[#c5ffad]">Valor Total</p>
                    <p className="text-3xl font-black">
                      R$
                      {parseFloat(vendaDetalhes.valor_total)
                        .toFixed(2)
                        .replace(".", ",")}
                    </p>
                  </div>
                </>
              )}

              <DialogFooter>
                <Button
                  className="w-full bg-[#924187] hover:bg-[#B478AB] rounded-[20px] text-[#DDF1D4] cursor-pointer transform transition duration-200
                   hover:scale-105"
                  onClick={() => setVendaDetalhes(null)}
                >
                  Fechar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Modal: Confirmar Estorno */}
          <Dialog open={!!vendaParaEstornar} onOpenChange={() => setVendaParaEstornar(null)}>
            <DialogContent className="bg-[#E5B8F1] border-[3px] border-dashed border-[#B478AB] rounded-[50px]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black text-[#8c3e82]">
                  Confirmar Estorno
                </DialogTitle>
              </DialogHeader>

              {vendaParaEstornar && (
                <p className="text-[#8c3e82] mb-4">
                  Tem certeza que deseja estornar a venda{" "}
                  <strong>#{vendaParaEstornar.id}</strong>?
                </p>
              )}

              <DialogFooter className="flex gap-3 mt-4">
                <Button
                  className="flex-1 bg-[#c5ffad] hover:bg-[#B1F097] text-[#8c3e82] border-[2px] border-[#75ba51] rounded-[25px] cursor-pointer"
                  onClick={() => setVendaParaEstornar(null)}
                >
                  Cancelar
                </Button>

                <Button
                  className="flex-1 bg-[#924187] hover:bg-[#B478AB] text-[#DDF1D4] border-[2px] border-[#9D4E92] rounded-[25px] cursor-pointer"
                  onClick={estornarVenda}
                >
                  Estornar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </div>
    </>
  );
}
