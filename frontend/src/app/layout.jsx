import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SessaoExpiradaModal from "@/components/layout/SessaoExpiradaModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tikitos",
  description: "Sistema interno da rede de brinquedos Tikitos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="PT-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#DABCE1]`}
      >
        {children}
        <SessaoExpiradaModal/>
      </body>
    </html>
  );
}
