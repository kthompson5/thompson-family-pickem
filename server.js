const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;
const PICKEM_PASSWORD = process.env.PICKEM_PASSWORD || 'goirish';
const ODDS_API_KEY = "10edd05ababaff9ad4db9f204f91b190";

let picks = {};
let results = {};
let golfPicks = {};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ✅ Route: Submit regular picks
app.post('/submit', (req, res) => {
  const { player, picks: playerPicks, password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });
  picks[player] = playerPicks;
  res.json({ message: 'Picks saved!' });
});

// ✅ Route: Submit results
app.post('/results', (req, res) => {
  const { results: submittedResults, password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });
  results = submittedResults;
  res.json({ message: 'Results submitted!' });
});

// ✅ Route: Submit golf picks (legacy)
app.post('/golf-submit', (req, res) => {
  const { player, golfer1, golfer2, golfer3, tiebreaker, password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });
  golfPicks[player] = {
    golfers: [golfer1, golfer2, golfer3],
    tiebreaker
  };
  res.json({ message: 'Golf picks submitted!' });
});

// ✅ Route: Submit golf picks (JSON method)
app.post('/submit-golf-picks', (req, res) => {
  const { player, password, golfers, tiebreaker } = req.body;
  if (password !== PICKEM_PASSWORD) {
    return res.json({ message: 'Incorrect password.' });
  }
  if (!player || !Array.isArray(golfers) || golfers.length < 3 || !tiebreaker) {
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

// ✅ Route: Leaderboard
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

// ✅ Route: Clear one player's picks
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

// ✅ Route: Clear all picks
app.post('/clear-all', (req, res) => {
  const { password } = req.body;
  if (password !== PICKEM_PASSWORD) return res.status(403).json({ message: 'Invalid password' });
  picks = {};
  res.json({ message: 'All picks cleared.' });
});

// ✅ Route: Get odds from The Odds API
app.get('/api/odds', async (req, res) => {
  const sport = req.query.sport || 'americanfootball_nfl';
  const url = `https://api.the-odds-api.com/v4/sports/${sport}/odds/?regions=us&markets=h2h&oddsFormat=american&apiKey=${ODDS_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Error fetching odds:", err);
    res.status(500).json({ error: "Failed to fetch odds" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

