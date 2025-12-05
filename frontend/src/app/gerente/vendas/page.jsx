"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  Package,
  Calendar,
  DollarSign,
  User,
  CreditCard,
  Search,
  Filter,
} from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";

const TIKI = {
  roxoEscuro: "#76196c",
  roxoMedio: "#924187",
  roxoClaro: "#d695e7",
  rosaTikitos: "#e8c5f1",
  verdeTikitos: "#75ba51",
  verdeClaro: "#9bf377",
  verdeFundo: "#DDF1D4",
  rosaClaro: "#E5B8F1",
};

const GerenteVendasPage = () => {
  const [vendas, setVendas] = useState([]);
  const [produtos, setProdutos] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedVenda, setExpandedVenda] = useState(null);
  const [dataInicio, setDataInicio] = useState("2025-11-01");
  const [dataFim, setDataFim] = useState("2025-11-30");
  const [filtroTipoPagamento, setFiltroTipoPagamento] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    carregarDados();
  }, [dataInicio, dataFim]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Buscar vendas
      const vendasResponse = await fetch(
        `http://localhost:8080/gerente/vendas?dataInicio=${dataInicio}&dataFim=${dataFim}&itens=true`,
        { credentials: "include" }
      );
      const vendasData = await vendasResponse.json();

      // Buscar produtos
      const produtosResponse = await fetch(
        "http://localhost:8080/gerente/produtos/",
        { credentials: "include" }
      );
      const produtosData = await produtosResponse.json();

      // Criar mapa de produtos para acesso rápido
      const produtosMap = {};
      produtosData.produtosFormatados.forEach((prod) => {
        produtosMap[prod.id_produto] = prod;
      });

      setVendas(vendasData.vendas || []);
      setProdutos(produtosMap);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVenda = (idVenda) => {
    setExpandedVenda(expandedVenda === idVenda ? null : idVenda);
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatarMoeda = (valor) => {
    return `R$ ${parseFloat(valor).toFixed(2).replace(".", ",")}`;
  };

  const getTipoPagamentoIcon = (tipo) => {
    switch (tipo.toLowerCase()) {
      case "pix":
        return "📱";
      case "dinheiro":
        return "💵";
      case "cartão":
        return "💳";
      default:
        return "💰";
    }
  };

  const vendasFiltradas = () => {
    return vendas.filter((venda) => {
      const matchTipo =
        filtroTipoPagamento === "todos" ||
        venda.tipo_pagamento === filtroTipoPagamento;
      const nomeUsuario = (venda.nome_usuario || "").toString();
      const matchSearch =
        searchTerm === "" ||
        nomeUsuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venda.id_venda.toString().includes(searchTerm);
      return matchTipo && matchSearch;
    });
  };

  const calcularTotais = () => {
    const filtradas = vendasFiltradas();
    const total = filtradas.reduce(
      (sum, v) => sum + parseFloat(v.total || 0),
      0
    );
    const quantidade = filtradas.length;
    return { total, quantidade };
  };

  const { total: totalGeral, quantidade: qtdVendas } = calcularTotais();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#DDF1D4] to-[#9bf377] flex items-center justify-center">
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-16 w-16 border-b-4 mx-auto"
            style={{ borderColor: TIKI.roxoMedio }}
          ></div>
          <p className="mt-4 font-semibold" style={{ color: TIKI.roxoEscuro }}>
            Carregando vendas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex m-5 gap-2 items-center">
        <SidebarTrigger />
      </div>

      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex items-center justify-between mb-6">
              <div>
                <h1
                  className="text-3xl font-bold flex items-center gap-3"
                  style={{ color: TIKI.roxoEscuro }}
                >
                  Gerenciamento de Vendas
                </h1>
                <p className="text-gray-700 mt-1 font-medium">
                  Tikitos - Pequenos momentos, grandes resultados
                </p>
              </div>
            </div>

          {/* Header */}
          <div
            className="bg-[#75B851] border-3 border-[#4F6940] border-dashed rounded-4xl shadow-lg p-6 mb-6">
            

            {/* Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

              <div>
                <label
                  className="block text-sm text-[#9BF377] font-semibold mb-2">
                  <Search size={16} className="inline mr-1" />
                  Buscar
                </label>
                <input
                  type="text"
                  placeholder="Vendedor ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#4F6940] bg-[#9BF377] text-[#4F6940] rounded-xl focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label
                  className="block text-sm text-[#9BF377] font-semibold mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Data Início
                </label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#4F6940] bg-[#9BF377] text-[#4F6940] rounded-xl focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label
                  className="block text-sm text-[#9BF377] font-semibold mb-2">
                  <Calendar size={16} className="inline mr-1" />
                  Data Fim
                </label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-[#4F6940] bg-[#9BF377] text-[#4F6940] rounded-xl focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label
                  className="block text-sm text-[#9BF377] font-semibold mb-2">
                  <Filter size={16} className="inline mr-1" />
                  Pagamento
                </label>
                <select
                  value={filtroTipoPagamento}
                  onChange={(e) => setFiltroTipoPagamento(e.target.value)}
                  className="w-full px-4 py-2 border-2 bg-[#9BF377] border-[#4F6940] text-[#4F6940] rounded-xl focus:outline-none focus:ring-2"
                >
                  <option value="todos">Todos</option>
                  <option value="pix">PIX</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartão">Cartão</option>
                </select>
              </div>

            </div>
          </div>

          {/* Cards de Resumo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6 py-4">
            
            <div
              className="rounded-[50px] shadow-lg p-6 text-[#CAF4B7]"
              style={{
                background: `linear-gradient(135deg, ${TIKI.roxoMedio}, ${TIKI.roxoEscuro})`,
                borderColor: TIKI.roxoEscuro,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">
                    Total de Vendas
                  </p>
                  <p className="text-3xl font-bold mt-2">{qtdVendas}</p>
                </div>
                <Package size={48} className="opacity-80" />
              </div>
            </div>

            <div
              className="rounded-[50px] shadow-lg p-6 text-[#CAF4B7]"
              style={{
                background: `linear-gradient(135deg, ${TIKI.verdeTikitos}, #5a9a3f)`,
                borderColor: TIKI.verdeTikitos,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Valor Total</p>
                  <p className="text-3xl font-bold mt-2">
                    {formatarMoeda(totalGeral)}
                  </p>
                </div>
                <DollarSign size={48} className="opacity-80" />
              </div>
            </div>

            <div
              className="rounded-[50px] shadow-lg p-6"
              style={{
                background: TIKI.rosaClaro,
                borderColor: TIKI.roxoClaro,
                color: TIKI.roxoEscuro,
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold opacity-90">
                    Ticket Médio
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {qtdVendas > 0
                      ? formatarMoeda(totalGeral / qtdVendas)
                      : "R$ 0,00"}
                  </p>
                </div>
                <CreditCard
                  size={48}
                  style={{ color: TIKI.roxoMedio, opacity: 0.8 }}
                />
              </div>
            </div>
          </div>

          {/* Lista de Vendas */}
          <div className="space-y-4">
            {vendasFiltradas().length === 0 ? (
              <div
                className="bg-white rounded-[50px] border-2 border-dashed shadow-lg p-12 text-center"
                style={{ borderColor: TIKI.roxoClaro }}
              >
                <Package
                  size={64}
                  className="mx-auto mb-4"
                  style={{ color: TIKI.roxoClaro }}
                />
                <p
                  className="text-lg font-semibold"
                  style={{ color: TIKI.roxoEscuro }}
                >
                  Nenhuma venda encontrada no período selecionado
                </p>
              </div>
            ) : (
              vendasFiltradas().map((venda) => (
                <div
                  key={venda.id_venda}
                  className="bg-[#D695E7] rounded-[30px] border-1 border-[#8C3E82] shadow-lg overflow-hidden transition-all hover:!bg-[#EBC7F5]"                >
                  <div
                    onClick={() => toggleVenda(venda.id_venda)}
                    className="p-6 cursor-pointer transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6 flex-1">
                        <div
                          className="rounded-2xl p-3 bg-[#75BA51]"
                        >
                          <Package
                            size={24}
                            style={{ color: TIKI.roxoMedio }}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span
                              className="font-bold text-[#4F6940]">
                              Venda <span className="text-[#4EA912]">#{venda.id_venda}</span> - Caixa {venda.id_caixa}
                            </span>

                            <span
                              className="px-3 py-1 rounded-full text-sm font-semibold bg-[#B478AB]"
                              style={{
                                color: TIKI.roxoEscuro,
                              }}
                            >
                              {venda.tipo_pagamento.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-[#76196C] font-medium">
                            <span className="flex items-center gap-1">
                              <User size={16} />
                              {venda.nome_usuario}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={16} />
                              {formatarData(venda.data_venda)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className="text-sm font-semibold mb-1"
                            style={{ color: TIKI.roxoEscuro }}
                          >
                            Total
                          </p>
                          <p
                            className="text-2xl font-bold text-[#4EA912]">
                            {formatarMoeda(venda.total)}
                          </p>
                          <p className="text-sm text-[#4F6940] font-medium">
                            {venda.itens.length}{" "}
                            {venda.itens.length === 1 ? "item" : "itens"}
                          </p>
                        </div>
                      </div>
                      <div
                        className="ml-4 transition-transform duration-300"
                        style={{
                          transform:
                            expandedVenda === venda.id_venda
                              ? "rotate(180deg)"
                              : "rotate(0deg)",
                        }}
                      >
                        <ChevronDown
                          size={24}
                          style={{ color: TIKI.roxoMedio }}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className="overflow-hidden transition-all duration-500 ease-in-out"
                    style={{
                      maxHeight:
                        expandedVenda === venda.id_venda ? "2000px" : "0px",
                      opacity: expandedVenda === venda.id_venda ? 1 : 0,
                    }}
                  >
                    <div
                      className="p-6"
                      style={{
                        borderColor: TIKI.roxoClaro,
                        backgroundColor: TIKI.verdeFundo,
                      }}
                    >
                      <h3
                        className="font-bold mb-4 flex items-center gap-2"
                        style={{ color: TIKI.roxoEscuro }}
                      >
                        <Package size={20} style={{ color: TIKI.roxoMedio }} />
                        Itens da Venda
                      </h3>
                      <div className="space-y-3">
                        {venda.itens.map((item) => {
                          const produto = produtos[item.id_produto] || {};
                          return (
                            <div
                              key={item.id_item}
                              className="bg-[#EBC7F5] rounded-[20px] p-4 shadow-sm hover:shadow-md transition-all duration-300 border-2 transform hover:scale-[1.01]"
                              style={{ borderColor: TIKI.roxoClaro }}
                            >
                              <div className="flex items-center gap-4">
                                {produto.imagem && (
                                  <img
                                    src={produto.imagem}
                                    alt={produto.nome}
                                    className="w-16 h-16 object-cover rounded-xl border-1"
                                    style={{ borderColor: TIKI.roxoClaro }}
                                    onError={(e) => {
                                      e.target.style.display = "none";
                                    }}
                                  />
                                )}
                                <div className="flex-1">
                                  <p
                                    className="font-semibold"
                                    style={{ color: TIKI.roxoEscuro }}
                                  >
                                    {" "}
                                    {produto.nome ||
                                      `Produto #${item.id_produto}`}
                                  </p>
                                  {produto.descricao && (
                                    <p className="text-sm text-[#4F6940] mt-1">
                                      {produto.descricao}
                                    </p>
                                  )}
                                  {produto.categoria && (
                                    <span
                                      className="inline-block mt-2 px-2 py-1 rounded-lg text-xs font-semibold border-1"
                                      style={{
                                        backgroundColor: TIKI.rosaTikitos,
                                        color: TIKI.roxoEscuro,
                                        borderColor: TIKI.roxoClaro,
                                      }}
                                    >
                                      {produto.categoria.nome}
                                    </span>
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <p
                                        className="text-sm font-semibold"
                                        style={{ color: TIKI.roxoEscuro }}
                                      >
                                        Quantidade
                                      </p>
                                      <p
                                        className="text-lg font-bold"
                                        style={{ color: TIKI.roxoMedio }}
                                      >
                                        {item.quantidade}x
                                      </p>
                                    </div>
                                    <div>
                                      <p
                                        className="text-sm font-semibold"
                                        style={{ color: TIKI.roxoEscuro }}
                                      >
                                        Preço Unit.
                                      </p>
                                      <p
                                        className="text-lg font-semibold text-[#4EA912]">
                                        {formatarMoeda(item.preco_unitario)}
                                      </p>
                                    </div>
                                    <div
                                      className="ml-4 px-4 py-2 rounded-[20px] border-2"
                                      style={{
                                        backgroundColor: "#c5ffad",
                                        borderColor: TIKI.verdeTikitos,
                                      }}
                                    >
                                      <p
                                        className="text-sm text-[#4EA912] font-semibold">
                                        Subtotal
                                      </p>
                                      <p
                                        className="text-xl font-bold text-[#4EA912]">
                                        {formatarMoeda(item.subtotal)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GerenteVendasPage;
