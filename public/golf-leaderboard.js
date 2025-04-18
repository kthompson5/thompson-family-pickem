const leaderboard = [
  {
    player: "Ben",
    netScore: -9,
    bonuses: ["🏆", "🐦"],
    golfers: ["Scheffler", "McIlroy", "Homa"]
  },
  {
    player: "Rory",
    netScore: -7,
    bonuses: ["😴"],
    golfers: ["Fleetwood", "Clark", "Lowry"]
  },
  {
    player: "Olivia",
    netScore: -4,
    bonuses: [],
    golfers: ["Spieth", "Rahm", "Hovland"]
  }
];

const tableBody = document.querySelector("#golfLeaderboard tbody");

leaderboard.forEach((entry, i) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${i + 1}</td>
    <td>${entry.player}</td>
    <td class="highlight-net">${entry.netScore > 0 ? "+" : ""}${entry.netScore}</td>
    <td>${entry.bonuses.join(" ") || "-"}</td>
    <td>${entry.golfers[0]}</td>
    <td>${entry.golfers[1]}</td>
    <td>${entry.golfers[2]}</td>
  `;
  tableBody.appendChild(row);
});
