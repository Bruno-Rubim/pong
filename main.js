let canvas = document.querySelector('canvas');
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let paddle = document.querySelector('#paddle');
let wall = document.querySelector('#wall');
let score = document.querySelector('#score');

blocks = [];

let keyIsPressed = {};

let ballPosX = canvas.width/2;
let ballPosY = canvas.height/2;
let ballRegularSpeed = 10;
let ballSpeedX = 0;
let ballSpeedY = 0;
let ballRadius = 10;
let ballColor = "rgb(255, 255, 255)";
let ballColorR = 255;
let ballColorG = 255;
let ballColorB = 255;
let invisible = false;
let ballIsStationary = true;
let fast = 15;

let barWidth = 20;
let barSpeed = 1;
let barHeight = 100;
let barMovement = 15;

let barLeftPosX = 50;
let barLeftPosY = (canvas.height - barHeight) / 2;
let barLeftSpeed = 0;
let barLeftColor = "rgb(0, 255, 119)";
let leftScore = 0;

let barRightPosX = canvas.width - 50;
let barRightPosY = (canvas.height - barHeight) / 2;
let barRightSpeed = 0;
let barRightColor = "rgb(0, 255, 119)";
let rightScore = 0;

let frictionSpeed = 0.1;

// Score stuff

function drawScore(xDistance, yDistance, fontSize){
    ctx.font = fontSize + "px Monospace";
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillText(leftScore, canvas.width/2 - xDistance - fontSize/2, yDistance);
    ctx.fillText(rightScore, canvas.width/2 + xDistance - fontSize/2, yDistance);
}

// Bar stuff

function drawBar(x, y, color, width, height){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
}

function barColision() {
    if (barLeftPosY > canvas.height - barHeight) {
        barLeftPosY = canvas.height - barHeight;
        wall.play();
    } else if (barLeftPosY < 0) {
        barLeftPosY = 0;
        barLeftSpeed = 0;
        wall.play();
    }
    if (barRightPosY > canvas.height - barHeight) {
        barRightPosY = canvas.height - barHeight;
        wall.play();
    } else if (barRightPosY < 0) {
        barRightPosY = 0;
        barRightSpeed = 0;
        wall.play();
    }
}

// Controler stuff

function keydownHandler(e){
    keyIsPressed[e.code] = true;
    console.log(e.code);
}

function keyupHandler(e){
    keyIsPressed[e.code] = false;
}

window.addEventListener("keydown", keydownHandler);
window.addEventListener("keyup", keyupHandler);

function translateKeys(){
    if (keyIsPressed.Minus || keyIsPressed.NumpadSubtract) {
        centerBall();
        leftScore = 0;
        rightScore = 0;
    }
    if (keyIsPressed.KeyW) {
        barLeftPosY -= barMovement;
        barLeftSpeed -= barSpeed;
    } else if (keyIsPressed.KeyS) {
        barLeftPosY += barMovement;
        barLeftSpeed += barSpeed;
    } else {
        barLeftSpeed = 0;
    }
    if (keyIsPressed.ArrowUp || keyIsPressed.Numpad8) {
        barRightPosY -= barMovement;
        barRightSpeed -= barSpeed;
    } else if (keyIsPressed.ArrowDown || keyIsPressed.Numpad5) {
        barRightPosY += barMovement;
        barRightSpeed += barSpeed;
    } else {
        barRightSpeed = 0;
    }
    if (ballIsStationary){
        if ((keyIsPressed.ArrowRight || keyIsPressed.Numpad6) && keyIsPressed.KeyA) {
            centerBall();
            if(Math.random() > 0.5){
                ballSpeedX = ballRegularSpeed;
            } else {
                ballSpeedX = -ballRegularSpeed;
            }
            ballIsStationary = false;
        }
        if (keyIsPressed.KeyA) {
            barLeftPosY = (canvas.height - barHeight) / 2;
            barLeftColor = "rgb(0, 255, 119)";
        } else {
            barLeftColor = "rgb(255, 255, 255)";
        }
        if (keyIsPressed.ArrowRight || keyIsPressed.Numpad6) {
            barRightPosY = (canvas.height - barHeight) / 2;
            barRightColor = "rgb(0, 255, 119)";
        } else {
            barRightColor = "rgb(255, 255, 255)";
        }
    } else {
        barLeftColor = "rgb(255, 255, 255)";
        barRightColor = "rgb(255, 255, 255)";
    }
}

// ball stuff

// function ballSpeedCalculator(){
//     return (ballSpeedX**2 + ballSpeedY**2)**0.5;
// }

// function addFriction(){
//     let speed = ballSpeedCalculator();
//     if (speed >= frictionSpeed){
//         ballSpeedX -= (ballSpeedX / speed)*frictionSpeed;
//         ballSpeedY -= (ballSpeedY / speed)*frictionSpeed;
//     } else {
//         ballSpeedX = 0;
//         ballSpeedY = 0;
//     }
// }

function drawBall(x, y, color, radius){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2*Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

function changeBallColor(type, R, G, B) {
    if (type == "gradual") {
        if (ballColorR < R) {
            ballColorR++;
        } else if (ballColorR > R) {
            ballColorR--;
        }
        if (ballColorG < G) {
            ballColorG++;
        } else if (ballColorG > G) {
            ballColorG--;
        }
        if (ballColorB < B) {
            ballColorB++;
        } else if (ballColorB > B) {
            ballColorB--;
        }
    } else {
        ballColorR = R;
        ballColorG = G;
        ballColorB = B;
    }
    ballColor = "rgb(" + ballColorR + ", " + ballColorG + ", " + ballColorB + ")";
}

function centerBall() {
    ballPosX = canvas.width/2;
    ballPosY = canvas.height/2;
    ballSpeedY = 0;
    ballSpeedX = 0;
    invisible = false;
    ballIsStationary = true;
    changeBallColor("instant", 255, 255, 255);
}

function ballPhysics(){
    ballPosX += ballSpeedX;
    ballPosY += ballSpeedY;
    if (ballIsStationary) {
        ballSpeedY = 0;
        ballSpeedX = 0;
    }
    if (ballSpeedY > fast || ballSpeedY < -fast) {
        console.log("fast");
        changeBallColor("instant", 255, 0, 119);
    } else {
        changeBallColor("gradual", 255, 255, 255);
    }
}

function ballCollision(){
    let ballCollisionDepthUp = ballPosY - ballRadius;
    let ballCollisionDepthDown = ballPosY + ballRadius - canvas.height;
    let ballCollisionDepthLeftWall = ballPosX - ballRadius;
    let ballCollisionDepthRightWall = ballPosX + ballRadius - canvas.width;
    let ballCollisionDepthLeftBar = ballPosX - ballRadius - barWidth - barLeftPosX;
    let ballCollisionDepthRightBar = barRightPosX - (ballPosX + ballRadius);
    if (ballCollisionDepthUp < 0) {
        ballPosY -= ballCollisionDepthUp*2;
        ballSpeedY *= -1;
    }
    if (ballCollisionDepthDown > 0) {
        ballPosY -= ballCollisionDepthDown*2;
        ballSpeedY *= -1;
    }
    if (ballCollisionDepthLeftWall < 0 && !ballIsStationary) {
        ballIsStationary = true;
        rightScore ++;
        score.play();
    }
    if (ballCollisionDepthRightWall > 0 && !ballIsStationary) {
        ballIsStationary = true;
        leftScore ++;
        score.play();
    }
    if (!invisible) {
        if (ballCollisionDepthLeftBar < 0 && 
        ballPosY-ballRadius < barLeftPosY + barHeight &&
        ballPosY+ballRadius > barLeftPosY
        ) {
            ballPosX -= ballCollisionDepthLeftBar*2;
            ballSpeedX *= -1;
            paddle.play();
            ballSpeedY += (barLeftSpeed)* Math.random();
        } else if (ballCollisionDepthRightBar < 0 && 
        ballPosY-ballRadius < barRightPosY + barHeight &&
        ballPosY+ballRadius > barRightPosY
        ) {
            ballPosX += ballCollisionDepthRightBar*2;
            ballSpeedX *= -1;
            paddle.play();
            ballSpeedY += (barRightSpeed)* Math.random();
        } else if (ballPosX - ballRadius < barLeftPosX + barWidth ||
        ballPosX + ballRadius > barRightPosX) {
            invisible = true;
        }
    }
}

// blocks

function addBlock (type, x, y) {
    let newBlock = {type: type, posX: x, posY: y};
    switch(type){
        case 'blank':
        default:
            newBlock.colorR = 255;
            newBlock.colorG = 255;
            newBlock.colorB = 255;
            break;
    }
    newBlock.color = "rgb(" + newBlock.colorR + ", " + newBlock.colorG + ", " + newBlock.colorB + ")";
    blocks.push(newBlock);
}

function drawBlocks(){
    for(let i = 0; i < blocks.length; i++){
        ctx.fillStyle = blocks[i].color;
        ctx.fillRect(blocks[i].posX, blocks[i].posY, 50, 50);
    }
}

// rendering

function clearCanvas(){
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function render(){
    clearCanvas();
    drawScore(300, 200, 100);
    drawBlocks();
    drawBall(ballPosX, ballPosY, ballColor, ballRadius);
    drawBar(barLeftPosX, barLeftPosY, barLeftColor, barWidth, barHeight);
    drawBar(barRightPosX, barRightPosY, barRightColor, barWidth, barHeight);
}

function frame(){
    translateKeys();
    barColision();
    ballPhysics();
    ballCollision();
    render();
    requestAnimationFrame(frame);
    console.log(ballSpeedY);
}
frame();