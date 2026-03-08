import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function initDB() {

  const db = await open({
    filename: "./database/reviews.db",
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY,
    product_id TEXT,
    product_name TEXT,
      rating INTEGER,
      title TEXT,
      text TEXT,
    sentiment TEXT,
      themes TEXT,
      review_hash TEXT UNIQUE,
      ingestion_date TEXT
    )
  `);

  console.log("Database initialized");

}

initDB();