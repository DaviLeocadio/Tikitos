"use client"
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { ArrowRight, Shapes } from "lucide-react";
import React, { useEffect, useState } from "react";

const CardProdutos = () => {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/vendedor/produtos', {
            method: "GET",
            credentials: "include",
            headers: { "Content-type": "application/json" }
        })

            .then(response => {
                console.log(response);
                if (!response.ok) {
                    throw new Error(`Erro HTTP! Status: ${response.staus}`);
                }
                setProdutos(response.json);
            })
            .then(data => console.log(data))
            .catch(error => ('Erro ao buscar produtos: ', error))
    }, [])
    return (
        <>
            {/* <Card className="group max-w-xs shadow-none gap-0 pt-0 pb-0 bg-[#D8F1DC] border-4 border-dashed border-[#75ba51] rounded-[70px] p-3 hover:bg-[#C8FDB4] transition">
                <CardHeader className="pt-4 px-8 flex items-center flex-row justify-between gap-3 font-semibold">

                    <div className="flex flex-col align-center">
                        <div>
                            <h3 className="text-[#8C3E82]">Ursinho Teddy</h3>
                        </div>

                        <div>
                            <p className="text-[#c97fda]">R$40,00</p>
                        </div>
                    </div>

                    <div className="w-16 h-full flex justify-between align-center">
                        <i className="bi bi-info-circle text-2xl text-[#569a33] hover:scale-95 transition"></i>
                        <i className="bi bi-cart4 gap-3 text-2xl text-[#4f6940] hover:scale-95 transition"></i>
                    </div>

                </CardHeader>

                <CardContent className="mt-1 text-[15px] text-muted-foreground px-5">
                    <img
                        className="p-0 flex align-end w-full h-full object-contain transform transition group-hover:scale-108 duration-400 ease-out"
                        src="/img/produtos/urso_teddy.png"
                        alt="Imagem grande"
                    />
                </CardContent>
            </Card> */}

            <Card className="group max-w-90 shadow-none gap-0 pt-0 pb-0 bg-[#D8F1DC] border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-2 hover:bg-[#C8FDB4] transition">
                <CardHeader className="pt-3 px-6 flex items-center flex-row justify-between gap-2 font-semibold text-sm">
                    <div className="flex flex-col align-center">
                        <div>
                            <h3 className="text-[#8C3E82] text-[12px]">Ursinho Teddy</h3>
                        </div>

                        <div>
                            <p className="text-[#c97fda] text-[12px]">R$40,00</p>
                        </div>
                    </div>

                    <div className="w-12 h-full flex justify-between align-center">
                        <i className="bi bi-info-circle text-[15px] text-[#569a33] hover:scale-95 transition"></i>
                        <i className="bi bi-cart4 gap-3 text-[15px] text-[#4f6940] hover:scale-95 transition"></i>
                    </div>
                </CardHeader>
                <CardContent className="mt-1 text-[13px] text-muted-foreground px-4 max-w-90">
                    <img
                        className="p-0 flex align-end w-full h-full object-contain transform transition group-hover:scale-108 duration-400 ease-out"
                        src="/img/produtos/urso_teddy.png"
                        alt="Imagem grande"
                    />
                </CardContent>
            </Card>



        </>
    );
};

export default CardProdutos;