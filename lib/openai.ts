import OpenAI from "openai";

if (!process.env.NEXT_PUBLIC_OPENAI_API_KEY) {
  throw new Error("Missing OpenAI API key");
}

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getCoachingAdvice(gameState: any) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert League of Legends coach. Provide concise, actionable advice for the current game situation."
        },
        {
          role: "user",
          content: `Current game state: ${JSON.stringify(gameState)}. What should I focus on?`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get coaching advice");
  }
}

export async function getBuildRecommendation(champion: string, enemyTeam: string[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert League of Legends coach. Provide optimal build recommendations based on the current game state."
        },
        {
          role: "user",
          content: `I'm playing ${champion} against ${enemyTeam.join(", ")}. What items should I build?`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to get build recommendation");
  }
}