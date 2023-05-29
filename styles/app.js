const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
//getContext() method會回傳一個canvas的drawing context
//drawing context可以用來在cancas內畫圖
const unit = 20;
const row = canvas.height / unit; // 320 / 20 = 16
const col = canvas.width / unit;

let snake = []; //array中每個元素，都是一個物件
//物件的工作是，儲存身體的x，y座標
function createSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * col) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }
  pickALocation() {
    let overlapping = false; //重疊 果實and蛇
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          console.log("overlapping...");
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * col) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);
    this.x = new_x;
    this.y = new_y;
  }
}
//初始設定
createSnake();
let myFruit = new Fruit();
window.addEventListener("keydown", changeDirection);
let d = "Right"; //方向
function changeDirection(e) {
  if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  } else if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  }

  // 每次按下上下左右鍵之後，在下一幀被畫出來之前，
  // 不接受任何keydown事件
  // 這樣可以防止連續按鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

let score = 0;
let highestScore;
loadHighestScore();
document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
function draw() {
  //每次畫圖之前確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("Game Over");
      return;
    }
  }
  //因為canvas會不斷覆蓋，所以每次更新要把背景設全黑
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  myFruit.drawFruit();

  //畫出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen"; //ctx.fillStyle 長方形要填滿的顏色
    } else {
      ctx.fillStyle = "lightblue";
    }

    ctx.strokeStyle = "white"; //ctx.strokeStyle 長方形邊框顏色

    if (snake[0].x >= canvas.width) {
      snake[0].x = 0;
    }
    if (snake[0].x < 0) {
      snake[0].x = canvas.width - unit;
    }
    if (snake[0].y >= canvas.height) {
      snake[0].y = 0;
    }
    if (snake[0].y < 0) {
      snake[0].y = canvas.height - unit;
    }

    //x,y,width,height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit); //要畫長方形內容
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit); //要畫長方形邊框內容
  }

  //目前d變數方向，來決定蛇頭的下一禎座標
  let snakeHeadX = snake[0].x; //snake[0]是一個物件，但snake[0].x是個number
  let snakeHeadY = snake[0].y;
  if (d == "Left") {
    snakeHeadX -= unit;
  } else if (d == "Up") {
    snakeHeadY -= unit;
  } else if (d == "Right") {
    snakeHeadX += unit;
  } else if (d == "Down") {
    snakeHeadY += unit;
  }

  let newHead = {
    x: snakeHeadX,
    y: snakeHeadY,
  };

  if (myFruit.x == snake[0].x && myFruit.y == snake[0].y) {
    myFruit.pickALocation();
    // myFruit.drawFruit();
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數:" + score;
    document.getElementById("myScore2").innerHTML = "最高分數:" + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  //確認蛇是否吃到果實
  window.addEventListener("keydown", changeDirection);
}

let myGame = setInterval(draw, 100);

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
