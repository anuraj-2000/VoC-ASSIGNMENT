
import { chromium } from "playwright";

async function scrapeReviews(url) {
 console.log("Opening browser...");

  const browser = await chromium.launch({
    headless: true
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded"
  });

  
let productName = "Unknown Product";

try {
  await page.waitForSelector("#productTitle", { timeout: 10000 });

  productName = await page.$eval(
    "#productTitle",
    el => el.textContent.trim()
  );

  console.log("Product detected:", productName);

} catch (err) {
  console.log("Product name not detected, using fallback");
}

  // load review
  await page.waitForTimeout(3000);

  const reviews = await page.evaluate((productName) => {

    const results = [];

    document.querySelectorAll("[data-hook='review']").forEach(el => {

      const ratingText =
        el.querySelector("[data-hook='review-star-rating'] span")?.innerText;

      const rating = ratingText
        ? parseInt(ratingText.split(" ")[0])
        : 4;

      const title =
        el.querySelector("[data-hook='review-title']")?.innerText;

      const text =
        el.querySelector("[data-hook='review-body'] span")?.innerText;

      results.push({
        product_name: productName,
        rating: rating,
        title: title || "No title",
        text: text || "No review text"
      });

    });

    return results;

  }, productName);

  await browser.close();

  if (reviews.length === 0) {

    console.log("No reviews detected, using demo reviews");

    return []
    ;

  }

  console.log("Reviews scraped:", reviews.length);

  return reviews;

}

export default scrapeReviews;