"use client";

import React from "react";
import { ToastContainer } from "react-toastify";
import SessaoExpiradaModal from "@/components/layout/SessaoExpiradaModal";

export default function ClientOnlyUI() {
  // Component rendered only on the client to avoid SSR/CSR mismatches
  console.debug("[ClientOnlyUI] mounted");
  return (
    <>
      <ToastContainer />
      <SessaoExpiradaModal />
    </>
  );
}
