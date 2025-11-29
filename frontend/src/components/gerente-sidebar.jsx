"use client"

import * as React from "react"
import Link from 'next/link';
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Dashboard",
      href: "/gerente/",
      icon: (props) => <i className="bi bi-speedometer2" {...props} />,
    },
    {
      title: "Produtos",
      href: "/gerente/produtos",
      icon: (props) => <i className="bi bi-box-seam" {...props} />,
    },
    {
      title: "Vendedores",
      href: "/gerente/vendedores",
      icon: (props) => <i className="bi bi-people" {...props} />,
    },
    {
      title: "Financeiro",
      href: "/gerente/financeiro",
      icon: (props) => <i className="bi bi-cash-coin" {...props} />,
    },
    {
      title: "Relatórios",
      href: "/gerente/relatorios",
      icon: (props) => <i className="bi bi-file-earmark-bar-graph" {...props} />,
    },
    {
      title: "Alertas",
      href: "/gerente/alertas",
      icon: (props) => <i className="bi bi-bell" {...props} />,
    }
    
  ],
}

export function GerenteSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/vendedor/pdv">
                <img src="/img/logos/logo_ioio.png" alt="" className="max-h-full"/>
                <span className="text-base font-semibold text-[#76216D] hover:bg-[#ffffff00]">Tikitos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter className="flex justify-start pl-1.5">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
