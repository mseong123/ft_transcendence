let ballInfo =  document.global.ballInfo;
const arenaWidth = document.global.clientWidth;

const paddleWidth = document.global.clientWidth / document.global.clientWidthDivision / 5;
const paddleHeight = document.global.clientWidth  / document.global.clientWidthDivision / document.global.aspect / 7;

const canvas = document.getElementById("c");
canvas.addEventListener("mousemove", canvasMouseMove)

function canvasMouseMove(e) {
    var mouseX = e.clientX;
	
    // document.global.paddleOneInfo.x = -((WIDTH - mouseX) / WIDTH * FIELD_WIDTH) + (FIELD_WIDTH / 2);
  }




export function processBallMovement() {
	let halfArenaWidth = document.global.clientWidth / 2.5 / 2;
	let halfArenaHeight = document.global.clientWidth / document.global.aspect / 2.5 / 2;
	let halfArenaDepth = document.global.clientWidth / document.global.aspect / 2;
	let ballRadius = document.global.clientWidth / ballInfo.radiusDivision;
	
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
}

function updateBallPosition() {
	//update the ball's position.
	ballInfo.x += ballInfo.velocityX;
	ballInfo.y += ballInfo.velocityY;
	ballInfo.z += ballInfo.velocityZ;
}






