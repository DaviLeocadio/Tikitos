import { useState, useEffect } from "react";

export default function PixContainer() {

  const [timeLeft, setTimeLeft] = useState(15 * 60); // 10 minutos em segundos

  // Temporizador
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval); 
  }, []);

  // Converter segundos → mm:ss
  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}min ${sec.toString().padStart(2, "0")}seg`;
  };
  
  return (
    <>
      <main className="flex gap-3 px-5 py-3 pt-2 pe-0">
        {/* Imagem QrCode */}
        <div className="flex align-start justify-start ">
          <img className="max-w-[260px]" src="/img/pagamento/qrcode_pagamento.png" alt="" />
        </div>

        {/* Temporizador */}
        <div className="pt-2">
          <h3 className="max-w-10 text-verdefolha font-bold">Expira Em:</h3>
          <i className="bi bi-clock text-rosinha font-bold text-[30px] mt-1"></i>
          <h4 className="max-w-10 text-roxo font-bold mt-1">{formatTime()}</h4>
        </div>
      </main>
    </>
  )
}