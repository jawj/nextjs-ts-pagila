import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import withDbClient from '../../shared/withDbClient';
import * as db from 'zapatos/db';
import * as s from 'zapatos/schema';

export async function getServerSideProps() {
  const films = await withDbClient(dbClient =>
    db.select('film', db.all, { 
      extras: { title: db.sql<s.film.SQL, string>`initcap(${"title"})` },
      order: { by: 'title', direction: 'ASC' },
    }).run(dbClient)
  );
  return { props: { films } };
}

const Home: NextPage<Awaited<ReturnType<typeof getServerSideProps>>['props']> = ({ films }) =>
  <>
    <Head><title>All films</title></Head>
    <main>
      <ul>
        {films.map(film => 
          <li key={film.film_id}>
            <Link href={`/films/${film.film_id}`}>{film.title}</Link> ({film.release_year})
          </li>)}
      </ul>
    </main>
  </>;

export default Home;
