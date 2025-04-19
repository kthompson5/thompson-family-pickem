const apiKey = "10edd05ababaff9ad4db9f204f91b190";
const sports = [
  { name: "NFL", key: "americanfootball_nfl" },
  { name: "NBA", key: "basketball_nba" },
  { name: "MLB", key: "baseball_mlb" },
  { name: "CFB", key: "americanfootball_ncaaf" },
  { name: "Golf", key: "golf" }
];

async function fetchOdds(sportKey) {
  const url = `https://api.the-odds-api.com/v4/sports/${sportKey}/odds/?regions=us&markets=h2h&oddsFormat=american&apiKey=${apiKey}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch odds for ${sportKey}`);
  return await response.json();
}

function createGameHTML(game) {
  const home = game.home_team;
  const away = game.away_team;
  const bookmaker = game.bookmakers[0];
  if (!bookmaker || !bookmaker.markets[0]) return "";

  const outcomes = bookmaker.markets[0].outcomes;
  const homeOdds = outcomes.find(o => o.name === home)?.price ?? "-";
  const awayOdds = outcomes.find(o => o.name === away)?.price ?? "-";

  return `
    <div class="game-odds-row">
      <strong>${away}</strong> (${awayOdds}) @ <strong>${home}</strong> (${homeOdds})
    </div>
  `;
}

async function loadOdds() {
  for (const sport of sports) {
    try {
      const data = await fetchOdds(sport.key);
      const section = document.getElementById(`odds-${sport.name.toLowerCase()}`);
      section.innerHTML = data.map(createGameHTML).join("") || "<p>No games found.</p>";
    } catch (err) {
      console.error(`Error loading odds for ${sport.name}:`, err);
      const section = document.getElementById(`odds-${sport.name.toLowerCase()}`);
      section.innerHTML = "<p>Error loading odds.</p>";
    }
  }
}

window.onload = loadOdds;
