import CardDemo from '@/components/card-01';
import styles from "./carrinho.module.css";
import { useEffect, useState } from "react";
import { obterCarrinho } from "@/utils/carrinho.js"
import CarrinhoCard from "@/components/carrinho/CarrinhoCard.jsx"

export default function Carrinho() {
    const [carrinho, setCarrinho] = useState([]);

    useEffect(() => {
        const checkCarrinho = () => {
            const carrinho = obterCarrinho();
            setCarrinho(carrinho);
        };

        checkCarrinho();

        const handleStorage = (e) => {
            // Atualiza ao mudar entre abas
            if (e.key === "carrinhoAtualizado") checkCarrinho();
        };

        const handleCustom = () => checkCarrinho(); // Atualiza na mesma aba

        window.addEventListener("storage", handleStorage);
        window.addEventListener("carrinhoAtualizado", handleCustom);

        return () => {
            window.removeEventListener("storage", handleStorage);
            window.removeEventListener("carrinhoAtualizado", handleCustom);
        };
    }, []);


    return (
        <>
            <div className='grid grid-cols-7 mt-5'>
                <div className='flex col-span-5 bg-[#E5B8F1] border-[3px] border-dashed border-[#B478AB] rounded-[50px] text-[#8c3e82] text-sm font-semibold p-5 min-h-124 max-h-124'>
                    <div className="flex w-full flex-col justify-between">
                        <div className="flex w-full flex-col gap-1">
                            <div className="flex justify-between w-full px-3">
                                <div className="flex flex-row gap-2 text-center justify-center items-center">
                                    <i className="bi bi-cart4 text-[20px]"></i>
                                    <p>Carrinho</p>
                                </div>
                                <div className="flex flex-row gap-2 text-center justify-center items-center">
                                    <i className={`bi bi-arrow-repeat text-[25px] ${styles.rotate_on_hover}`}></i>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 overflow-y-scroll max-h-53 pe-6 pt-0 ms-1">
                                {(carrinho && carrinho.length > 0) ? carrinho.map((produto) => {
                                    return (
                                        <CarrinhoCard key={produto.id_produto} produto={produto} />
                                    )
                                }) : (<p> Adicione produtos no baú da felicidade!</p>)
                                }

                        </div>
                    </div>

                    <div className="px-1">
                        <CardDemo></CardDemo>
                        <div className="bg-[#c5ffad] border-[3px] border-dashed border-[#75ba51] rounded-[50px] mt-4 py-2 px-5 text-[#8c3e82] text-sm font-semibold">
                            <h3>Total: Llalala</h3>
                        </div>
                        <button className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold w-full h-13 flex gap-3 justify-center items-center transform transition-all duration-300 ease-out group-hover:scale-110 hover:bg-[#74816b] hover:scale-97">
                            <h3>Avançar para o pagamento</h3>
                            <i className="bi bi-arrow-right-circle-fill text-[25px]"></i>
                        </button>
                    </div>
                </div>
            </div>


            <div className='flex items-center col-span-2'>
                <div className="">

                    <img
                        className="m-0 pr-3"
                        src="/img/pdv/carrinho_criancas.png"
                        alt="Logo"
                    />

                </div>
            </div>
        </div >
        </>
    );
}