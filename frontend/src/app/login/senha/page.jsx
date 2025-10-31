"use client";
import { useEffect, useState } from "react";
import styles from "./senha.module.css";
import Link from "next/link";
import { getCookie } from "cookies-next/client";
import { toast, ToastContainer, Bounce } from "react-toastify";

export default function Home() {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  async function senhaNova() {
    const email = getCookie("email");

    try {
      const response = await fetch("http://localhost:8080/auth/definir_senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          novaSenha: senha,
          confirmarSenha: confirmarSenha,
        }),
      });

      const data = await response.json();
      if (response.status == 400) {
        // if (data.code == "FALTA_DADOS") {
        //   toast("⚠️ Preencha todos os campos obrigatórios!", {
        //     position: "top-right",
        //     autoClose: 4000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     style: { backgroundColor: "#4f6940", color: "#fff" },
           
        //     transition: Bounce,
        //   });
        //   console.log("FALTA_DADOS");
        // }

        if (data.code == "CARACTER_EXCEDIDO") {
          console.log("CARACTER_EXCEDIDO")
        }

        if (data.code == "SENHA_DIFERENTE") {
          console.log("SENHA_DIFERENTE")
        }
      }

      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.log("Erro ao criar nova senha: ", error);
    }
  }
  return (
    <>
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-1 min-h-screen ${styles.login_fundo}`}
      >
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

        {/* TÍTULO DE LOGIN E TEXTINHO */}
        <div className="p-17 sm:p-15 md:p-18 flex flex-col justify-center">
          <div className="pb-5 pl-0 ml-0 sm:p-7 md:p-10 sm:pb-15 md:pb-7 md:pt-0">
            <div className=" block lg:hidden ">
              {/* imagem logo Tikitos */}
              <img
                className="w-full h-auto"
                src="/img/logos/logo_comprida.png"
                alt=""
              />
            </div>

            <img
              src="/img/senha/senha_titulo.png"
              className="w-full h-auto"
              alt=""
            />

            <div className="relative flex flex-col items-center">
              <h3
                className={`text-[14px] xs:text-[17px] sm:text-[23px] md:text-[26px] lg:text-[14px] xl:text-[17px] leading-tight z-10 text-center text-[var(--color-verdao)] `}
              >
                Acesse e continue espalhando encanto!
              </h3>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#E5B8F1] rounded-lg h-3 z-0 w-0 xs:w-92 sm:w-120 md:w-136 lg:w-80 xl:w-90"></div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* INPUT DE EMAIL */}
            <div className={`bg-[#9CD089]  ${styles.form_container}`}>
              <form className={styles.form}>
                <div className={styles.form_group}>
                  <label
                    className={`text-[var(--color-verdao)]`}
                    htmlFor="email"
                  >
                    3°: Digite uma nova senha:
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    placeholder="E-mail"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required=""
                    className={`bg-[#DABCE1] focus:border-color[#9CD089]`}
                  />
                </div>
              </form>
            </div>

            {/* INPUT DE VERIFICAÇÃO */}
            <div className={`bg-[#9CD089]  ${styles.form_container}`}>
              <form className={styles.form}>
                <div className={styles.form_group}>
                  <label
                    className={`text-[var(--color-verdao)] `}
                    htmlFor="email"
                  >
                    4° Confirme sua nova senha:
                  </label>
                  <input
                    type="password"
                    id="email"
                    name="email"
                    placeholder="Senha"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    required=""
                    className={`bg-[#DABCE1]`}
                  />
                </div>
              </form>
            </div>
          </div>

          {/* BOTÃO DE ENVIAR */}
          <div className="flex justify-center">
            <button
              className="group cursor-pointer transition-all duration-200 mt-5 rounded-full border border-transparent flex items-center justify-center gap-2 whitespace-nowrap bg-[#D6B9E2] text-[var(--color-verdao)] font-light hover:bg-[#db90e4] active:scale-95 px-8 py-3 text-[15px] sm:px-10 sm:text-[16px] md:px-14 md:text-[15px] lg:px-16 lg:text-[15px] xl:px-36"
              onClick={senhaNova}
            >
              <span className="text-end">Fazer login</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-[#6a0d75] transition-transform duration-300 ease-in-out group-hover:translate-x-[3px]"
              >
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
