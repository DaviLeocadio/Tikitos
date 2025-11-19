import Link from 'next/link';

export default function AtalhosDiv() {
    return (
        <>
            <div className="bg-[#9BF377] border-[3px] border-dashed border-[#b478ab] rounded-[50px] m-5 p-2 px-5 text-[#8c3e82] text-sm font-semibold flex justify-between">
                <div className="gap-2 flex font-bold">
                    <h3>Atalhos: </h3>
                </div>

                <div className="gap-2 flex">
                    <i className="bi bi-arrow-repeat font-bold"></i>
                    <h3>Resetar o carrinho: <span className='bold'>INSERT</span> </h3>
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
                    <h3>Voltar ao login: <span className='bold'>ESC</span> </h3>
                </div>
            </div>
        </>
    );
}