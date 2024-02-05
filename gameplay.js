let ballInfo =  document.global.ballInfo;
const arenaWidth = document.global.minWidth;
let halfArenaWidth = document.global.minWidth / 2.5 / 2;
let halfArenaHeight = document.global.minWidth / document.global.aspect / 2.5 / 2;
let halfArenaDepth = document.global.minWidth / document.global.aspect / 2;
let ballRadius = document.global.minWidth / ballInfo.radiusDivision;
const paddleWidth = document.global.minWidth / document.global.minWidthDivision / 5;
const paddleHeight = document.global.minWidth  / document.global.minWidthDivision / document.global.aspect / 7;

const canvas = document.getElementById("c");
canvas.addEventListener("mousemove", canvasMouseMove)

function canvasMouseMove(e) {
    var mouseX = e.clientX;
	console.log(mouseX);
    // document.global.paddleOneInfo.x = -((WIDTH - mouseX) / WIDTH * FIELD_WIDTH) + (FIELD_WIDTH / 2);
  }


function isXCollision() {
	let ballX = ballInfo.x;
	return ballX - ballRadius < -halfArenaWidth || ballX + ballRadius > halfArenaWidth;
}

function isYCollision() {
	let ballY = ballInfo.y;

	return ballY - ballRadius < -halfArenaHeight || ballY + ballRadius > halfArenaHeight;
}

function isZCollision() {
	let ballZ = ballInfo.z;
	

	return ballZ - ballRadius < -halfArenaDepth || ballZ + ballRadius > halfArenaDepth;
}

export function processBallMovement() {
	
	updateBallPosition();
	
	if(isXCollision()) {
		ballInfo.velocityX *= -1;
	}
	if(isYCollision()) {
		ballInfo.velocityY *= -1;
	}
	if(isZCollision()) {
		ballInfo.velocityZ *= -1;
	}
}

function updateBallPosition() {
	//update the ball's position.
	ballInfo.x += ballInfo.velocityX;
	ballInfo.y += ballInfo.velocityY;
	ballInfo.z += ballInfo.velocityZ;
}






