import type { NextPage, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import withDbClient from '../../shared/withDbClient';
import * as db from 'zapatos/db';
import * as s from 'zapatos/schema';

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
  const film_id = parseInt(query.film_id as string, 10);
  if (isNaN(film_id)) return { notFound: true };

  const film = await withDbClient(dbClient =>
    db.selectOne('film', { film_id }, { 
      extras: { title: db.sql<s.film.SQL, string>`initcap(${"title"})` },
      order: { by: 'title', direction: 'ASC' },
      lateral: { 
        actors: db.select('film_actor', { film_id: db.parent() }, {
          lateral: db.selectExactlyOne('actor', { actor_id: db.parent() }, {
            extras: {
              first_name: db.sql<s.actor.SQL, string>`initcap(${"first_name"})`,
              last_name: db.sql<s.actor.SQL, string>`initcap(${"last_name"})`,
            },
            order: [{ by: 'last_name', direction: 'ASC' }, { by: 'first_name', direction: 'ASC' }],
          })
        }),
        categories: db.select('film_category', { film_id: db.parent() }, {
          lateral: db.selectExactlyOne('category', { category_id: db.parent() })
        }),
      }
    }).run(dbClient)
  );
  if (film === undefined) return { notFound: true };

  return { props: { film } };
}

const Home: NextPage<Awaited<ReturnType<typeof getServerSideProps>>['props']> = (props) => {
  const { film } = props!;
  return <>
    <Head><title>{film.title}</title></Head>
    <main>
      <h1>{film.title} ({film.release_year})</h1>
      <p>{film.description}</p>
      <ul className='actors'>
        {film.actors.map(actor => <li key={actor.actor_id}><Link href={`/actors/${actor.actor_id}`}><a>{actor.first_name} {actor.last_name}</a></Link></li>)}
      </ul>
      <ul className='categories'>
        {film.categories.map(cat => <li key={cat.category_id}>{cat.name}</li>)}
      </ul>
      <p><Link href='/films'>&laquo; All films</Link></p>
    </main>
  </>;
}

export default Home;
