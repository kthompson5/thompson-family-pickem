const games = [
  { id: "game1", away: "Harbor Beach", home: "Hudson", date: "Nov 28", time: "8:30 AM", leftPercent: 50 },
  { id: "game2", away: "Ole Miss", home: "Mississippi State", date: "Nov 28", time: "11:00 AM", leftPercent: 60 },
  { id: "game3", away: "Utah", home: "Kansas", date: "Nov 28", time: "11:00 AM", leftPercent: 65 },
  { id: "game4", away: "Unity Christian", home: "Divine Child", date: "Nov 28", time: "11:30 AM", leftPercent: 40 },
  { id: "game5", away: "Georgia", home: "Georgia Tech", date: "Nov 28", time: "2:30 PM", leftPercent: 67 },
  { id: "game6", away: "Kingsley", home: "Lumen Christi", date: "Nov 28", time: "3:00 PM", leftPercent: 35 },
  { id: "game7", away: "Orchard Lake St. Mary's", home: "Dexter", date: "Nov 28", time: "6:00 PM", leftPercent: 65 },
  { id: "game8", away: "Indiana", home: "Purdue", date: "Nov 28", time: "6:30 PM", leftPercent: 97 },
  { id: "game9", away: "Texas A&M", home: "Texas", date: "Nov 28", time: "6:30 PM", leftPercent: 55 },
  { id: "game10", away: "Arizona", home: "Arizona State", date: "Nov 28", time: "8:00 PM", leftPercent: 50 },
  { id: "game11", away: "Chandler", home: "Hamilton", date: "Nov 28", time: "8:00 PM", leftPercent: 40 },
  { id: "game12", away: "Liberty", home: "Basha", date: "Nov 28", time: "8:00 PM", leftPercent: 50 },
  // SATURDAY GAMES
  { id: "game13", away: "Ohio State", home: "Michigan", date: "Nov 29", time: "11:00 AM", leftPercent: 62 },
  { id: "game14", away: "Miami", home: "Pitt", date: "Nov 29", time: "11:00 AM", leftPercent: 58 },
  { id: "game15", away: "Oregon", home: "Washington", date: "Nov 29", time: "2:30 PM", leftPercent: 62 },
  { id: "game16", away: "LSU", home: "Oklahoma", date: "Nov 29", time: "2:30 PM", leftPercent: 35 },
  { id: "game17", away: "Vanderbilt", home: "Tennessee", date: "Nov 29", time: "2:30 PM", leftPercent: 45 },
  { id: "game18", away: "Florida State", home: "Florida", date: "Nov 29", time: "3:30 PM", leftPercent: 50 },
  { id: "game19", away: "Alabama", home: "Auburn", date: "Nov 29", time: "6:30 PM", leftPercent: 58 },
  { id: "game20", away: "Northwestern", home: "Illinois", date: "Nov 29", time: "6:30 PM", leftPercent: 45 },
  { id: "game21", away: "Notre Dame", home: "Stanford", date: "Nov 29", time: "9:30 PM", leftPercent: 97 },
  // SUNDAY GAMES
  { id: "game22", away: "Menominee", home: "Schoolcraft", date: "Nov 30", time: "8:30 AM", leftPercent: 50 },
  { id: "game23", away: "Mount Pleasant", home: "DeWitt", date: "Nov 30", time: "11:30 AM", leftPercent: 45 },
  { id: "game24", away: "Bears", home: "Eagles", date: "Nov 30", time: "12:00 PM", leftPercent: 40 },
  { id: "game25", away: "Texans", home: "Colts", date: "Nov 30", time: "12:00 PM", leftPercent: 45 },
  { id: "game26", away: "West Catholic", home: "Notre Dame Prep", date: "Nov 30", time: "3:00 PM", leftPercent: 60 },
  { id: "game27", away: "Vikings", home: "Seahawks", date: "Nov 30", time: "3:00 PM", leftPercent: 38 },
  { id: "game28", away: "Bills", home: "Steelers", date: "Nov 30", time: "3:25 PM", leftPercent: 50 },
  { id: "game28", away: "Catholic Central", home: "Cass Tech", date: "Nov 30", time: "6:00 PM", leftPercent: 50 },
  { id: "game28", away: "Broncos", home: "Commanders", date: "Nov 30", time: "7:20 PM", leftPercent: 55 },
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

showPopup("🍀 Good Luck! Your Picks are Saved!");

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

function showPopup(message) {
  document.getElementById("popup-message").textContent = message;
  document.getElementById("popup").style.display = "flex";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
