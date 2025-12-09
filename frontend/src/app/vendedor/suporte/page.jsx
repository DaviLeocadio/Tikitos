"use client";
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import CardSuporte from "@/components/cardSuporte/CardSuporte.jsx";
import { useState } from "react";
import styles from "./suporte.module.css";

export default function Suporte() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // controla o sidebar

  const faqs = [
    {
      question: "Meu pedido não aparece no histórico de vendas.",
      answer:
        "Verifique se a venda foi finalizada corretamente no PDV. Se mesmo assim não aparecer, atualize a página. Caso o problema continue, envie uma mensagem no suporte informando o horário da venda.",
    },
    {
      question: "O PDV travou ou ficou em branco.",
      answer:
        "Isso pode acontecer por instabilidade na internet. Atualize a página e tente novamente. Se o erro persistir, limpe o cache do navegador ou entre em contato com o suporte.",
    },
    {
      question: "Como saber se a venda foi concluída?",
      answer:
        "Toda venda finalizada com sucesso aparece imediatamente no Histórico de Vendas, com o valor e a data. Se não estiver lá, é provável que o pagamento não tenha sido confirmado.",
    },
    {
      question: "Esqueci minha senha de acesso.",
      answer:
        "Na tela de login, clique em 'Esqueci minha senha' e siga as instruções para redefinir. Você receberá um link por e-mail para criar uma nova senha.",
    },
    {
      question: "Posso alterar meus dados de vendedor?",
      answer:
        "Por enquanto, mudanças como nome da loja ou informações de contato devem ser feitas com a ajuda do suporte. Envie uma mensagem explicando o que deseja alterar.",
    },
  ];

  return (
    <>
      <div className="relative w-full p-[6%] pb-[0] pt-[2%]">
        {/* BOTÃO SIDEBAR */}
        <div className="absolute top-7 left-20 z-20">
          <SidebarTrigger />
        </div>

        {/* BANNER */}
        <img
          src="/img/suporte/topicos_suporte.png"
          className="w-full rounded-3xl"
        />
      </div>

      {/* CARDS DOS TÓPICOS EXPLICTIVOS */}
      <div className="rounded-3xl overflow-hidden sm:w-[100%] px-22 py-5">
        <div className="flex flex-wrap justify-center gap-10 my-5">
          <CardSuporte
            src="/img/suporte/ursinho_suporte.png"
            title="Ponto de Venda"
            text="O PDV é onde você registra suas vendas de forma rápida e segura. Selecione o produto, finalize o pagamento e o pedido será adicionado ao seu histórico automaticamente."
            sidebarOpen={sidebarOpen}
          />
          <CardSuporte
            src="/img/suporte/dinheiro_suporte.png"
            title="Pagamento e Recebimento"
            text="Os pagamentos são processados automaticamente após cada venda. Você pode acompanhar tudo pelo Histórico de Vendas. Em caso de diferença ou atraso, fale com o suporte."
            sidebarOpen={sidebarOpen}
          />
          <CardSuporte
            src="/img/suporte/contato_suporte.png"
            title="Contato com o Suporte"
            text="Precisa de ajuda personalizada? Estamos prontos pra te atender. Clique no botão abaixo e fale com a equipe Tikitos."
            sidebarOpen={sidebarOpen}
          />
          <CardSuporte
            src="/img/suporte/dica_suporte.png"
            title="Dica Tikitos"
            text="Mantenha seus dados atualizados e acompanhe o histórico de vendas regularmente — isso evita atrasos e facilita o suporte quando precisar."
            sidebarOpen={sidebarOpen}
          />
        </div>
      </div>

      {/* FAQ HORIZONTAL */}
      <div className={`flex flex-col lg:flex-row justify-center items-center ps-23 pt-0 pb-10 ${styles.supportRow}`}>
        {/* COLUNA DE PERGUNTAS */}
        <div className="">
          <div className="pb-5">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-[#DA93E3] lucide lucide-message-circle-question-mark-icon lucide-message-circle-question-mark"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              <h1 className="text-3xl lg:text-4xl font-bold text-[#76196c] flex items-center gap-2">
                FAQ - PERGUNTAS E RESPOSTAS
              </h1>
            </div>
            <p className="text-[#64a343] mt-1 font-medium">
              Querido vendedor, na Tikitos a magia não é atrapalhada pela dúvida:
            </p>
          </div>
          <div className="flex flex-col w-full rounded-lg overflow-hidden bg-[#EADAF9] text-[#76216D]">
            {faqs.map((faq, index) => (
              <button
                key={index}
                className={`text-left p-4 cursor-pointer 
              !transform-none !hover:transform-none
              bg-[#EADAF9] hover:bg-[#D9C4F2] border-b-2 border-dashed border-[#DA93E3] last:border-b-0
              ${activeIndex === index ? "font-semibold bg-[#D3B8EC]" : ""}`}
                onClick={() => setActiveIndex(index)}
              >
                {faq.question}
              </button>
            ))}
          </div>
        </div>


        {/* PAINEL DE RESPOSTA COM IMAGENS */}
        <div className="flex-1 flex flex-col items-center p-6 rounded-lg min-h-[300px] lg:w-1/2 relative items-center justify-center align-center">

          {/* CÍRCULO DE FUNDO */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pt-5">
            <div className="w-[400px] h-[400px] bg-[#EADAF9] rounded-full"></div>
          </div>

          {/* IMAGEM SUPERIOR */}
          <img
            src="/img/suporte/presente_cima.png"
            alt="presente topo"
            className="w-[40%] mb-4 relative z-10"
          />

          {/* DIV CENTRAL COM TEXTO */}
          <div className="bg-[#9BF377] rounded-lg p-4 w-4/5 text-center min-h-[140px] flex items-center justify-center relative z-10 text-[#76216D] border-3 border-dashed border-[#75ba51]">
            {activeIndex !== null ? (
              <p>{faqs[activeIndex].answer}</p>
            ) : (
              <p>Selecione uma pergunta à esquerda para ver a resposta.</p>
            )}
          </div>

          {/* IMAGEM INFERIOR */}
          <img
            src="/img/suporte/presente_baixo.png"
            alt="presentes abaixo"
            className="w-[65%] mt-4 relative z-10"
          />
        </div>
      </div>
    </>
  );
}
