
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function runQuery(question) {

  const db = await open({
    filename: "./database/reviews.db",
    driver: sqlite3.Database
  });

  const reviews = await db.all(`
    SELECT product_name, rating, text, sentiment, themes
    FROM reviews
    LIMIT 200
  `);

  const context = reviews
  .map(r => `${r.product_name} | sentiment:${r.sentiment} | themes:${r.themes} | review:${r.text}`)
  .join("\n");

  const prompt = `
You are a Voice of Customer analyst.

Use ONLY the review data provided to answer the question.

Reviews:
${context}

Question:
${question}

Give a clear analytical answer grounded in the reviews.
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [{ role: "user", content: prompt }]
  });

  console.log("\nAnswer:\n");
  console.log(completion.choices[0].message.content);
}

const question = process.argv.slice(2).join(" ");

runQuery(question);