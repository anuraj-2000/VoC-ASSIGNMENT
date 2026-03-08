import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

async function generateGlobalReport() {

  const db = await open({
    filename: "./database/reviews.db",
    driver: sqlite3.Database
  });

  const rows = await db.all(`
    SELECT themes, sentiment
    FROM reviews
  `);

  const themeCounts = {};

  rows.forEach(r => {

    let themes;

    try {
      themes = JSON.parse(r.themes);
    } catch {
      themes = [];
    }

    themes.forEach(t => {

      if (!themeCounts[t]) {
        themeCounts[t] = 0;
      }

      themeCounts[t]++;

    });

  });

  const sortedThemes = Object.entries(themeCounts)
    .sort((a,b) => b[1] - a[1]);

  let report = `# Global Voice of Customer Report\n\n`;

  report += `## Product Team\n`;

  sortedThemes.slice(0,5).forEach(([theme,count]) => {
    report += `• Investigate recurring feedback on ${theme} (${count} mentions)\n`;
  });

  report += `\n## Marketing Team\n`;
  report += `• Promote strong sound quality and battery performance\n`;
  report += `• Highlight comfort and build quality in campaigns\n`;

  report += `\n## Support Team\n`;
  report += `• Prepare troubleshooting guides for common issues\n`;
  report += `• Add FAQs addressing recurring complaints\n`;

  fs.writeFileSync("./reports/global_report.md", report);

  console.log("Global report generated");

}

export default generateGlobalReport;