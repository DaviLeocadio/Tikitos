"use client";

import * as React from "react";
import Link from "next/link";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Definição dos itens de menu baseada no perfil ADMINISTRADOR (Matriz)
const data = {
  navMain: [
    {
      title: "Visão Geral",
      href: "/admin", // Dashboard Consolidado
      icon: (props) => <i className="bi bi-speedometer2" {...props} />,
    },
    {
      title: "Lojas e Filiais",
      href: "/admin/lojas", // CRUD de Lojas (Exclusivo Admin)
      icon: (props) => <i className="bi bi-shop" {...props} />,
    },
    {
      title: "Catálogo de Produtos",
      href: "/admin/produtos", // Gestão Mestre de Produtos e Preços
      icon: (props) => <i className="bi bi-box-seam" {...props} />,
    },
    {
      title: "Fornecedores",
      href: "/admin/fornecedores", // Gestão de Fornecedores da Rede
      icon: (props) => <i className="bi bi-truck" {...props} />,
    },
    {
      title: "Gerentes",
      href: "/admin/gerentes", // (Gerencia gerentes)
      icon: (props) => <i className="bi bi-people" {...props} />,
    },
    {
      title: "Vendedores",
      href: "/admin/vendedores", // (Gerencia vendedores)
      icon: (props) => <i className="bi bi-people" {...props} />,
    },
    {
      title: "Financeiro Global",
      href: "/admin/financeiro", // Contas a Pagar Matriz + Fluxo Consolidado
      icon: (props) => <i className="bi bi-cash-coin" {...props} />,
    },
    {
      title: "Relatórios de Rede",
      href: "/admin/relatorios", // Comparativo entre lojas, Curva ABC, etc.
      icon: (props) => (
        <i className="bi bi-file-earmark-bar-graph" {...props} />
      ),
    },
  ],
};

export function AdminSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="
              transform transition-all duration-300 ease-out
              data-[slot=sidebar-menu-button]:!p-1.5 bg-transparent 
              group-hover:scale-102 hover:scale-97 cursor-pointer
    hover:bg-transparent 
    focus:bg-transparent 
    active:bg-transparent 
    data-[active=true]:bg-transparent"
    
            >
              {/* O Admin deve ser direcionado para o Dashboard Admin ao clicar no Logo, não para o PDV */}
              <Link href="/admin">
                <img
                  src="/img/logos/logo_ioio.png"
                  alt="Tikitos Logo"
                  className="max-h-full"
                />
                <span className="text-base font-semibold text-[#76216D] hover:bg-[#ffffff00]">
                  Tikitos{" "}
                  <small className="text-xs text-gray-500 block font-normal">
                    Matriz
                  </small>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="flex justify-start pl-1.5">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
