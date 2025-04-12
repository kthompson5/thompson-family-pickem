const games = [
  { id: "game1", away: "Tigers", home: "Yankees" },
  { id: "game2", away: "Dodgers", home: "Cubs" },
  { id: "game3", away: "Mets", home: "Phillies" },
  { id: "game4", away: "Red Sox", home: "Blue Jays" },
  { id: "game5", away: "Braves", home: "Marlins" },
  { id: "game6", away: "Astros", home: "Rangers" },
  { id: "game7", away: "Cardinals", home: "Pirates" },
  { id: "game8", away: "Giants", home: "Padres" },
  { id: "game9", away: "Brewers", home: "Nationals" },
  { id: "game10", away: "Rays", home: "Orioles" }
];

const logos = {
  "Tigers": "https://a.espncdn.com/i/teamlogos/mlb/500/det.png",
  "Yankees": "https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png",
  "Dodgers": "https://a.espncdn.com/i/teamlogos/mlb/500/lad.png",
  "Cubs": "https://a.espncdn.com/i/teamlogos/mlb/500/chc.png",
  "Mets": "https://a.espncdn.com/i/teamlogos/mlb/500/nym.png",
  "Phillies": "https://a.espncdn.com/i/teamlogos/mlb/500/phi.png",
  "Red Sox": "https://a.espncdn.com/i/teamlogos/mlb/500/bos.png",
  "Blue Jays": "https://a.espncdn.com/i/teamlogos/mlb/500/tor.png",
  "Braves": "https://a.espncdn.com/i/teamlogos/mlb/500/atl.png",
  "Marlins": "https://a.espncdn.com/i/teamlogos/mlb/500/mia.png",
  "Astros": "https://a.espncdn.com/i/teamlogos/mlb/500/hou.png",
  "Rangers": "https://a.espncdn.com/i/teamlogos/mlb/500/tex.png",
  "Cardinals": "https://a.espncdn.com/i/teamlogos/mlb/500/stl.png",
  "Pirates": "https://a.espncdn.com/i/teamlogos/mlb/500/pit.png",
  "Giants": "https://a.espncdn.com/i/teamlogos/mlb/500/sf.png",
  "Padres": "https://a.espncdn.com/i/teamlogos/mlb/500/sd.png",
  "Brewers": "https://a.espncdn.com/i/teamlogos/mlb/500/mil.png",
  "Nationals": "https://a.espncdn.com/i/teamlogos/mlb/500/wsh.png",
  "Rays": "https://a.espncdn.com/i/teamlogos/mlb/500/tb.png",
  "Orioles": "https://a.espncdn.com/i/teamlogos/mlb/500/bal.png"
};

window.onload = () => {
  const gamesDiv = document.getElementById("games");
  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "game-card";
    div.innerHTML = `
      <div class="team">
        <img src="${logos[game.away]}" alt="${game.away}" />
        ${game.away} @ 
        <img src="${logos[game.home]}" alt="${game.home}" />
        ${game.home}
      </div>
      <select id="${game.id}">
        <option value="">-- Select --</option>
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

function loadLeaderboard() {
  fetch('/leaderboard')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("leaderboard");
      list.innerHTML = '';
      data.forEach(({ player, score }) => {
        const li = document.createElement('li');
        li.textContent = `${player}: ${score} pts`;
        list.appendChild(li);
      });
    });
}
