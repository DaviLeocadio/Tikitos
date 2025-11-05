
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { ArrowRight, Shapes } from "lucide-react";
import React, { useEffect, useState } from "react";

const CardProdutos = ({ produtos }) => {
    return (
        <>

            <Card className="group min-w-53 shadow-none gap-0 pt-0 pb-0 bg-[#D8F1DC] border-[3px] border-dashed border-[#75ba51] rounded-[50px] p-2 hover:bg-[#C8FDB4] transition">
                <CardHeader className="pt-3 px-6 flex items-center flex-row justify-between gap-2 font-semibold text-sm">
                    <div className="flex flex-col align-center">
                        <div>
                            <h3 className="text-[#8C3E82] text-[12px] tracking-tighter">{produtos.nome}</h3>
                        </div>

                        <div>
                            <p className="text-[#c97fda] text-[12px]">{produtos.preco}</p>
                        </div>
                    </div>

                    <div className="w-10 h-full flex justify-between items-center">
                        <i className="bi bi-info-circle text-[15px] text-[#569a33] hover:scale-95 transition"></i>
                        <i className="bi bi-cart4 gap-3 text-[15px] text-[#4f6940] hover:scale-95 transition"></i>
                    </div>
                </CardHeader>
                <CardContent className="mt-1 text-[13px] text-muted-foreground px-4 max-w-90">
                    <img
                        className="p-0 flex align-end w-full h-full object-contain transform transition group-hover:scale-108 duration-400 ease-out"
                        src={`${produtos.imagem}`}
                        alt="Imagem grande"
                    />
                </CardContent>
            </Card>







        </>
    );
};

export default CardProdutos;