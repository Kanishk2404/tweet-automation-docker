const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const ACCESS_CODE = "tweetmaster2025";

app.post('/auth', (req, res) => {
    const { password } = req.body;
    if (password === ACCESS_CODE) {
        res.json({ success: true, message: "access granted!" });
    } else {
        res.json({ success: false, message: "Invalid access code" });
    }
});

app.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Test server running on http://localhost:${PORT}`);
});
