
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

async function generateWeeklyReport() {

  const db = await open({
    filename: "./database/reviews.db",
    driver: sqlite3.Database
  });

  const rows = await db.all(`
    SELECT themes, sentiment
    FROM reviews
    WHERE ingestion_date >= date('now','-7 day')
  `);

  let report = `# Weekly Delta Report\n\n`;

  const negatives = rows.filter(r => r.sentiment === "Negative");

  report += `Negative reviews this week: ${negatives.length}\n\n`;

  negatives.forEach(r => {

    let themesText = "";

    try {
      const parsedThemes = JSON.parse(r.themes);
      themesText = parsedThemes.join(", ");
    } catch {
      themesText = r.themes;
    }

    report += `• Complaint related to ${themesText}\n`;

  });

  fs.writeFileSync("./reports/weekly_report.md", report);

  console.log("Weekly delta report generated");

}

export default generateWeeklyReport;