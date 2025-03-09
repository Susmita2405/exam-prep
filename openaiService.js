const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

async function generateQuestion(topic) {
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: Generate a multiple-choice question on ${topic}. Provide four options and indicate the correct answer.,
        max_tokens: 100,
    });
    return response.data.choices[0].text.trim();
}

module.exports = { generateQuestion };