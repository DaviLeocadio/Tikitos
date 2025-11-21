"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";

import {
  CreditCard,
  QrCode,
  Wallet,
  CircleCheck,
  CircleDollarSign,
  Check,
} from "lucide-react";

const paymentOptions = [
  {
    label: "Débito",
    value: "débito",
    icon: CreditCard,
  },
  {
    label: "Crédito",
    value: "crédito",
    icon: CreditCard,
  },
  {
    label: "Pix",
    value: "pix",
    icon: QrCode,
  },
  {
    label: "Dinheiro",
    value: "dinheiro",
    icon: CircleDollarSign,
  },
];

export default function MetodoDePagamento({ metodoPag, setMetodoPag }) {
  return (
    <RadioGroupPrimitive.Root
      defaultValue="pix"
      value={metodoPag}
      onValueChange={(value) => setMetodoPag(value)}
      className="w-full grid grid-cols-4 gap-5 py-5"
    >
      {paymentOptions.map((option) => (
        <RadioGroupPrimitive.Item
          key={option.value}
          value={option.value}
          className="
      relative rounded-lg px-4 pt-4 pb-5 text-start transition

      ring-2 ring-[#76196c] text-roxo

      data-[state=checked]:ring-2 data-[state=checked]:ring-verdao
      data-[state=checked]:text-verdao

      cursor-pointer
    "
        >
          <div className="flex justify-between">
            <option.icon className="mb-3" size={25} />
            {metodoPag === option.value && (
              <i className="bi bi-check-circle-fill transition-color text-lg" />
            )}
          </div>

          <span className=" tracking-tight text-lg font-semibold">{option.label}</span>

          {/* check verde */}
          <CircleCheck
            className="
        absolute top-2 right-2 h-5 w-5 
        hidden data-[state=checked]:block 
        fill-[#75ba51] text-white
      "
          />
        </RadioGroupPrimitive.Item>
      ))}
    </RadioGroupPrimitive.Root>
  );
}
