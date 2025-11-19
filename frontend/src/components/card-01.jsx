import * as React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function CardDemo({quantidade, subtotal, desconto, setDesconto}) {

  const itens = [
    {
      nome: "Total itens",  
      valor: quantidade,
    },
    {
      nome: "Subtotal",
      valor:  `R$ ${Number(subtotal).toFixed(2).replace(".", ",")}`,
    },
    {
      nome: "Desconto",
      placeholder: "Em %",
    },
  ];

  const handleChangeDesconto = (e) => {
    setDesconto(e.target.value)
  }

  return (
    <div className="flex flex-row gap-3">
      {itens.map((item, index) => (
        <Card
          key={index}
          className="flex flex-col justify-center items-center text-center p-2 w-[120px] bg-[#924187] border border-[#924187] text-[#DDF1D4] rounded-[25px] shadow-sm"
        >
          <h1 className="text-[13px] font-semibold tracking-tight text-[#c5ffad]">
            {item.nome}
          </h1>

          {index === itens.length - 1 ? (
            <Input
              id={`input-${index}`}
              type="number"
              placeholder={item.placeholder}
              onChange={handleChangeDesconto}
              className="mt-1 w-[70px] text-center text-sm placeholder:text-[#EADBEA] bg-[#B96AAE] border-none text-[#DDF1D4] focus:outline-none rounded-md h-5.5
      [&::-webkit-inner-spin-button]:appearance-none
      [&::-webkit-outer-spin-button]:appearance-none
      [appearance:textfield] outline-none shadow-none"
            />
          ) : (
            <p className="mt-0 text-[#EADBEA] text-[15px]">{item.valor}</p>
          )}

        </Card>
      ))}
    </div>
  );
}
