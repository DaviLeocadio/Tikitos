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
                </div>
            </div>


        </>
    )
}