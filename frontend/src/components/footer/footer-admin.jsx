import Image from "next/image";
import styles from './footer.module.css';
import Link from 'next/link';

export default function FooterAdmin() {
    return (
        <>
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-1 rounded-t-[150px] ${styles.rodape_fundo}`}>
                <div className={`flex m-auto p-23`}>
                    <img
                        className="m-0 w-full h-auto"
                        src="/img/logos/logo_comprimida.png"
                        alt="Logo"
                    />
                </div>

                <div className={`grid grid-cols-2`}>

                    <div className="flex flex-col gap-6 align-center justify-center">
                        <div>
                            <p className="font-bold text-[#8C3E82] mb-2">Vendas</p>
                            <ul className="text-[#4f6940] space-y-1">
                                <li className="hover:scale-95 transition">
                                    <Link href="/admin/produtos">Produtos</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="/admin/relatorios/vendas">Vendas</Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <p className="font-bold text-[#8C3E82] mb-2">Controle</p>
                            <ul className="text-[#4f6940] space-y-1">
                                <li className="hover:scale-95 transition">
                                    <Link href="/admin/produtos">Filtros</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="/admin/financeiro">Fluxo de caixa</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6 align-center justify-center">
                        <div>
                            <p className="font-bold text-[#8C3E82] mb-2">Meu perfil</p>
                            <ul className="text-[#4f6940] space-y-1">
                                <li className="hover:scale-95 transition">
                                    <Link href="/admin/relatorios/vendas">Vendas</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="/admin/relatorios/geral">Desempenho</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="/admin/relatorios">Feedbacks</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="/admin/fornecedores">Solicitações</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="/admin/gerentes">Tarefas</Link>
                                </li>
                                <li className="hover:scale-95 transition">
                                    <Link href="/admin/vendedores">Comissão</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex align-end mb-0">
                    <img
                        className="p-0 pt-11 pe-10 flex align-end w-full h-full object-contain"
                        src="/img/rodape/crianca_rodape.png"
                        alt="Imagem grande"
                    />
                </div>
            </div>

            <div>
                <div className="h-4 bg-[#8C3E82] border-b-4 border-dashed border-[#d594e6]"></div>
                <div className="flex items-center justify-center bg-[#8C3E82]">
                    <p className="text-[#ebc7f5] p-5">Desenvolvido por Tikitos®, 2025 - Todos os direitos reservados.</p>
                </div>
                <img
                    className="m-0 p-0 w-full bg-[#8C3E82] object-cover"
                    src="/img/rodape/bolinhas_rodape.png"
                    alt="Imagem grande"
                />
            </div>
        </>
    );
}