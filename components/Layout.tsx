import { ReactNode } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function Layout({ children }: { children: ReactNode }) {
  return <>
    <Head>
      <title>Pagila film/actor explorer</title>
      <link rel="icon" href="/favicon-32x32.png" type="image/png" />
    </Head>

    <header><a href="https://github.com/devrimgunduz/pagila">Pagila</a> film/actor explorer</header>

    <main>
      {children}
    </main>

    <footer>
      <span>Powered by</span>
      <a href="https://neon.tech">
        <Image src="/neon.svg" alt="Neon logo" width={92} height={26} />
      </a>
      <a href="https://vercel.com" target="_blank" rel="noreferrer">
        <Image src="/vercel.svg" alt="Vercel logo" width={72} height={16} />
      </a>
    </footer>
  </>
}