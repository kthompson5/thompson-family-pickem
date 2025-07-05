const games = [
  { id: "game1", away: "Phillies", home: "Cubs", date: "Aug 31", winChance: { away: 42, home: 58 } },
  { id: "game2", away: "Orioles", home: "Tigers", date: "Aug 31", winChance: { away: 64, home: 36 } },
  { id: "game3", away: "Mets", home: "Nationals", date: "Aug 31", winChance: { away: 55, home: 45 } },
  // Add the rest of your games with date + winChance %
];

window.onload = () => {
  const gamesDiv = document.getElementById("games");
  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "game-card";
    div.innerHTML = `
      <div class="game-date">${game.date}</div>
      <div class="team-row">
        <div class="team-block">
          <img src="${logos[game.away]}" alt="${game.away}" />
          <div>${game.away}</div>
        </div>
        <div class="win-circle" data-away="${game.winChance.away}" data-home="${game.winChance.home}">
          ${createWinCircle(game.winChance.away, game.winChance.home)}
        </div>
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

function createWinCircle(awayPercent, homePercent) {
  return `
    <svg class="circle-chart" viewBox="0 0 36 36">
      <path class="circle-chart-background" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
      <path class="circle-chart-foreground away" stroke-dasharray="${awayPercent},100"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
      <text x="18" y="20.35" class="circle-chart-text">${awayPercent}%</text>
    </svg>
    <svg class="circle-chart" viewBox="0 0 36 36">
      <path class="circle-chart-background" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
      <path class="circle-chart-foreground home" stroke-dasharray="${homePercent},100"
        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
      <text x="18" y="20.35" class="circle-chart-text">${homePercent}%</text>
    </svg>
  `;
}

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
