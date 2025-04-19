function submitGolfPicks() {
  const player = document.getElementById("player").value.trim();
  const tiebreaker = document.getElementById("tiebreaker").value;
  const picks = [
    document.getElementById("golfer1").value,
    document.getElementById("golfer2").value,
    document.getElementById("golfer3").value,
    document.getElementById("golfer4").value
  ];

  if (!player || picks.includes("") || !tiebreaker) {
    document.getElementById("status").textContent = "Please complete all fields.";
    return;
  }

  fetch("/submit-golf-picks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      player,
      tiebreaker,
      golfers: picks,
      password: "goirish"
    })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("status").textContent = data.message;
    })
    .catch(err => {
      console.error("Error submitting golf picks:", err);
      document.getElementById("status").textContent = "Something went wrong!";
    });
}

