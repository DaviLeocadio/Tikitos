"use client";

import React from "react";
import {
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  Package,
  Clock,
  ShieldCheck,
  Zap,
} from "lucide-react";

const formatCurrency = (value) => {
  if (typeof value !== "number") return "R$ 0,00";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (isoDateString) => {
  if (!isoDateString) return "N/A";
  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat("pt-BR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return "Data inválida";
  }
};

export default function LojaCard({ loja }) {
  const {
    id_empresa,
    nome,
    tipo,
    endereco,
    status,
    gerente,
    faturamento_mes,
    total_vendas_mes,
    ticket_medio,
    estoque_status,
    ultima_venda,
  } = loja;

  const handleDetailsClick = () => {
    window.location.href = `/admin/lojas/${id_empresa}`;
  };

  const statusColor =
    status === "ativo"
      ? "text-[#75ba51] bg-[#e4f8d9]"
      : "text-red-600 bg-red-100";

  const estoqueColor =
    estoque_status === "OK" ? "text-[#75ba51]" : "text-[#ff7a00]";

  const gerenteDisplay = gerente || "Gerente não atribuído";

  return (
    <div
      className={` p-6 rounded-2xl  transition duration-300 border-2 border-dashed border-[#91cf85] flex flex-col h-full  ${
        loja.status === "inativo"
          ? "bg-verdinho grayscale-70 opacity-65"
          : "bg-[#cbf9b9] shadow-md hover:shadow-xl"
      }`}
    >
      <div className="flex justify-between items-start mb-4 border-b border-[#91cf85] pb-3">
        <h3 className="text-xl font-extrabold text-[#76196c] line-clamp-2">
          {nome}
        </h3>
        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full uppercase ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <p className={`flex items-center text-sm text-[#924187] font-semibold ${loja.status === "inativo" ? "opacity-100" : ""}`}>
          <Users size={16} className="mr-2 text-[#75ba51]" />
          {gerenteDisplay}
        </p>
        <p className="text-xs text-[#76196c] italic opacity-100">
          ID: {id_empresa} • {tipo}
        </p>
      </div>

      <div className="flex items-start text-sm text-[#76196c] mb-4">
        <MapPin size={16} className="mr-2 mt-1 flex-shrink-0 text-[#d695e7]" />
        <p className="leading-relaxed line-clamp-2">{endereco}</p>
      </div>

      <div className={`grid grid-cols-2 gap-4 mb-5 pt-3 border-t border-[#91cf85] ${loja.status === "inativo" ? "opacity-100" : ""}`}>
        <div className="flex items-center space-x-2">
          <DollarSign size={18} className="text-[#75ba51]" />
          <div>
            <p className="text-xs text-[#924187]">Faturamento Mês</p>
            <p className="font-extrabold text-lg text-[#75ba51]">
              {formatCurrency(faturamento_mes)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <TrendingUp size={18} className="text-[#d695e7]" />
          <div>
            <p className="text-xs text-[#924187]">Ticket Médio</p>
            <p className="font-extrabold text-base text-[#76196c]">
              {formatCurrency(ticket_medio)}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Users size={18} className="text-[#9bf377]" />
          <div>
            <p className="text-xs text-[#924187]">Total Vendas</p>
            <p className="font-extrabold text-base text-[#76196c]">
              {total_vendas_mes}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Package size={18} className={estoqueColor} />
          <div>
            <p className="text-xs text-[#924187]">Estoque</p>
            <p className={`font-extrabold flex items-center ${estoqueColor}`}>
              {estoque_status === "OK" ? (
                <ShieldCheck size={18} />
              ) : (
                <Zap size={18} />
              )}
              <span className="ml-1">{estoque_status}</span>
            </p>
          </div>
        </div>
      </div>

      <div className={`"mt-auto pt-4 border-t border-[#91cf85] flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0" `}>
        <p className={`flex items-center text-xs text-[#76196c]  ${loja.status === "inativo" ? "opacity-50" : "opacity-100 "}`}>
          <Clock size={14} className="mr-1" />
          Última Venda:{" "}
          <span className="ml-1 font-semibold">{formatDate(ultima_venda)}</span>
        </p>

        <button
          onClick={handleDetailsClick}
          className={`w-full sm:w-auto px-5 py-2 bg-[#7d3676]  font-semibold rounded-xl shadow-md hover:bg-[#924187] transition text-sm ${loja.status === "inativo" ? "text-[#c8a0c4]" : "opacity-100 text-white "}`}
        >
          Ver detalhes
        </button>
      </div>
    </div>
  );
}
