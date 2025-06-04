const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const strengthMeter = new Image();
strengthMeter.src = 'strength_meter.png';

const hammer = new Image();
hammer.src = 'hammer.png';

let angle = 0;
let direction = 1;
let swinging = true;
let animationId = null;

let currentPlayer = 1;
let player1Score = null;
let player2Score = null;

strengthMeter.onload = () => {
  draw();
};

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(strengthMeter, 60, 20, 180, 360);

  // Draw needle
  ctx.save();
  ctx.translate(canvas.width / 2, 370);
  ctx.rotate((angle - 90) * Math.PI / 180);
  ctx.fillStyle = 'black';
  ctx.fillRect(-2, -100, 4, 100);
  ctx.restore();

  // Decorative hammer
  ctx.drawImage(hammer, 10, 300, 60, 60);
}

function animate() {
  if (!swinging) return;
  angle += direction * 2;
  if (angle >= 180 || angle <= 0) {
    direction *= -1;
  }
  draw();
  animationId = requestAnimationFrame(animate);
}

function stopSwing() {
  if (!swinging) return;
  swinging = false;
  cancelAnimationFrame(animationId);

  const score = Math.max(0, Math.round(100 - Math.abs(90 - angle)));
  document.getElementById('score').textContent = `Player ${currentPlayer} Score: ${score}`;

  if (currentPlayer === 1) {
    player1Score = score;
    currentPlayer = 2;
    document.getElementById('turnInfo').textContent = "Player 2's Turn";
    setTimeout(() => {
      startNextTurn();
    }, 1500);
  } else {
    player2Score = score;
    showResult();
  }
}

function startNextTurn() {
  angle = 0;
  direction = 1;
  swinging = true;
  document.getElementById('score').textContent = "";
  animate();
}

function showResult() {
  const resultDiv = document.getElementById('score');
  let winnerText = "";
  if (player1Score > player2Score) {
    winnerText = "🏆 Player 1 Wins!";
  } else if (player2Score > player1Score) {
    winnerText = "🏆 Player 2 Wins!";
  } else {
    winnerText = "It's a Draw!";
  }

  document.getElementById('turnInfo').textContent = "Game Over";
  resultDiv.innerHTML = `
    Player 1 Score: ${player1Score}<br>
    Player 2 Score: ${player2Score}<br>
    <strong>${winnerText}</strong>
  `;
}

// Start the game
animate();
