'use client'
import { useEffect,useState } from "react";
import { limparCarrinho, voltarCarrinho } from "@/utils/carrinho";
import { deleteCookie } from "cookies-next/client";

export default function AtalhosDiv() {
    const [listaProdutos, setListaProdutos] = useState([]);

    // Atalhos
    const handleKeyDown = async (event) => {
        if (event.keyCode === 45) return limparCarrinho();

        if (event.keyCode === 113) return voltarCarrinho(listaProdutos);

        if (event.keyCode === 27) {
            const response = await fetch("http://localhost:8080/auth/logout", {
                method: "POST",
                credentials: "include",
            });

            if (response.ok) {
                deleteCookie("nome");
                deleteCookie("email");
                deleteCookie("perfil");
                deleteCookie("empresa");

                return (window.location.href = "/");
            }
        }

        if (event.keyCode === 115)
            return (window.location.href = "/vendedor/suporte");
    }

    useEffect(() => {

        const buscarProdutos = async () => {
            const response = await fetch("http://localhost:8080/vendedor/produtos", {
                method: "GET",
                credentials: "include",
                headers: { "Content-type": "application/json" },
            });

            if (response.status == 403) return (window.location.href = "/forbidden");
            if (response.status == 404) return;

            if (response.ok) {
                const data = await response.json();
                return setListaProdutos(data.produtosFormatados);
            }
        };
        buscarProdutos();

    }, []);


    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [listaProdutos]);
    return (
        <>
            <div className="hidden lg:flex bg-[#9BF377] border-[3px] border-dashed border-[#b478ab] rounded-[50px] m-5 p-2 px-5 text-[#8c3e82] text-sm font-semibold justify-between">

                <div className="gap-2 flex font-bold">
                    <h3>Atalhos:</h3>
                </div>

                <div className="gap-2 flex">
                    <i className="bi bi-arrow-repeat font-bold"></i>
                    <h3>Resetar o carrinho: <span className='bold'>INSERT</span></h3>
                </div>

                <div className="gap-2 flex">
                    <i className="bi bi-arrow-counterclockwise font-bold"></i>
                    <h3>Voltar o item excluído: <span className='bold'>F2</span> </h3>
                </div>

                <div className="gap-2 flex">
                    <i className="bi bi-question-circle font-bold"></i>
                    <h3>Página de suporte: <span className='bold'>F4</span> </h3>
                </div>

                <div className="gap-2 flex">
                    <i className="bi bi-shield-lock font-bold"></i>
                    <h3>Voltar ao login: <span className='bold'>ESC</span></h3>
                </div>
            </div>
        </>
    );
}