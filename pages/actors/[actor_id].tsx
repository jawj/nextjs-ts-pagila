import type { NextPage, GetStaticPaths, GetStaticPropsContext } from 'next';
import Link from 'next/link';
import * as db from 'zapatos/db';
import withDbClient from '../../shared/withDbClient';
import { filmTitle, actorName } from '../../shared/utils';

export const getStaticPaths: GetStaticPaths = async () => {
  const actors = await withDbClient(dbClient =>
    db.select('actor', db.all, { columns: ['actor_id'] }).run(dbClient)
  );
  const paths = actors.map(({ actor_id }) => ({ params: { actor_id: String(actor_id) } }));

  return { paths, fallback: false };
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const actor_id = parseInt(context.params!.actor_id as string, 10);
  if (isNaN(actor_id)) return { notFound: true };

  const actor = await withDbClient(dbClient =>
    db.selectOne('actor', { actor_id }, {
      lateral: {
        films: db.select('film_actor', { actor_id: db.parent() }, {
          lateral: db.selectExactlyOne('film', { film_id: db.parent() })
        })
      }
    }).run(dbClient)
  );
  if (actor === undefined) return { notFound: true };

  return { props: { actor } };
}

const Home: NextPage<Awaited<ReturnType<typeof getStaticProps>>['props']> = (props) => {
  const { actor } = props!;
  return <main>
    <h1>{actorName(actor)}</h1>
    <p>Stars in:</p>
    <ul className='films'>
      {actor.films.map(film =>
        <li key={film.film_id}><Link href={`/films/${film.film_id}`}>{filmTitle(film)}</Link></li>)}
    </ul>
    <p><Link href='/actors'>&laquo; All actors</Link></p>
  </main>;
}

export default Home;
