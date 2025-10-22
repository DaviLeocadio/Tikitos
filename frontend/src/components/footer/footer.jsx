import Image from "next/image";
import styles from './footer.module.css';
import Link from 'next/link';

export default function Footer() {
    return (
        <>
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-1 rounded-t-[150px] ${styles.rodape_fundo}`}>
                <div className={`p-40`}>
                    <img
                        className="m-0 w-full h-auto"
                        src="/img/logos/logo_comprimida.png"
                        alt="Logo"
                    />
                </div>

                <div className={`grid grid-cols-2 gap-4 px-10 py-20`}>

                    <div className="flex flex-col gap-6 align-center justify-center">
                        <div>
                            <p className="font-bold text-[#8C3E82] mb-2">Vendas</p>
                            <ul className="text-[#4f6940] space-y-1">
                                <li className="hover:scale-95 transition">
                                    <Link href="">Produtos</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="">Carrinho</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-bold text-[#8C3E82] mb-2">Controle</p>
                            <ul className="text-[#4f6940] space-y-1">
                                <li className="hover:scale-95 transition">
                                    <Link href="">Filtros</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="">Fluxo de caixa</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 align-center justify-center">
                        <div>
                            <p className="font-bold text-[#8C3E82] mb-2">Meu perfil</p>
                            <ul className="text-[#4f6940] space-y-1">
                                <li className="hover:scale-95 transition">
                                    <Link href="">Vendas</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="">Desempenho</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="">Feedbacks</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="">Solicitações</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="">Tarefas</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="">Comissão</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className={`pt-18 px-10`}>
                    <img
                        className="m-0 p-0 w-full h-auto"
                        src="/img/rodape/crianca_rodape.png"
                        alt="Imagem grande"
                    />
                </div>
            </div>

            <div>
                <div className="h-5 bg-[#8C3E82] border-b-4 border-dashed border-[#d594e6]"></div>
                <div className="flex items-center justify-center bg-[#8C3E82]">
                    <p className="text-[#ebc7f5] p-5">Desenvolvido por Tikitos®, 2025 - Todos os direitos reservados.</p>
                </div>
                <img
                    className="m-0 p-0 h-full bg-[#8C3E82]"
                    src="/img/rodape/bolinhas_rodape.png"
                    alt="Imagem grande"
                />
            </div>
        </>
    );
}