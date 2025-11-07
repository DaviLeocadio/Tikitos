import Image from "next/image";
// import styles from './footer.module.css';
import Link from 'next/link';

import PricingCard from "../card-05-01";

export default function Carrinho() {
    return (
        <>
            <div className='grid grid-cols-7 items-center justify-center mt-5'>
                <div className='flex items-center col-span-5 bg-[#E5B8F1] border-[3px] border-dashed border-[#B478AB] rounded-[50px] text-[#8c3e82] text-sm font-semibold max-h-108 p-5'>
                    <div className="flex justify-between w-full">
                        <div className="flex flex-row gap-2 text-center justify-center items-center">
                            <i className="bi bi-cart4 text-[20px]"></i>
                            <p>Carrinho</p>
                        </div>
                        <div className="flex flex-row gap-2 text-center justify-center items-center">
                            <i className="bi bi-arrow-repeat text-[25px]"></i>
                        </div>
                    </div>
                    {/* <div className="">
                        <PricingCard></PricingCard>
                    </div> */}
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
            </div>
        </>
    );
}