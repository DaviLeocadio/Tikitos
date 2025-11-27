"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Trash } from "lucide-react";
import InputDataMask from "@/components/inputMasks/InputDataMask";

// Modal Adicionar Despesa
function ModalAdicionarDespesa({ open, onClose, onSalvar }) {
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");

  const [dataPag, setDataPag] = useState("");
  const [status, setStatus] = useState("pendente");
  const [loading, setLoading] = useState(false);

  const handleSalvar = async () => {
    if (!descricao || !preco) {
      alert("Preencha descrição e valor!");
      return;
    }

    setLoading(true);
    await onSalvar({
      descricao,
      preco: parseFloat(preco),
      data_pag: dataPag,
      status,
    });
    setLoading(false);
    setDescricao("");
    setPreco("");
    setDataPag("");
    setStatus("pendente");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#e8c5f1] border-3 border-[#924187] border-dashed rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-[#76196c] font-extrabold text-xl">
            Adicionar Despesa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-sm  text-[#8c3e82] font-semibold block mb-2">
                Descrição:
              </label>
              <input
                type="text"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Ex: Conta de energia"
                className="w-full p-3 rounded-lg border-2 border-[#b478ab] text-[#76196c] font-semibold focus:outline-none focus:border-[#76196c]"
              />
            </div>
            <div>
              <label className="text-sm  text-[#8c3e82] font-semibold block mb-2">
                Valor (R$):
              </label>
              <input
                type="number"
                step="0.01"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                placeholder="0.00"
                className="w-full p-3 rounded-lg border-2 border-[#b478ab] text-[#76196c] font-bold focus:outline-none focus:border-[#76196c]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-[#8c3e82] font-semibold block mb-2">
                Data de Pagamento:
              </label>
              <InputDataMask
                type="text"
                placeholder="25/12/1969"
                value={dataPag}
                onChange={(e) => setDataPag(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-[#b478ab] text-[#76196c] font-bold focus:outline-none focus:border-[#76196c]"
              />
            </div>

            <div>
              <label className="text-sm text-[#8c3e82] font-semibold block mb-2">
                Status:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-3 rounded-lg border-2 border-[#b478ab] text-[#76196c] font-semibold focus:outline-none focus:border-[#76196c] cursor-pointer"
              >
                <option value="pendente">Pendente</option>
                <option value="pago">Pago</option>
              </select>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <div className="flex gap-2 w-full">
            <Button
              variant="secondary"
              className="flex-1 bg-[#9bf377] text-[#4f6940] hover:bg-[#75ba51] font-bold cursor-pointer"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#76196c] text-white hover:bg-[#924187] font-bold cursor-pointer"
              onClick={handleSalvar}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function GerenteFinanceiro() {
  const [loading, setLoading] = useState(true);
  const [despesas, setDespesas] = useState([]);
  const [fluxoCaixa, setFluxoCaixa] = useState([]);
  const [resumo, setResumo] = useState(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [dialogExcluir, setDialogExcluir] = useState({ open: false, id: null });
  const [dialogMarcarPago, setDialogMarcarPago] = useState({
    open: false,
    despesa: null,
  });

  useEffect(() => {
    buscarDados();
  }, []);

  useEffect(() => {
    calcularResumo();
  }, [despesas, fluxoCaixa]);

  const buscarDados = async () => {
    setLoading(true);
    try {
      // Buscar despesas
      const resDespesas = await fetch("http://localhost:8080/gerente/gastos", {
        credentials: "include",
      });
      if (resDespesas.ok) {
        const data = await resDespesas.json();
        setDespesas(data.gastos || []);
      }

      // Buscar fluxo de caixa
      const resFluxo = await fetch("http://localhost:8080/gerente/caixa", {
        credentials: "include",
      });
      if (resFluxo.ok) {
        const data = await resFluxo.json();
        setFluxoCaixa(data.caixaData || []);
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const calcularResumo = () => {
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

    setResumo({
      totalDespesas,
      despesasPendentes,
      totalVendas,
      saldo: totalVendas - totalDespesas,
    });
  };

  const handleAdicionarDespesa = async (despesaData) => {
    try {
      const response = await fetch("http://localhost:8080/gerente/gastos", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(despesaData),
      });

      if (response.ok) {
        await buscarDados();
      }
    } catch (error) {
      console.error("Erro ao adicionar despesa:", error);
      alert("Erro ao adicionar despesa!");
    }
  };

  const handleExcluirDespesa = async (idDespesa) => {
    try {
      const response = await fetch(
        `http://localhost:8080/gerente/gastos/${idDespesa}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        await buscarDados();
      }
    } catch (error) {
      console.error("Erro ao excluir despesa:", error);
      alert("Erro ao excluir despesa!");
    }
    setDialogExcluir({ open: false, id: null });
  };

  const handleMarcarComoPago = async (despesa) => {
    try {
      const response = await fetch(
        `http://localhost:8080/gerente/gastos/${despesa.id_despesa}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "pago",
            data_pag: new Date().toISOString().split("T")[0],
          }),
        }
      );

      if (response.ok) {
        await buscarDados();
      }
    } catch (error) {
      console.error("Erro ao atualizar despesa:", error);
      alert("Erro ao atualizar despesa!");
    }
    setDialogMarcarPago({ open: false, despesa: null });
  };

  const despesasFiltradas = despesas.filter((d) => {
    if (filtroStatus === "todos") return true;
    return d.status === filtroStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0e5f5] to-[#e8f5e8] p-5 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c]">
              Financeiro
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

        {/* Cards de Resumo */}
        {resumo && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white rounded-xl border-3 border-dashed border-[#569a33] p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">
                    Total Vendas
                  </p>
                  <p className="text-3xl font-bold text-[#569a33]">
                    R$ {resumo.totalVendas.toFixed(2).replace(".", ",")}
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
                    R$ {resumo.totalDespesas.toFixed(2).replace(".", ",")}
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
                    R$ {resumo.despesasPendentes.toFixed(2).replace(".", ",")}
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
                      resumo.saldo >= 0 ? "text-[#569a33]" : "text-[#ff6b6b]"
                    }`}
                  >
                    R$ {resumo.saldo.toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <i className="bi bi-wallet2 text-3xl text-[#76196c]"></i>
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Despesas */}
        <div className="bg-white rounded-xl border-3 border-dashed border-[#b478ab] overflow-hidden">
          <div className="p-5 bg-[#e8c5f1] border-b-2 border-[#b478ab]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-bold text-[#76196c]">Despesas</h2>

              <div className="flex gap-2">
                {["todos", "pago", "pendente"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFiltroStatus(status)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition cursor-pointer ${
                      filtroStatus === status
                        ? "bg-[#76196c] text-white"
                        : "bg-white text-[#76196c] hover:bg-[#f0e5f5]"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#f0e5f5]">
                <tr>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Descrição
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Valor
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Data Adicionado
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Data Pagamento
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Status
                  </th>
                  <th className="p-4 text-left text-[#76196c] font-bold">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#76196c]"></div>
                        <span className="text-[#8c3e82]">Carregando...</span>
                      </div>
                    </td>
                  </tr>
                ) : despesasFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center">
                      <i className="bi bi-inbox text-4xl text-[#b478ab] opacity-50"></i>
                      <p className="text-lg font-semibold text-[#8c3e82] mt-2">
                        Nenhuma despesa encontrada
                      </p>
                    </td>
                  </tr>
                ) : (
                  despesasFiltradas.map((despesa) => (
                    <tr
                      key={despesa.id_despesa}
                      className="border-b border-[#b478ab]/30 hover:bg-[#f0e5f5]/30"
                    >
                      <td className="p-4 font-semibold text-[#4f6940]">
                        {despesa.descricao}
                      </td>
                      <td className="p-4 font-bold text-[#ff6b6b]">
                        R${" "}
                        {parseFloat(despesa.preco).toFixed(2).replace(".", ",")}
                      </td>
                      <td className="p-4 text-gray-600">
                        {new Date(despesa.data_adicionado).toLocaleDateString(
                          "pt-BR"
                        )}
                      </td>
                      <td className="p-4 text-gray-600">
                        {despesa.data_pag
                          ? new Date(despesa.data_pag).toLocaleDateString(
                              "pt-BR"
                            )
                          : "-"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            despesa.status === "pago"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {despesa.status === "pago" ? "Pago" : "Pendente"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {despesa.status === "pendente" && (
                            <button
                              onClick={() =>
                                setDialogMarcarPago({ open: true, despesa })
                              }
                              className="px-3 py-1 bg-[#569a33] text-white rounded-lg text-sm font-semibold hover:bg-[#4f6940] transition cursor-pointer"
                              title="Marcar como pago"
                            >
                              <CheckCircle size={16} />
                            </button>
                          )}
                          <button
                            onClick={() =>
                              setDialogExcluir({
                                open: true,
                                id: despesa.id_despesa,
                              })
                            }
                            className="px-3 py-1 bg-[#ff6b6b] text-white rounded-lg text-sm font-semibold hover:bg-[#ff5252] transition cursor-pointer"
                            title="Excluir"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fluxo de Caixa Diário */}
        <div className="bg-white rounded-xl border-3 border-dashed border-[#569a33] p-6">
          <h2 className="text-xl font-bold text-[#569a33] mb-4">
            Fluxo de Caixa Diário
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#e8f5e8]">
                <tr>
                  <th className="p-3 text-left text-[#569a33] font-bold">
                    Data
                  </th>
                  <th className="p-3 text-left text-[#569a33] font-bold">
                    Total Caixas
                  </th>
                  <th className="p-3 text-left text-[#569a33] font-bold">
                    Valor Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {fluxoCaixa.map((fluxo, index) => (
                  <tr key={index} className="border-b border-[#569a33]/20">
                    <td className="p-3 font-semibold text-[#4f6940]">
                      {new Date(fluxo.data).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-3 text-gray-600">{fluxo.caixas}</td>
                    <td className="p-3 font-bold text-[#569a33]">
                      R${" "}
                      {parseFloat(fluxo.valor_total)
                        .toFixed(2)
                        .replace(".", ",")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
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
