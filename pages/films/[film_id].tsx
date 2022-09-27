import type { NextPage, GetStaticPaths, GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as db from 'zapatos/db';
import Loading from '../../components/Loading';
import withDbClient from '../../shared/withDbClient';
import { filmTitle, actorName } from '../../shared/utils';
import { revalidationTime } from '../../shared/config';

export const getStaticPaths: GetStaticPaths = async () => {
  const films = await withDbClient(dbClient =>
    db.select('film', db.all, { columns: ['film_id'] }).run(dbClient)
  );
  return {
    fallback: true,
    paths: films.map(({ film_id }) => ({ params: { film_id: String(film_id) } })),
  }
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

  return {
    revalidate: revalidationTime,
    props: { film },
  };
}

const Home: NextPage<Awaited<ReturnType<typeof getStaticProps>>['props']> = (props) => {
  const router = useRouter();
  if (router.isFallback) return <Loading />;

  const { film } = props!;
  return <>
    <Head><title>{filmTitle(film)}</title></Head>
    <main>
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
    </main>
  </>;
}

export default Home;
