
import Footer from "@/components/footer/footer";
import { GerenteSidebar } from "@/components/gerente-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function GerenteLayout({ children }) {
  return (
    <>
      <SidebarProvider>
        <GerenteSidebar />
        <div className="flex flex-col">
          <main>{children}</main>
          {/* <Footer /> */}
        </div>
      </SidebarProvider>
    </>
  );
}
