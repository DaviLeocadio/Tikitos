"use client";

import { useState, useMemo } from "react";
import {
  useFinanceiro,
  FinanceiroFilters,
  ResumoFinanceiro,
  DespesasTable,
  FluxoCaixaTable,
  ModalAdicionarDespesa,
} from "@/components/gerente/financeiro";
import { GetColumns } from "@/components/gerente/financeiro/GetColumns";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function GerenteFinanceiro() {
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dialogExcluir, setDialogExcluir] = useState({ open: false, id: null });
  const [dialogMarcarPago, setDialogMarcarPago] = useState({
    open: false,
    despesa: null,
  });

  const {
    despesas,
    fluxoCaixa,
    loading,
    periodo,
    dataInicio,
    handleAdicionarDespesa,
    handleExcluirDespesa,
    handleMarcarComoPago,
    mudarPeriodo,
    navegar,
  } = useFinanceiro();

  // Colunas da tabela - memoizado para evitar recriação
  const columns = useMemo(
    () => GetColumns({ setDialogExcluir, setDialogMarcarPago }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e5f5] to-[#e8f5e8] p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c]">
              <SidebarTrigger /> Financeiro
            </h1>
            <p className="text-lg text-[#8c3e82] mt-1">
              Gestão de despesas e fluxo de caixa
            </p>
          </div>

          <button
            onClick={() => setModalAberto(true)}
            className="bg-[#569a33] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4f6940] transition flex items-center gap-2 cursor-pointer"
          >
            <i className="bi bi-plus-circle text-xl"></i>
            Nova Despesa
          </button>
        </div>

        {/* Filtros com Período */}
        <FinanceiroFilters
          periodo={periodo}
          dataInicio={dataInicio}
          mudarPeriodo={mudarPeriodo}
          navegar={navegar}
        />

        {/* Cards de Resumo */}
        <ResumoFinanceiro despesas={despesas} fluxoCaixa={fluxoCaixa} />

        {/* Tabela de Despesas */}
        <DespesasTable
          data={despesas}
          columns={columns}
          loading={loading}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
        />

        {/* Fluxo de Caixa */}
        <FluxoCaixaTable fluxoCaixa={fluxoCaixa} loading={loading} />
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
            <DialogTitle className="text-[#ff6b6b] font-extrabold text-xl">
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <p className="text-[#4f6940] font-semibold py-4">
            Tem certeza que deseja excluir esta despesa? Esta ação não pode ser
            desfeita.
          </p>
          <DialogFooter className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold cursor-pointer"
              onClick={() => setDialogExcluir({ open: false, id: null })}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#ff6b6b] text-white hover:bg-[#ff5252] font-bold cursor-pointer"
              onClick={() => handleExcluirDespesa(dialogExcluir.id)}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Marcar como Pago */}
      <Dialog
        open={dialogMarcarPago.open}
        onOpenChange={(open) => setDialogMarcarPago({ open, despesa: null })}
      >
        <DialogContent className="sm:max-w-md bg-white border-3 border-[#569a33] border-dashed rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#569a33] font-extrabold text-xl">
              Marcar como Pago
            </DialogTitle>
          </DialogHeader>
          <p className="text-[#4f6940] font-semibold py-4">
            Deseja marcar esta despesa como paga? A data de pagamento será
            definida como hoje.
          </p>
          <DialogFooter className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold cursor-pointer"
              onClick={() =>
                setDialogMarcarPago({ open: false, despesa: null })
              }
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#569a33] text-white hover:bg-[#4f6940] font-bold cursor-pointer"
              onClick={() => handleMarcarComoPago(dialogMarcarPago.despesa)}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
