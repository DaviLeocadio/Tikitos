"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import LojaCard from "@/components/admin/lojas/LojaCard";

function SlideOpacity({ lojas }) {
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);
  const cardRefs = React.useRef([]); // guarda todas as refs
  const [maxHeight, setMaxHeight] = React.useState(0);

  // Ao carregar, mede o maior card
  React.useEffect(() => {
    if (cardRefs.current.length > 0) {
      const heights = cardRefs.current.map((el) => el?.offsetHeight || 0);
      setMaxHeight(Math.max(...heights));
    }
  }, [lojas]);

  React.useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => setCurrent(api.selectedScrollSnap() + 1));
  }, [api]);

  return (
    <div className="mx-auto w-full pe-10 pt-1">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <div className="flex justify-between pt-0 gap-3 pb-2 w-full ">
          <div className="flex items-center text-[#75BA51] gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-circle-star-icon lucide-circle-star"
            >
              <path d="M11.051 7.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.867l-1.156-1.152a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <p className="text-lg text-[#8c3e82]">Veja o TOP 03 em vendas</p>
          </div>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0 p-1 rounded-full text-[#7D2373] bg-[#92EF6C] hover:bg-[#92ce72] transition-colors hover:text-[#7D2373]">
              <div className="bg-[#7D2373] rounded-full p-2 flex items-center justify-center">
                <CarouselPrevious.icon className="text-white" />
              </div>
            </CarouselPrevious>

            <CarouselNext className="static translate-y-0 p-1 rounded-full text-[#7D2373] bg-[#92EF6C] hover:bg-[#92ce72] transition-colors hover:text-[#7D2373]">
              <div className="bg-[#7D2373] rounded-full p-2 flex items-center justify-center">
                <CarouselNext.icon className="text-white" />
              </div>
            </CarouselNext>
          </div>
        </div>

        <CarouselContent className="w-full">
          {lojas?.map((loja, index) => {
            const medalColor =
              index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32";
            const medalLabel = index === 0 ? "1" : index === 1 ? "2" : "3";
            return (
              <CarouselItem
                key={loja.id_empresa}
                className="basis-4/6 flex justify-center pt-5"
              >
                <Card
                  ref={(el) => (cardRefs.current[index] = el)}
                  style={{ minHeight: maxHeight }}
                  className={cn(
                    "relative w-full transition-all duration-500",
                    index !== current - 1 && "opacity-30"
                  )}
                >
                  <CardContent className="p-0 h-full">
                    <div className="absolute z-50 -translate-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-lg"
                        style={{ background: medalColor }}
                        aria-hidden
                      >
                        {medalLabel}
                      </div>
                    </div>
                    <LojaCard loja={loja} />
                  </CardContent>
                </Card>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}

export { SlideOpacity };
