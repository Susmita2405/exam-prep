// import pLimit from 'p-limit'; // Import p-limit
// import OpenAI from 'openai';

// const openai = new OpenAI({
//   baseURL: 'https://openrouter.ai/api/v1',
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const limit = pLimit(1); 

// async function generateNotes(text) {
//   try {
//     const response = await limit(() => openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "user",
//           content: `Generate notes on the text: ${text}. Give consise notes covering important points`,
//         },
//       ],
//       max_tokens: 100,
//     }));
//     return response.choices[0].message.content.trim();
//   } catch (error) {
//     console.error("Error generating question:", error);
//     throw error;
//   }
// }

// async function generateQuestion(topic) {
//   try {
//     const response = await limit(() => openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "user",
//           content: `Generate a multiple-choice question on ${topic}. Provide four options and indicate the correct answer.`,
//         },
//       ],
//       max_tokens: 100,
//     }));
//     return response.choices[0].message.content.trim();
//   } catch (error) {
//     console.error("Error generating question:", error);
//     throw error;
//   }
// }

// export default { generateQuestion };
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
          content: `Generate notes on the text: ${text}. Give concise notes covering important points`,
        },
      ],
      max_tokens: 100,
    }));
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating notes:", error);
    throw error;
  }
}

async function generateMCQQuestion(topic, classLevel) {
  try {
    const response = await limit(() => openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a multiple-choice question on ${topic} for class ${classLevel}. Provide four options and indicate the correct answer.`,
        },
      ],
      max_tokens: 200,
    }));
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating MCQ question:", error);
    throw error;
  }
}

async function generateShortQuestion(topic) {
  try {
    const response = await limit(() => openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a short answer question on ${topic} that can be answered in 1-3 sentences. Also provide the correct answer.`,
        },
      ],
      max_tokens: 200,
    }));
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating short question:", error);
    throw error;
  }
}

async function generateLongQuestion(topic) {
  try {
    const response = await limit(() => openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a long answer question on ${topic} that requires a detailed explanation. Also provide a model answer.`,
        },
      ],
      max_tokens: 400,
    }));
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating long question:", error);
    throw error;
  }
}

async function generateMultipleMCQs(topic, count = 10) {
  try {
    const response = await limit(() => openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate ${count} multiple-choice questions on ${topic}. For each question, provide four options labeled A, B, C, D and indicate the correct answer at the end of each question. Format each question as: "Question: [question text]\nA. [option A]\nB. [option B]\nC. [option C]\nD. [option D]\nCorrect Answer: [letter]"`,
        },
      ],
      max_tokens: 1500,
    }));
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating multiple MCQs:", error);
    throw error;
  }
}

async function generateMultipleShortQuestions(topic, count = 10) {
  try {
    const response = await limit(() => openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate ${count} short answer questions on ${topic}. For each question, also provide the correct answer. Format as: "Question: [question text]\nAnswer: [answer text]"`,
        },
      ],
      max_tokens: 1500,
    }));
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating multiple short questions:", error);
    throw error;
  }
}

async function generateMultipleLongQuestions(topic, count = 10) {
  try {
    const response = await limit(() => openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate ${count} long answer questions on ${topic} that require detailed explanations. For each question, also provide a model answer. Format as: "Question: [question text]\nModel Answer: [answer text]"`,
        },
      ],
      max_tokens: 2000,
    }));
    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating multiple long questions:", error);
    throw error;
  }
}

export default { 
  generateNotes, 
  generateMCQQuestion, 
  generateShortQuestion, 
  generateLongQuestion,
  generateMultipleMCQs,
  generateMultipleShortQuestions,
  generateMultipleLongQuestions
};