"use client";
import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/footer/footer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getCookie } from "cookies-next/client";
import Forbidden from "../forbidden/page";

export default function Layout({ children }) {
  const perfil = getCookie("perfil");
  if (perfil && perfil !== "vendedor") return <Forbidden />;
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-col">
          <main>{children}</main>
          <Footer />
        </div>
      </SidebarProvider>
    </>
  );
}
