// routes/funding-helper.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/', async (req, res) => {
  const { answers } = req.body;

  // Validate input
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Missing or invalid answers in request body' });
  }

  const {
    amount = 'Not specified',
    purpose = 'Not specified',
    businessPlan = 'Not specified',
    pastFunding = 'Not specified',
    hasFinancials = 'Not specified',
    isRegistered = 'Not specified',
  } = answers;

  const prompt = `
Help this small business find suitable funding. Their details:
- Amount needed: ₹${amount}
- Purpose: ${purpose}
- Has business plan: ${businessPlan}
- Previous loan: ${pastFunding}
- Knows financials: ${hasFinancials}
- GST or Registration: ${isRegistered}

Suggest top 3 funding options in India (govt, private, NGO, or crowdfunding), why they are suitable, and what documents they need to apply.
`;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices[0]?.message?.content || 'No response from Groq';
    res.json({ reply });
  } catch (err) {
    console.error('Funding helper error:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get funding help' });
  }
});

module.exports = router;
