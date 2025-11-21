export default function PixContainer() {
    return (
        <>
        <main className="flex gap-3">
          {/* Imagem QrCode */}
          <div className="flex align-start justify-start">
            <img src="/img/pagamento/qrcode_pagamento.png" alt="" />
          </div>

          {/* Temporizador */}
          <div className="">
            <h3 className="max-w-10 text-verdefolha font-bold">Expira Em:</h3>
            <i className="bi bi-clock text-rosinha font-bold text-[30px] mt-1"></i>
            <h4 className="max-w-10 text-roxo font-bold mt-1">10min 32seg</h4>
          </div>
        </main>
        </>
    )
}