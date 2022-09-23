import type { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import withDbClient from '../../shared/withDbClient';
import * as db from 'zapatos/db';
import * as s from 'zapatos/schema';

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const actor_id = parseInt(query.actor_id as string, 10);
  if (isNaN(actor_id)) return { notFound: true };

  const actor = await withDbClient(dbClient =>
    db.selectOne('actor', { actor_id }, { 
      extras: { 
        first_name: db.sql<s.actor.SQL, string>`initcap(${"first_name"})`,
        last_name: db.sql<s.actor.SQL, string>`initcap(${"last_name"})`
      },
      order: [{ by: 'last_name', direction: 'ASC' }, { by: 'first_name', direction: 'ASC' }],
      lateral: { 
        films: db.select('film_actor', { actor_id: db.parent() }, {
          lateral: db.selectExactlyOne('film', { film_id: db.parent() }, {
            extras: {
              title: db.sql<s.film.SQL, string>`initcap(${"title"})`,
            },
            order: [{ by: 'release_year', direction: 'DESC' }, { by: 'title', direction: 'ASC' }],
          })
        })
      }
    }).run(dbClient)
  );
  if (actor === undefined) return { notFound: true };

  return { props: { actor } };
}

const Home: NextPage<Awaited<ReturnType<typeof getServerSideProps>>['props']> = (props) => {
  const { actor } = props!;
  return <>
    <Head><title>{actor.first_name} {actor.last_name}</title></Head> 
    <main>
      <h1>{actor.first_name} {actor.last_name}</h1>
      <ul className='films'>
        {actor.films.map(film => 
          <li key={film.film_id}><Link href={`/films/${film.film_id}`}>{film.title}</Link> ({film.release_year})</li>)}
      </ul>
      <p><Link href='/actors'>&laquo; All actors</Link></p>
    </main>
  </>;
}

export default Home;
