"use client";
import { memo } from "react";

const ResumoFinanceiro = memo(function ResumoFinanceiro({ despesas, fluxoCaixa }) {
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
      <div className="bg-white rounded-xl border-3 border-dashed border-[#569a33] p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Total Vendas
            </p>
            <p className="text-3xl font-bold text-[#569a33]">
              R$ {totalVendas.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <i className="bi bi-arrow-up-circle text-3xl text-[#569a33]"></i>
        </div>
      </div>

      <div className="bg-white rounded-xl border-3 border-dashed border-[#ff6b6b] p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Despesas Pagas
            </p>
            <p className="text-3xl font-bold text-[#ff6b6b]">
              R$ {totalDespesas.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <i className="bi bi-arrow-down-circle text-3xl text-[#ff6b6b]"></i>
        </div>
      </div>

      <div className="bg-white rounded-xl border-3 border-dashed border-[#ff9800] p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              A Pagar
            </p>
            <p className="text-3xl font-bold text-[#ff9800]">
              R$ {despesasPendentes.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <i className="bi bi-clock-history text-3xl text-[#ff9800]"></i>
        </div>
      </div>

      <div className="bg-white rounded-xl border-3 border-dashed border-[#76196c] p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">
              Saldo
            </p>
            <p
              className={`text-3xl font-bold ${
                saldo >= 0 ? "text-[#569a33]" : "text-[#ff6b6b]"
              }`}
            >
              R$ {saldo.toFixed(2).replace(".", ",")}
            </p>
          </div>
          <i className="bi bi-wallet2 text-3xl text-[#76196c]"></i>
        </div>
      </div>
    </div>
  );
});

export default ResumoFinanceiro;
