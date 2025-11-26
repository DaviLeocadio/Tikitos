'use client'
import React, { useState, useEffect } from 'react';

const PaymentMethod = ({ icon, label, isSelected, onClick }) => (
  <button
    className={`
      flex flex-col items-center justify-center p-3 sm:p-4 rounded-lg transition-colors duration-200
      ${isSelected ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-700 shadow-md border-2 border-gray-200 hover:bg-green-100'}
    `}
    onClick={onClick}
  >
    <div className={`
      w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-2xl sm:text-3xl
      ${isSelected ? 'bg-white text-green-600' : 'bg-green-600 text-white'}
    `}>
      {icon}
    </div>
    <span className="mt-2 text-xs font-semibold">{label}</span>
  </button>
);

export default function CheckoutScreen(){
  const [selectedMethod, setSelectedMethod] = useState('pix');
  const [buttonVisible, setButtonVisible] = useState(true);

  // Simula o timer para o botão sumir após 15 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setButtonVisible(false);
    }, 15000); // 15 segundos

    return () => clearTimeout(timer);
  }, []);

  // Ícones simples para simular
  const methodIcons = {
    debito: '💳',
    credito: '💰',
    pix: '⚡',
    dinheiro: '💵',
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 flex items-center justify-center bg-gray-50">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl">

        {/* --- Seção de Pagamento (Verde Claro) --- */}
        <div className="lg:w-3/5 p-6 sm:p-10 bg-green-200 bg-opacity-70">
          <header className="flex justify-between items-center mb-6">
            <div className="flex items-center text-green-800">
              <span className="text-2xl font-bold">{'<'}</span>
              <h1 className="ml-2 text-xl font-semibold">Página de pagamento</h1>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full transition-colors">
              Finalizar pagamento {'\u27A4'}
            </button>
          </header>

          <h2 className="text-lg font-bold mb-3 mt-6 text-green-800">Método de pagamento:</h2>
          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {Object.keys(methodIcons).map((key) => (
              <PaymentMethod
                key={key}
                icon={methodIcons[key]}
                label={key.charAt(0).toUpperCase() + key.slice(1)}
                isSelected={selectedMethod === key}
                onClick={() => setSelectedMethod(key)}
              />
            ))}
          </div>

          <div className="flex items-start justify-between mt-8">
            {/* QR Code */}
            <div className="p-2 bg-white rounded-lg shadow-xl w-36 h-36 sm:w-48 sm:h-48 flex items-center justify-center border-4 border-green-600">
              {/* Simulação de QR Code. Na vida real seria uma imagem ou SVG. */}
              <div className="text-center text-xs font-mono">
                              </div>
            </div>

            <div className="flex flex-col space-y-4 ml-4">
              {/* Informações Extras */}
              <div className="text-sm font-semibold text-green-800">
                Embalagem (<span className="text-red-600">R$1,50</span>):
              </div>
              
              <div className="flex items-center">
                <span className="text-xl mr-2 text-green-700">🕒</span>
                <div className="text-sm font-medium text-gray-700">
                    Expira em: <br/> **10min 32seg**
                </div>
              </div>

              <div className="text-sm font-semibold text-green-800">
                Programa Fidelidade:
              </div>
              <div className="flex space-x-1 text-2xl text-yellow-500">
                <span>🎁</span><span>🎁</span><span>🎁</span><span>🎁</span>
              </div>
            </div>
          </div>

          {/* Nota Fiscal / CPF */}
          <div className="mt-8 flex flex-col items-end">
            <h3 className="text-sm font-semibold mb-2 text-green-800">Nota Fiscal (CPF):</h3>
            <button className="bg-purple-300 hover:bg-purple-400 text-white font-bold py-2 px-6 rounded-lg transition-colors text-sm">
              Insira aqui
            </button>
          </div>

          <footer className="mt-12 pt-4 border-t border-green-300 text-xs text-green-800 flex flex-wrap justify-between gap-2">
            <strong>Atalhos:</strong>
            <span className="hover:underline cursor-pointer">{'⟳'} Resetar o carrinho: **INSERT**</span>
            <span className="hover:underline cursor-pointer">{'⟳'} Voltar o item excluído: **F1**</span>
            <span className="hover:underline cursor-pointer">{'⟳'} Página de suporte: **F5**</span>
            <span className="hover:underline cursor-pointer">{'⟳'} Voltar ao login: **ESC**</span>
          </footer>
        </div>

        {/* --- Seção Carrinho (Roxo) --- */}
        <div className="lg:w-2/5 p-6 sm:p-8 bg-purple-300 relative">
          <header className="flex justify-between items-center mb-6">
            <div className="flex items-center text-purple-800">
              <span className="text-3xl mr-2">🛒</span>
              <h2 className="text-xl font-bold">Carrinho</h2>
            </div>
            <button className="text-purple-800 text-xl hover:text-purple-900">{'⟳'}</button>
          </header>

          <p className="text-sm text-purple-700 italic mb-10">Adicione produtos no baú da felicidade!</p>

          <div className="space-y-4 mb-8">
            {/* Botões de Resumo */}
            <div className="grid grid-cols-3 gap-2 text-center text-sm font-semibold">
                <div className="bg-purple-500 text-white py-3 rounded-lg shadow">Total Itens<br/>**0**</div>
                <div className="bg-purple-500 text-white py-3 rounded-lg shadow">Subtotal<br/>**R$ 0,00**</div>
                <div className="bg-purple-500 text-white py-3 rounded-lg shadow">Desconto<br/>**Em %**</div>
            </div>
            
            {/* Total */}
            <div className="bg-green-500 text-white p-3 rounded-lg text-center font-extrabold text-2xl shadow-xl">
              Total: **R$ 0,00**
            </div>
          </div>

          {/* Botão que "Vai Sumir" */}
          {buttonVisible && (
            <div className="flex justify-center mt-6">
              <button className="bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 px-8 rounded-lg text-lg shadow-2xl transition-opacity duration-500">
                ESSE BOTÃO VAI SUMIR
              </button>
            </div>
          )}

          <footer className="mt-12 pt-4 border-t border-purple-400 text-xs text-purple-700 text-center">
            <span className="hover:underline cursor-pointer">Voltar ao login: **ESC**</span>
          </footer>
          
          {/* Elementos Estéticos (Simulação da Imagem) */}
          <div className="absolute -right-20 bottom-0 z-10 hidden lg:block">
            {/* Simulação da imagem de crianças no canto */}
                      </div>
          <div className="absolute top-4 right-4 text-purple-800 font-bold text-3xl">
            tiki<span className="text-green-600">tos</span>
          </div>
        </div>
      </div>
    </div>
  );
};

