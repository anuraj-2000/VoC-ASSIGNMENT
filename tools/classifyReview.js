import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function classifyReview(text) {

  const prompt = `
You are a Voice of Customer analyst.

Analyze the following customer review.

Return ONLY valid JSON.
Do not include explanations.

Format:

{
 "sentiment": "Positive | Neutral | Negative",
 "themes": ["Battery Life","Sound Quality","Comfort","ANC","Build Quality","App Experience","Price","Delivery"]
}

Review:
${text}
`;


  try {

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "user", content: prompt }
      ],
      temperature: 0.2
    });

    const response = completion.choices[0].message.content;

    console.log("Groq response:", response);

    try {

      const jsonMatch = response.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

    } catch (parseErr) {

      console.log("JSON parse failed:", parseErr);

    }

  } catch (err) {

    console.log("Groq API error:", err.message);

  }

  // fallback classifier
  const t = text.toLowerCase();

  let sentiment = "Neutral";
  let themes = [];

  if (t.includes("good") || t.includes("great") || t.includes("excellent"))
    sentiment = "Positive";

  if (t.includes("bad") || t.includes("poor") || t.includes("worst"))
    sentiment = "Negative";

  if (t.includes("battery")) themes.push("Battery Life");
  if (t.includes("sound")) themes.push("Sound Quality");
  if (t.includes("comfort")) themes.push("Comfort");

  console.log("Fallback classifier used");

  return { sentiment, themes };

}

export default classifyReview;