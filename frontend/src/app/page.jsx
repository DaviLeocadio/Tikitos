import Image from "next/image";
import styles from './page.module.css';

export default function Home() {
  return (
    <>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 ${styles.login_fundo}`}>

        <div>
          {/* imagem das crianças ao lado do login */}
          <img src="/img/login/login_imagem.png" alt="" />
        </div>

        <div>
          <div className="pb-5 pl-0 ml-0">
            {/* imagem do título login */}
          <img src="/img/login/login_titulo.png" className="p-25 pt-13 pb-1" alt="" />
          <p className="d-flex text-center text-[var(--color-verdao)]"> <span className="grifado">Acesse e continue espalhando encanto!</span></p>
          </div>

          <div className={`bg-[#9CD089] ${styles.form_container}`}>
            <form className={styles.form}>
              <div className={styles.form_group}>
                <label className={`text-[var(--color-verdao)] `} htmlFor="email">Insira o seu e-mail:</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required=""
                />
              </div>
            </form>

            <form className={styles.form}>
              <div className={styles.form_group}>
                <label className={`text-[var(--color-verdao)] `} htmlFor="email">Insira a sua senha</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  required=""
                />
              </div>

              <button className={`${styles.form_submit_btn}`} type="submit">
                Send Email
              </button>
            </form>

            <p className={`${styles.signup_link}`}>
              Don't have an account?
              <a href="#" className={`${styles.signup_link} ${styles.link}`}>
                {" "}
                Sign up now
              </a>
            </p>

          </div>
        </div>
      </div>
    </>
  );
}