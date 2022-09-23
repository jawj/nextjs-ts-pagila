import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import withDbClient from '../../shared/withDbClient';
import * as db from 'zapatos/db';
import * as s from 'zapatos/schema';

export async function getServerSideProps() {
  const actors = await withDbClient(dbClient =>
    db.select('actor', db.all, { 
      extras: { 
        first_name: db.sql<s.actor.SQL, string>`initcap(${"first_name"})`,
        last_name: db.sql<s.actor.SQL, string>`initcap(${"last_name"})`,
      },
      order: { by: 'last_name', direction: 'ASC' },
    }).run(dbClient)
  );
  return { props: { actors } };
}

const Home: NextPage<Awaited<ReturnType<typeof getServerSideProps>>['props']> = ({ actors }) =>
  <>
    <Head><title>All films</title></Head>
    <main>
      <ul>
        {actors.map(actor => 
          <li key={actor.actor_id}>
            <Link href={`/actors/${actor.actor_id}`}><a>{actor.first_name} {actor.last_name}</a></Link>
          </li>)}
      </ul>
    </main>
  </>;

export default Home;
