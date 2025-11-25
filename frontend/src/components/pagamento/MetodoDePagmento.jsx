"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

const paymentOptions = [
  {
    label: "Débito",
    value: "débito",
    icon: "bi-credit-card",
  },
  {
    label: "Crédito",
    value: "crédito",
    icon: "bi-credit-card-2-front",
  },
  {
    label: "Pix",
    value: "pix",
    icon: "bi-qr-code",
  },
  {
    label: "Dinheiro",
    value: "dinheiro",
    icon: "bi-cash-coin",
  },
];

export default function MetodoDePagamento({ metodoPag, setMetodoPag }) {
  return (
    <RadioGroupPrimitive.Root
      value={metodoPag}
      onValueChange={(value) => setMetodoPag(value)}
      className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 py-3 sm:py-5 px-1"
    >
      {paymentOptions.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className="
            relative rounded-lg px-3 sm:px-4 pt-3 sm:pt-4 pb-4 sm:pb-5 
            text-start transition-all duration-200
            ring-2 ring-[#76196c] text-roxo
            data-[state=checked]:ring-2 data-[state=checked]:ring-verdao
            data-[state=checked]:text-verdao
            data-[state=checked]:bg-[#9bf377]/10
            hover:scale-[1.02] active:scale-[0.98]
            cursor-pointer
            min-h-[100px] sm:min-h-[120px]
            flex flex-col justify-between
          "
        >
          {/* Ícone e check */}
          <div className="flex justify-between items-start">
            <i 
              className={`${option.icon} text-2xl sm:text-3xl transition-all`}
            />
            {metodoPag === option.value && (
              <i className="bi bi-check-circle-fill text-base sm:text-lg transition-all animate-in fade-in zoom-in duration-200" />
            )}
          </div>

          {/* Label */}
          <span className="tracking-tight text-base sm:text-lg font-semibold leading-tight mt-2">
            {option.label}
          </span>

          {/* Indicador visual quando selecionado */}
          {metodoPag === option.value && (
            <div className="absolute inset-0 rounded-lg border-2 border-verdao pointer-events-none animate-in fade-in duration-200" />
          )}
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}