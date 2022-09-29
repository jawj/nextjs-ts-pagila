import type { NextPage } from 'next'
import Link from 'next/link'

const Home: NextPage = () => {
  return (
    <main>
      <h1>Home</h1>

      <ul>
        <li><Link href='/films'>Films</Link></li>
        <li><Link href='/actors'>Actors</Link></li>
      </ul>

    </main>
  )
}

export default Home
