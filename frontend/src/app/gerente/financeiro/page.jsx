"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  FinanceiroFilters,
  ResumoFinanceiro,
  DespesasTable,
  ModalAdicionarDespesa,
} from "@/components/gerente/financeiro";
import { GetColumns } from "@/components/gerente/financeiro/GetColumns";
import useFinanceiro from "@/components/gerente/financeiro/useFinanceiro";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

export default function GerenteFinanceiro() {
  const [periodo, setPeriodo] = useState("mes");
  const [dataInicio, setDataInicio] = useState(new Date());

  // Handlers that update local state only (no network calls)
  const mudarPeriodo = (novoPeriodo) => {
    setPeriodo(novoPeriodo);
    // reset dataInicio to today when period changes
    setDataInicio(new Date());
  };

  const navegar = (direcao) => {
    const novaData = new Date(dataInicio);
    switch (periodo) {
      case "semana":
        novaData.setDate(novaData.getDate() + direcao * 7);
        break;
      case "mes":
        novaData.setMonth(novaData.getMonth() + direcao);
        break;
      case "ano":
        novaData.setFullYear(novaData.getFullYear() + direcao);
        break;
      default:
        novaData.setMonth(novaData.getMonth() + direcao);
    }
    setDataInicio(novaData);
  };

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [modalAberto, setModalAberto] = useState(false);
  const [dialogExcluir, setDialogExcluir] = useState({ open: false, id: null });
  const [dialogMarcarPago, setDialogMarcarPago] = useState({ open: false, despesa: null });

  const {
    despesas,
    fluxoCaixa,
    loading,
    periodo: periodoHook,
    dataInicio: dataInicioHook,
    handleAdicionarDespesa,
    handleExcluirDespesa,
    handleMarcarComoPago,
    mudarPeriodo: mudarPeriodoHook,
    navegar: navegarHook,
  } = useFinanceiro();

  // Columns from GetColumns (pure function)
  const columns = useMemo(() => GetColumns({ setDialogExcluir, setDialogMarcarPago }), []);

  return (
    <div className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        <SidebarTrigger /> Financeiro — Diagnóstico
      </h1>

      <div>
        <h2 className="text-lg font-semibold mb-2">Filtros (isolado)</h2>
        <FinanceiroFilters
          periodo={periodo}
          dataInicio={dataInicio}
          mudarPeriodo={mudarPeriodo}
          navegar={navegar}
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Resumo (isolado)</h2>
        <ResumoFinanceiro despesas={[]} fluxoCaixa={[]} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Despesas</h2>
        <DespesasTable
          data={despesas}
          columns={columns}
          loading={loading}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
        />
      </div>

      {/* Modal Adicionar Despesa */}
      <ModalAdicionarDespesa
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSalvar={handleAdicionarDespesa}
      />

      {/* Dialog Excluir */}
      <Dialog
        open={dialogExcluir.open}
        onOpenChange={(open) => setDialogExcluir({ open, id: null })}
      >
        <DialogContent className="sm:max-w-md bg-white border-3 border-[#ff6b6b] border-dashed rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#ff6b6b] font-extrabold text-xl">Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p className="text-[#4f6940] font-semibold py-4">Tem certeza que deseja excluir esta despesa? Esta ação não pode ser desfeita.</p>
          <DialogFooter className="flex gap-2">
            <Button variant="secondary" className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold" onClick={() => setDialogExcluir({ open: false, id: null })}>
              Cancelar
            </Button>
            <Button className="flex-1 bg-[#ff6b6b] text-white hover:bg-[#ff5252] font-bold" onClick={() => { handleExcluirDespesa(dialogExcluir.id); setDialogExcluir({ open: false, id: null }); }}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Marcar como Pago */}
      <Dialog
        open={dialogMarcarPago.open}
        onOpenChange={(open) => setDialogMarcarPago({ open: false, despesa: null })}
      >
        <DialogContent className="sm:max-w-md bg-white border-3 border-[#569a33] border-dashed rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#569a33] font-extrabold text-xl">Marcar como Pago</DialogTitle>
          </DialogHeader>
          <p className="text-[#4f6940] font-semibold py-4">Deseja marcar esta despesa como paga? A data de pagamento será definida como hoje.</p>
          <DialogFooter className="flex gap-2">
            <Button variant="secondary" className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold" onClick={() => setDialogMarcarPago({ open: false, despesa: null })}>
              Cancelar
            </Button>
            <Button className="flex-1 bg-[#569a33] text-white hover:bg-[#4f6940] font-bold" onClick={() => { handleMarcarComoPago(dialogMarcarPago.despesa); setDialogMarcarPago({ open: false, despesa: null }); }}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
