"use client";
import { memo } from "react";

const ResumoFinanceiro = memo(function ResumoFinanceiro({
  despesas,
  fluxoCaixa,
}) {
  const totalDespesas = despesas
    .filter((d) => d.status === "pago")
    .reduce((acc, d) => acc + parseFloat(d.preco), 0);

  const despesasPendentes = despesas
    .filter((d) => d.status === "pendente")
    .reduce((acc, d) => acc + parseFloat(d.preco), 0);

  const totalVendas = fluxoCaixa.reduce(
    (acc, f) => acc + parseFloat(f.valor_total || 0),
    0
  );

  const saldo = totalVendas - totalDespesas;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div className="bg-[#75BA51] rounded-4xl border-3 p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-[#C5FFAD] mb-1">
              Total Vendas
            </p>
            <p className="text-3xl font-bold text-[#C5FFAD]">
              R$ {totalVendas.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <i className="bi bi-arrow-up-circle text-3xl text-[#C5FFAD]"></i>
        </div>
      </div>

      <div className="bg-[#D695E7] rounded-4xl border-3 p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-[#9D4E92] mb-1">
              Despesas Pagas
            </p>
            <p className="text-3xl font-bold text-[#9D4E92]">
              R$ {totalDespesas.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <i className="bi bi-arrow-down-circle text-3xl text-[#9D4E92]"></i>
        </div>
      </div>

      <div className="bg-[#76196C] rounded-4xl border-3 p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-[#F1B8E8] mb-1">A Pagar</p>
            <p className="text-3xl font-bold text-[#F1B8E8]">
              R$ {despesasPendentes.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <i className="bi bi-clock-history text-3xl text-[#F1B8E8]"></i>
        </div>
      </div>

      <div className="bg-[#4F6940] rounded-4xl border-3 p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-[#9BF377] mb-1">Saldo</p>
            <p
              className={`text-3xl font-bold ${
                saldo >= 0 ? "text-[#9BF377]" : "text-[#9BF377]"
              }`}
            >
              R$ {saldo.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <i className="bi bi-wallet2 text-3xl text-[#9BF377]"></i>
        </div>
      </div>
    </div>
  );
});

export default ResumoFinanceiro;
