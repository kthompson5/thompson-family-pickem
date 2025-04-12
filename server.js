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

// Submit picks
app.post('/submit', (req, res) => {
  const { player, picks: playerPicks, password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });
  picks[player] = playerPicks;
  res.json({ message: 'Picks saved!' });
});

// Submit results
app.post('/results', (req, res) => {
  const { results: submittedResults, password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });
  results = submittedResults;
  res.json({ message: 'Results submitted!' });
});

// Get leaderboard
app.get('/leaderboard', (req, res) => {
  const leaderboard = Object.entries(picks).map(([player, playerPicks]) => {
    let score = 0;
    for (const [game, selected] of Object.entries(playerPicks)) {
      if (results[game] && results[game] === selected) {
        score++;
      }
    }
    return { player, score };
  });
  leaderboard.sort((a, b) => b.score - a.score);
  res.json(leaderboard);
});

// Clear one player's picks
app.post('/clear-player', (req, res) => {
  const { player, password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });
  if (picks[player]) {
    delete picks[player];
    res.json({ message: `${player}'s picks cleared.` });
  } else {
    res.json({ message: `${player} had no picks.` });
  }
});

// Clear all picks
app.post('/clear-all', (req, res) => {
  const { password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });
  picks = {};
  res.json({ message: 'All picks cleared.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
