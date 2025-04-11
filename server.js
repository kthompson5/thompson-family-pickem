const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PICKEM_PASSWORD = process.env.PICKEM_PASSWORD || 'goirish';

let picks = {};
let results = {};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/submit', (req, res) => {
  const { player, gamePicks, password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });
  picks[player] = gamePicks;
  return res.json({ message: 'Picks submitted!' });
});

app.get('/picks', (req, res) => {
  res.json(picks);
});

app.post('/results', (req, res) => {
  const { gameResults, password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });
  results = gameResults;
  return res.json({ message: 'Results submitted!' });
});

app.get('/leaderboard', (req, res) => {
  const leaderboard = Object.entries(picks).map(([player, playerPicks]) => {
    let score = 0;
    for (const [key, value] of Object.entries(playerPicks)) {
      if (results[key] && results[key] === value) {
        score++;
      }
    }
    return { player, score };
  });
  leaderboard.sort((a, b) => b.score - a.score);
  res.json(leaderboard);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
