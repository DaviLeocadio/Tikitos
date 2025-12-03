import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ClientOnlyUI from "@/components/layout/ClientOnlyUI";

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
  
  setInterval(function () {
    console.log("Júlia Nicoly");
  }, 10 * 60 * 1000);

  return (
    <html lang="PT-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#DABCE1]`}
      >
        <ClientOnlyUI />
        {children}
      </body>
    </html>
  );
}
