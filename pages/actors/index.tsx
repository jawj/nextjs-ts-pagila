import type { NextPage } from 'next';
import Link from 'next/link';
import * as db from 'zapatos/db';
import withDbClient from '../../shared/withDbClient';
import { actorName } from '../../shared/utils';

export async function getStaticProps() {
  const actors = await withDbClient(dbClient =>
    db.select('actor', db.all, { order: { by: 'last_name', direction: 'ASC' } }).run(dbClient)
  );
  return { props: { actors } };
}

const Home: NextPage<Awaited<ReturnType<typeof getStaticProps>>['props']> = ({ actors }) =>
  <main>
    <h1>Actors</h1>
    <ul>
      {actors.map(actor =>
        <li key={actor.actor_id}>
          <Link href={`/actors/${actor.actor_id}`}>{actorName(actor)}</Link>
        </li>)}
    </ul>
    <p><Link href='/'>&laquo; Home</Link></p>
  </main>;

export default Home;
