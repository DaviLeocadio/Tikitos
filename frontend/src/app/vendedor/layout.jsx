import { AppSidebar } from "@/components/app-sidebar";
import Footer from "@/components/footer/footer";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }) {
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
