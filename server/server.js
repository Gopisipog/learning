const express = require('express');
require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function getAIResponse(prompt, question, correctAnswer, promptInputAnswers) {
  const message = `
Given the question: "${question}"
The user has selected "${correctAnswer}" as the correct answer.
The user has also provided the following items as input for their request: ${promptInputAnswers.join(', ')}.
Now, please respond to the following request: "${prompt}"
    `;

  try {
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'pplx-7b-chat',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return {
      fullPrompt: message,
      aiResponse: response.data.choices[0].message.content,
    };
  } catch (error) {
    console.error('Error fetching AI response:', error);
    return {
      fullPrompt: message,
      aiResponse: 'Error generating AI response.',
    };
  }
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const response = await axios.post(
      'https://api.perplexity.ai/chat/completions',
      {
        model: 'pplx-7b-chat',
        messages: [{ role: 'user', content: message }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.post('/generate-report', async (req, res) => {
  const { question, correctAnswer, promptInputAnswers, selectedPrompts } = req.body;

  try {
    const aiResponseObjects = await Promise.all(
      selectedPrompts.map(prompt =>
        getAIResponse(prompt, question, correctAnswer, promptInputAnswers)
      )
    );

    const consolidatedReport = aiResponseObjects
      .map(
        (res) =>
          `**Full Prompt Sent to AI:**\n${res.fullPrompt}\n\n---\n\n**AI Response:**\n${res.aiResponse}`
      )
      .join('\n\n====================\n\n');

    res.json({ report: consolidatedReport });
  } catch (error) {
    console.error('Failed to generate report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});