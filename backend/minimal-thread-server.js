const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint to confirm correct file is running
app.post('/test-alive', (req, res) => res.json({ ok: true }));

// Minimal /generate-thread endpoint for testing
app.post('/generate-thread', (req, res) => {
  const { prompt } = req.body;
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, message: 'Prompt is required to generate a thread.' });
  }
  // Return a mock thread for testing
  res.json({
    success: true,
    tweets: [
      `Tweet 1 about: ${prompt}`,
      `Tweet 2 about: ${prompt}`,
      `Tweet 3 about: ${prompt}`,
      `Tweet 4 about: ${prompt}`,
      `Tweet 5 about: ${prompt}`
    ]
  });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Minimal thread server running on http://localhost:${PORT}`);
});
