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

// 사운드 객체
const eatSound = new Audio('https://cdn.pixabay.com/audio/2022/10/16/audio_12b8fae1b7.mp3');

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function drawSnakeCell(cell, idx) {
  // 머리
  if (idx === 0) {
    ctx.fillStyle = '#34d399'; // 연두색 머리
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
    // 몸통
    ctx.fillStyle = '#6ee7b7';
    ctx.beginPath();
    ctx.arc(cell.x + grid/2, cell.y + grid/2, grid/2-3, 0, Math.PI*2);
    ctx.fill();
  }
}

function gameLoop() {
  requestAnimationFrame(gameLoop);
  if (++count < 4) return;
  count = 0;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 이동
  let head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  // 사과 먹음
  if (head.x === apple.x && head.y === apple.y) {
    maxCells++;
    score++;
    eatSound.currentTime = 0;
    eatSound.play();
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;
  }

  // 꼬리 자르기
  if (snake.length > maxCells) {
    snake.pop();
  }

  // 사과 그리기 (동글동글)
  ctx.fillStyle = '#f87171';
  ctx.beginPath();
  ctx.arc(apple.x + grid/2, apple.y + grid/2, grid/2-2, 0, Math.PI*2);
  ctx.fill();

  // 뱀 그리기 (머리/몸/눈)
  snake.forEach(drawSnakeCell);

  // 자기 몸에 부딪힘
  snake.forEach((cell, idx) => {
    for (let i = idx + 1; i < snake.length; i++) {
      if (cell.x === snake[i].x && cell.y === snake[i].y) {
        // 게임 오버
        snake = [{ x: 160, y: 160 }];
        dx = grid;
        dy = 0;
        maxCells = 4;
        score = 0;
        apple.x = getRandomInt(0, 20) * grid;
        apple.y = getRandomInt(0, 20) * grid;
      }
    }
  });

  // 벽에 부딪힘
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    snake = [{ x: 160, y: 160 }];
    dx = grid;
    dy = 0;
    maxCells = 4;
    score = 0;
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;
  }

  // 점수 표시 (Tailwind로 별도 div에 표시)
  document.getElementById('score').textContent = 'Score: ' + score;
}

document.addEventListener('keydown', function(e) {
  // 상하좌우 반대 방향으로는 이동 불가
  if (e.key === 'ArrowLeft' && dx === 0) {
    dx = -grid; dy = 0;
  } else if (e.key === 'ArrowUp' && dy === 0) {
    dx = 0; dy = -grid;
  } else if (e.key === 'ArrowRight' && dx === 0) {
    dx = grid; dy = 0;
  } else if (e.key === 'ArrowDown' && dy === 0) {
    dx = 0; dy = grid;
  }
});

gameLoop();
