let ballInfo =  document.global.ballInfo;

const canvas = document.getElementById("c");
canvas.addEventListener("mousemove", canvasMouseMove);
canvas.addEventListener("keydown", canvasKeydown);
canvas.addEventListener("keyup", canvasKeyup);

function isPaddleCollision(paddle) {
	let canvasWidth = document.global.clientWidth;
	let radius =  canvasWidth / document.global.ballInfo.radiusDivision;
	let paddleThickness = canvasWidth / document.global.aspect / 150;
	let paddleZ = paddle.position.z;
	
	let ballZ = document.global.ballMesh.position.z;
	
	if (paddleZ < 0) 
		return ballZ - radius <= paddleZ + paddleThickness && isBallAlignedWithPaddleX(paddle) && isBallAlignedWithPaddleY(paddle);
		
	else if (paddleZ > 0)
		return ballZ + radius >= paddleZ - paddleThickness && isBallAlignedWithPaddleX(paddle) && isBallAlignedWithPaddleY(paddle);
}

function hitBallBack(paddle) {
	let ballMesh = document.global.ballMesh;
	
    ballInfo.velocityX = (ballMesh.position.x - paddle.position.x) / 5; 
	ballInfo.velocityY = (ballMesh.position.y - paddle.position.y) / 5;
	if (ballInfo.velocityY < 1 && ballInfo.velocityY > 0)
		ballInfo.velocityY = 1;
	if (ballInfo.velocityY > -1 && ballInfo.velocityY < 0)
		ballInfo.velocityY = -1;
	if (ballInfo.velocityX < 1 && ballInfo.velocityX > 0)
		ballInfo.velocityX = 1;
	if (ballInfo.velocityX > -1 && ballInfo.velocityX < 0)
		ballInfo.velocityX = -1;
    ballInfo.velocityZ *= -1;
  }

function isBallAlignedWithPaddleX(paddle) {
	let halfPaddleWidth = document.global.clientWidth / document.global.widthDivision / 5 / 2;
	let ballX = document.global.ballMesh.position.x;
	let paddleX = paddle.position.x;
	return ballX > paddleX - halfPaddleWidth && ballX < paddleX + halfPaddleWidth;
}

function isBallAlignedWithPaddleY(paddle) {
	let halfPaddleHeight = document.global.clientWidth  / document.global.widthDivision / document.global.aspect / 7 / 2;
	let ballY = document.global.ballMesh.position.y;
	let paddleY = paddle.position.y;
	return ballY > paddleY - halfPaddleHeight && ballY < paddleY + halfPaddleHeight;
}

function canvasKeydown(e) {
	let arrow = e.key;
	if (e.keyCode === 87) 
		document.global.keyboard.w =1;
	if (e.keyCode === 83) 
		document.global.keyboard.s =1;
	if (e.keyCode === 65) 
		document.global.keyboard.a =1;
	if (e.keyCode === 68) 
		document.global.keyboard.d =1;
	if (arrow === 'ArrowUp')
		document.global.keyboard.up =1;
	if (arrow === 'ArrowDown')
		document.global.keyboard.down =1;
	if (arrow === 'ArrowLeft')
		document.global.keyboard.left =1;
	if (arrow === 'ArrowRight')
		document.global.keyboard.right =1;
	
}

function canvasKeyup(e) {
	let arrow = e.key;
	if (e.keyCode === 87) 
		document.global.keyboard.w = 0;
	if (e.keyCode === 83) 
		document.global.keyboard.s =0;
	if (e.keyCode === 65) 
		document.global.keyboard.a =0;
	if (e.keyCode === 68) 
		document.global.keyboard.d =0;
	if (arrow === 'ArrowUp')
		document.global.keyboard.up =0;
	if (arrow === 'ArrowDown')
		document.global.keyboard.down =0;
	if (arrow === 'ArrowLeft')
		document.global.keyboard.left =0;
	if (arrow === 'ArrowRight')
		document.global.keyboard.right =0;
	
}

function canvasMouseMove(e) {
	canvas.style.cursor = 'none';
	let paddleWidth = document.global.clientWidth / document.global.widthDivision / 5;
	let paddleHeight = document.global.clientWidth  / document.global.widthDivision / document.global.aspect / 7;
	let canvasWidth = document.global.clientWidth;
	let canvasHeight = document.global.clientWidth / document.global.aspect;
	let arenaWidth = document.global.clientWidth / 2.5;
	let arenaHeight = document.global.clientWidth / document.global.aspect / 2.5;
    var mouseX = e.clientX;
	var mouseY = e.clientY;

	var positionX = -((canvasWidth - mouseX) / canvasWidth * arenaWidth) + (arenaWidth / 2);
	if (positionX > (arenaWidth / 2) - (paddleWidth/2))
		positionX = (arenaWidth / 2) - (paddleWidth/2);
	else if (positionX < (-arenaWidth / 2) + (paddleWidth/2))
		positionX = (-arenaWidth / 2) + (paddleWidth/2)

	var positionY = -(-((canvasHeight - mouseY) / canvasHeight * arenaHeight) + (arenaHeight / 2));
	
	if (positionY > (arenaHeight / 2) - (paddleHeight/2))
		positionY = (arenaHeight / 2) - (paddleHeight/2);
	else if (positionY < (-arenaHeight / 2) + (paddleHeight/2))
		positionY = (-arenaHeight / 2) + (paddleHeight/2);
	
    document.global.paddleOne.position.x = positionX;
	document.global.paddleOne.position.y = positionY;
	
  }

export function movePaddle() {
	let paddleWidth = document.global.clientWidth / document.global.widthDivision / 5;
	let paddleHeight = document.global.clientWidth  / document.global.widthDivision / document.global.aspect / 7;
	let arenaWidth = document.global.clientWidth / 2.5;
	let arenaHeight = document.global.clientWidth / document.global.aspect / 2.5;

	//paddleOne
	if (document.global.paddleOne.position.y < (arenaHeight / 2) - (paddleHeight/2))
		document.global.paddleOne.position.y += document.global.keyboard.w * document.global.keyboard.speed;
	if (document.global.paddleOne.position.y > (-arenaHeight / 2) + (paddleHeight/2))
		document.global.paddleOne.position.y -= document.global.keyboard.s * document.global.keyboard.speed;
	if (document.global.paddleOne.position.x < (arenaWidth / 2) - (paddleWidth/2))
		document.global.paddleOne.position.x += document.global.keyboard.d * document.global.keyboard.speed;
	if (document.global.paddleOne.position.x > (-arenaWidth / 2) + (paddleWidth/2))
		document.global.paddleOne.position.x -= document.global.keyboard.a * document.global.keyboard.speed;

	//paddleTwo
	if (document.global.paddleTwo.position.y < (arenaHeight / 2) - (paddleHeight/2))
		document.global.paddleTwo.position.y += document.global.keyboard.up * document.global.keyboard.speed;
	if (document.global.paddleTwo.position.y > (-arenaHeight / 2) + (paddleHeight/2))
		document.global.paddleTwo.position.y -= document.global.keyboard.down * document.global.keyboard.speed;
	if (document.global.paddleTwo.position.x < (arenaWidth / 2) - (paddleWidth/2))
		document.global.paddleTwo.position.x += document.global.keyboard.right * document.global.keyboard.speed;
	if (document.global.paddleTwo.position.x > (-arenaWidth / 2) + (paddleWidth/2))
		document.global.paddleTwo.position.x -= document.global.keyboard.left * document.global.keyboard.speed;
}


export function processBallMovement() {
	let ballMesh = document.global.ballMesh;
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
		ballMesh.position.set(0,0,0);
		ballInfo.velocityX = 3;
		ballInfo.velocityY = 3;
		ballInfo.velocityZ = 3;

	}
	if(isPaddleCollision(document.global.paddleOne)) {
		hitBallBack(document.global.paddleOne);
	}
	if(isPaddleCollision(document.global.paddleTwo)) {
		hitBallBack(document.global.paddleTwo);
	}

	function isXCollision() {
		let ballX = document.global.ballMesh.position.x;
		return ballX - ballRadius < -halfArenaWidth || ballX + ballRadius > halfArenaWidth;
	}
	
	function isYCollision() {
		let ballY = document.global.ballMesh.position.y;
	
		return ballY - ballRadius < -halfArenaHeight || ballY + ballRadius > halfArenaHeight;
	}
	
	function isZCollision() {
		let ballZ = document.global.ballMesh.position.z;
		
	
		return ballZ - ballRadius < -halfArenaDepth -100|| ballZ + ballRadius > halfArenaDepth + 100;
	}
}

function updateBallPosition() {
	//update the ball's position.
	document.global.ballMesh.position.x += ballInfo.velocityX;
	document.global.ballMesh.position.y += ballInfo.velocityY;
	document.global.ballMesh.position.z += ballInfo.velocityZ;
}






