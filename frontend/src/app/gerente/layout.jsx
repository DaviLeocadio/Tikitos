"use client";
import Footer from "@/components/footer/footer";
import { GerenteSidebar } from "@/components/gerente-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Forbidden from "../forbidden/page";
import { getCookie } from "cookies-next";

export default function GerenteLayout({ children }) {
  const perfil = getCookie("perfil");
  if (perfil && perfil !== "gerente") return <Forbidden />;
  return (
    <>
      <SidebarProvider>
        <GerenteSidebar />
        <main className="w-full">{children}</main>
        {/* <Footer /> */}
      </SidebarProvider>
    </>
  );
}
