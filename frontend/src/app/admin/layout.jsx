"use client";

import { useEffect, useState } from "react";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin-sidebar"; // Sidebar específica do Admin
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Footer from "@/components/footer/footer";


// Import da página de acesso negado
import ForbiddenPage from "../forbidden/page"; 
import FooterAdmin from "@/components/footer/footer-admin";

export default function AdminLayout({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null); // null = verificando
  const router = useRouter();

  useEffect(() => {
    // Busca o perfil salvo no cookie
    const perfil = getCookie("perfil");

    // Apenas 'admin' passa. Se for 'gerente', 'vendedor' ou null, bloqueia.
    if (perfil === "admin") {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [router]);

  
  if (isAuthorized === false) {
    return <ForbiddenPage />;
  }
  return (
    <SidebarProvider>
        <AdminSidebar />
        <div className="flex flex-col">
          <main>{children}</main>
          <FooterAdmin />
        </div>
        
      </SidebarProvider>
  );
}