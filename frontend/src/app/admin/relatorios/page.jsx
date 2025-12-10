import { SidebarTrigger } from "@/components/ui/sidebar";

export default function RelatoriosIndex() {
  const cards = [
    {
      title: "Relatório Geral",
      href: "/admin/relatorios/geral",
      desc: "Visão consolidada do negócio",
      icon: "TrendingUp",
      bg: "#B0FF8F",
      text: "#4E8A3D",
    },
    {
      title: "Relatório de Vendas",
      href: "/admin/relatorios/vendas",
      desc: "Vendas por período e filial",
      icon: "BarChart3",
      bg: "#DA93E3",
      text: "#76196c",
    },
    {
      title: "Relatório de Produtos",
      href: "/admin/relatorios/produtos",
      desc: "Desempenho, vendas e estoque",
      icon: "Package",
      bg: "#70B64C",
      text: "#C5FFAD",
    },
    {
      title: "Relatório da Filial",
      href: "/admin/relatorios/filial",
      desc: "Detalhes completos de uma filial",
      icon: "Store",
      bg: "#F1B8E8",
      text: "#8E4187",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-[#DDF0D4] p-5 lg:p-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Título */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-2 text-[#76196c]">
            <SidebarTrigger /> Relatórios Administrativos
          </h1>
          <p className="text-[#4F6940] mt-1 font-medium">
            Escolha um relatório para visualizar informações detalhadas
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-6">
          {cards.map((c) => {
            const Icon = require("lucide-react")[c.icon];

            return (
              <a
                key={c.href}
                href={c.href}
                style={{ backgroundColor: c.bg }}
                className="
                  group shadow-lg rounded-2xl p-6
                  transition-all duration-300 ease-out cursor-pointer
                  hover:scale-[0.97] hover:shadow-xl
                "
              >
                <div className="flex items-center gap-3 mb-4">
                  <Icon
                    style={{ color: c.text }}
                    className="w-8 h-8 transition-transform group-hover:scale-110"
                  />

                  <h2
                    style={{ color: c.text }}
                    className="text-xl font-bold transition-opacity group-hover:opacity-80"
                  >
                    {c.title}
                  </h2>
                </div>

                <p
                  style={{ color: c.text }}
                  className="text-sm opacity-90"
                >
                  {c.desc}
                </p>
              </a>
            );
          })}
        </div>

      </div>
    </div>
  );
}
