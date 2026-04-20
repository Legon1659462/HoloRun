let character = document.getElementById('character');
let ground = document.getElementById('ground');
let displayScore = document.getElementById('score');

let highscore = localStorage.getItem('highscore') || 0;
const highscoreDisplay = document.getElementById('highscore-display');
highscoreDisplay.innerText = `Mejor puntuación: ${highscore}`;

const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');

let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
let groundHeight = parseInt(window.getComputedStyle(ground).getPropertyValue('height'));

let isJumping = false;
let score = 0;
let scoreInterval; // guardamos el intervalo del score

function jump() {
  if (isJumping) return;
  isJumping = true;

  let upTime = setInterval(() => {
    if (characterBottom >= groundHeight + 250) {
      clearInterval(upTime);

      let downTime = setInterval(() => {
        if (characterBottom <= groundHeight + 10) {
          clearInterval(downTime);
          isJumping = false;
        }
        characterBottom -= 10;
        character.style.bottom = characterBottom + 'px';
      }, 20);
    }
    characterBottom += 10;
    character.style.bottom = characterBottom + 'px';
  }, 20);
}

function showScore() {
  score++;
  displayScore.innerText = score;
}

// Obstáculos
function generateObstacle() {
  const obstacles = document.querySelector('.obstacles');
  let obstacle = document.createElement('div');
  obstacle.setAttribute('class', 'obstacle');
  obstacles.appendChild(obstacle);

  let obstacleRight = 0;
  let obstacleBottom = 100;
  let obstacleWidth = 30;
  let obstacleHeight = Math.floor(Math.random() * 50) + 50;

  

  function gameOver() {
    if (score > highscore) {
  highscore = score;
  localStorage.setItem('highscore', highscore);
}



    document.body.innerHTML = `
      <div style="text-align:center; margin-top:100px; font-family:sans-serif;">
        <h1>Game Over</h1>
        <p>Tu puntuación fue: <strong>${score}</strong></p>
        <button onclick="location.reload()" style="padding:10px 20px; font-size:16px;">Reiniciar</button>
      </div>
    `;
  }

  function moveObstacle() {
    obstacleRight += 5;
    obstacle.style.right = obstacleRight + 'px';

    let characterRect = character.getBoundingClientRect();
    let obstacleRect = obstacle.getBoundingClientRect();

    // Detección de colisión
    if (
      characterRect.left < obstacleRect.right &&
      characterRect.right > obstacleRect.left &&
      characterRect.bottom > obstacleRect.top &&
      characterRect.top < obstacleRect.bottom
    ) {
      gameOver();
    }

    if (obstacleRight < window.innerWidth) {
      requestAnimationFrame(moveObstacle);
    } else {
      obstacle.remove();
    }
  }

  requestAnimationFrame(moveObstacle);

  let randomTimeout = Math.floor(Math.random() * 2000) + 1000;
  setTimeout(generateObstacle, randomTimeout);
}

// Controles
function control(e) {
  if (e.key === 'ArrowUp' || e.key === ' ') {
    jump();
  }
}
document.addEventListener('keydown', control);

// -------------------- INICIO DEL JUEGO --------------------
startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  gameContainer.style.display = 'block';

  // Intenta reproducir la música sin bloquear el resto
  const music = document.getElementById('game-music');
  try {
    music.play();
    music.volume = 0.5; // Ajusta el volumen si es necesario

  } catch (error) {
    console.warn("No se pudo reproducir la música automáticamente:", error);
  }

  // Inicia puntuación y obstáculos
  scoreInterval = setInterval(showScore, 100);
  generateObstacle();
});




