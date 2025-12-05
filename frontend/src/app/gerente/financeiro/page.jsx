"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  FinanceiroFilters,
  ResumoFinanceiro,
  DespesasTable,
  VendasTable,
  FluxoCaixaTable,
  ModalAdicionarDespesa,
} from "@/components/gerente/financeiro";
import { GetColumns } from "@/components/gerente/financeiro/GetColumns";
import useFinanceiro from "@/components/gerente/financeiro/useFinanceiro";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";

export default function GerenteFinanceiro() {
  const [modalAberto, setModalAberto] = useState(false);
  const [dialogExcluir, setDialogExcluir] = useState({ open: false, id: null });
  const [dialogMarcarPago, setDialogMarcarPago] = useState({
    open: false,
    despesa: null,
  });

  // ✅ Use apenas o hook, remova states duplicados de período e data
  const {
    despesas,
    fluxoCaixa,
    filtroStatus,
    mudarFiltroStatus,
    vendas,
    loading,
    periodo,
    dataInicio,
    handleAdicionarDespesa,
    handleExcluirDespesa,
    handleMarcarComoPago,
    mudarPeriodo,
    navegar,
  } = useFinanceiro();

  // Columns from GetColumns (pure function)
  const columns = useMemo(
    () => GetColumns({ setDialogExcluir, setDialogMarcarPago }),
    []
  );

  return (
    <div className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">
        <SidebarTrigger />
      </h1>

      <div>
        <FinanceiroFilters
          periodo={periodo}
          dataInicio={dataInicio || new Date()}
          mudarPeriodo={mudarPeriodo}
          navegar={navegar}
        />
      </div>

      <div>
        <ResumoFinanceiro despesas={despesas} fluxoCaixa={fluxoCaixa} />
      </div>

      <div>
        <DespesasTable
          data={despesas}
          columns={columns}
          loading={loading}
          filtroStatus={filtroStatus}
          mudarFiltroStatus={mudarFiltroStatus}
          setModalAberto={setModalAberto}
        />
      </div>
      <div>
        <VendasTable vendas={vendas} loading={loading} />
      </div>

      <div>
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
        className="bg-[#c61f1f]"
      >
        <DialogContent className="sm:max-w-md bg-[#F1B8E8] border-2 border-[#c61f1f] rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-[#c61f1f] font-extrabold text-xl">
              Confirmar Exclusão
            </DialogTitle>
          </DialogHeader>
          <p className="text-[#c61f1f] font-semibold py-4">
            Tem certeza que deseja excluir esta despesa? Esta ação não pode ser
            desfeita.
          </p>
          <DialogFooter className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1 bg-[#C5FFAD] text-gray-700 hover:bg-[#C5FFAD] font-bold"
              onClick={() => setDialogExcluir({ open: false, id: null })}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#c61f1f] text-[#F1B8E8] hover:bg-[#ff5252] font-bold"
              onClick={() => {
                handleExcluirDespesa(dialogExcluir.id);
                setDialogExcluir({ open: false, id: null });
              }}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Marcar como Pago */}
      <Dialog
        open={dialogMarcarPago.open}
        onOpenChange={(open) =>
          setDialogMarcarPago({ open: false, despesa: null })
        }
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
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300 font-bold"
              onClick={() =>
                setDialogMarcarPago({ open: false, despesa: null })
              }
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#569a33] text-white hover:bg-[#4f6940] font-bold"
              onClick={() => {
                handleMarcarComoPago(dialogMarcarPago.despesa);
                setDialogMarcarPago({ open: false, despesa: null });
              }}
            >
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
