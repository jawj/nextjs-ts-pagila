import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import * as db from 'zapatos/db';
import withDbClient from '../../shared/withDbClient';
import { filmTitle } from '../../shared/utils';
import { revalidationTime } from '../../shared/config';

export async function getStaticProps() {
  const films = await withDbClient(dbClient =>
    db.select('film', db.all, { order: { by: 'title', direction: 'ASC' } }).run(dbClient)
  );
  return {
    revalidate: revalidationTime,
    props: { films },
  };
}

const Home: NextPage<Awaited<ReturnType<typeof getStaticProps>>['props']> = ({ films }) =>
  <>
    <Head><title>Films</title></Head>
    <main>
      <h1>Films</h1>
      <ul>
        {films.map(film =>
          <li key={film.film_id}>
            <Link href={`/films/${film.film_id}`}>{filmTitle(film)}</Link>
          </li>)}
      </ul>
      <p><Link href='/'>&laquo; All data</Link></p>
    </main>
  </>;

export default Home;
