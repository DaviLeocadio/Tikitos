import { SidebarTrigger } from "@/components/ui/sidebar";

export default function RelatoriosIndex() {
  const cards = [
    {
      title: "Relatório Geral",
      href: "/admin/relatorios/geral",
      desc: "Visão consolidada do negócio",
      icon: "TrendingUp",
    },
    {
      title: "Relatório de Vendas",
      href: "/admin/relatorios/vendas",
      desc: "Vendas por período e filial",
      icon: "BarChart3",
    },
    {
      title: "Relatório da Filial",
      href: "/admin/relatorios/filial",
      desc: "Detalhes completos de uma filial",
      icon: "Store",
    },
    {
      title: "Relatório de Produtos",
      href: "/admin/relatorios/produtos",
      desc: "Desempenho, vendas e estoque",
      icon: "Package",
    },
  ];

  return (
    <div className="p-10 animate-fadeIn">
      {/* Título principal */}

      <div>
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c] flex items-center gap-2">
            <SidebarTrigger /> Relatórios Administrativos
          </h1>
        </div>
        <p className="text-gray-700 mt-1 font-medium">
          Escolha um relatório para visualizar informações detalhadas
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
        {cards.map((c) => {
          const Icon = require("lucide-react")[c.icon];
          return (
            <a
              key={c.href}
              href={c.href}
              className="group bg-white dark:bg-neutral-900 shadow-lg rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className="w-8 h-8 text-roxo group-hover:scale-110 transition" />
                <h2 className="text-xl font-bold group-hover:text-roxo transition">
                  {c.title}
                </h2>
              </div>
              <p className="text-neutral-600 dark:text-neutral-300 text-sm">
                {c.desc}
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
