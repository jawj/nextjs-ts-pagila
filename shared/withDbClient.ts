
import { Client } from 'pg';

export default async function withDbClient<T>(fn: (client: Client) => T): Promise<T> {
  const connectionString = process.env.DB_URL;
  const client = new Client({ connectionString });
  await client.connect();

  try {  
    const result = await fn(client)
    return result;

  } finally {
    await client.end();
  }
}