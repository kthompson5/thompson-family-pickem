const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fetch = require('node-fetch'); // ✅ Use require here instead of import

const app = express();
const PORT = process.env.PORT || 3000;
const PICKEM_PASSWORD = process.env.PICKEM_PASSWORD || 'goirish';

let picks = {};
let results = {};
let golfPicks = {};

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Submit regular picks
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

// Submit golf picks (old method)
app.post('/golf-submit', (req, res) => {
  const { player, golfer1, golfer2, golfer3, tiebreaker, password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });

  golfPicks[player] = {
    golfers: [golfer1, golfer2, golfer3],
    tiebreaker
  };

  res.json({ message: 'Golf picks submitted!' });
});

// Submit golf picks (JSON file method)
app.post('/submit-golf-picks', (req, res) => {
  const { player, password, golfers, tiebreaker } = req.body;
  if (password !== PICKEM_PASSWORD) {
    return res.json({ message: 'Incorrect password.' });
  }

  if (!player || !Array.isArray(golfers) || golfers.length !== 3 || !tiebreaker) {
    return res.json({ message: 'Missing data. Please try again.' });
  }

  const file = './golf-picks.json';
  let data = {};

  if (fs.existsSync(file)) {
    const raw = fs.readFileSync(file);
    data = raw.length ? JSON.parse(raw) : {};
  }

  data[player] = {
    golfers,
    tiebreaker,
    timestamp: new Date().toISOString()
  };

  fs.writeFileSync(file, JSON.stringify(data, null, 2));
  res.json({ message: 'Golf picks submitted!' });
});

// Golf leaderboard API
app.get('/golf-api/players', async (req, res) => {
  try {
    const response = await fetch(`https://feeds.datagolf.com/preds/live-strokes-gained?sg=total&file_format=json&key=a6a414c8999b33f828a1bb5750cf`);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching DataGolf API:", error);
    res.status(500).json({ error: "Failed to fetch golfers" });
  }
});

// Leaderboard
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

