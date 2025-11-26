"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import CardSuporte from "@/components/cardSuporte/CardSuporte.jsx";

import {
    Calculator,
    Clock,
    AlertTriangle,
    Package,
    TrendingUp,
    Timer,
  } from "lucide-react";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
} from "recharts";

const data = [
    { name: "Seg", rosa: 18, verde: 5 },
    { name: "Ter", rosa: 27, verde: 6 },
    { name: "Qua", rosa: 23, verde: 15 },
    { name: "Qui", rosa: 35, verde: 35 },
    { name: "Sex", rosa: 36, verde: 42 },
];

export default function Configuracoes() {

    
    return (
        <>

            {/* MENU DA SIDEBAR */}
            <div className="grid gap-5 grid-cols-1 md:grid-cols-1">
                <div className="flex m-5 gap-2 items-center">
                    <SidebarTrigger />
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center md:items-start w-full gap-4">

                {/* IMAGEM */}
                <img
                    src="/img/configuracoes/titulo_historico.png"
                    className="w-[70%] md:w-[30%] items-center p-6 md:p-10"
                    alt="Título Histórico"
                />
                {/* GRÁFICO */}
                <div className="w-full h-[260px] md:h-[320px] items-end rounded-xl p-4 md:p-6 bg-[#DDF1D4]">
                    <ResponsiveContainer width="100%" height="90%">
                        <LineChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 20 }}>
                            <CartesianGrid stroke="#D9EBD1" strokeWidth={1} />
                            <XAxis
                                dataKey="name"
                                tick={{ fill: "#415932", fontSize: 15 }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                tick={{ fill: "#415932", fontSize: 14 }}
                                axisLine={false}
                                tickLine={false}
                                domain={[0, 50]}
                            />
                            <Tooltip cursor={false} />
                            <Line
                                type="monotone"
                                dataKey="rosa"
                                stroke="#D8A8E5"
                                strokeWidth={4}
                                dot={{ r: 5, fill: "#D8A8E5" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="verde"
                                stroke="#4C8E37"
                                strokeWidth={4}
                                dot={{ r: 5, fill: "#4C8E37" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>


            


        </>
    )
}