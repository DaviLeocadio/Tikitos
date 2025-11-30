"use client";
import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FinanceiroFilters = memo(function FinanceiroFilters({
  periodo,
  dataInicio,
  mudarPeriodo,
  navegar,
}) {
  const formatarData = () => {
    const opcoes = { year: "numeric", month: "long", day: "numeric" };

    switch (periodo) {
      case "semana":
        const proximaData = new Date(dataInicio);
        proximaData.setDate(proximaData.getDate() + 6);
        return `${dataInicio.toLocaleDateString(
          "pt-BR",
          opcoes
        )} - ${proximaData.toLocaleDateString("pt-BR", opcoes)}`;

      case "mes":
        return dataInicio.toLocaleDateString("pt-BR", {
          year: "numeric",
          month: "long",
        });

      case "ano":
        return dataInicio.toLocaleDateString("pt-BR", { year: "numeric" });

      default:
        return dataInicio.toLocaleDateString("pt-BR", opcoes);
    }
  };

  return (
    <div className="bg-white rounded-xl border-3 border-dashed border-[#b478ab] p-5 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Seletor de Período */}
        <div>
          <label className="text-sm font-semibold text-[#76196c] block mb-2">
            Período
          </label>
          <div className="flex gap-2">
            {["semana", "mes", "ano"].map((p) => (
              <button
                key={p}
                onClick={() => mudarPeriodo(p)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  periodo === p
                    ? "bg-[#76196c] text-white"
                    : "bg-gray-100 text-[#76196c] hover:bg-gray-200"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Intervalo de Datas */}
        <div>
          <label className="text-sm font-semibold text-[#76196c] block mb-2">
            Período Selecionado
          </label>
          <div className="text-lg font-bold text-[#569a33]">
            {formatarData()}
          </div>
        </div>

        {/* Navegação de Datas */}
        <div>
          <label className="text-sm font-semibold text-[#76196c] block mb-2">
            Navegar
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => navegar(-1)}
              className="flex-1 px-3 py-2 bg-[#e8c5f1] hover:bg-[#d4a8de] text-[#76196c] rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1"
              title="Período anterior"
            >
              <ChevronLeft size={18} />
              Anterior
            </button>
            <button
              onClick={() => navegar(1)}
              className="flex-1 px-3 py-2 bg-[#e8c5f1] hover:bg-[#d4a8de] text-[#76196c] rounded-lg font-semibold transition cursor-pointer flex items-center justify-center gap-1"
              title="Próximo período"
            >
              Próximo
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FinanceiroFilters;
