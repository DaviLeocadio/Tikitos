import { useEffect, useState } from "react";
import styles from "./carrinho.module.css";
import {atualizarQuantidade, removerDoCarrinho} from "@/utils/carrinho"

export default function CarrinhoCard({ produto }) {
    const quantidade = produto.quantidade;
    const [value, setValue] = useState(quantidade);
    const max = 10;
    console.log(produto)

    const increment = () => setValue(prev => (prev < max ? prev + 1 : prev));
    const decrement = () => setValue(prev => Math.max(1, prev - 1));

    useEffect(() => {
        if (value > 10) setValue(10);
        atualizarQuantidade(produto.id_produto, value)         
    }, [value]);

    const handleDelete = () => {
        removerDoCarrinho(produto.id_produto)
    }
    return (
        <div className="group flex w-full min-w-53 shadow-none gap-0 bg-[#D8F1DC] border-[3px] border-dashed border-[#75ba51] rounded-[40px] p-5 hover:bg-[#C8FDB4] transition justify-between items-center cursor-pointer">

            <div className="flex flex-col align-center gap-2">
                <div>
                    <h3 className="text-[#8C3E82] text-[14px] tracking-tighter">{produto.nome}</h3>
                    <p className="text-[#c97fda] text-[13px]">{produto.preco}</p>
                </div>

                <div className="flex flex-row justify-center items-center gap-2 text-center">
                    <div className="flex flex-col items-center justify-center text-center space-y-1">
                        <div className="flex items-center bg-[#9D4E92] border border-[#9D4E92] rounded-md">
                            <button
                                type="button"
                                onClick={decrement}
                                className="px-2 py-1 text-[#DDF1D4] bg-[#9D4E92] border-r border-[#9D4E92] rounded-l-md hover:bg-[#B478AB]"
                            >
                                <svg
                                    className="w-3 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path d="M5 12h14" />
                                </svg>
                            </button>

                            <input
                                type="number"
                                value={value}
                                onChange={(e) => setValue(Number(e.target.value))}
                                className="w-8 semBordar text-center text-sm text-[#DDF1D4] border-0 focus:ring-0 bg-[#9D4E92] appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none focus-visible:border-[#9D4E92]
                                                        outline-none
                                                        focus-visible:shadow-green
                                                        "
                            />

                            <button
                                type="button"
                                onClick={increment}
                                className="px-2 py-1 text-[#DDF1D4] bg-[#9D4E92] border-l border-[#9D4E92] rounded-r-md hover:bg-[#B478AB]"
                            >
                                <svg
                                    className="w-3 h-5"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path d="M5 12h14" />
                                    <path d="M12 5v14" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <i className="bi bi-trash text-[18px] hover:scale-85 transition cursor-pointer pt-0.5"
                    onClick={handleDelete}></i>
                </div>
            </div>

            <div className="flex justify-center items-center w-20 h-20">
                <img
                    className="m-0 max-h-20 object-contain transform transition-transform duration-300 ease-out group-hover:scale-110"
                    src={produto.imagem}
                    alt="Produto"
                />
            </div>
        </div>
    )
}