import Link from 'next/link';
export default function NotFound() {
    return (
        <>  
        <div className="h-screen w-full bg-[url('/img/error/fundo_error.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center p-4">

                {/* Wrapper para limitar a largura em telas muito grandes e conter o grid */}
                <div className="max-w-6xl w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 items-center justify-items-center">

                        {/* Coluna do Urso - MODIFICADO AQUI */}
                        <div className='hidden lg:flex items-center justify-center p-1'>
                            <img 
                                src="/img/error/urso_404.png" 
                                alt="Urso de pelúcia" 
                                className='object-contain w-3/4 lg:w-full max-w-sm' 
                            />
                        </div>

                        {/* Coluna do 404, Texto e Botão */}
                        <main className='flex flex-col items-center justify-center text-center p-1'>
                            
                            {/* Imagem do 404 */}
                            <div className="mb-6">
                                <img 
                                    src="/img/error/404.png" 
                                    alt="Erro 404" 
                                    className='max-w-xs sm:max-w-sm' 
                                />
                            </div>
                            
                            {/* Texto */}
                            <div className="mb-8 max-w-md">
                                 <p className='text-lg sm:text-xl   font-semibold text-gray-700 color-[var(--color-verdao)]'>
                                    Que pena! Parece que o seu acesso a esta área está "em manutenção" 
                                    pelos nossos pequenos construtores de sonhos! 
                                 </p>
                            </div>
                           
                            {/* Botão para voltar à página inicial */}
                            <Link href="/">
                                <button className="bg-[#65745A] rounded-[50px] mt-2 py-2 px-5 text-[#caf4b7] text-sm font-semibold w-full h-13 flex gap-3 justify-center items-center transform transition-all duration-300 ease-out group-hover:scale-110 hover:bg-[#74816b] hover:scale-97">
                                    <h3>Voltar para a outra página</h3>
                                    <i className="bi bi-arrow-right-circle-fill text-[25px]"></i>
                                </button>
                            </Link>
                        </main>

                    </div>
                </div>
            </div>
        </>
    );
}