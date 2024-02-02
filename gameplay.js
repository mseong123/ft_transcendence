let canvas = document.querySelector("#c");
let ballInfo =  document.global.ballInfo;
let halfArenaWidth = canvas.clientWidth / 2.5 / 2;
let halfArenaHeight = canvas.clientHeight / 2.5 / 2;
let halfArenaDepth = canvas.clientHeight / 2;
let ballRadius = canvas.clientWidth / ballInfo.radiusDivision;




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






