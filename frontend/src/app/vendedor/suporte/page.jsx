"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import CardSuporte from "@/components/cardSuporte/CardSuporte.jsx";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";


export default function Suporte() {
  return (
    <>

      <div className="grid gap-5 grid-cols-1 md:grid-cols-1">
        <div className="flex m-5 gap-2 items-center">
          <SidebarTrigger />
        </div>
      </div>

      {/* BANNER INICIAL */}
      <div className="rounded-[50px]">
        <img
        src="/img/suporte/topicos_suporte.png"
        className="w-full px-35 rounded-[50px]"
      />
      </div>

      {/* CARDS DOS TÓPICOS EXPLICTIVOS */}
      <div className="flex flex-wrap items-center gap-15 justify-center py-3">
        <CardSuporte src="/img/suporte/ursinho_suporte.png" title="Ponto de Venda"
          text="O PDV é onde você registra suas vendas de forma rápida e segura.Selecione o produto, 
        finalize o pagamento e o pedido será adicionado ao seu histórico automaticamente."/>

        <CardSuporte src="/img/suporte/dinheiro_suporte.png" title="Pagamento e Recebimento"
          text="Os pagamentos são processados automaticamente após cada venda. Você pode acompanhar 
        tudo pelo Histórico de Vendas. Em caso de diferença ou atraso, fale com o suporte." />

        <CardSuporte src="/img/suporte/contato_suporte.png" title="Contato com o Suporte"
          text="Precisa de ajuda personalizada? Estamos prontos pra te atender. Clique no botão abaixo e 
        fale com a equipe Tikitos." />

        <CardSuporte src="/img/suporte/dica_suporte.png" title="Dica Tikitos"
          text="Mantenha seus dados atualizados e acompanhe o histórico de vendas regularmente — isso 
        evita atrasos e facilita o suporte quando precisar." />
      </div>



      {/* TÍTULO PARA AS PERGUNTAS FREQUENTES */}
      <img src="/img/suporte/perguntas_suporte.png" className="w-[43%] p-17 mt-[-40]" />

      {/* ACCORDION DAS PERGUNTAS */}
      <div className="max-w-xl mx-auto p-1">
        <Accordion type="single" collapsible className="w-full">

          <AccordionItem value="item-1">
            <AccordionTrigger>O que é o shadcn/ui?</AccordionTrigger>
            <AccordionContent>
              É uma coleção de componentes usando Tailwind + Radix.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>É gratuito?</AccordionTrigger>
            <AccordionContent>
              Sim, totalmente open-source.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>Como instalar o shadcn/ui?</AccordionTrigger>
            <AccordionContent>
              Basta rodar o comando <code>npx shadcn-ui init</code> e depois adicionar
              os componentes desejados.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>Preciso usar Tailwind?</AccordionTrigger>
            <AccordionContent>
              Sim. O shadcn/ui é construído usando Tailwind como base.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Posso personalizar os componentes?</AccordionTrigger>
            <AccordionContent>
              Pode! Os componentes são totalmente editáveis dentro da sua pasta
              <code>/components/ui</code>.
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>



    </>
  );
}
