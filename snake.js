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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
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
    apple.x = getRandomInt(0, 20) * grid;
    apple.y = getRandomInt(0, 20) * grid;
  }

  // 꼬리 자르기
  if (snake.length > maxCells) {
    snake.pop();
  }

  // 사과 그리기
  ctx.fillStyle = 'red';
  ctx.fillRect(apple.x, apple.y, grid-2, grid-2);

  // 뱀 그리기
  ctx.fillStyle = 'lime';
  snake.forEach((cell, idx) => {
    ctx.fillRect(cell.x, cell.y, grid-2, grid-2);
    // 자기 몸에 부딪힘
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

  // 점수 표시
  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 10, 390);
}

document.addEventListener('keydown', function(e) {
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
