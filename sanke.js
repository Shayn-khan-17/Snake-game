const gameBox = document.getElementById("game-box");
const currentScore = document.getElementById("score");
const highScoreDisplay = document.querySelector(".high");
const finalScore = document.querySelector(".final-score");
const gameOverScreen = document.querySelector(".game-over");
const restartBtn = document.querySelector(".reset-btn");

let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0;  // Fix: ensure it's a number
let snake = [{ x: 5, y: 5 }];
let dx = 1;
let dy = 0;
const boxSize = 20;
const gridSize = 19;
let foodX, foodY;
let gameLoop = null;

highScoreDisplay.textContent = "High: " + highScore;

function drawSnake() {
    document.querySelectorAll(".shead").forEach(e => e.remove());

    snake.forEach((segment) => {
        const part = document.createElement("div");
        part.classList.add("shead");
        part.style.left = `${segment.x * boxSize}px`;
        part.style.top = `${segment.y * boxSize}px`;
        gameBox.appendChild(part);
    });
}

function drawFood() {
    const oldFood = document.querySelector(".food");
    if (oldFood) oldFood.remove();

    foodX = Math.floor(Math.random() * gridSize);
    foodY = Math.floor(Math.random() * gridSize);

    const food = document.createElement("div");
    food.classList.add("food");
    food.style.left = `${foodX * boxSize}px`;
    food.style.top = `${foodY * boxSize}px`;
    gameBox.appendChild(food);
}

function eatFood() {
    const head = snake[0];
    if (head.x === foodX && head.y === foodY) {
        score += 10;
        currentScore.textContent = "Score: " + score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreDisplay.textContent = "High: " + highScore;
        }
        drawFood();
        return true;
    }
    return false;
}

function checkWallCollision(head) {
    return head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize;
}

function checkSelfCollision(head) {
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function gameOver() {
    clearInterval(gameLoop);
    finalScore.textContent = "Score: " + score;
    gameOverScreen.classList.add("active");
}

function updateGame() {
    if (dx === 0 && dy === 0) return; // Prevent movement when game hasn't started

    const newHead = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    };

    if (checkWallCollision(newHead) || checkSelfCollision(newHead)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);

    if (!eatFood()) {
        snake.pop();
    }

    drawSnake();
}

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && dy !== 1) {
        dx = 0;
        dy = -1;
    } else if (e.key === "ArrowDown" && dy !== -1) {
        dx = 0;
        dy = 1;
    } else if (e.key === "ArrowLeft" && dx !== 1) {
        dx = -1;
        dy = 0;
    } else if (e.key === "ArrowRight" && dx !== -1) {
        dx = 1;
        dy = 0;
    }
});

restartBtn.addEventListener("click", () => {
    // Reset game state
    snake = [{ x: 5, y: 5 }];
    dx = 1;
    dy = 0;
    score = 0;
    currentScore.textContent = "Score: 0";
    finalScore.textContent = "Score: 0";
    gameOverScreen.classList.remove("active");
    drawSnake();
    drawFood();
    clearInterval(gameLoop);
    gameLoop = setInterval(updateGame, 200);
});

// Start game
drawSnake();
drawFood();
gameLoop = setInterval(updateGame, 200);
