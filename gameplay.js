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
	const canvas = document.getElementById("c");
	const paddleWidth = document.global.paddle.width;
	const paddleHeight = document.global.paddle.height;
	const canvasWidth = canvas.clientWidth;
	const canvasHeight = canvas.clientHeight;
	const arenaWidth = document.global.arena.width;
	const arenaHeight = document.global.arena.height;
    const mouseX = e.clientX;
	const mouseY = e.clientY;

	let positionX = -((canvasWidth - mouseX) / canvasWidth * arenaWidth) + (arenaWidth / 2);
	if (positionX > (arenaWidth / 2) - (paddleWidth/2))
		positionX = (arenaWidth / 2) - (paddleWidth/2);
	else if (positionX < (-arenaWidth / 2) + (paddleWidth/2))
		positionX = (-arenaWidth / 2) + (paddleWidth/2)

	let positionY = -(-((canvasHeight - mouseY) / canvasHeight * arenaHeight) + (arenaHeight / 2));
	
	if (positionY > (arenaHeight / 2) - (paddleHeight/2))
		positionY = (arenaHeight / 2) - (paddleHeight/2);
	else if (positionY < (-arenaHeight / 2) + (paddleHeight/2))
		positionY = (-arenaHeight / 2) + (paddleHeight/2);
	
	//For local game, mouse is attached to paddle nearest to camera
	if (document.global.gameplay.local) {
		document.global.paddle.paddles[0].position.x = positionX;
		document.global.paddle.paddles[0].position.y = positionY;
	}
	//For multi, mouse is attached to player num
	if (document.global.gameplay.multi) {
		document.global.paddle.paddles[document.global.gameplay.playerNum].position.x = positionX;
		document.global.paddle.paddles[document.global.gameplay.playerNum].position.y = positionY;
	}
}

//addeventlistener
export function keyBinding() {
	const canvas = document.getElementById("c");
	canvas.addEventListener("mousemove", canvasMouseMove);
	canvas.addEventListener("keydown", canvasKeydown);
	canvas.addEventListener("keyup", canvasKeyup);

	//to change later
	const gamestart = document.getElementById("gamestart");
	gamestart.addEventListener("click", ()=>{document.global.gameplay.gameStart = 1});

}

function isBallAlignedWithPaddleX(paddle) {
	const halfPaddleWidth = document.global.paddle.width / 2;
	const sphereX = document.global.sphereMesh.position.x;
	const paddleX = paddle.position.x;
	return sphereX >= paddleX - halfPaddleWidth && sphereX <= paddleX + halfPaddleWidth;
}

function isBallAlignedWithPaddleY(paddle) {
	let halfPaddleHeight = document.global.paddle.height / 2;
	let sphereY = document.global.sphereMesh.position.y;
	let paddleY = paddle.position.y;
	return sphereY >= paddleY - halfPaddleHeight && sphereY <= paddleY + halfPaddleHeight;
}

function isPaddleCollision(paddles) {
	const sphereRadius =  document.global.sphere.radius;
	const paddleThickness = document.global.paddle.thickness;
	const halfArenaDepth = document.global.arena.depth / 2;
	
	for (let i = 0; i < paddles.length; i++) {
		let paddleZ = paddles[i].position.z;
		let sphereZ = document.global.sphereMesh.position.z;
		if (paddleZ <= 0 && sphereZ - sphereRadius <= paddleZ && sphereZ - sphereRadius >= paddleZ - paddleThickness && isBallAlignedWithPaddleX(paddles[i]) && isBallAlignedWithPaddleY(paddles[i]))
			return i;
		else if (paddleZ > 0 && sphereZ + sphereRadius >= paddleZ - paddleThickness && sphereZ + sphereRadius <= paddleZ && isBallAlignedWithPaddleX(paddles[i]) && isBallAlignedWithPaddleY(paddles[i]))
			return i;
	}
	return false;
}

function hitSphereBack(paddle) {
	const sphereMesh = document.global.sphereMesh;
	const sphere = document.global.sphere;
	
    sphere.velocityX = (sphereMesh.position.x - paddle.position.x) / document.global.paddle.hitBackModifier; 
	sphere.velocityY = (sphereMesh.position.y - paddle.position.y) / document.global.paddle.hitBackModifier;
	if (sphere.velocityY < 1 && sphere.velocityY > 0)
		sphere.velocityY = 1;
	if (sphere.velocityY > -1 && sphere.velocityY < 0)
		sphere.velocityY = -1;
	if (sphere.velocityX < 1 && sphere.velocityX > 0)
		sphere.velocityX = 1;
	if (sphere.velocityX > -1 && sphere.velocityX < 0)
		sphere.velocityX = -1;
	sphere.velocityZ *= -1;
  }

function isXCollision() {
	const sphereX = document.global.sphereMesh.position.x;
	const radius = document.global.sphere.radius;
	const halfArenaWidth = document.global.arena.width / 2;

	return sphereX - radius <= -halfArenaWidth || sphereX + radius >= halfArenaWidth;
}

function isYCollision() {
	const sphereY = document.global.sphereMesh.position.y;
	const radius = document.global.sphere.radius;
	const halfArenaHeight = document.global.arena.height / 2;

	return sphereY - radius <= -halfArenaHeight || sphereY + radius >= halfArenaHeight;
}

function isZCollision() {
	const sphereZ = document.global.sphereMesh.position.z;
	const radius = document.global.sphere.radius;
	const halfArenaDepth = document.global.arena.depth / 2;
	const sphereOutModifier = document.global.gameplay.sphereOutModifier;
	return sphereZ - radius <= -halfArenaDepth || sphereZ + radius >= halfArenaDepth;
}

function updateSpherePosition() {
	document.global.sphereMesh.position.x += document.global.sphere.velocityX;
	document.global.sphereMesh.position.y += document.global.sphere.velocityY;
	document.global.sphereMesh.position.z += document.global.sphere.velocityZ;
}

export function processSphereMovement() {
	const sphere = document.global.sphere;
	
	updateSpherePosition();
	

	
	if(isXCollision()) {
		sphere.velocityX *= -1;
	}
	if(isYCollision()) {
		sphere.velocityY *= -1;
	}
	if(isZCollision()) {
		document.global.pointLight.castShadow = false;
		document.global.gameplay.shadowFrame = 0;
		document.global.gameplay.gameStart = 0;
		document.global.sphereMesh.position.set(0,0,0);
		sphere.velocityX = document.global.arena.clientWidth / document.global.sphere.velocityDivision;
		sphere.velocityY = document.global.arena.clientWidth / document.global.sphere.velocityDivision;
		sphere.velocityZ = document.global.arena.clientWidth / document.global.sphere.velocityDivision;
	}
	let paddleCollisionIndex = isPaddleCollision(document.global.paddle.paddles);
	if(paddleCollisionIndex !== false)
		hitSphereBack(document.global.paddle.paddles[paddleCollisionIndex]);
	
	
}


export function movePaddle() {
	let arenaWidth = document.global.arena.width;
	let arenaHeight = document.global.arena.height;
	let paddleWidth = document.global.paddle.width;
	let paddleHeight = document.global.paddle.height;

	//local game
	if (document.global.gameplay.local) {
		const paddleOne = document.global.paddle.paddles[0]; //to change later, now hardcoded
		const paddleTwo = document.global.paddle.paddles[1];
		
		
		if (paddleOne.position.y < (arenaHeight / 2) - (paddleHeight/2))
			paddleOne.position.y += document.global.keyboard.w * document.global.keyboard.speed;
		if (paddleOne.position.y > (-arenaHeight / 2) + (paddleHeight/2))
			paddleOne.position.y -= document.global.keyboard.s * document.global.keyboard.speed;
		if (paddleOne.position.x < (arenaWidth / 2) - (paddleWidth/2))
			paddleOne.position.x += document.global.keyboard.d * document.global.keyboard.speed;
		if (paddleOne.position.x > (-arenaWidth / 2) + (paddleWidth/2))
			paddleOne.position.x -= document.global.keyboard.a * document.global.keyboard.speed;

		if (paddleTwo.position.y < (arenaHeight / 2) - (paddleHeight/2))
			paddleTwo.position.y += document.global.keyboard.up * document.global.keyboard.speed;
		if (paddleTwo.position.y > (-arenaHeight / 2) + (paddleHeight/2))
			paddleTwo.position.y -= document.global.keyboard.down * document.global.keyboard.speed;
		if (paddleTwo.position.x < (arenaWidth / 2) - (paddleWidth/2))
			paddleTwo.position.x += document.global.keyboard.right * document.global.keyboard.speed;
		if (paddleTwo.position.x > (-arenaWidth / 2) + (paddleWidth/2))
			paddleTwo.position.x -= document.global.keyboard.left * document.global.keyboard.speed;
	}
	if (document.global.gameplay.multi) {
		const paddleOne = document.global.paddle.paddles[2]; //to change later, now hardcoded
		const paddleTwo = document.global.paddle.paddles[1];
		
		
		if (paddleOne.position.y < (arenaHeight / 2) - (paddleHeight/2))
			paddleOne.position.y += document.global.keyboard.w * document.global.keyboard.speed;
		if (paddleOne.position.y > (-arenaHeight / 2) + (paddleHeight/2))
			paddleOne.position.y -= document.global.keyboard.s * document.global.keyboard.speed;
		if (paddleOne.position.x < (arenaWidth / 2) - (paddleWidth/2))
			paddleOne.position.x += document.global.keyboard.d * document.global.keyboard.speed;
		if (paddleOne.position.x > (-arenaWidth / 2) + (paddleWidth/2))
			paddleOne.position.x -= document.global.keyboard.a * document.global.keyboard.speed;

		if (paddleTwo.position.y < (arenaHeight / 2) - (paddleHeight/2))
			paddleTwo.position.y += document.global.keyboard.up * document.global.keyboard.speed;
		if (paddleTwo.position.y > (-arenaHeight / 2) + (paddleHeight/2))
			paddleTwo.position.y -= document.global.keyboard.down * document.global.keyboard.speed;
		if (paddleTwo.position.x < (arenaWidth / 2) - (paddleWidth/2))
			paddleTwo.position.x += document.global.keyboard.right * document.global.keyboard.speed;
		if (paddleTwo.position.x > (-arenaWidth / 2) + (paddleWidth/2))
			paddleTwo.position.x -= document.global.keyboard.left * document.global.keyboard.speed;
	}
}








