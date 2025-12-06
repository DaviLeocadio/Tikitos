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

// AQUI É A IMPORTAÇÃO NECESSÁRIA PARA OS ÍCONES
import { BiMoney, BiSearch } from "react-icons/bi";
import { BsCart, BsClockHistory } from "react-icons/bs";
import { BsQuestionCircle, BsCashStack } from "react-icons/bs";
import { BsReceiptCutoff } from "react-icons/bs";


const data = {
  navMain: [
    {
      title: "Ponto de Venda",
      href: "/vendedor/pdv",
      icon: (props) => <BsReceiptCutoff className="size-7" {...props} />,
    },
    {
      title: "Caixa",
      href: "/vendedor/caixa",
      icon: (props) => <BsCashStack className="size-4" {...props} />,
    },
    {
      title: "Vendas",
      href: "/vendedor/vendas",
      icon: (props) => <BsCart className="size-4" {...props} />,
    },
    {
      title: "Suporte",
      href: "/vendedor/suporte",
      icon: (props) => <BsQuestionCircle className="size-4" {...props} />,
    }
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <Link href="/vendedor/pdv">
                <img src="/img/logos/logo_ioio.png" alt="" className="max-h-full" />
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
