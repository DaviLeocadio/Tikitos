"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon, X } from "lucide-react";
import { useState } from "react";

export default function InputWithAdornmentDemo({ query, setQuery }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChangeQuery = (e) => {
    setQuery(e.target.value)
  }
  const handleClean = () => {
    setQuery('')
  }

  return (
    <div className="w-full">
      <div
        className="relative flex items-center p-1 bg-[#EBC7F5] border-[3px] border-dashed border-[#b478ab] rounded-[50px] m-0 mt-0 px-2">
        <i className="bi bi-search ps-3 text-[#9d4e92]"></i>
        <Input
          type="text"
          value={query}
          onChange={handleChangeQuery}
          placeholder="Nome, SKU ou descrição"
          className="border-0 focus-visible:ring-0 shadow-none text-[#5c6854]" />
        {query.length > 0 && <Button
          onClick={handleClean}
          className="bg-transparent hover:bg-transparent cursor-pointer hover:scale-110">
          <X className="text-[#9d4e92] " />
        </Button>}
      </div>
    </div>
  );
}
