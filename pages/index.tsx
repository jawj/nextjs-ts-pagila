import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pagila movie rentals explorer</title>
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>

      <ul>
        <li><Link href='/films'>Films</Link></li>
        <li><Link href='/actors'>Actors</Link></li>
      </ul>

    </>
  )
}

export default Home
