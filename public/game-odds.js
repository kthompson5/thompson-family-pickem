async function loadOddsForSport(sport, containerId) {
  try {
    const res = await fetch(`/api/odds?sport=${sport}`);
    const data = await res.json();

    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (!data || !Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p style='color:white;'>No data available.</p>";
      return;
    }

    data.forEach(event => {
      const matchDiv = document.createElement("div");
      matchDiv.style.padding = "10px 0";
      matchDiv.style.borderBottom = "1px solid #ccc";

      const team1 = event.bookmakers[0]?.markets[0]?.outcomes[0];
      const team2 = event.bookmakers[0]?.markets[0]?.outcomes[1];

      matchDiv.innerHTML = `
        <strong style="color:white;">${event.home_team} vs ${event.away_team}</strong><br>
        <span style="color:#9bd3f7;">${team1.name}: ${team1.price}</span><br>
        <span style="color:#9bd3f7;">${team2.name}: ${team2.price}</span>
      `;

      container.appendChild(matchDiv);
    });
  } catch (err) {
    console.error("Failed to load odds:", err);
    document.getElementById(containerId).innerHTML = "<p style='color:white;'>Error loading data</p>";
  }
}

window.onload = () => {
  loadOddsForSport('americanfootball_nfl', 'nfl-odds');
  loadOddsForSport('basketball_nba', 'nba-odds');
  loadOddsForSport('baseball_mlb', 'mlb-odds');
  loadOddsForSport('americanfootball_ncaaf', 'cfb-odds');
  loadOddsForSport('golf_pga_championship_winner', 'golf-odds'); // Change this to current tournament if needed
};
