import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import { ArrowRight, Shapes } from "lucide-react";
import React from "react";

const CardProdutos = () => {
    return (
        <Card className="max-w-xs shadow-none gap-0 pt-0 pb-0 bg-[#D8F1DC] border-4 border-dashed border-[#75ba51] rounded-[70px] p-3 hover:bg-[#C8FDB4] transition">
            <CardHeader className="pt-4 px-8 flex items-center flex-row justify-between gap-3 font-semibold">

                <div className={`flex flex-col align-center`}>
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
                {/* <p>
                    Explore a collection of Shadcn UI blocks and components, ready to
                    preview and copy.
                </p> */}
                {/* <div className="mt-5 w-full aspect-video bg-muted rounded-xl" /> */}
                <img
                    className="p-0 flex align-end w-full h-full object-contain"
                    src="/img/produtos/urso_teddy.png"
                    alt="Imagem grande"
                />
            </CardContent>

            {/* <CardFooter className="mt-6">
                <Button className="/blocks">
                    Explore Blocks <ArrowRight />
                </Button>
            </CardFooter> */}
        </Card>
    );
};

export default CardProdutos;