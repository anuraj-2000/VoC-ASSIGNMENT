
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import crypto from "crypto";

async function storeReview(review) {

  const db = await open({
    filename: "./database/reviews.db",
    driver: sqlite3.Database
  });

  const content = review.title + review.text;

  const reviewHash = crypto
    .createHash("sha256")
    .update(content)
    .digest("hex");

  const existing = await db.get(
    "SELECT id FROM reviews WHERE review_hash = ?",
    reviewHash
  );

  if (existing) {
    console.log("Duplicate review skipped");
    return "DUPLICATE";
  }

  await db.run(
    `INSERT INTO reviews
    (product_id,product_name,rating,title,text,sentiment,,review_hash,ingestion_date)
    VALUES (?,?,?,?,?,?,?, ?,date('now'))`,
    [
      review.product_id,
      review.product_name,
      review.rating,
      review.title,
      review.text,
      review.sentiment,
      JSON.stringify(review.themes),
      reviewHash
    ]
  );

  console.log("Review stored");

  return "NEW";
}

export default storeReview;