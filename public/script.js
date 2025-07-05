// script.js

const games = [
  { id: "game1", away: "Phillies", home: "Cubs", date: "Aug 25", winPercent: { away: 45, home: 55 } },
  { id: "game2", away: "Orioles", home: "Tigers", date: "Aug 25", winPercent: { away: 52, home: 48 } },
  { id: "game3", away: "Mets", home: "Nationals", date: "Aug 25" } // No winPercent data
];

window.onload = () => {
  const gamesDiv = document.getElementById("games");
  games.forEach(game => {
    const div = document.createElement("div");
    div.className = "game-card";

    const awayLogo = logos[game.away] || "placeholder.png";
    const homeLogo = logos[game.home] || "placeholder.png";

    const predictionCircle = createPredictionCircle(game.winPercent, awayLogo, homeLogo);

    div.innerHTML = `
      <div class="game-header">
        <strong>${game.away} @ ${game.home}</strong>
        <div class="game-date">${game.date || ""}</div>
      </div>
      <div class="team-row">
        <div class="team-block">
          <img src="${awayLogo}" alt="${game.away}" />
          <div>${game.away}</div>
        </div>
        <div class="prediction-container">${predictionCircle}</div>
        <div class="team-block">
          <img src="${homeLogo}" alt="${game.home}" />
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

function createPredictionCircle(winPercent, awayLogo, homeLogo) {
  if (!winPercent) return "";

  return `
    <div class="prediction-circle">
      <div class="prediction-left">${winPercent.away}%</div>
      <div class="circle">
        <div class="circle-fill" style="--away:${winPercent.away}; --home:${winPercent.home};"></div>
        <div class="divider"></div>
        <img src="${awayLogo}" alt="Away" class="circle-logo left" />
        <img src="${homeLogo}" alt="Home" class="circle-logo right" />
      </div>
      <div class="prediction-right">${winPercent.home}%</div>
      <div class="prediction-source">According to Thompson Sports Analytics</div>
    </div>
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

  fetch("/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player, picks, password })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("status").textContent = data.message;
    });
}
