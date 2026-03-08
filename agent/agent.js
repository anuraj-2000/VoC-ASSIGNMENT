
import scrapeReviews from "../tools/scrapeReviews.js";
import classifyReview from "../tools/classifyReview.js";
import storeReview from "../tools/storeReview.js";

import generateGlobalReport from "../tools/generateGlobalReport.js";
import generateWeeklyReport from "../tools/generateWeeklyReport.js";
import dotenv from "dotenv";

dotenv.config();

async function runAgent() {

  console.log("Starting VoC Intelligence Agent...");

  const productUrls = [
    "https://www.amazon.in/dp/B09Y5MP7C4",
    "https://www.amazon.in/dp/B0D3V6PSC4"
  ];

  let newReviewsCount = 0;
  let duplicateCount = 0;

  for (const url of productUrls) {

    console.log("Scraping reviews:", url);

    const reviews = await scrapeReviews(url);

    console.log("Reviews scraped:", reviews.length);

    for (const review of reviews) {

      const classification = await classifyReview(review.text);

      const processed = {
        product_id: url,
        product_name: review.product_name,
        rating: review.rating,
        title: review.title,
        text: review.text,
        sentiment: classification.sentiment,
        themes: classification.themes
      };

      const stored = await storeReview(processed);

      if (stored === "NEW") {
        newReviewsCount++;
      } else {
        duplicateCount++;
      }

      //prevent api rate limits
      await new Promise(r => setTimeout(r, 1200));

    }

  }

  console.log("New reviews inserted:", newReviewsCount);
  console.log("Duplicates skipped:", duplicateCount);

  
  // await queryReviews();

  await generateGlobalReport();
  
  await generateWeeklyReport();

  console.log("VoC pipeline complete");

}

// start agent
runAgent();