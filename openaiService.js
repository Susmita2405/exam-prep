import pLimit from 'p-limit'; // Import p-limit
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENAI_API_KEY,
});

const limit = pLimit(1); 

async function generateNotes(text) {
  try {
    const response = await limit(() => openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate notes on the text: ${text}. Give consise notes covering important points`,
        },
      ],
      max_tokens: 100,
    }));
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating question:", error);
    throw error;
  }
}

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
    console.error("Error generating question:", error);
    throw error;
  }
}

export default { generateQuestion };