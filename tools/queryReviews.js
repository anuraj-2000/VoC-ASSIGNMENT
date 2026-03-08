
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

async function queryReviews() {

  const db = await open({
    filename: "./database/reviews.db",
    driver: sqlite3.Database
  });

  const negatives = await db.all(`
    SELECT themes, COUNT(*) as count
    FROM reviews
    WHERE sentiment = 'Negative'
    GROUP BY themes
    ORDER BY count DESC
    LIMIT 10
  `);

  let report = `# Global Voice of Customer Report\n\n`;

  report += `## Product Team\n`;

  negatives.forEach(n => {
    report += `• Investigate issues related to ${n.themes}\n`;
  });

  report += `\n## Marketing Team\n`;
  report += `• Highlight strong features mentioned in positive reviews\n`;
  report += `• Address price/value perception in messaging\n`;

  report += `\n## Support Team\n`;
  report += `• Prepare troubleshooting guides for connectivity and battery issues\n`;

  fs.writeFileSync("./reports/global_report.md", report);

  console.log("Global report generated");

}

export default queryReviews;