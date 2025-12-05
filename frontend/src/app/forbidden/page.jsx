import Link from "next/link";

export default function Forbidden() {
  return (
    <>
      <main className="bg-[url(/img/error/fundo_error.png)] grid h-[100vh]">
        <div className="flex items-center justify-center">
          <img
            src="/img/error/403.png"
            alt="Imagem erro 403, forbidden"
            className="w-[85%] mt-7"
          />
        </div>

        <div className="flex items-center justify-center">
          <p className=" max-w-[50%] text-center text-[var(--color-verdao)] font-bold text-[20px] sm:text-[28px]">
            Que pena! Parece que o seu acesso a esta área está "em manutenção"
            pelos nossos pequenos construtores de sonhos!
          </p>
        </div>

        <div className="flex items-center justify-center">
          <Link href={"/"}>
            <button
              type="button"
              className="h-[3rem] w-[20rem] rounded-xl bg-[var(--color-verdao)] text-[var(--color-verdeclaro)]"
            >
              Voltar para a outra página
            </button>
          </Link>
        </div>
      </main>
    </>
  );
}
