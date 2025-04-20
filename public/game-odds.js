async function loadOddsForSport(sport, containerId, markets = ['h2h']) {
  try {
    const query = `/api/odds?sport=${sport}&markets=${markets.join(',')}`;
    const res = await fetch(query);
    const data = await res.json();

    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (!data || !Array.isArray(data) || data.length === 0) {
      container.innerHTML = "<p style='color:white;'>No data available.</p>";
      return;
    }

    data.forEach(event => {
      const matchDiv = document.createElement("div");
      matchDiv.className = "matchup";

      const title = `<strong>${event.home_team} vs ${event.away_team}</strong>`;
      let lines = "";

      markets.forEach(market => {
        const marketData = event.bookmakers?.[0]?.markets?.find(m => m.key === market);
        if (marketData) {
          const boxClass = market === 'h2h' ? 'box-h2h'
                         : market === 'spreads' ? 'box-spread'
                         : 'box-outright';

          marketData.outcomes.forEach(outcome => {
            const price = outcome.price > 0 ? `+${outcome.price}` : outcome.price;
            const label = market === 'spreads' && outcome.point !== null
              ? `${outcome.name} (${outcome.point})`
              : outcome.name;
            lines += `<span class="odds-box ${boxClass}">${label}: ${price}</span>`;
          });
        }
      });

      matchDiv.innerHTML = title + "<br>" + lines;
      container.appendChild(matchDiv);
    });

  } catch (err) {
    console.error("Failed to load odds:", err);
    document.getElementById(containerId).innerHTML = "<p style='color:white;'>Error loading data.</p>";
  }
}

window.onload = () => {
  loadOddsForSport('basketball_nba', 'nba-odds', ['h2h', 'spreads']);
  loadOddsForSport('baseball_mlb', 'mlb-odds', ['h2h', 'spreads']);
  loadOddsForSport('americanfootball_ncaaf', 'cfb-odds', ['h2h', 'spreads']);
  loadOddsForSport('americanfootball_nfl', 'nfl-odds', ['outrights']);
  loadOddsForSport('golf_pga_championship', 'golf-odds', ['outrights']);
};
