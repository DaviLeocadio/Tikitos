"use client"

import * as React from "react"
import {
  IconDotsVertical,
  IconLogout,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavUser({ user }) {
  const { isMobile, setOpen, setIsPinned } = useSidebar()
  const [dropdownOpen, setDropdownOpen] = React.useState(false)

  function handleDropdownOpenChange(open) {
    setDropdownOpen(open)

    if (open) {
      setOpen(true)
      setIsPinned(true)
    }
  }

  function handleDropdownClick() {
    if (!isMobile) {
      setDropdownOpen(false)
      setIsPinned(false)
      setOpen(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={dropdownOpen} onOpenChange={handleDropdownOpenChange}>
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
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight hover:text-[#75BA51]">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
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
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-[#75BA51] text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator className="bg-[#75BA51]" />

            <DropdownMenuItem
              className="text-[#75BA51] focus:text-[#75BA51] focus:bg-[#F1B8E8] active:bg-[#F1B8E8] active:text-[#75BA51]"
            >
              <IconLogout className="text-[#75BA51]" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
