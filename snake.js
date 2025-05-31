const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const grid = 20;
let count = 0;
let snake = [{ x: 160, y: 160 }];
let dx = grid;
let dy = 0;
let apple = { x: 320, y: 320 };
let maxCells = 4;
let score = 0;
const eatSound = new Audio('https://cdn.pixabay.com/audio/2022/10/16/audio_12b8fae1b7.mp3');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function drawSnakeCell(cell, idx) {
  ctx.save();
  ctx.shadowColor = "#6ee7b7";
  ctx.shadowBlur = 10;
  if (idx === 0) {
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(cell.x + grid/2, cell.y + grid/2, grid/2-2, 0, Math.PI*2);
    ctx.fill();
    // 눈
    ctx.fillStyle = '#222';
    let eyeOffsetX = dx === grid ? 4 : dx === -grid ? -4 : 0;
    let eyeOffsetY = dy === grid ? 4 : dy === -grid ? -4 : 0;
    ctx.beginPath();
    ctx.arc(cell.x + grid/2 + eyeOffsetX, cell.y + grid/2 + eyeOffsetY - 3, 2, 0, Math.PI*2);
    ctx.arc(cell.x + grid/2 + eyeOffsetX, cell.y + grid/2 + eyeOffsetY + 3, 2, 0, Math.PI*2);
    ctx.fill();
  } else {
    ctx.fillStyle = '#a7f3d0';
    ctx.beginPath();
    ctx.arc(cell.x + grid/2, cell.y + grid/2, grid/2-3, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (++count < 4) return;
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // 사과 먹음
  if (head.x === apple.x && head.y === apple.y) {
    maxCells++;
    score++;
    eatSound.currentTime = 0;
    eatSound.play();
    document.getElementById('score-value').textContent = score;
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;
  }

  if (snake.length > maxCells) snake.pop();

  // 사과 그리기
  ctx.save();
  ctx.shadowColor = "#fca5a5";
  ctx.shadowBlur = 12;
  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.arc(apple.x + grid/2, apple.y + grid/2, grid/2-2, 0, Math.PI*2);
  ctx.fill();
  ctx.restore();

  // 뱀 그리기
  snake.forEach(drawSnakeCell);

  // 자기 몸에 부딪힘
  snake.forEach((cell, idx) => {
    for (let i = idx + 1; i < snake.length; i++) {
      if (cell.x === snake[i].x && cell.y === snake[i].y) {
        restartGame();
      }
    }
  });

  // 벽에 부딪힘
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    restartGame();
  }
}

function restartGame() {
  snake = [{ x: 160, y: 160 }];
  dx = grid;
  dy = 0;
  maxCells = 4;
  score = 0;
  document.getElementById('score-value').textContent = score;
  apple.x = getRandomInt(0, 20) * grid;
  apple.y = getRandomInt(0, 20) * grid;
}

document.getElementById('restart').onclick = restartGame;

document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft' && dx === 0) { dx = -grid; dy = 0; }
  else if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -grid; }
  else if (e.key === 'ArrowRight' && dx === 0) { dx = grid; dy = 0; }
  else if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = grid; }
});

// 모바일 스와이프(간단)
let touchStartX, touchStartY;
canvas.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
});
canvas.addEventListener('touchend', e => {
  let dxTouch = e.changedTouches[0].clientX - touchStartX;
  let dyTouch = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dxTouch) > Math.abs(dyTouch)) {
    if (dxTouch > 0 && dx === 0) { dx = grid; dy = 0; }
    else if (dxTouch < 0 && dx === 0) { dx = -grid; dy = 0; }
  } else {
    if (dyTouch > 0 && dy === 0) { dx = 0; dy = grid; }
    else if (dyTouch < 0 && dy === 0) { dx = 0; dy = -grid; }
  }
});

gameLoop();
