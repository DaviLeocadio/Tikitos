"use client";

import * as React from "react";

import { useState, useEffect } from "react";

import { IconDotsVertical, IconLogout } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { deleteCookie, getCookie } from "cookies-next/client";

export function NavUser() {
  const { isMobile, setOpen, setIsPinned } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userIniciais, setUserIniciais] = useState();

  useEffect(() => {
    const nome = getCookie("nome");
    const email = getCookie("email");

    if (email) setUserEmail(email);

    const partes = nome.trim().split(" ");
    const iniciais =
      (partes[0]?.charAt(0).toUpperCase() || "") +
      (partes[partes.length - 1]?.charAt(0).toUpperCase() || "");

    const nomeExibido = `${
      partes[0]?.charAt(0).toUpperCase() + partes[0]?.slice(1).toLowerCase()
    } ${
      partes[partes.length - 1]
        ? partes[partes.length - 1].charAt(0).toUpperCase() +
          partes[partes.length - 1].slice(1).toLowerCase()
        : ""
    }`;

    setUserName(nomeExibido);
    setUserIniciais(iniciais);
  }, []);

  function handleDropdownOpenChange(open) {
    setDropdownOpen(open);

    if (open) {
      setOpen(true);
      setIsPinned(true);
    }
  }

  function handleDropdownClick() {
    if (!isMobile) {
      setDropdownOpen(false);
      setIsPinned(false);
      setOpen(false);
    }
  }

  const sair = async () => {
    const response = await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (response.ok) {
      deleteCookie("nome");
      deleteCookie("email");
      deleteCookie("perfil");
      deleteCookie("empresa");

      return (window.location.href = "/");
    }
  };

  const fecharCaixa = async () => {
    const response = await fetch("http://localhost:8080/vendedor/caixa/fechar", {
      method: "PUT",
      credentials: "include",
    });

    if (response.ok) {
      deleteCookie("idCaixa");
    }
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu
          open={dropdownOpen}
          onOpenChange={handleDropdownOpenChange}
        >
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className={`
                data-[state=open]:bg-[#924187]
                data-[state=open]:text-[#75BA51]
                hover:bg-[#924187]
                hover:text-[#75BA51]
              `}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {/* <AvatarImage src={user.avatar} alt={user.name} /> */}
                <AvatarFallback className="rounded-lg">
                  {userIniciais}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight hover:text-[#75BA51]">
                <span className="truncate font-medium">{userName}</span>
                <span className="truncate text-xs">{userEmail}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            onClick={handleDropdownClick}
            className="w-(--radix-dropdown-menu-trigger-width) border-[#9D4E92] bg-[#9D4E92] text-[#75BA51] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal cursor-pointer">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={} alt={nome} /> */}
                  <AvatarFallback className="rounded-lg">
                    {userIniciais}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userName}</span>
                  <span className="text-[#75BA51] text-xs">{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-[#75BA51]" />

            <DropdownMenuItem className="text-[#75BA51] focus:text-[#75BA51] focus:bg-[#F1B8E8] active:bg-[#F1B8E8] active:text-[#75BA51]">
              <IconLogout className="text-[#75BA51]" />
              <button
                type="button"
                onClick={async () => {
                  await fecharCaixa();
                  await sair();
                }}
              >
                Sair
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
