var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballURL = "./assets/coinbase.png";

var sealHeight = 75;
var frameBottomY = canvas.height - 30;
var x = canvas.width / 2;
var y = frameBottomY - sealHeight - 50;

var speed = 2;

var dx = speed;
var dy = -speed;

var ballRadius = 50;
var paddleHeight = 100;
var paddleWidth = 100;
var paddleX = (canvas.width - paddleWidth) / 2;
var rightPressed = false;
var leftPressed = false;
var score = 0;
var lives = 1;
var modeColor = "row";

var failure = document.querySelector(".failure");
var failureBtn = document.querySelector("#failureBtn");
var success = document.querySelector(".success");
var successBtn = document.querySelector("#successBtn");

function reloadPage() {
  document.location.reload();
}
function resetValues(element) {
  ballRadius = 0;
  lives = 0;
  score = 0;
  paddleWidth = 0;
  element.style.top = "40%";
}

//reloads page OnClick
failureBtn.addEventListener("click", () => {
  reloadPage();
});

successBtn.addEventListener("click", () => {
  reloadPage();
});

// function drawImg() {
//   let img = new Image();
//   img.src = './assets/coinbase.png';
//   ctx.drawImage(img);
// }

function drawBall() {
  ctx.beginPath();
  let img = new Image();
  img.src = ballURL;
  ctx.drawImage(img, x, y, ballRadius, ballRadius);
  // ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  // ctx.fillStyle = "#FFFF00";
  // ctx.fillStyle = utilsColor(c,r, "random"); // To make the ball random colours.
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  let img = new Image();
  img.src = "./assets/arjaverse.png";
  // ctx.drawImage(
  //   img,
  //   paddleX,
  //   canvas.height - paddleHeight,
  //   paddleWidth,
  //   paddleHeight
  // );
  ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "pink";
  ctx.fill();
  ctx.closePath();
}

function drawScore() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Score: " + score, 8, 20);
}

var sideCollision = false;
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();
  // drawImg();
  drawPaddle();
  drawScore();
  const nextBallY = y + dy;
  const paddleHead = canvas.height - ballRadius - sealHeight;
  const paddleFoot = canvas.height - ballRadius;
  const ispaddleCollision =
    nextBallY >= paddleHead &&
    nextBallY <= paddleFoot && // y 軸碰海豹
    x > paddleX &&
    x < paddleX + paddleWidth; // x 軸碰海豹
    

  const isBottomCollision = nextBallY >= frameBottomY;

  if (y + dy < 0) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius - sealHeight) {
    if (isBottomCollision && ballRadius > 10) {
      ballRadius = ballRadius * 0.8;
    }
    // TODO: detect x, y and paddleX, paddleY, paddleWidth, paddleHeight
    if (ispaddleCollision) {
      sideCollision = false;
      if(x < paddleX || x > paddleX + paddleWidth){
        dx = -dx;
        sideCollision = true;
      }

      // highest speed
      if(dy <= 0) {
        return;
      }
      if(!sideCollision){
        dy = -dy;
      }
      // if (dy > 8) {
      // } else {
      //   dy = -dy * 1.1;
      // }
      score++;
      document.getElementById('win').textContent = score;
    }

    //over
    if (isBottomCollision) {
      lives--;
      if (!lives) {
        if(score==0){
          resetValues(failure);
        }
        else resetValues(success);
        return;
      } else {
        // reset
        x = canvas.width / 2;
        y = frameBottomY;
        dx = speed;
        dy = -speed;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  if (x + dx > canvas.width - ballRadius || x + dx < 0) {
    dx = -dx;
    dy += getRandomArbitrary(-0.4, 0.4);
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

document.addEventListener("mousemove", mouseMoveHandler);

// get a random value between two values
function getRandomArbitrary(min, max, toInt = false) {
  let value = Math.random() * (max - min) + min;
  if (toInt) {
    return Math.round(value);
  }
  return value;
}

function mouseMoveHandler(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  if (
    relativeX > 0 + paddleWidth / 2 &&
    relativeX < canvas.width - paddleWidth / 2
  ) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

document.addEventListener("keypress", keyDownHandler);

function keyDownHandler(e) {
  // "D" for right and "A" for left movement
  if (e.code == "KeyD") {
    let relativeX = paddleX + 10;
    if (relativeX < canvas.width - 100) {
      paddleX = relativeX + 10;
    }
  }

  if (e.code == "KeyA") {
    let relativeX = paddleX - 10;
    if (relativeX > 0) {
      paddleX = relativeX - 10;
    }
  }
}

draw();

window.onload = function() {
  nftBackground();
  getBallUrl();
};
function nftBackground() {
  var urlParams = new URLSearchParams(window.location.search);
  var bgColor = urlParams.get('bg');
  if(bgColor) {
    bgColor = bgColor.toLowerCase();
    var cv = document.getElementById("myCanvas");
    cv.style.backgroundColor = bgColor; 
  }
}

function getBallUrl() {
  var urlParams = new URLSearchParams(window.location.search);
  var ball = urlParams.get('ball');
  if(!ball) {
    return;
  }
  ballURL = "https://gateway.pinata.cloud/ipfs/QmNRKhqYUWFCttsW1bkUNLSuNWD3kChcqSSTr3UMBr74sz/BigBall/" + ball + ".png";
}

function setTitle() {
  var urlParams = new URLSearchParams(window.location.search);
  var id = urlParams.get('id');
  document.title = "Arjaverse Game #" + id;
}