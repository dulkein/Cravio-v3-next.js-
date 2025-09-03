// pages/api/meal-suggestion.js
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mood, ingredients } = req.body;

    if (!mood || !ingredients) {
      return res.status(400).json({
        error: "Please provide both mood and ingredients",
      });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Updated to correct model name
        messages: [
          {
            role: "system",
            content:
              "You are Cravio, a friendly AI chef that suggests meals based on people's emotions and available ingredients. Always provide 2–3 meal options with a detailed recipe for the top recommendation. Be warm and encouraging in your tone.",
          },
          {
            role: "user",
            content: `I'm feeling ${mood} and I have these ingredients available: ${ingredients}. Please suggest 2-3 meal options that would be perfect for my current mood and use the ingredients I have. Then provide a detailed, easy-to-follow recipe for your top recommendation. Format your response like this: 🍽️ PERFECT MEALS FOR YOU: [List 2-3 meal suggestions with brief descriptions] 👨‍🍳 FEATURED RECIPE: [Name of top recommendation] [Detailed step-by-step recipe] 💭 WHY THIS MEAL? [Brief explanation of why this meal matches their mood]`,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "OpenAI API error");
    }

    const data = await response.json();
    const suggestion = data.choices[0].message.content;

    res.json({ suggestion });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Sorry, something went wrong. Please try again.",
    });
  }
}
