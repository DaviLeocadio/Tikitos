
import Footer from "@/components/footer/footer";
import { GerenteSidebar } from "@/components/gerente-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function GerenteLayout({ children }) {
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
