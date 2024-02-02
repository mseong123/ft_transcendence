

let ballInfo =  document.global.ballInfo;

function isXCollision() {
	let canvas = document.querySelector("#c");
	let ballX = ballInfo.x;
	let halfArenaWidth = canvas.clientWidth / 2.5 / 2;
	let ballRadius = canvas.clientWidth / ballInfo.radiusDivision;
	console.log(canvas.clientWidth);
	console.log(ballX - ballRadius < -halfArenaWidth);
	return ballX - ballRadius < -halfArenaWidth || ballX + ballRadius > halfArenaWidth;
}

function isYCollision() {
	let canvas = document.querySelector("#c");
	let ballY = ballInfo.y;
	let halfArenaHeight = canvas.clientHeight / 2.5 / 2;
	let ballRadius = canvas.clientWidth / ballInfo.radiusDivision;

	return ballY - ballRadius < -halfArenaHeight || ballY + ballRadius > halfArenaHeight;
}

function isZCollision() {
	let canvas = document.querySelector("#c");
	let ballZ = ballInfo.z;
	let halfArenaDepth = canvas.clientHeight / 2;
	let ballRadius = canvas.clientWidth / ballInfo.radiusDivision;

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






