"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import { useState } from "react";

export default function InputWithAdornmentDemo() {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full">
      <div
        className="relative flex items-center p-1 bg-[#EBC7F5] border-[3px] border-dashed border-[#b478ab] rounded-[50px] m-0 mt-0 px-2">
        <i className="bi bi-search ps-3 text-[#9d4e92]"></i>
        <Input
          type="email"
          placeholder="Nome, SKU ou descrição"
          className="border-0 focus-visible:ring-0 shadow-none" />
      </div>
    </div>
  );
}
