"use client"
import CardProdutos from '@/components/cards/cardProdutos.jsx';
import AtalhosDiv from '@/components/atalhos/atalhosDiv';
import InputWithAdornmentDemo from '@/components/input-07';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
            <div className='grid gap-5 grid-cols-2 md:grid-cols-2'>
                <div className='flex m-5 gap-2 items-center'>
                    <SidebarTrigger />
                    <InputWithAdornmentDemo></InputWithAdornmentDemo>
                </div>

            </div>
            <div className='grid gap-5 grid-cols-1 x-sm:grid-cols-1 sm:grid-cols-2 md:grid-cols-2 '>
                <div className='grid gap-5 grid-cols-1 x-sm:grid-cols- sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 overflow-y-scroll max-h-105 p-5 pt-0'>

                    {produtos.length > 0 ? (
                        (produtos.map((produto) => {
                            return (
                                <CardProdutos key={produto.id} produtos={produto}></CardProdutos>
                            )
                        }))) : ('')}

                </div>
            </div>
            <AtalhosDiv></AtalhosDiv>
        </>
    );
}