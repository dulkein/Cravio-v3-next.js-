export default async function handler(req, res) {
  // CORS headers (Next.js handles this automatically in most cases)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mood, ingredients } = req.body;

    // Validate input
    if (!mood || !ingredients) {
      return res.status(400).json({
        error: "Please provide both mood and ingredients",
      });
    }

    // Check environment variable (Next.js loads .env.local automatically)
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not found in environment variables');
      return res.status(500).json({
        error: "Server configuration error",
      });
    }

    console.log('Making OpenAI API request...');

    // Make request to OpenAI (using built-in fetch)
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are Cravio, a friendly AI chef that suggests meals based on people's emotions and available ingredients. Always provide 2–3 meal options with a detailed recipe for the top recommendation. Be warm and encouraging in your tone.",
          },
          {
            role: "user",
            content: `I'm feeling ${mood} and I have these ingredients available: ${ingredients}. Please suggest 2-3 meal options that would be perfect for my current mood and use the ingredients I have. Then provide a detailed, easy-to-follow recipe for your top recommendation. Format your response like this:

🍽️ PERFECT MEALS FOR YOU:
[List 2-3 meal suggestions with brief descriptions]

👨‍🍳 FEATURED RECIPE: [Name of top recommendation]
[Detailed step-by-step recipe]

💭 WHY THIS MEAL?
[Brief explanation of why this meal matches their mood]`,
          },
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      if (response.status === 401) {
        return res.status(500).json({
          error: "API key authentication failed. Please check your OpenAI API key.",
        });
      }
      
      if (response.status === 429) {
        return res.status(500).json({
          error: "Rate limit exceeded. Please try again in a moment.",
        });
      }
      
      return res.status(500).json({
        error: "Failed to get meal suggestion. Please try again.",
      });
    }

    const data = await response.json();
    const suggestion = data.choices[0].message.content;

    console.log('Successfully generated meal suggestion');
    res.json({ suggestion });

  } catch (error) {
    console.error("Error in meal-suggestion:", error);
    res.status(500).json({
      error: "Something went wrong. Please try again.",
    });
  }
}
