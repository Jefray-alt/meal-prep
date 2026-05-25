import { Client } from 'pg'

export default async function globalTeardown() {
  const client = new Client({
    database: process.env['DB_NAME'],
    host: process.env['DB_HOST'],
    password: process.env['DB_PASSWORD'],
    port: Number(process.env['DB_PORT'] ?? 5432),
    user: process.env['DB_USERNAME'],
  })
  await client.connect()
  await client.query('DELETE FROM users WHERE email LIKE \'%@mise-e2e.test\'')
  await client.end()
}
