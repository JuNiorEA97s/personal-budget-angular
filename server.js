const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/budget', (req, res) => {
    try {
        const json = fs.readFileSync(path.join(__dirname, 'budget.json'), 'utf8');
        res.json(JSON.parse(json));
    } catch (e) {
        res.status(500).json({ error: 'Failed to load budget data' });
    }
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`);
});
