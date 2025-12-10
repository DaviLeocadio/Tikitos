"use client";
import { useState } from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip_one";

export default function MapaFiliais() {
  const [hovered, setHovered] = useState(null);

  const filiais = [
    { id: 1, estado: "Acre", qtd: 1, x: "13%", y: "34%" },
    { id: 2, estado: "Amazonas", qtd: 3, x: "24%", y: "24%" },
    { id: 3, estado: "Roraima", qtd: 1, x: "33%", y: "8%" },
    { id: 4, estado: "Amapá", qtd: 1, x: "56%", y: "6%" },
    { id: 5, estado: "Pará", qtd: 4, x: "55%", y: "25%" },
    { id: 6, estado: "Rondônia", qtd: 2, x: "28%", y: "38%" },
    { id: 7, estado: "Mato Grosso", qtd: 4, x: "47%", y: "45%" },
    { id: 8, estado: "Tocantins", qtd: 3, x: "65%", y: "38%" },
    { id: 9, estado: "Maranhão", qtd: 2, x: "73%", y: "25%" },
    { id: 10, estado: "Piauí", qtd: 2, x: "79%", y: "32%" },
    { id: 11, estado: "Ceará", qtd: 3, x: "88%", y: "25%" },
    { id: 12, estado: "Rio Grande do Norte", qtd: 2, x: "94%", y: "24%" },
    { id: 13, estado: "Paraíba", qtd: 2, x: "97%", y: "28%" },
    { id: 14, estado: "Pernambuco", qtd: 3, x: "90%", y: "31%" },
    { id: 15, estado: "Alagoas", qtd: 1, x: "96%", y: "34%" },
    { id: 16, estado: "Sergipe", qtd: 1, x: "93%", y: "37%" },
    { id: 17, estado: "Bahia", qtd: 6, x: "81%", y: "43%" },
    { id: 18, estado: "Goiás", qtd: 3, x: "62%", y: "51%" },
    { id: 19, estado: "Distrito Federal", qtd: 2, x: "67%", y: "49%" },
    { id: 20, estado: "Minas Gerais", qtd: 6, x: "75%", y: "58%" },
    { id: 21, estado: "Espírito Santo", qtd: 2, x: "85%", y: "58%" },
    { id: 22, estado: "Rio de Janeiro", qtd: 4, x: "80%", y: "64%" },
    { id: 23, estado: "São Paulo", qtd: 10, x: "65%", y: "66%" },
    { id: 24, estado: "Paraná", qtd: 5, x: "56%", y: "69%" },
    { id: 25, estado: "Santa Catarina", qtd: 4, x: "61%", y: "76%" },
    { id: 26, estado: "Rio Grande do Sul", qtd: 6, x: "52%", y: "84%" },
    { id: 27, estado: "Mato Grosso do Sul", qtd: 2, x: "49%", y: "61%" },
  ];

  return (
    <div className="pe-7">
      <div className="w-full flex flex-col items-center pb-5">
        <img
          src="/img/adm/titulo_nossas_filiais.png"
          className="max-w-[300px] md:max-w-[400px] drop-shadow-[10px_10px_0px_rgba(183,101,202,0.9)]"
        />

        <div className="relative w-[320px] md:w-[430px] mt-4">
          <img src="/img/adm/mapa_nossas_filiais.png" className="w-full" />

          {filiais.map((f) => (
            <div
              key={f.id}
              style={{ top: f.y, left: f.x }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <img
                    src="/img/adm/marcador_nossas_filiais.png"
                    className="w-5 h-5 object-contain drop-shadow-md hover:scale-125 transition cursor-pointer"
                  />
                </TooltipTrigger>

                <TooltipContent side="top" className="text-xs text-center">
                  <p>{f.estado}</p>
                  <p>
                    <b>
                      {f.qtd} {f.qtd > 1 ? "filiais" : "filial"}
                    </b>
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
