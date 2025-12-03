"use client";
import { useState, useEffect } from "react";
import MetodoDePagamento from "@/components/pagamento/MetodoDePagmento";
import CartaoContainer from "./CartaoContainer";
import PixContainer from "./PixContainer";
import DinheiroContainer from "./DinheiroContainer";
import FinalizarPagamentoButton from "./FinalizarPagamentoButton";
import InputCPFMask from "../inputMasks/InputCPFMask";

export default function PagamentoContainer() {
  const [metodoPag, setMetodoPag] = useState("débito");
  const [embalagem, setEmbalagem] = useState(false);
  const [cpf, setCpf] = useState("");
  const [fidelidade, setFidelidade] = useState(0);

  // Gera fidelidade aleatória ao montar o componente
  useEffect(() => {
    const pontosAleatorios = Math.floor(Math.random() * 11); // 0 a 10
    setFidelidade(pontosAleatorios);
  }, []);

  function renderFidelidade() {
    const itens = [];

    for (let i = 1; i <= 10; i++) {
      if (i <= fidelidade) {
        itens.push(
          <i
            key={i}
            className="bi bi-gift-fill text-[#b478ab] text-2xl sm:text-3xl transition-all"
          />
        );
      } else {
        itens.push(
          <i
            key={i}
            className="bi bi-gift text-[#b478ab] text-xl sm:text-2xl transition-all opacity-40"
          />
        );
      }
    }

    return itens;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-roxo flex flex-col leading-tight">
          <span>página de</span>
          <span>pagamento</span>
        </h1>

        <FinalizarPagamentoButton 
          pagamento={metodoPag} 
          cpf={cpf}
          embalagem={embalagem}
        />
      </div>

      {/* Método de pagamento e embalagem */}
      <div className="flex flex-col gap-3 overflow-x-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-verdefolha">
            Método de pagamento:
          </h3>

          <button
            onClick={() => setEmbalagem(!embalagem)}
            className="flex items-center gap-2 transition cursor-pointer hover:scale-105 active:scale-95 px-5"
          >
            <span className="text-base sm:text-lg font-bold text-verdefolha">
              Embalagem
            </span>
            <span className="text-sm sm:text-md font-semibold text-[#569a33]">
              (R$1,50)
            </span>
            <i
              className={`bi ${
                embalagem ? "bi-gift-fill" : "bi-gift"
              } text-[#b478ab] text-xl sm:text-2xl transition-all`}
            />
          </button>
        </div>

        <MetodoDePagamento metodoPag={metodoPag} setMetodoPag={setMetodoPag} />
      </div>

      {/* Container de pagamento e fidelidade */}
      <div className="flex flex-col lg:flex-row gap-5">
        {/* Área do método de pagamento selecionado */}
        <div className="flex-1 min-h-[200px]">
          {metodoPag === "débito" && <CartaoContainer />}
          {metodoPag === "crédito" && <CartaoContainer />}
          {metodoPag === "pix" && <PixContainer />}
          {metodoPag === "dinheiro" && <DinheiroContainer />}
        </div>

        {/* Sidebar - Fidelidade e CPF */}
        <div className="lg:w-1/3 flex flex-col gap-6">
          {/* Programa Fidelidade */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-verdefolha mb-3">
              Programa Fidelidade
            </h3>
            <div className="grid grid-cols-5 gap-2 justify-items-center items-center">
              {renderFidelidade()}
            </div>
            <p className="text-center mt-3 text-verdefolha font-semibold">
              {fidelidade}/10 presentes
            </p>
          </div>

          {/* CPF para Nota Fiscal */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-verdefolha mb-2">
              Nota Fiscal (CPF)
            </h3>
            <InputCPFMask
              id="cpf"
              type="text"
              className="bg-rosinha text-base rounded-lg w-full p-3 text-white placeholder:text-white/60"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="000.000.000-00"
            />
            {cpf && cpf.replace(/\D/g, '').length === 11 && (
              <p className="text-verdao text-sm mt-2 flex items-center gap-1">
                <i className="bi bi-check-circle-fill" />
                CPF válido
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { useState, useEffect } from "react";
// import MetodoDePagamento from "@/components/pagamento/MetodoDePagmento";
// import CartaoContainer from "./CartaoContainer";
// import PixContainer from "./PixContainer";
// import DinheiroContainer from "./DinheiroContainer";
// import FinalizarPagamentoButton from "./FinalizarPagamentoButton";
// import InputCPFMask from "../inputMasks/InputCPFMask";

// export default function PagamentoContainer() {
//   const [metodoPag, setMetodoPag] = useState("débito");
//   const [embalagem, setEmbalagem] = useState(false);
//   const [cpf, setCpf] = useState("");
//   const [fidelidade, setFidelidade] = useState(0);

//   useEffect(() => {
//     setFidelidade(Math.floor(Math.random() * 11));
//   }, []);

//   function renderFidelidade() {
//     return Array.from({ length: 10 }, (_, i) => {
//       const index = i + 1;
//       return (
//         <i
//           key={i}
//           className={`bi ${index <= fidelidade ? "bi-gift-fill" : "bi-gift"} 
//           text-[#b478ab] transition-all 
//           ${index <= fidelidade ? "text-xl sm:text-2xl" : "text-lg sm:text-xl opacity-40"}`}
//         />
//       );
//     });
//   }

//   return (
//     <div className="flex flex-col gap-4 p-3 w-full h-[74vh] overflow-y-auto bg-white/40 rounded-xl shadow-md">

//       {/* HEADER */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-xl sm:text-2xl font-bold text-roxo leading-tight">
//           pagamento
//         </h1>

//         <FinalizarPagamentoButton 
//           pagamento={metodoPag} 
//           cpf={cpf} 
//           embalagem={embalagem}
//         />
//       </div>

//       {/* MÉTODO + EMBALAGEM */}
//       <div className="flex flex-col gap-2">
//         <div className="flex justify-between items-center">
//           <h3 className="text-base sm:text-lg font-bold text-verdefolha">Pagamento:</h3>

//           <button onClick={() => setEmbalagem(!embalagem)}
//             className="flex items-center gap-2 hover:scale-105 px-2">
//             <span className="text-sm sm:text-base text-verdefolha font-bold">Embalagem</span>
//             <span className="text-xs text-[#569a33] font-semibold">(R$1,50)</span>
//             <i className={`bi ${embalagem ? "bi-gift-fill" : "bi-gift"} text-[#b478ab] text-lg`} />
//           </button>
//         </div>

//         <MetodoDePagamento metodoPag={metodoPag} setMetodoPag={setMetodoPag} />
//       </div>

//       {/* ÁREA PRINCIPAL */}
//       <div className="flex gap-4 mt-2 h-full">

//         {/* FORMAS DE PAGAMENTO */}
//         <div className="flex-1 p-2 border rounded-lg">
//           {["débito", "crédito"].includes(metodoPag) && <CartaoContainer />}
//           {metodoPag === "pix" && <PixContainer />}
//           {metodoPag === "dinheiro" && <DinheiroContainer />}
//         </div>

//         {/* FIDELIDADE + CPF */}
//         <div className="w-[28%] flex flex-col gap-4">

//           {/* Fidelidade */}
//           <div className="text-center">
//             <h3 className="text-base sm:text-lg font-bold text-verdefolha">Fidelidade</h3>
//             <div className="grid grid-cols-5 gap-1 my-2">{renderFidelidade()}</div>
//             <p className="text-[14px] text-verdefolha font-semibold">{fidelidade}/10</p>
//           </div>

//           {/* CPF */}
//           <div>
//             <h3 className="text-base sm:text-lg font-bold text-verdefolha mb-1">CPF</h3>
//             <InputCPFMask
//               id="cpf"
//               type="text"
//               className="bg-rosinha text-sm rounded-lg w-full p-2 text-white"
//               value={cpf}
//               onChange={(e) => setCpf(e.target.value)}
//               placeholder="000.000.000-00"
//             />
//             {cpf.replace(/\D/g, "").length === 11 && (
//               <p className="text-verdao text-xs mt-1 flex items-center gap-1">
//                 <i className="bi bi-check-circle-fill" /> CPF válido
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }