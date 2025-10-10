import Image from "next/image";
import styles from './page.module.css';

export default function Home() {
  return (
    <>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-10">
        <div className={`cols-2 ${styles.formContainer}`}>
          <div className={styles.logoContainer}>Forgot Password</div>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
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
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your email"
                required=""
              />
            </div>
            <button className={`${styles.formSubmitBtn}`} type="submit">
              Send Email
            </button>
          </form>
          <p className={`${styles.signupLink}`}>
            Don't have an account?
            <a href="#" className={`${styles.signupLink} ${styles.link}`}>
              {" "}
              Sign up now
            </a>
          </p>
        </div>
      </div>



    </>
  );
}
