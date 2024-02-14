import * as THREE from 'https://threejs.org/build/three.module.js';


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
	let paddleWidth = document.global.paddle.width;
	let paddleHeight = document.global.paddle.height;
	const canvasWidth = canvas.clientWidth;
	const canvasHeight = canvas.clientHeight;
	const arenaWidth = document.global.arena.width;
	const arenaHeight = document.global.arena.height;
    const mouseX = e.clientX;
	const mouseY = e.clientY;

	if ((document.global.gameplay.local && document.global.paddle.paddles[0].largePaddle) || (document.global.gameplay.multi && document.global.paddle.paddles[document.global.gameplay.playerNum].largePaddle)) { 
		paddleWidth = paddleWidth * document.global.powerUp.largePaddle.multiplier;
		paddleHeight = paddleHeight * document.global.powerUp.largePaddle.multiplier;
	}

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

}

function isBallAlignedWithPaddleX(paddle) {
	let halfPaddleWidth;
	const sphereX = document.global.sphereMesh.position.x;
	const paddleX = paddle.position.x;

	if (paddle.largePaddle)
		halfPaddleWidth = document.global.paddle.width / 2 * document.global.powerUp.largePaddle.multiplier;
	else
		halfPaddleWidth = document.global.paddle.width / 2;
	return sphereX >= paddleX - halfPaddleWidth && sphereX <= paddleX + halfPaddleWidth;
}

function isBallAlignedWithPaddleY(paddle) {
	let halfPaddleHeight;
	const sphereY = document.global.sphereMesh.position.y;
	const paddleY = paddle.position.y;

	if (paddle.largePaddle)
		halfPaddleHeight = document.global.paddle.height / 2 * document.global.powerUp.largePaddle.multiplier;
	else
		halfPaddleHeight = document.global.paddle.height / 2;
	
	return sphereY >= paddleY - halfPaddleHeight && sphereY <= paddleY + halfPaddleHeight;
}

function isPaddleCollision(paddles) {
	const sphereRadius =  document.global.sphere.radius;
	const paddleThickness = document.global.paddle.thickness;
	
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
	return sphereZ - radius <= -halfArenaDepth || sphereZ + radius >= halfArenaDepth;
}

function isPowerUpCollision() {
	const sphereRadius = document.global.sphere.radius;
	const powerUpCircleRadius = document.global.powerUp.circleRadius;
	
	const distance = document.global.sphereMesh.position.distanceTo(document.global.powerUp.mesh[document.global.powerUp.index].position);
	return distance <= sphereRadius + powerUpCircleRadius;
}

function powerUpCollisionEffect() {
	document.global.gameplay.gameStart = 0;
	document.global.powerUp.mesh[document.global.powerUp.index].visible = false;
	document.global.powerUp.index = Math.floor(Math.random() * 1);
	document.global.powerUp.positionX = Math.floor((Math.random() * (document.global.arena.width - document.global.powerUp.circleRadius)) - (document.global.arena.width - document.global.powerUp.circleRadius)/ 2);
	document.global.powerUp.positionY = Math.floor((Math.random() * (document.global.arena.height - document.global.powerUp.circleRadius)) - (document.global.arena.height -document.global.powerUp.circleRadius) / 2);
	document.global.powerUp.positionZ = Math.floor((Math.random() * (document.global.arena.depth / 3)) - (document.global.arena.depth / 3));
	for (let i = 0; i < document.global.sphere.circleRadius.length * 2; i += 2) {
		document.global.sphereMesh.children[i].visible = true;
		document.global.sphereMesh.children[i + 1].visible = true;
	}
	



	//individual effects
	//large paddle
	if (document.global.powerUp.index === 0) {
		const powerUpPaddleGeometry = new THREE.BoxGeometry(document.global.paddle.width * document.global.powerUp.largePaddle.multiplier, document.global.paddle.height * document.global.powerUp.largePaddle.multiplier, document.global.paddle.thickness )
		if (document.global.sphere.velocityZ <= 0) {
			document.global.paddle.paddles[0].largePaddle = 1;
			document.global.paddle.paddles[0].geometry.dispose();
			document.global.paddle.paddles[0].geometry = powerUpPaddleGeometry;
			if (document.global.paddle.paddles[2]) {
				document.global.paddle.paddles[2].largePaddle = 1;
				document.global.paddle.paddles[2].geometry.dispose();
				document.global.paddle.paddles[2].geometry = powerUpPaddleGeometry;
			}
		}
		else if (document.global.sphere.velocityZ > 0) {
			document.global.paddle.paddles[1].largePaddle = 1;
			document.global.paddle.paddles[1].geometry.dispose();
			document.global.paddle.paddles[1].geometry = powerUpPaddleGeometry;
			if (document.global.paddle.paddles[3]) {
				document.global.paddle.paddles[3].largePaddle = 1;
				document.global.paddle.paddles[3].geometry.dispose();
				document.global.paddle.paddles[2].geometry = powerUpPaddleGeometry;
			}
		}
		
	}
}

export function resetPowerUp() {
	if (document.global.powerUp.enable) {
		//reset settings for all powerup and randomise powerup rendering.
		document.global.powerUp.mesh[document.global.powerUp.index].visible = false;
		document.global.powerUp.index = Math.floor(Math.random() * 1);
		document.global.powerUp.positionX = Math.floor((Math.random() * (document.global.arena.width - document.global.powerUp.circleRadius)) - (document.global.arena.width - document.global.powerUp.circleRadius)/ 2);
		document.global.powerUp.positionY = Math.floor((Math.random() * (document.global.arena.height - document.global.powerUp.circleRadius)) - (document.global.arena.height -document.global.powerUp.circleRadius) / 2);
		document.global.powerUp.positionZ = Math.floor((Math.random() * (document.global.arena.depth / 3)) - (document.global.arena.depth / 3));
		document.global.powerUp.mesh[document.global.powerUp.index].position.set(document.global.powerUp.positionX, document.global.powerUp.positionY, document.global.powerUp.positionZ);
		//reset visibile for sphere circle radius
		for (let i = 0; i < document.global.sphere.circleRadius.length; i++) {
			document.global.sphereMesh.children[i].visible = false;
			document.global.sphereMesh.children[i + 1].visible = false;
		}
		document.global.powerUp.mesh[document.global.powerUp.index].visible = true;
		

		//large paddles reset
		const paddleGeometry = new THREE.BoxGeometry(document.global.paddle.width, document.global.paddle.height, document.global.paddle.thickness )
		document.global.paddle.paddles.forEach(paddle=>{
			paddle.largePaddle = 0;
			paddle.geometry = paddleGeometry;
		});
	}
}

function updateSpherePosition() {
	document.global.sphereMesh.position.x += document.global.sphere.velocityX;
	document.global.sphereMesh.position.y += document.global.sphere.velocityY;
	document.global.sphereMesh.position.z += document.global.sphere.velocityZ;
}

export function processSphereMovement() {
	if (document.global.gameplay.gameStart) {
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
			resetPowerUp()
		}
		if (document.global.powerUp.enable && document.global.powerUp.mesh[document.global.powerUp.index].visible === true && isPowerUpCollision()) {
			powerUpCollisionEffect();
		}
		let paddleCollisionIndex = isPaddleCollision(document.global.paddle.paddles);
		if(paddleCollisionIndex !== false)
			hitSphereBack(document.global.paddle.paddles[paddleCollisionIndex]);
		
	}
	
	
}


export function movePaddle() {
	let arenaWidth = document.global.arena.width;
	let arenaHeight = document.global.arena.height;
	let paddleWidth = document.global.paddle.width;
	let paddleHeight = document.global.paddle.height;
	let largePaddleWidth = paddleWidth * document.global.powerUp.largePaddle.multiplier;
	let largePaddleHeight = paddleHeight * document.global.powerUp.largePaddle.multiplier; 

	//local game
	if (document.global.gameplay.local) {
		const paddleOne = document.global.paddle.paddles[0]; //to change later, now hardcoded
		const paddleTwo = document.global.paddle.paddles[1];

		if (paddleOne.largePaddle) {
			paddleWidth = largePaddleWidth;
			paddleHeight = largePaddleHeight;
		}
		if (paddleOne.position.y < (arenaHeight / 2) - (paddleHeight/2))
			paddleOne.position.y += document.global.keyboard.w * document.global.keyboard.speed;
		if (paddleOne.position.y > (-arenaHeight / 2) + (paddleHeight/2))
			paddleOne.position.y -= document.global.keyboard.s * document.global.keyboard.speed;
		if (paddleOne.position.x < (arenaWidth / 2) - (paddleWidth/2))
			paddleOne.position.x += document.global.keyboard.d * document.global.keyboard.speed;
		if (paddleOne.position.x > (-arenaWidth / 2) + (paddleWidth/2))
			paddleOne.position.x -= document.global.keyboard.a * document.global.keyboard.speed;

		if (!paddleTwo.largePaddle) {
			paddleWidth = document.global.paddle.width;
			paddleHeight = document.global.paddle.height;
		}
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
		
		if (paddleOne.largePaddle) {
			paddleWidth = largePaddleWidth;
			paddleHeight = largePaddleHeight;
		}
		if (paddleOne.position.y < (arenaHeight / 2) - (paddleHeight/2))
			paddleOne.position.y += document.global.keyboard.w * document.global.keyboard.speed;
		if (paddleOne.position.y > (-arenaHeight / 2) + (paddleHeight/2))
			paddleOne.position.y -= document.global.keyboard.s * document.global.keyboard.speed;
		if (paddleOne.position.x < (arenaWidth / 2) - (paddleWidth/2))
			paddleOne.position.x += document.global.keyboard.d * document.global.keyboard.speed;
		if (paddleOne.position.x > (-arenaWidth / 2) + (paddleWidth/2))
			paddleOne.position.x -= document.global.keyboard.a * document.global.keyboard.speed;

		if (!paddleTwo.largePaddle) {
			paddleWidth = document.global.paddle.width;
			paddleHeight = document.global.paddle.height;
		}
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








