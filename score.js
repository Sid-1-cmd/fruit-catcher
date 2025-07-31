// Retrieve score-related data from localStorage 
const playerName = localStorage.getItem('playerName') || 'Anonymous';
const totalScore = parseInt(localStorage.getItem('totalScore')) || 0;
const fruitScores = JSON.parse(localStorage.getItem('fruitScores')) || {};

// Create latest score entry
const latestEntry = {
  name: playerName,
  score: totalScore,
  timestamp: Date.now()  // To differentiate even if score is same
};

// Retrieve existing high scores
let highScores = JSON.parse(localStorage.getItem('highScores')) || [];

// Add latest entry
highScores.push(latestEntry);

// Remove duplicates based on name and score (ignore timestamp)
const uniqueMap = new Map();
for (let entry of highScores) {
  const key = `${entry.name}-${entry.score}`;
  if (!uniqueMap.has(key)) {
    uniqueMap.set(key, entry);
  }
}
highScores = Array.from(uniqueMap.values());

// Sort descending by score
highScores.sort((a, b) => b.score - a.score);

// Keep top 5
highScores = highScores.slice(0, 5);

// Determine which entry is the current player
highScores = highScores.map(entry => ({
  ...entry,
  isLatest: entry.name === playerName && entry.score === totalScore
}));

// Save updated leaderboard
localStorage.setItem('highScores', JSON.stringify(highScores));

// Display player's score breakdown
document.getElementById('playerStats').innerHTML = `
  <h2>Well Played, ${playerName}!</h2>
  <p><strong>Total Score:</strong> ${totalScore}</p>
  <h3>Points per Fruit:</h3>
  <ul>
    ${Object.entries(fruitScores).map(([fruit, points]) => `
      <li><strong>${fruit}</strong>: ${points} points</li>
    `).join('')}
  </ul>
`;

// Render leaderboard without Date column
const scoreTable = document.getElementById('scoreTable');
scoreTable.innerHTML = `
  <thead>
    <tr>
      <th>Rank</th>
      <th>Name</th>
      <th>Total Score</th>
    </tr>
  </thead>
  <tbody>
    ${highScores.map((entry, index) => `
      <tr${entry.isLatest ? ' class="latest-player"' : ''}>
        <td>${index + 1}</td>
        <td>${entry.isLatest ? 'You' : entry.name}</td>
        <td>${entry.score}</td>
      </tr>
    `).join('')}
  </tbody>
`;
