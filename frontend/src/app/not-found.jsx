import Link from 'next/link';

export default function NotFound() {
    return (
        <>
            <div className="grid grid-cols-2">
                <div className='flex h-full items-center justify-center'>
                    <img src="/img/404/urso_404.png" className='object-contain' />
                </div>

                <main className='grid h-full items-center justify-center'>
                    <div className="flex h-full items-center justify-center">
                        <img src="/img/404/404.png" alt="" />
                    </div>
                    <div className="flex h-full items-center justify-center">
                         <p>Que pena! Parece que o seu acesso a esta área está "em manutenção" pelos nossos pequenos construtores de sonhos!</p>
                    </div>
                   
                    <button type="button"></button>
                </main>

            </div>

        </>
    );
}
