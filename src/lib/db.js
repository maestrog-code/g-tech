import { createClient } from '@libsql/client';

let client = null;

function getClient() {
  if (!client) {
    // Production: use Turso remote DB (set env vars on Vercel)
    // Development: fall back to local sqlite file
    client = createClient({
      url: process.env.TURSO_DATABASE_URL || 'file:./gtech_vault.db',
      authToken: process.env.TURSO_AUTH_TOKEN || undefined,
    });
  }
  return client;
}

export async function openDb() {
  const db = getClient();

  await db.execute(`
        CREATE TABLE IF NOT EXISTS citizens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            codename TEXT NOT NULL UNIQUE,
            specialization TEXT NOT NULL,
            registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

  return db;
}
