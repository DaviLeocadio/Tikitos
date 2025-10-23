'use client'

import styles from './token.module.css';
import Link from 'next/link';
import { useRef } from "react";

export default function Home() {
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (value && index < inputsRef.current.length - 1) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    return (
        <>
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-1 min-h-screen ${styles.login_fundo}`}>

                {/* IMAGEM DA MENINA PULANDO */}
                <div className="hidden lg:block m-0 p-0">
                    <img
                        className="m-0 p-0 w-full h-full"
                        src="/img/login/login_imagem.png"
                        alt="Imagem grande"
                    />
                </div>

                <div className="hidden lg:hidden m-0 p-0">
                    <img
                        className="m-0 p-0 w-full h-full"
                        src="/img/login/login_imagem2.png"
                        alt="Imagem pequena"
                    />
                </div>


                {/* TÍTULO DE CADASTRO E TEXTINHO */}
                <div className="p-17 sm:p-15 md:p-18 flex flex-col justify-center">
                    <div className="pb-5 pl-0 ml-0 sm:p-7 md:p-10 sm:pb-15 md:pb-7 md:pt-0">

                        <div className=" block lg:hidden ">
                            {/* imagem logo Tikitos */}
                            <img className="w-full h-auto" src="/img/logos/logo_comprida.png" alt="" />
                        </div>

                        <img src="/img/token/token_titulo.png" className="w-full h-auto" alt="" />

                        <div className="relative flex flex-col items-center">
                            <h3 className={`text-[14px] xs:text-[17px] sm:text-[23px] md:text-[26px] lg:text-[14px] xl:text-[17px] leading-tight z-10 text-center text-[var(--color-verdao)] `}>
                                Acesse e continue espalhando encanto!
                            </h3>

                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#E5B8F1] rounded-lg h-3 z-0 w-0 xs:w-92 sm:w-120 md:w-136 lg:w-80 xl:w-90"></div>
                        </div>
                    </div>

                    {/* ÁREA DOS INPUTS COM TODOS OS DETALHES */}
                    <div className="flex items-start gap-6">
                        {/* LINHA LATERAL (01 → 02) */}
                        <div className="flex flex-col items-center mt-2">
                            <img
                                src="/img/token/token_linha.png"
                                alt="Linha com etapas"
                                className="h-full w-10 object-contain"
                            />
                        </div>

                        {/* CONTEÚDO DOS FORMULÁRIOS */}
                        <div className="flex flex-col gap-4">
                            {/* INPUT DE E-MAIL */}
                            <div className={`flex flex-col gap-4 bg-[#9CD089] p-4 rounded-3xl ${styles.form_container}`}>
                                <form className={styles.form}>
                                    <div className={styles.form_group}>
                                        <label
                                            className="text-[var(--color-verdao)]"
                                            htmlFor="email"
                                        >
                                            Insira o seu e-mail:
                                        </label>
                                        <input
                                            type="text"
                                            id="email"
                                            name="email"
                                            placeholder="E-mail"
                                            required
                                            className="bg-[#DABCE1] border-2 border-dashed border-[#7C3A82] rounded-2xl px-4 py-2 text-[var(--color-verdao)] focus:outline-none focus:border-[#7C3A82] w-full"
                                        />
                                    </div>
                                </form>
                            </div>

                            {/* INPUT DE VERIFICAÇÃO (FUNCIONAL E RESPONSIVO) */}
                            <div className={`bg-[#9CD089] p-4 rounded-3xl flex justify-center ${styles.form_container}`}>
                                <form className={`flex flex-col items-center ${styles.form}`}>
                                    <div className={styles.form_group}>
                                        <label
                                            className="text-[var(--color-verdao)] mb-2 block"
                                            htmlFor="number"
                                        >
                                            Digite o código de validação:
                                        </label>

                                        {/* 6 inputs - 1 linha no desktop / 2 linhas no mobile */}
                                        <div className="grid grid-cols-6 sm:flex sm:flex-nowrap justify-center gap-3 transition-all duration-300 ease-in-out">
                                            {Array.from({ length: 6 }).map((_, i) => (
                                                <input
                                                    key={i}
                                                    ref={(el) => (inputsRef.current[i] = el)}
                                                    type="text"
                                                    maxLength="1"
                                                    onChange={(e) => handleChange(e, i)}
                                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                                    className="w-10 h-12 text-center text-lg font-semibold bg-[#DABCE1] border-2 border-dashed border-[#7C3A82] rounded-xl focus:outline-none focus:border-[#7C3A82] text-[var(--color-verdao)] transition-all duration-300 ease-in-out"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>



                    {/* BOTÃO DE ENVIAR */}
                    <div className="flex justify-center">
                        <Link href="/login/senha">
                            <button
                                className="group cursor-pointer transition-all duration-200 mt-5 rounded-full border border-transparent flex items-center justify-center gap-2 whitespace-nowrap bg-[#D6B9E2] text-[var(--color-verdao)] font-light hover:bg-[#db90e4] active:scale-95 px-8 py-3 text-[15px] sm:px-10 sm:text-[16px] md:px-14 md:text-[15px] lg:px-16 lg:text-[15px] xl:px-29"
                            >
                                <span className="text-end">Faça a verificação</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#6a0d75] transition-transform duration-300 ease-in-out group-hover:translate-x-[3px]"
                                >
                                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                                </svg>
                            </button>
                        </Link>
                    </div>


                </div>
            </div>

        </>
    );
}