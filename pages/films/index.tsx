import type { NextPage } from 'next';
import Link from 'next/link';
import * as db from 'zapatos/db';
import withDbClient from '../../shared/withDbClient';
import { filmTitle } from '../../shared/utils';

export async function getStaticProps() {
  const films = await withDbClient(dbClient =>
    db.select('film', db.all, { order: { by: 'title', direction: 'ASC' } }).run(dbClient)
  );
  return { props: { films } };
}

const Home: NextPage<Awaited<ReturnType<typeof getStaticProps>>['props']> = ({ films }) =>
  <main>
    <h1>Films</h1>
    <ul>
      {films.map(film =>
        <li key={film.film_id}>
          <Link href={`/films/${film.film_id}`}>{filmTitle(film)}</Link>
        </li>)}
    </ul>
    <p><Link href='/'>&laquo; Home</Link></p>
  </main>;

export default Home;
