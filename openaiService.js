const OpenAI = require("openai");
const pLimit = require('p-limit');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const limit = pLimit(1); 

async function generateQuestion(topic) {
  try {
    const response = await limit(() => openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a multiple-choice question on ${topic}. Provide four options and indicate the correct answer.`,
        },
      ],
      max_tokens: 100,
    }));
    return response.choices[0].message.content.trim();
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error("Rate limit exceeded. Please try again later.");
    } else {
      console.error("Error generating question:", error);
    }
    throw error;
  }
}

module.exports = { generateQuestion };