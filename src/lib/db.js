import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let db = null;

export async function openDb() {
    if (!db) {
        db = await open({
            filename: './gtech_vault.db',
            driver: sqlite3.Database
        });

        await db.exec(`
      CREATE TABLE IF NOT EXISTS citizens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codename TEXT NOT NULL UNIQUE,
        specialization TEXT NOT NULL,
        registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
    return db;
}
