"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import CardSuporte from "@/components/cardSuporte/CardSuporte.jsx";
import styles from "./suporte.module.css";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import Pagamento from "@/components/pagamento";

export default function Suporte() {
  return (
    <>
      <div className="grid gap-5 grid-cols-1 md:grid-cols-1">
        <div className="flex m-5 gap-2 items-center">
          <SidebarTrigger />
        </div>
      </div>

      {/* BANNER INICIAL */}
      <div className="rounded-3xl overflow-hidden px-[45px] mb-10 sm:w-[100%] ">
        <img
          src="/img/suporte/topicos_suporte.png"
          className="w-full rounded-3xl"
        />
      </div>

      {/* CARDS DOS TÓPICOS EXPLICTIVOS */}
      <div className="flex flex-wrap items-center gap-15 justify-center py-3 mb-[-1%]">
        <CardSuporte
          src="/img/suporte/ursinho_suporte.png"
          title="Ponto de Venda"
          text="O PDV é onde você registra suas vendas de forma rápida e segura.Selecione o produto, 
        finalize o pagamento e o pedido será adicionado ao seu histórico automaticamente."
        />

        <CardSuporte
          src="/img/suporte/dinheiro_suporte.png"
          title="Pagamento e Recebimento"
          text="Os pagamentos são processados automaticamente após cada venda. Você pode acompanhar 
        tudo pelo Histórico de Vendas. Em caso de diferença ou atraso, fale com o suporte."
        />

        <CardSuporte
          src="/img/suporte/contato_suporte.png"
          title="Contato com o Suporte"
          text="Precisa de ajuda personalizada? Estamos prontos pra te atender. Clique no botão abaixo e 
        fale com a equipe Tikitos."
        />

        <CardSuporte
          src="/img/suporte/dica_suporte.png"
          title="Dica Tikitos"
          text="Mantenha seus dados atualizados e acompanhe o histórico de vendas regularmente — isso 
        evita atrasos e facilita o suporte quando precisar."
        />
      </div>

      <div
        className={`flex flex-col lg:flex-row items-start w-full ${styles.supportRow}`}
      >
        {/* BLOCO ESQUERDO = TÍTULO + ACCORDION */}
        <div className="flex flex-col items-start w-full lg:w-[55%]">
          {/* TÍTULO */}
          <img
            src="/img/suporte/perguntas_suporte.png"
            className="w-[80%] p-4  
             sm:w-[60%] sm:p-10 sm:mb-[2%] sm:items-center
             md:w-[80%] md:p-16 md:mb-[-10%]"
          />

          {/* ACCORDION */}
          <div className="max-w-md w-full sm:px-6 lg:mx-10 p-1 items-start">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  Meu pedido não aparece no histórico de vendas.
                </AccordionTrigger>
                <AccordionContent>
                  Verifique se a venda foi finalizada corretamente no PDV. Se
                  mesmo assim não aparecer, atualize a página. Caso o problema
                  continue, envie uma mensagem no suporte informando o horário
                  da venda.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>
                  O PDV travou ou ficou em branco.
                </AccordionTrigger>
                <AccordionContent>
                  Isso pode acontecer por instabilidade na internet. Atualize a
                  página e tente novamente. Se o erro persistir, limpe o cache
                  do navegador ou entre em contato com o suporte.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>
                  Como saber se a venda foi concluída?
                </AccordionTrigger>
                <AccordionContent>
                  Toda venda finalizada com sucesso aparece imediatamente no
                  Histórico de Vendas, com o valor e a data. Se não estiver lá,
                  é provável que o pagamento não tenha sido confirmado.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>
                  Esqueci minha senha de acesso.
                </AccordionTrigger>
                <AccordionContent>
                  Na tela de login, clique em “Esqueci minha senha” e siga as
                  instruções para redefinir. Você receberá um link por e-mail
                  para criar uma nova senha.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>
                  Posso alterar meus dados de vendedor?
                </AccordionTrigger>
                <AccordionContent>
                  Por enquanto, mudanças como nome da loja ou informações de
                  contato devem ser feitas com a ajuda do suporte. Envie uma
                  mensagem explicando o que deseja alterar.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* BLOCO DIREITO = FORMULÁRIO */}
      
      </div>
    </>
  );
}
