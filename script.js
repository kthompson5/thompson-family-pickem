function submitPicks() {
  const player = document.getElementById('player').value;
  const password = document.getElementById('password').value;
  const picks = document.getElementById('picksInput').value;

  try {
    const parsed = JSON.parse(picks);
    fetch('/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player, gamePicks: parsed, password })
    })
    .then(res => res.json())
    .then(data => alert(data.message))
    .catch(err => alert('Error submitting picks'));
  } catch (e) {
    alert('Invalid JSON format for picks');
  }
}

function loadLeaderboard() {
  fetch('/leaderboard')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('leaderboard');
      list.innerHTML = '';
      data.forEach(({ player, score }) => {
        const li = document.createElement('li');
        li.textContent = `${player}: ${score} pts`;
        list.appendChild(li);
      });
    });
}
