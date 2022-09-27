import Head from 'next/head';
import Image from 'next/image';

export default function Loading() {
  return <>
    <Head><title>Loading …</title></Head>
    <div className='loading'>
      <Image src='/puff.svg' alt='Loading' width={30} height={30} />
      <p>Getting data, please wait …</p>
    </div>
  </>;
}