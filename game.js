const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

const basket = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 60,
  width: 60,
  height: 60,
  speed: 7
};

let fruits = [];
let score = 0;
let fruitScores = {};
let gameInterval;
let basketImg = new Image();
basketImg.src = "assets/basket.png";

// Preload images and set rarity
const fruitImages = {
  apple:      { src: "assets/apple.png", points: 10, rarity: 2 },
  orange:     { src: "assets/orange.png", points: 15, rarity: 1.2 },
  grapes:     { src: "assets/grapes.png", points: 20, rarity: 1 },
  watermelon: { src: "assets/watermelon.png", points: 30, rarity: 1 },
  bomb:       { src: "assets/bomb.png", points: 0, type: "bomb", rarity: 0.75 },
  zombie:     { src: "assets/zombie.png", points: -10, type: "zombie", rarity: 0.75 }
};

const loadedImages = {};
for (let key in fruitImages) {
  const img = new Image();
  img.src = fruitImages[key].src;
  loadedImages[key] = img;
}

// Controls
let keys = {};

window.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Fruit spawner
function spawnFruit() {
  const choices = [];

  for (let type in fruitImages) {
    const rarity = fruitImages[type].rarity || 1;
    for (let i = 0; i < rarity * 10; i++) {
      choices.push(type);
    }
  }

  const randomType = choices[Math.floor(Math.random() * choices.length)];
  fruits.push({
    type: randomType,
    x: Math.random() * (canvas.width - 40),
    y: -40,
    width: 40,
    height: 40,
    speed: 2 + Math.random() * 1.5
  });
}

// Collision detection
function isColliding(fruit) {
  return (
    fruit.x < basket.x + basket.width &&
    fruit.x + fruit.width > basket.x &&
    fruit.y < basket.y + basket.height &&
    fruit.y + fruit.height > basket.y
  );
}

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move basket
  if (keys["ArrowLeft"] && basket.x > 0) basket.x -= basket.speed;
  if (keys["ArrowRight"] && basket.x + basket.width < canvas.width) basket.x += basket.speed;

  // Basket
  if (basketImg.complete && basketImg.naturalHeight !== 0) {
    ctx.drawImage(basketImg, basket.x, basket.y, basket.width, basket.height);
  }

  // Fruits
  fruits.forEach((fruit, index) => {
    fruit.y += fruit.speed;

    const img = loadedImages[fruit.type];
    if (img && img.complete && img.naturalHeight !== 0) {
      ctx.drawImage(img, fruit.x, fruit.y, fruit.width, fruit.height);
    }

    if (isColliding(fruit)) {
      const fruitData = fruitImages[fruit.type];
      if (fruitData.type === "bomb") {
        endGame();
        return;
      } else {
        const points = fruitData.points || 0;
        score += points;
        fruitScores[fruit.type] = (fruitScores[fruit.type] || 0) + points;
        fruits.splice(index, 1);
      }
    }

    // Remove off-screen fruits
    if (fruit.y > canvas.height) {
      fruits.splice(index, 1);
    }
  });

  // Draw score
  ctx.fillStyle = "#000";
  ctx.font = "18px Arial";
  ctx.fillText("Score: " + score, 10, 20);
}

// Game control
function gameLoop() {
  draw();
}

function startGame() {
  gameInterval = setInterval(gameLoop, 1000 / 60);
  setInterval(spawnFruit, 600);
}

function endGame() {
  clearInterval(gameInterval);
  localStorage.setItem("totalScore", score);
  localStorage.setItem("fruitScores", JSON.stringify(fruitScores));
  window.location.href = "score.html";
}

startGame();
