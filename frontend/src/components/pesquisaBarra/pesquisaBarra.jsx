import Link from 'next/link';

export default function PesquisaBarra() {
    return (
        <>
            <div className="bg-[#EBC7F5] border-[3px] border-dashed border-[#b478ab] rounded-[50px] m-5 mt-0 p-2 px-5">
                <p className='text-[#C28BC2] text-sm font-semibold'> <i class="bi bi-search"></i> Nome, SKU ou descrição </p>
            </div>
        </>
    );
}