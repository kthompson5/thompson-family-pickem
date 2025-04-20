const games = [
  // ✅ MLB Games – April 25
  { id: "game1", away: "Phillies", home: "Cubs" },
  { id: "game2", away: "Orioles", home: "Tigers" },
  { id: "game3", away: "Mets", home: "Nationals" },
  { id: "game4", away: "Blue Jays", home: "Yankees" },
  { id: "game5", away: "Red Sox", home: "Guardians" },
  { id: "game6", away: "Astros", home: "Royals" },
  { id: "game7", away: "Angels", home: "Twins" },
  { id: "game8", away: "Brewers", home: "Cardinals" },
  { id: "game9", away: "Reds", home: "Rockies" },
  { id: "game10", away: "Rays", home: "Padres" },
  { id: "game11", away: "Marlins", home: "Mariners" },
  { id: "game12", away: "Braves", home: "Diamondbacks" },
  { id: "game13", away: "White Sox", home: "Athletics" },
  { id: "game14", away: "Pirates", home: "Dodgers" },
  { id: "game15", away: "Rangers", home: "Giants" },

  // ✅ NBA Playoff Games – April 25
  { id: "game16", away: "Celtics", home: "Magic" },
  { id: "game17", away: "Pacers", home: "Bucks" },
  { id: "game18", away: "Lakers", home: "Timberwolves" },

  // ✅ NBA Playoff Games – April 26
  { id: "game19", away: "Rockets", home: "Warriors" },
  { id: "game20", away: "Cavaliers", home: "Heat" },
  { id: "game21", away: "Thunder", home: "Grizzlies" },
  { id: "game22", away: "Nuggets", home: "Clippers" },
  { id: "game23", away: "Knicks", home: "Pistons" }
];

window.onload = () => {
  const gamesDiv = document.getElementById("games");
  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "game-card";
    div.innerHTML = `
      <div class="team-row">
        <div class="team-block">
          <img src="${logos[game.away]}" alt="${game.away}" />
          <div>${game.away}</div>
        </div>
        <div>vs</div>
        <div class="team-block">
          <img src="${logos[game.home]}" alt="${game.home}" />
          <div>${game.home}</div>
        </div>
      </div>
      <select id="${game.id}">
        <option value="">-- Select Winner --</option>
        <option value="${game.away}">${game.away}</option>
        <option value="${game.home}">${game.home}</option>
      </select>
    `;
    gamesDiv.appendChild(div);
  });
};

function submitPicks() {
  const player = document.getElementById("player").value.trim();
  const password = document.getElementById("password").value.trim();
  if (!player || !password) {
    alert("Enter name and password");
    return;
  }

  const picks = {};
  games.forEach(game => {
    const choice = document.getElementById(game.id).value;
    if (choice) picks[`${game.away}@${game.home}`] = choice;
  });

  fetch('/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ player, picks, password })
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById("status").textContent = data.message;
  });
}

