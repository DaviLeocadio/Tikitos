"use client";
import React, { useState, useEffect } from "react";
import { AlertTriangle, Package, TrendingDown, RefreshCw } from "lucide-react";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AlertasEstoque() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const carregarProdutos = async () => {
    setLoading(true);
    setErro(null);

    try {
      const response = await fetch(
        "http://localhost:8080/gerente/estoque-baixo",
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar produtos com estoque baixo");
      }

      const data = await response.json();
      setProdutos(data.produtosComEstoqueBaixo || []);
    } catch (error) {
      setErro(error.message);
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProdutos();
  }, []);

  const getNivelCriticidade = (estoque) => {
    if (estoque <= 5)
      return {
        cor: "bg-red-100 ",
        texto: "text-red-800",
        badge: "bg-red-500",
      };
    if (estoque <= 10)
      return {
        cor: "bg-orange-100 ",
        texto: "text-orange-800",
        badge: "bg-orange-500",
      };
    return {
      cor: "bg-yellow-100 ",
      texto: "text-yellow-800",
      badge: "bg-yellow-500",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <RefreshCw className="w-12 h-12 text-purple-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Carregando alertas...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-800 mb-2">
              Erro ao Carregar Alertas
            </h3>
            <p className="text-red-600 mb-4">{erro}</p>
            <button
              onClick={carregarProdutos}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl font-medium transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
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

          {/* Cabeçalho */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-2xl shadow-lg">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-roxoescuro mb-1">
                    Alertas de Estoque
                  </h1>
                  <p className="text-gray-600 font-medium">
                    Produtos que precisam de atenção imediata
                  </p>
                </div>
              </div>

              {/* BOTÃO DE ATUALIZAR */}
              <button
                onClick={carregarProdutos}
                className="cursor-pointer text-roxo px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Atualizar
              </button>
            </div>

            {/* Resumo */}
            <div className="bg-[#EBC7F5] rounded-4xl shadow-xl p-6 border-3 border-dashed border-[#76196C]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4">
                  <div className="bg-red-200 p-3 rounded-xl">
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-red-600 font-medium">
                      Crítico (≤5)
                    </p>
                    <p className="text-2xl font-black text-red-600">
                      {produtos.filter((p) => p.estoque <= 5).length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-orange-200 p-3 rounded-xl">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-orange-600 font-medium">
                      Alerta (6-10)
                    </p>
                    <p className="text-2xl font-black text-orange-600">
                      {
                        produtos.filter((p) => p.estoque > 5 && p.estoque <= 10)
                          .length
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-yellow-200 p-3 rounded-xl">
                    <Package className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-yellow-600 font-medium">
                      Atenção (11-20)
                    </p>
                    <p className="text-2xl font-black text-yellow-600">
                      {produtos.filter((p) => p.estoque > 10).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Produtos */}
          {produtos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-12 text-center border-2 border-green-200 ">
              <Package className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-black text-gray-800 mb-2">
                Tudo em ordem!
              </h3>
              <p className="text-gray-600 font-medium">
                Nenhum produto com estoque baixo no momento.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {produtos
                .sort((a, b) => a.estoque - b.estoque)
                .map((produto) => {
                  const nivel = getNivelCriticidade(produto.estoque);
                  return (
                    <Link
                      key={produto.id_produto}
                      className={`${nivel.cor} border-1 rounded-4xl p-5 transition-all duration-300 hover:scale-101`}
                      href={`/gerente/produtos/?produtoNome=${produto.nome}&idProduto=${produto.id_produto}`}
                    >
                      <div className="flex items-start gap-5">
                        {/* Imagem do Produto */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24  rounded-xl overflow-hidden drop-shadow-md">
                            <img
                              src={produto.imagem}
                              alt={produto.nome}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src =
                                  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96"%3E%3Crect fill="%23e5e7eb" width="96" height="96"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14" font-family="sans-serif"%3ESem foto%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          </div>
                        </div>

                        {/* Informações do Produto */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3
                                className={`text-xl font-black ${nivel.texto} mb-1`}
                              >
                                {produto.nome}
                              </h3>
                              <p className="text-sm text-[#4F6940] font-medium mb-2">
                                {produto.descricao}
                              </p>
                              <div className="flex items-center gap-3 flex-wrap">
                                <span className="text-xs bg-[#E5B8F1] px-3 py-1 rounded-full font-bold text-[#76196C]">
                                  {produto.categoria}
                                </span>
                                <span className="text-xs bg-[#E5B8F1] px-3 py-1 rounded-full font-bold text-[#76196C]">
                                  ID: {produto.id_produto}
                                </span>
                              </div>
                            </div>

                            {/* Badge de Estoque */}
                            <div className="text-center">
                              <div
                                className={`${nivel.badge} text-[#D8F1DC] px-4 py-2 rounded-xl shadow-md`}
                              >
                                <p className="text-xs font-bold mb-1">
                                  ESTOQUE
                                </p>
                                <p className="text-3xl font-black">
                                  {produto.estoque}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Informações Adicionais */}
                          <div className="bg-[#CAF4B7]/50 rounded-xl p-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div>
                              <p className="text-xs text-[#4F6940] font-medium mb-1">
                                Preço
                              </p>
                              <p className="text-lg font-black text-[#4EA912]">
                                {produto.precoFormatado}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[#4F6940] font-medium mb-1">
                                Custo
                              </p>
                              <p className="text-lg font-black text-[#4EA912]">
                                R${" "}
                                {parseFloat(produto.custo)
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[#4F6940] font-medium mb-1">
                                Lucro
                              </p>
                              <p className="text-lg font-black text-[#4EA912]">
                                {produto.lucro}%
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-[#4F6940] font-medium mb-1">
                                Fornecedor
                              </p>
                              <p className="text-sm font-bold text-[#76196C] truncate">
                                {produto.fornecedor}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
