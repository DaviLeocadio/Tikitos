"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import CardSuporte from "@/components/cardSuporte/CardSuporte.jsx";

export default function Suporte() {
  return (
    <>
      <div className="grid gap-5 grid-cols-1 md:grid-cols-1">
        <div className="flex m-5 gap-2 items-center">
          <SidebarTrigger />
          {/* TÍTULO INICIAL */}
          <img src="/img/suporte/topicos_suporte.png" className="w-80"/>
        </div>
      </div>

      
      <div className="flex items-center gap-15 justify-center py-7">
        <CardSuporte />
        <CardSuporte />
        <CardSuporte />
        <CardSuporte />
        
      </div>
    </>
  );
}
