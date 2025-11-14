"use client";

import { setCookie } from "cookies-next/client";
import styles from "./token.module.css";
import { useEffect, useRef, useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";

export default function Home() {
  const [email, setEmail] = useState("");
  const [emailIncorreto, setEmailIncorreto] = useState(false);
  const [emailCorreto, setEmailCorreto] = useState(false);
  const [caracterExcedido, setCaracterExcedido] = useState(false);
  const inputsRef = useRef([]);

  function aparecerToast(msg) {
    toast(msg, {
      icon: (
        <img
          src="/img/toast/logo_ioio.png"
          alt="logo"
          className="w-22 h-7"
        />
      ),
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      style: { backgroundColor: "#924187", color: "#fff" },
      transition: Bounce,
    });
  }

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.length > 1) return;

    // Vai para o próximo se digitou algo
    if (value && inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }

    // Volta para o anterior se apagou e não é o primeiro input
    if (!value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  //Junta todos os valores dos inputs em 1
  const obterTokenCompleto = () => {
    return inputsRef.current.map((input) => input.value).join("");
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (!email) return;

    //Verificar Email
    const temporizador = setTimeout(async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/auth/checar_email",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        // TRATAMENTO DE ERROS
        //Caso tente enviar um email vazio
        if (response.status == 401) {
          return aparecerToast("Preencha todos os campos!");
        }

        if (response.status == 400) {
          return aparecerToast("Número de caracteres excedido!")
        }

        //Vendo se o email está correto de acordo com o banco
        if (response.status == 404) {
          setEmailIncorreto(true);
          return aparecerToast("Email incorreto!")
        }

        if (response.status == 400) {
          return aparecerToast("Número de caracteres excedido!")
        }

        if (response.status == 200) {
          setEmailCorreto(true);
        }
      } catch (error) {
        return console.log("Erro ao verificar email: ", error);
      }
    }, 2000);

    //Tirando as mensagens de erro
    setCaracterExcedido(false);
    return () => clearTimeout(temporizador);
  }, [email]);

  //Verificar token
  async function verificarToken() {
    const codigo = obterTokenCompleto();
    try {
      const response = await fetch(
        "http://localhost:8080/auth/verificar_token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email, token: codigo }),
        }
      );

      const data = await response.json();

      console.log(data.code);

      if (response.status == 401) {
        switch (data.code) {
          case "CODIGO_EXPIROU":
            return aparecerToast("O seu código expirou!")

          case "CODIGO_INVALIDO":
            return aparecerToast("Código inválido!")
        }
      }

      if (response.status == 400) {
        switch (data.code) {
          case "CARACTER_EXCEDIDO":
            return aparecerToast("Número de caracteres excedido!")

          case "FALTA_DADOS":
            return aparecerToast("Preencha todos os campos!");

          case "TOKEN_INCORRETO":
            return aparecerToast("Token inválido!")
        }
      }

      if (response.ok) {
        setCookie("email", email);
        return window.location.href = "/login/senha";
      }

      return;
    } catch (error) {
      console.log("Erro ao verificar o token: ", error);
      return;
    }
  }

  return (
    <>
      <ToastContainer />
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

        {/* TÍTULO DE CADASTRO E TEXTINHO */}
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
              src="/img/token/token_titulo.png"
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

          {/* ÁREA DOS INPUTS COM TODOS OS DETALHES */}
          <div className="flex items-start gap-6">
            {/* imagem da linha com os números */}
            {/* {/* <div className="flex flex-col items-center mt-2">
              <img
                src="/img/token/token_linha.png"
                alt="Linha com etapas"
                className="h-full w-90 z-10 m-0 p-0 object-contain"
              />
            </div> */}

            {/* CONTEÚDO DOS FORMULÁRIOS */}
            <div className="flex flex-col gap-4">
              {/* INPUT DE E-MAIL */}
              <div
                className={`flex flex-col gap-4 bg-[#9CD089] p-4 rounded-3xl ${styles.form_container}`}
              >
                <form className={styles.form}>
                  <div className={styles.form_group}>
                    <label
                      className="text-[var(--color-verdao)]"
                      htmlFor="email"
                    >
                      1°: Insira o seu e-mail:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="email"
                        name="email"
                        placeholder="E-mail"
                        required
                        className={`bg-[#DABCE1] border-2 border-dashed ${emailIncorreto
                          ? "!border-[#f34236] focus:!border-[#f34236]"
                          : emailCorreto
                            ? "!border-[var(--color-verdao)] focus:!border-[var(--color-verdao)]"
                            : "!border-[#7C3A82] focus:!border-[#91678c]"
                          } rounded-2xl px-4 py-2 pr-10 text-[var(--color-verdao)] focus:outline-none w-full transition-all duration-300`}
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setEmailCorreto(false);
                          setEmailIncorreto(false);
                        }}
                      />
                      {emailIncorreto ? (
                        <img
                          src="/img/token/token_email_error.png"
                          className="absolute right-3 lg:right-1.5 top-1/2 -translate-y-1/2 w-4 sm:w-5 md:w-3 pointer-events-none"
                          alt=""
                        />
                      ) : emailCorreto ? (
                        <img
                          src="/img/token/token_email_correto.png"
                          className="absolute right-3 lg:right-1.5 md:right-1.5 top-1/2 -translate-y-1/2 w-4 sm:w-5 md:w-3 pointer-events-none"
                          alt=""
                        />
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </form>
                {caracterExcedido ? (
                  <div>
                    <p>Número de caracteres excedido</p>
                  </div>
                ) : (
                  ""
                )}
              </div>

              {/* INPUT DE VERIFICAÇÃO (FUNCIONAL E RESPONSIVO) */}
              <div
                className={`bg-[#9CD089] p-4 rounded-3xl flex justify-center ${styles.form_container}`}
              >
                <form className={`flex flex-col items-center ${styles.form}`}>
                  <div className={styles.form_group}>
                    <label
                      className="text-[var(--color-verdao)] mb-2 block"
                      htmlFor="number"
                    >
                      Digite o código de validação:
                    </label>

                    {/* ÁREA DOS INPUTZINHOS DE VERIFICAÇÃO */}
                    <div className="grid grid-cols-2 sm:flex sm:flex-nowrap justify-center gap-4 sm:gap-3 transition-all duration-300 ease-in-out validation-inputs">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <input
                          key={i}
                          ref={(el) => (inputsRef.current[i] = el)}
                          type="text"
                          maxLength="1"
                          onChange={(e) => {
                            handleChange(e, i);
                          }}
                          onKeyDown={(e) => handleKeyDown(e, i)}
                          className={`w-12 h-14 sm:w-10 sm:h-10 min-w-[2.95rem] min-h-[3.55rem] text-center text-lg font-semibold bg-[#DABCE1] border-2 border-dashed border-[#7C3A82] rounded-full focus:outline-none focus:border-[#7C3A82] text-[var(--color-verdao)] transition-all duration-300 ease-in-out ${styles.validation_inputs}`}
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
            <button
              className="group cursor-pointer transition-all duration-200 mt-5 rounded-full border border-transparent flex items-center justify-center gap-2 whitespace-nowrap bg-[#D6B9E2] text-[var(--color-verdao)] font-light hover:bg-[#db90e4] active:scale-95 px-8 py-3 text-[15px] sm:px-10 sm:text-[16px] md:px-14 md:text-[15px] lg:px-16 lg:text-[15px] xl:px-29"
              onClick={verificarToken}
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
          </div>
        </div>
      </div>
    </>
  );
}
