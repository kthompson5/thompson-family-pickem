const games = [
  { id: "game1", away: "Iowa State", home: "Kansas State", date: "Aug 23", time: "11:00 AM", leftPercent: 45 },
  { id: "game2", away: "Basha", home: "Brophy", date: "Aug 28", time: "5:00 PM", leftPercent: 55 },
  { id: "game3", away: "Nebraska", home: "Cincinnati", date: "Aug 28", time: "8:00 PM", leftPercent: 60 },
  { id: "game4", away: "Auburn", home: "Baylor", date: "Aug 29", time: "7:00 PM", leftPercent: 55 },
  { id: "game5", away: "Georgia Tech", home: "Colorado", date: "Aug 29", time: "7:00 PM", leftPercent: 57 },
  { id: "game6", away: "Central Michigan", home: "San Jose State", date: "Aug 29", time: "9:30 PM", leftPercent: 40 },
  { id: "game7", away: "Texas", home: "Ohio State", date: "Aug 30", time: "11:00 AM", leftPercent: 48 },
  { id: "game8", away: "Syracuse", home: "Tennessee", date: "Aug 30", time: "11:00 AM", leftPercent: 40 },
  { id: "game9", away: "Old Dominion", home: "Indiana", date: "Aug 30", time: "1:30 PM", leftPercent: 30 },
  { id: "game10", away: "Alabama", home: "Florida State", date: "Aug 30", time: "2:30 PM", leftPercent: 65 },
  { id: "game11", away: "LSU", home: "Clemson", date: "Aug 30", time: "6:30 PM", leftPercent: 48 },
  { id: "game12", away: "UTEP", home: "Utah State", date: "Aug 30", time: "6:30 PM", leftPercent: 45 },
  { id: "game13", away: "Cal", home: "Oregon State", date: "Aug 30", time: "9:30 PM", leftPercent: 49 },
  { id: "game14", away: "Virginia Tech", home: "South Carolina", date: "Aug 31", time: "2:00 PM", leftPercent: 38 },
  { id: "game15", away: "Notre Dame", home: "Miami", date: "Aug 31", time: "6:30 PM", leftPercent: 51 },
  { id: "game16", away: "TCU", home: "North Carolina", date: "Sept 1", time: "7:00 PM", leftPercent: 55 },
  // NFL GAMES
  { id: "game17", away: "Cowboys", home: "Eagles", date: "Sept 4", time: "7:20 PM", leftPercent: 38 },
  { id: "game18", away: "Chiefs", home: "Chargers", date: "Sept 5", time: "7:00 PM", leftPercent: 53 },
  { id: "game19", away: "Dolphins", home: "Colts", date: "Sept 7", time: "12:00 PM", leftPercent: 49 },
  { id: "game20", away: "Cardinals", home: "Saints", date: "Sept 7", time: "12:00 PM", leftPercent: 58 },
  { id: "game21", away: "Steelers", home: "Jets", date: "Sept 7", time: "12:00 PM", leftPercent: 53 },
  { id: "game22", away: "Panthers", home: "Jags", date: "Sept 7", time: "12:00 PM", leftPercent: 48 },
  { id: "game23", away: "Titans", home: "Broncos", date: "Sept 7", time: "3:05 PM", leftPercent: 40 },
  { id: "game24", away: "49ers", home: "Seahawks", date: "Sept 7", time: "3:05 PM", leftPercent: 51 },
  { id: "game25", away: "Lions", home: "Packers", date: "Sept 7", time: "3:25 PM", leftPercent: 47 },
  { id: "game26", away: "Texans", home: "Rams", date: "Sept 7", time: "3:25 PM", leftPercent: 45 },
  { id: "game27", away: "Ravens", home: "Bills", date: "Sept 7", time: "7:20 PM", leftPercent: 48 },
  { id: "game28", away: "Vikings", home: "Bears", date: "Sept 8", time: "7:15 PM", leftPercent: 49 },
];

window.onload = () => {
  const gamesDiv = document.getElementById("games");

  games.forEach(game => {
    const left = game.leftPercent;
    const right = 100 - left;

    const div = document.createElement("div");
    div.className = "game-card";

    div.innerHTML = `
  <div class="team-row" style="margin-bottom: 12px;">
    <div class="team-block">
      <img src="${logos[game.away]}" alt="${game.away}" />
      <div>${game.away}</div>
      <div class="percentage-text animate-on-scroll" data-percent="${left}">
        ${left}%
      </div>
    </div>
    <div>at</div>
    <div class="team-block">
      <img src="${logos[game.home]}" alt="${game.home}" />
      <div>${game.home}</div>
      <div class="percentage-text animate-on-scroll" data-percent="${right}">
        ${right}%
      </div>
    </div>
  </div>

  <div class="predictor-credit animate-on-scroll">
    Win % According to Thompson Sports Analytics
  </div>

  <div class="game-info" style="margin-bottom: 10px;">
    <strong>${game.date} – ${game.time}</strong>
  </div>

  <select id="${game.id}">
    <option value="">-- Select Winner --</option>
    <option value="${game.away}">${game.away}</option>
    <option value="${game.home}">${game.home}</option>
  </select>
`;

    gamesDiv.appendChild(div);
  });

  setupScrollAnimation();
};

// Animate percentages when they scroll into view
function setupScrollAnimation() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      } else {
        entry.target.classList.remove('visible');
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}

// Submit picks
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
