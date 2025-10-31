'use client'
import CardProdutos from '@/components/cards/cardProdutos.jsx';
import { useEffect, useState } from 'react';

export default function PDV() {
    const [produtos, setProdutos] = useState();

    useEffect(() => {
        const buscarProdutos = async () => {
            const response = await fetch("http://localhost:8080/vendedor/produtos", {
                method: "GET",
                credentials: "include",
                headers: { "Content-type": "application/json" }
            });

            console.log(response)
        }

        buscarProdutos();
    }, [])

    // useEffect(() => {
    //     fetch('http://localhost:8080/vendedor/produtos', {
    //         method: "GET",
    //         credentials: "include",
    //         headers: { "Content-type": "application/json" }
    //     })

    //         .then(response => {
    //             console.log(response);
    //             if (!response.ok) {
    //                 throw new Error(`Erro HTTP! Status: ${response.staus}`);
    //             }
    //             setProdutos(response.json);
    //         })
    //         .then(data => console.log(data))
    //         .catch(error => ('Erro ao buscar produtos: ', error))
    // }, [])
    return (
        <>
            <div className='grid gap-5 grid-cols-2 md:grid-cols-2 '>
                <div className='grid gap-5 grid-cols-2 md:grid-cols-2 overflow-y-scroll max-h-110 p-10'>
                    {/* {Array(produtos).map((index) => {
                        return (
                            <div key={index}>
                                <CardProdutos></CardProdutos>
                            </div>
                        )
                    })} */}

                </div>
            </div>
        </>
    );
}