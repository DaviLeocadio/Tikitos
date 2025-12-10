"use client";
import Footer from "@/components/footer/footer";
import { GerenteSidebar } from "@/components/gerente-sidebar";
// import Footer from "@/components/footer/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import Forbidden from "../forbidden/page";
import { getCookie } from "cookies-next";
import FooterGerente from "@/components/footer/footer-gerente";

export default function GerenteLayout({ children }) {
  const perfil = getCookie("perfil");
  if (perfil && perfil !== "gerente") return <Forbidden />;
  return (
    <>
      <SidebarProvider>
        <GerenteSidebar />
        <div className="flex flex-col">
          <main>{children}</main>
          <FooterGerente />
        </div>
      </SidebarProvider> 
    </>
  );
}
