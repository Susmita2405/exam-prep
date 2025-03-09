const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


async function generateQuestion(topic) {
  const response = await openai.completions.create({
    model: "gpt-3.5-turbo-instruct", 
    prompt: `Generate a multiple-choice question on ${topic}. Provide four options and indicate the correct answer.`,
    max_tokens: 100,
  });
  return response.choices[0].text.trim();
}

module.exports = { generateQuestion };