import type { NextPage, GetStaticPaths, GetStaticPropsContext } from 'next';
import Link from 'next/link';
import * as db from 'zapatos/db';
import withDbClient from '../../shared/withDbClient';
import { filmTitle, actorName } from '../../shared/utils';

export const getStaticPaths: GetStaticPaths = async () => {
  const films = await withDbClient(dbClient =>
    db.select('film', db.all, { columns: ['film_id'] }).run(dbClient)
  );
  const paths = films.map(({ film_id }) => ({ params: { film_id: String(film_id) } }));

  return { paths, fallback: false };
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const film_id = parseInt(context.params!.film_id as string, 10);
  if (isNaN(film_id)) return { notFound: true };

  const film = await withDbClient(dbClient =>
    db.selectOne('film', { film_id }, {
      lateral: {
        actors: db.select('film_actor', { film_id: db.parent() }, {
          lateral: db.selectExactlyOne('actor', { actor_id: db.parent() })
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

const Home: NextPage<Awaited<ReturnType<typeof getStaticProps>>['props']> = (props) => {
  const { film } = props!;
  return <main>
    <h1>{filmTitle(film)}</h1>
    <p>{film.description}</p>
    <p>Starring:</p>
    <ul className='actors'>
      {film.actors.map(actor => <li key={actor.actor_id}><Link href={`/actors/${actor.actor_id}`}>{actorName(actor)}</Link></li>)}
    </ul>
    <ul className='categories'>
      {film.categories.map(cat => <li key={cat.category_id}>{cat.name}</li>)}
    </ul>
    <p><Link href='/films'>&laquo; All films</Link></p>
  </main>;
}

export default Home;
