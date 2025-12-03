"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import LojaCard from "@/components/admin/lojas/LojaCard"; // IMPORTAÇÃO DO CARD

function SlideOpacity({ lojas }) { // <-- recebe as filiais como props
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="mx-auto max-w-xs">
      <Carousel setApi={setApi} className="w-full max-w-xs mx-2" opts={{ loop: true }}>
        <CarouselContent>

          {lojas?.map((loja, index) => (
            <CarouselItem key={loja.id_empresa} className="basis-4/5">
              <Card
                className={cn("transition-all duration-500", {
                  "opacity-30": index !== current - 1,
                })}>
                <CardContent className="p-0">
                  <LojaCard loja={loja} /> {/* <-- CARD DA FILIAL */}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}

        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

export { SlideOpacity };