const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const generateRecipeDetails = async (recipeData) => {
  try {
    const prompt = `
      Generate detailed cooking instructions and calculate nutritional information (protein, calories, carbs, fat) for the following recipe.
      Recipe Data: ${JSON.stringify(recipeData)}
      
      Return ONLY valid JSON in the exact format below, with no markdown formatting or additional text:
      {
        "instructions": ["Step 1", "Step 2", ...],
        "nutrition": {
          "protein": number,
          "calories": number,
          "carbs": number,
          "fat": number
        }
      }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful assistant that returns only valid JSON responses without any markdown formatting or explanations.' 
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: "json_object" }, // Forces JSON response

      temperature: 0.1, // Lower temperature for more consistent formatting
    });

    let result = response.choices[0].message.content.trim();
    console.log('Raw OpenAI response:', result);

    // Clean up markdown code blocks if present
    if (result.startsWith('```json')) {
      result = result.replace(/```json\s*/, '').replace(/\s*```$/, '');
    } else if (result.startsWith('```')) {
      result = result.replace(/```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      return JSON.parse(result);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error(`OpenAI response is not valid JSON: ${result}`);
    }
  } catch (error) {
    console.error('OpenAI service error:', error);
    throw new Error(`Failed to generate recipe details: ${error.message}`);
  }
};

module.exports = { generateRecipeDetails };