"use client"
import CardProdutos from '@/components/cards/cardProdutos.jsx';
import { useEffect, useState } from 'react';

export default function PDV() {
    const [produtos, setProdutos] = useState([]);

    useEffect(() => {

        const buscarProdutos = async () => {
            const response = await fetch('http://localhost:8080/vendedor/produtos', {
                method: "GET",
                credentials: "include",
                headers: { "Content-type": "application/json" }
            })

            const data = await response.json();
            setProdutos(data.produtos)
            console.log(data.produtos)
        }

        buscarProdutos();
    }, [])
    return (
        <>
            <div className='grid gap-5 grid-cols-2 md:grid-cols-2 '>
                <div className='grid gap-5 grid-cols-2 md:grid-cols-2 overflow-y-scroll max-h-110 p-5'>
                    {produtos.map((produto) => {
                        return (
                            <CardProdutos key={produto.id} produtos={produto}></CardProdutos>
                        )
                    })}

                </div>
            </div>
        </>
    );
}