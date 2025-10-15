import Image from "next/image";
import styles from './page.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-1 ${styles.login_fundo}`}>

        <div className="hidden lg:block m-0 p-0">
          {/* imagem das crianças ao lado do login */}
          <img className="m-0 p-0 w-full h-auto" src="/img/login/login_imagem.png" alt="" />
        </div>

        {/* TÍTULO DE LOGIN E TEXTINHO */}
        <div className="p-20 sm:p-20 md:p-20 flex flex-col justify-center">
          <div className="pb-5 pl-0 ml-0">

            <div className=" block lg:hidden p-15 pt-0 pb-0 sm:p-0 sm:mt-0 md:mt-0">
              {/* imagem logo Tikitos */}
              <img className="m-0 p-0 w-full h-auto" src="/img/login/logo_comprida.png" alt="" />
            </div>

            <img src="/img/login/login_titulo.png" className="w-full h-auto" alt="" />

            <div className="relative flex flex-col items-center">
              <h3 className="text-[15px] z-10 text-center text-[var(--color-verdao)]">
                Acesse e continue espalhando encanto!
              </h3>

              <div className="hidden md:block absolute bottom-0 left-1/2 -translate-x-1/2 bg-[#E5B8F1] rounded-lg h-3 w-85 z-0"></div>
            </div>
          </div>

          {/* INPUT DE EMAIL */}
          <div className={`bg-[#9CD089]  ${styles.form_container}`}>
            <form className={styles.form}>
              <div className={styles.form_group}>
                <label className={`text-[var(--color-verdao)]`} htmlFor="email">Insira o seu e-mail:</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="E-mail"
                  required=""
                  className={`bg-[#DABCE1] focus:border-color[#9CD089]`}
                />
              </div>
            </form>

            {/* INPUT DE SENHA */}
            <form className={styles.form}>
              <div className={styles.form_group}>
                <label className={`text-[var(--color-verdao)] `} htmlFor="email">Insira a sua senha:</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Senha"
                  required=""
                  className={`bg-[#DABCE1]`}
                />
              </div>
            </form>
          </div>

          {/* BOTÃO DE ENVIAR */}
          <div className="flex justify-center">
            <Link href="/login">
              <button
                className="group cursor-pointer transition-all duration-200 mt-5 rounded-full border border-transparent flex items-center justify-center gap-2 whitespace-nowrap bg-[#D6B9E2] text-[var(--color-verdao)] font-light hover:bg-[#db90e4] active:scale-95 px-8 py-3 text-[15px] sm:px-10 sm:text-[16px] md:px-14 md:text-[15px] lg:px-16 lg:text-[15px] xl:px-19"
              >
                <span className="text-end">Entre clicando aqui!</span>
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


          {/* ESCRITA COM O LINK */}
          <p className={`mt-5 mb-0 pb-0 text-center text-[#76216d]  ${styles.signup_link}`}>
            Esqueceu ou não tem senha?
            <Link href="#" className={`no-underline hover:underline mx-1 ${styles.signup_link} ${styles.link}`}>
              Clique aqui!
            </Link>
          </p>
        </div>
      </div>




    </>
  );
}