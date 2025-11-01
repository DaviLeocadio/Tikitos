// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { useEffect, useState } from "react";
// import { getCookie } from "cookies-next/client";
// import { usePathname } from "next/navigation";

// export default function SessaoExpiradaModal() {
//   const [open, setOpen] = useState(false);
//   const pathname = usePathname();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       const expiresAt = getCookie("expiresAt");
//       if (!expiresAt) return;
//       if (pathname === "/") return;

//       if (Date.now() >= Number(expiresAt)) {
//         setOpen(true);
//       }
//     }, 4000);

//     return () => clearInterval(interval);
//   }, []);

//   function fazerLogin() {
//     window.location.href = "/";
//   }

//   return (
//     <Dialog open={open}>
//       <DialogContent className="rounded-2xl border-4 border-dashed border-[#d695e7] bg-[#e8c5f1] text-[#4f6940] shadow-lg p-6 max-w-sm">
//         <DialogHeader>
//           <DialogTitle className="text-center text-2xl font-bold text-[#76196c]">
//             Sessão expirada
//           </DialogTitle>
//         </DialogHeader>

//         <div className="text-center text-[#4f6940] text-lg mt-2">
//           Sua sessão chegou ao fim. Faça login novamente para continuar
//           espalhando encanto!
//         </div>

//         <DialogFooter className="w-full flex md:justify-center items-center mt-4">
//           <Button
//             onClick={fazerLogin}
//             className="bg-[#924187] hover:bg-[#76196c] outline-none  border-3 border-[#d695e7] hover:border-[#924187] border-dashed text-white rounded-xl px-6 py-3
//             text-md  transition-all cursor-pointer"
//           >
//             Fazer login novamente
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
