"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MapPin, DollarSign, Users, TrendingUp, Package, Clock, ShieldCheck, Zap,
  Briefcase, CornerUpLeft, RefreshCw, User, ClipboardList, ShoppingCart, Banknote,
} from 'lucide-react';

// Keep styles and helpers inline to preserve visual parity with original page
const TIKITOS_COLORS = {
  primary: '#76196c',
  medium: '#924187',
  highlight: '#d695e7',
  light: '#e8c5f1',
  success: '#75ba51',
  lightSuccess: '#9bf377',
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (isoDateString, includeTime = true) => {
  if (!isoDateString) return 'N/A';
  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: includeTime ? '2-digit' : undefined,
      minute: includeTime ? '2-digit' : undefined,
      timeZone: 'UTC',
    }).format(date);
  } catch (e) {
    return 'Data inválida';
  }
};

const DashedCard = ({ title, children, icon: Icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md transition duration-300 border-2 border-dashed h-full" style={{ borderColor: TIKITOS_COLORS.light }}>
    <header className="flex items-center mb-4 pb-3 border-b border-dashed" style={{ borderColor: TIKITOS_COLORS.light }}>
      {Icon && <Icon size={24} className="mr-3" style={{ color: TIKITOS_COLORS.primary }} />}
      <h2 className="text-xl font-extrabold" style={{ color: TIKITOS_COLORS.primary }}>{title}</h2>
    </header>
    <div className="space-y-4">{children}</div>
  </div>
);

const DetailItem = ({ label, value, icon: Icon, color }) => (
  <div className="flex justify-between items-center py-1 border-b border-dashed border-gray-100 last:border-b-0">
    <div className="flex items-center text-sm text-gray-600">
      <Icon size={16} className="mr-2" style={{ color }} />
      {label}:
    </div>
    <span className="font-semibold text-gray-800 text-right">{value}</span>
  </div>
);

const FinanceMetric = ({ label, value, icon: Icon, color, isLarge = false }) => (
  <div className="flex items-center space-x-3 p-3 rounded-lg shadow-sm border border-gray-100">
    <div className={`p-2 rounded-full flex-shrink-0 ${isLarge ? 'bg-opacity-20' : 'bg-opacity-10'}`} style={{ backgroundColor: color + '30', color: color }}>
      <Icon size={isLarge ? 24 : 20} />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-extrabold ${isLarge ? 'text-2xl' : 'text-lg'}`} style={{ color: color }}>{value}</p>
    </div>
  </div>
);

const CaixaList = ({ title, data, color }) => (
  <div>
    <h4 className="font-semibold text-base mb-2" style={{ color }}>{title}</h4>
    <div className="space-y-2">
      {(data && data.length > 0) ? (
        data.slice(0, 3).map((mov, index) => (
          <div key={index} className="flex justify-between text-sm text-gray-700 bg-gray-50 p-2 rounded-md border border-gray-200">
            <span>{formatDate(mov.data)}</span>
            <span className="font-bold" style={{ color }}>{formatCurrency(mov.valor || 0)}</span>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-500">Nenhuma movimentação registrada.</p>
      )}
    </div>
  </div>
);

// Specific cards
const LojaInfoCard = ({ loja }) => {
  const statusColor = loja.status === 'ativo' ? TIKITOS_COLORS.success : 'rgb(239 68 68)';
  return (
    <DashedCard title="Dados Gerais da Loja" icon={Briefcase}>
      <DetailItem label="Nome da Filial" value={loja.nome} icon={ShoppingCart} color={TIKITOS_COLORS.medium} />
      <DetailItem label="Tipo" value={loja.tipo?.toUpperCase?.() || ''} icon={ClipboardList} color={TIKITOS_COLORS.medium} />
      <DetailItem label="Endereço" value={loja.endereco} icon={MapPin} color='rgb(234 88 12)' />
      <DetailItem label="Gerente Atual" value={loja.gerente?.nome || 'Não atribuído'} icon={User} color='rgb(37 99 235)' />
      <DetailItem label="Status Operacional" value={loja.status?.toUpperCase?.() || ''} icon={loja.status === 'ativo' ? ShieldCheck : Zap} color={statusColor} />
    </DashedCard>
  );
};

const GerenteVendedoresCard = ({ gerente, vendedores }) => (
  <DashedCard title="Equipe de Vendas" icon={Users}>
    <h3 className="text-lg font-bold" style={{ color: TIKITOS_COLORS.medium }}>Gerente Responsável:</h3>
    <div className="flex items-center space-x-4 p-3 rounded-lg" style={{ backgroundColor: TIKITOS_COLORS.light }}>
      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold text-lg flex-shrink-0" style={{ color: TIKITOS_COLORS.primary }}>
        {gerente?.nome ? gerente.nome[0] : '?'}
      </div>
      <div>
        <p className="font-semibold text-gray-800">{gerente?.nome || 'N/A'}</p>
        <p className="text-sm text-gray-500 truncate">{gerente?.email || 'Sem e-mail'}</p>
      </div>
    </div>

    <h3 className="text-lg font-bold mt-6" style={{ color: TIKITOS_COLORS.medium }}>Lista de Vendedores:</h3>
    <div className="grid grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2">
      {(vendedores && vendedores.length > 0) ? (
        vendedores.map((vendedor) => (
          <div key={vendedor.id_usuario} className="p-3 bg-white rounded-lg shadow-sm flex items-center space-x-2 border border-gray-100">
            <User size={16} style={{ color: TIKITOS_COLORS.highlight }} />
            <span className="text-sm font-medium">{vendedor.nome}</span>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500 col-span-2">Nenhum vendedor registrado.</p>
      )}
    </div>
  </DashedCard>
);

const FinancasCard = ({ financeiro }) => {
  const { faturamento_mes, total_vendas_mes, ticket_medio, ultima_venda } = financeiro || {};
  return (
    <DashedCard title="Resumo Financeiro Mensal" icon={DollarSign}>
      <FinanceMetric label="Faturamento do Mês" value={formatCurrency(Number(faturamento_mes || 0))} icon={Banknote} color={TIKITOS_COLORS.success} isLarge />
      <FinanceMetric label="Total de Vendas" value={Number(total_vendas_mes || 0)} icon={TrendingUp} color={TIKITOS_COLORS.medium} />
      <FinanceMetric label="Ticket Médio" value={formatCurrency(Number(ticket_medio || 0))} icon={DollarSign} color={TIKITOS_COLORS.highlight} />
      <FinanceMetric label="Última Venda" value={formatDate(ultima_venda)} icon={Clock} color='rgb(107 114 128)' />
    </DashedCard>
  );
};

const EstoqueCard = ({ estoque }) => {
  const isCritical = estoque?.estoque_status === 'BAIXO' || (estoque?.produtos_criticos || 0) > 0;
  const statusColor = isCritical ? 'rgb(239 68 68)' : TIKITOS_COLORS.success;
  const statusIcon = isCritical ? Zap : ShieldCheck;
  return (
    <DashedCard title="Situação do Estoque" icon={Package}>
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <span className="font-bold text-lg flex items-center" style={{ color: statusColor }}>
          <span className="mr-2">{estoque?.estoque_status}</span>
          <span className="animate-pulse">{React.createElement(statusIcon, { size: 20 })}</span>
        </span>
        <p className="text-sm text-gray-500">Total de Itens: <span className="font-semibold text-gray-700">{estoque?.total_itens}</span></p>
      </div>
      <DetailItem label="Produtos Críticos" value={estoque?.produtos_criticos} icon={Zap} color='rgb(239 68 68)' />
      <p className="text-base font-semibold mt-4" style={{ color: TIKITOS_COLORS.medium }}>Produtos com Baixa Quantidade:</p>
      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
        {(estoque?.produtos && estoque.produtos.length > 0) ? (
          estoque.produtos.map((p) => (
            <div key={p.id_produto} className="flex justify-between text-sm p-2 rounded-lg bg-gray-50 border border-dashed border-gray-200">
              <span className="font-medium text-gray-700">{p.nome}</span>
              <span className="font-bold text-orange-500">{p.quantidade} un.</span>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">Nenhum produto em nível crítico.</p>
        )}
      </div>
    </DashedCard>
  );
};

const VendasCard = ({ ultimas_vendas }) => (
  <DashedCard title="Últimas Vendas" icon={Clock}>
    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
      {(ultimas_vendas && ultimas_vendas.length > 0) ? (
        ultimas_vendas.map((venda, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg border-l-4 shadow-sm" style={{ borderColor: TIKITOS_COLORS.highlight, backgroundColor: TIKITOS_COLORS.light + '1A' }}>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{formatCurrency(venda.total)}</p>
              <p className="text-xs text-gray-500">Venda #{venda.id_venda} por {venda.vendedor}</p>
            </div>
            <p className="text-xs font-medium text-gray-600">{formatDate(venda.data_venda, false)}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Nenhuma venda recente registrada.</p>
      )}
    </div>
  </DashedCard>
);

const CaixaCard = ({ caixa }) => (
  <DashedCard title="Movimentação de Caixa" icon={Banknote}>
    <CaixaList title="Aberturas Recentes" data={caixa?.aberturas} color={TIKITOS_COLORS.success} />
    <div className="pt-4 border-t border-dashed" style={{ borderColor: TIKITOS_COLORS.light }}>
      <CaixaList title="Fechamentos Recentes" data={caixa?.fechamentos} color='rgb(234 88 12)' />
    </div>
  </DashedCard>
);

const DespesasCard = ({ despesas }) => (
  <DashedCard title="Despesas da Loja" icon={DollarSign}>
    <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
      {(despesas && despesas.length > 0) ? (
        despesas.map((despesa, index) => (
          <div key={index} className="flex justify-between items-start p-3 rounded-lg border-l-4 shadow-sm bg-red-50 border-red-300">
            <div>
              <p className="font-semibold text-gray-800 text-sm">{despesa.descricao}</p>
              <p className="text-xs text-red-600 font-medium">{formatCurrency(despesa.valor)}</p>
            </div>
            <p className="text-xs text-gray-500">{formatDate(despesa.data, false)}</p>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">Nenhuma despesa recente registrada.</p>
      )}
    </div>
  </DashedCard>
);

const LojaHeader = ({ lojaName, status, loading, handleRefresh }) => {
  const statusColor = status === 'ativo' ? TIKITOS_COLORS.success : 'rgb(239 68 68)';
  const handleGoBack = () => window.location.href = '/lojas';
  return (
    <header className="mb-8 border-b-2 border-dashed pb-4 flex flex-col md:flex-row justify-between items-start md:items-center" style={{ borderColor: TIKITOS_COLORS.light }}>
      <div className="flex items-center mb-4 md:mb-0">
        <h1 className="text-3xl font-extrabold mr-4" style={{ color: TIKITOS_COLORS.primary }}>{lojaName}</h1>
        <span className="px-4 py-1 text-sm font-bold rounded-full uppercase text-white" style={{ backgroundColor: statusColor }}>{status}</span>
      </div>
      <div className="flex space-x-3">
        <button onClick={handleGoBack} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg shadow-sm hover:bg-gray-300 transition duration-150 text-sm">
          <CornerUpLeft size={16} className="mr-2" /> Voltar
        </button>
        <button onClick={handleRefresh} disabled={loading} className="flex items-center px-4 py-2 text-white font-medium rounded-lg shadow-md transition duration-150 text-sm disabled:opacity-50" style={{ backgroundColor: TIKITOS_COLORS.success }}>
          <RefreshCw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} /> Atualizar Dados
        </button>
      </div>
    </header>
  );
};

// Main component (exported)
export default function LojaDetalhesComponent({ params }) {
  const lojaId = params?.id || 200;
  const [loja, setLoja] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `http://localhost:8080/admin/filiais/${lojaId}`;

  const fetchLojaDetails = useCallback(async (retries = 3) => {
    setLoading(true); setError(null); let lastError = null;
    if (lojaId === 200) {
      await new Promise(r => setTimeout(r, 400)); setLoja(null); // allow mock usage in original dev file
    }
    for (let i = 0; i < retries; i++) {
      try {
        const resp = await fetch(API_URL, { method: 'GET', credentials: 'include', headers: { 'Content-Type': 'application/json' } });
        if (!resp.ok) throw new Error(`Erro HTTP: ${resp.status}`);
        const data = await resp.json();
        setLoja(data);
        setLoading(false);
        return;
      } catch (err) {
        lastError = err; if (i < retries - 1) await new Promise(r => setTimeout(r, 1000 * Math.pow(2, i)));
      }
    }
    setError(lastError?.message || 'Erro ao carregar detalhes da loja');
    setLoading(false);
  }, [API_URL, lojaId]);

  useEffect(() => { fetchLojaDetails(); }, [fetchLojaDetails]);

  const renderContent = useMemo(() => {
    if (loading) return (
      <div className="text-center py-20 flex flex-col items-center"><RefreshCw className="w-10 h-10 mb-4 animate-spin" style={{ color: TIKITOS_COLORS.highlight }} /><p className="text-xl font-medium" style={{ color: TIKITOS_COLORS.medium }}>Carregando detalhes da filial {lojaId}...</p></div>
    );

    if (error || !loja) return (
      <div className="text-center py-20 p-8 bg-red-50 border border-red-300 rounded-lg shadow-md">
        <p className="text-2xl font-bold text-red-700 mb-3">Erro de Carregamento</p>
        <p className="text-red-600 mb-4">Ocorreu um problema ao buscar os dados da loja:</p>
        <pre className="p-3 bg-red-100 rounded-md text-sm text-left whitespace-pre-wrap">{error || 'Sem dados retornados'}</pre>
        <button onClick={() => fetchLojaDetails(1)} className="mt-6 px-6 py-2 text-white font-medium rounded-lg shadow-md transition duration-150" style={{ backgroundColor: TIKITOS_COLORS.primary }}>Tentar Novamente</button>
      </div>
    );

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8"><LojaInfoCard loja={loja} /><GerenteVendedoresCard gerente={loja.gerente} vendedores={loja.vendedores} /></div>
        <div className="lg:col-span-2 space-y-8"><div className="grid grid-cols-1 md:grid-cols-2 gap-8"><FinancasCard financeiro={loja.financeiro} /><EstoqueCard estoque={loja.estoque} /></div><VendasCard ultimas_vendas={loja.ultimas_vendas} /></div>
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8"><CaixaCard caixa={loja.caixa} /><DespesasCard despesas={loja.despesas} /></div>
      </div>
    );
  }, [loading, error, loja, lojaId, fetchLojaDetails]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12"><div className="max-w-7xl mx-auto"><LojaHeader lojaName={loja?.nome || `Loja #${lojaId}`} status={loja?.status || 'desconhecido'} loading={loading} handleRefresh={() => fetchLojaDetails(1)} />{renderContent}</div></div>
  );
}
