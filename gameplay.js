import * as THREE from 'https://threejs.org/build/three.module.js';
import {createSphereMesh} from './render.js'

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
	
	//temp bind
	document.getElementById("powerup").addEventListener("click", (e)=>powerUpCollisionEffect());

}

function isBallAlignedWithPaddleX(paddle, sphereMesh) {
	let halfPaddleWidth;
	const sphereX = sphereMesh.position.x;
	const paddleX = paddle.position.x;

	if (paddle.largePaddle)
		halfPaddleWidth = document.global.paddle.width / 2 * document.global.powerUp.largePaddle.multiplier;
	else
		halfPaddleWidth = document.global.paddle.width / 2;
	return sphereX >= paddleX - halfPaddleWidth && sphereX <= paddleX + halfPaddleWidth;
}

function isBallAlignedWithPaddleY(paddle, sphereMesh) {
	let halfPaddleHeight;
	const sphereY = sphereMesh.position.y;
	const paddleY = paddle.position.y;

	if (paddle.largePaddle)
		halfPaddleHeight = document.global.paddle.height / 2 * document.global.powerUp.largePaddle.multiplier;
	else
		halfPaddleHeight = document.global.paddle.height / 2;
	
	return sphereY >= paddleY - halfPaddleHeight && sphereY <= paddleY + halfPaddleHeight;
}

function isPaddleCollision(paddles, sphereMesh) {
	const sphereRadius =  document.global.sphere.radius;
	const paddleThickness = document.global.paddle.thickness;
	
	for (let i = 0; i < paddles.length; i++) {
		let paddleZ = paddles[i].position.z;
		let sphereZ = sphereMesh.position.z;
		if (paddleZ <= 0 && sphereZ - sphereRadius <= paddleZ && sphereZ - sphereRadius >= paddleZ - paddleThickness && isBallAlignedWithPaddleX(paddles[i], sphereMesh) && isBallAlignedWithPaddleY(paddles[i], sphereMesh))
			return i;
		else if (paddleZ > 0 && sphereZ + sphereRadius >= paddleZ - paddleThickness && sphereZ + sphereRadius <= paddleZ && isBallAlignedWithPaddleX(paddles[i], sphereMesh) && isBallAlignedWithPaddleY(paddles[i], sphereMesh))
			return i;
	}
	return false;
}

function hitSphereBack(paddle, sphereMesh) {
	const velocityTopLimit = document.global.sphere.velocityTopLimit;
	const velocityBottomLimit = document.global.sphere.velocityBottomLimit;
	//invisibility effect
	if (paddle.invisibility)
		sphereMesh.material.opacity = document.global.powerUp.invisibility.opacity;
	else
		sphereMesh.material.opacity = 1;
	
	sphereMesh.velocityX = (sphereMesh.position.x - paddle.position.x) / document.global.paddle.hitBackModifier; 
	sphereMesh.velocityY = (sphereMesh.position.y - paddle.position.y) / document.global.paddle.hitBackModifier;
	if (sphereMesh.velocityY < velocityBottomLimit && sphereMesh.velocityY > 0)
		sphereMesh.velocityY = velocityBottomLimit;
	if (sphereMesh.velocityY > -velocityBottomLimit && sphereMesh.velocityY < 0)
		sphereMesh.velocityY = -velocityBottomLimit;
	if (sphereMesh.velocityX < velocityBottomLimit && sphereMesh.velocityX > 0)
		sphereMesh.velocityX = velocityBottomLimit;
	if (sphereMesh.velocityX > -velocityBottomLimit && sphereMesh.velocityX < 0)
		sphereMesh.velocityX = -velocityBottomLimit;
	if (sphereMesh.velocityX > velocityTopLimit)
		sphereMesh.velocityX = velocityTopLimit;
	if (sphereMesh.velocityX < -velocityTopLimit)
		sphereMesh.velocityX = -velocityTopLimit;
	if (sphereMesh.velocityY > velocityTopLimit)
		sphereMesh.velocityY = velocityTopLimit;
	if (sphereMesh.velocityY < -velocityTopLimit)
		sphereMesh.velocityY = -velocityTopLimit;
	sphereMesh.velocityZ *= -1;
  }

function isXCollision(sphereMesh) {
	const radius = document.global.sphere.radius;
	const halfArenaWidth = document.global.arena.width / 2;
	const sphereX = sphereMesh.position.x;
	return sphereX - radius <= -halfArenaWidth || sphereX + radius >= halfArenaWidth;
			
}

function isYCollision(sphereMesh) {
	const radius = document.global.sphere.radius;
	const halfArenaHeight = document.global.arena.height / 2;
	const sphereY = sphereMesh.position.y;
	return sphereY - radius <= -halfArenaHeight || sphereY + radius >= halfArenaHeight;
}

function isZCollision(sphereMesh) {
	const radius = document.global.sphere.radius;
	const halfArenaDepth = document.global.arena.depth / 2;
	const sphereZ = sphereMesh.position.z;
	return sphereZ - radius <= -halfArenaDepth || sphereZ + radius >= halfArenaDepth
}

function isPowerUpCollision() {
	const sphereRadius = document.global.sphere.radius;
	const powerUpCircleRadius = document.global.powerUp.circleRadius;
	for (let i = 0; i < document.global.sphereMesh.length; i++) {
		const distance = document.global.sphereMesh[i].position.distanceTo(document.global.powerUp.mesh[document.global.powerUp.index].position);
		if (distance <= sphereRadius + powerUpCircleRadius)
			return true;
	}
	return false;
}

function powerUpCollisionEffect() {
	// document.global.gameplay.gameStart = 0;
	//set visibility of powerup sphere to false;
	document.global.powerUp.mesh[document.global.powerUp.index].visible = false;
	//change color of rotating circle around main sphere to current powerup color and render visible
	const circleMaterial = new THREE.LineBasicMaterial( { color: document.global.powerUp.color[document.global.powerUp.index], transparent:true, opacity:1});
	document.global.sphereMesh.forEach(sphereMesh=>{
		sphereMesh.children[0].material.dispose();
		sphereMesh.children[1].material.dispose();
		sphereMesh.children[0].material = circleMaterial;
		sphereMesh.children[1].material = circleMaterial;
		//if invisibility power, change opacity
		if (document.global.powerUp.index == 2) {
			sphereMesh.children[0].material.opacity = document.global.powerUp.invisibility.opacity;
			sphereMesh.children[1].material.opacity = document.global.powerUp.invisibility.opacity;
		}
		sphereMesh.children[0].visible = true;
		sphereMesh.children[1].visible = true;
	})
	
	//individual effects
	//large paddle
	if (document.global.powerUp.index === 0) {
		const powerUpPaddleGeometry = new THREE.BoxGeometry(document.global.paddle.width * document.global.powerUp.largePaddle.multiplier, document.global.paddle.height * document.global.powerUp.largePaddle.multiplier, document.global.paddle.thickness )
		//only one sphere when this powerup occur, so hardcode
		if (document.global.sphereMesh[0].velocityZ <= 0) {
			document.global.paddle.paddles[0].largePaddle = 1;
			document.global.paddle.paddles[0].geometry.dispose();
			document.global.paddle.paddles[0].geometry = powerUpPaddleGeometry;
			if (document.global.paddle.paddles[2]) {
				document.global.paddle.paddles[2].largePaddle = 1;
				document.global.paddle.paddles[2].geometry.dispose();
				document.global.paddle.paddles[2].geometry = powerUpPaddleGeometry;
			}
		}
		else if (document.global.sphereMesh[0].velocityZ > 0) {
			document.global.paddle.paddles[1].largePaddle = 1;
			document.global.paddle.paddles[1].geometry.dispose();
			document.global.paddle.paddles[1].geometry = powerUpPaddleGeometry;
			if (document.global.paddle.paddles[3]) {
				document.global.paddle.paddles[3].largePaddle = 1;
				document.global.paddle.paddles[3].geometry.dispose();
				document.global.paddle.paddles[3].geometry = powerUpPaddleGeometry;
			}
		}
		
	}
	//no effects here for shake

	//invisibility
	else if (document.global.powerUp.index === 2) {
		if (document.global.sphereMesh[0].velocityZ <= 0) {
			document.global.paddle.paddles[0].invisibility = 1;
			if (document.global.paddle.paddles[2])
				document.global.paddle.paddles[2].invisibility = 1;
		}
		else if (document.global.sphereMesh[0].velocityZ > 0) {
			document.global.paddle.paddles[1].invisibility = 1;
			if (document.global.paddle.paddles[3]) {
				document.global.paddle.paddles[3].largePaddle = 1;
			}
		}
		document.global.sphereMesh[0].material.opacity = document.global.powerUp.invisibility.opacity;
	}

	//double 
	else if (document.global.powerUp.index === 3) {
		createSphereMesh(document.global.arena3D, -document.global.sphereMesh[0].velocityX, -document.global.sphereMesh[0].velocityY, document.global.sphereMesh[0].velocityZ);
		document.global.sphereMesh.forEach(sphereMesh=>{
			sphereMesh.children[0].material.dispose();
			sphereMesh.children[1].material.dispose();
			sphereMesh.children[0].material = circleMaterial;
			sphereMesh.children[1].material = circleMaterial;
			sphereMesh.children[0].visible = true;
			sphereMesh.children[1].visible = true;
		})
	}
	//ultimate
	else if (document.global.powerUp.index === 4) {
		for (let i = 0; i < document.global.powerUp.ultimate.count; i++) {
			if (i < document.global.powerUp.ultimate.count / 4)
				createSphereMesh(document.global.arena3D, -document.global.sphereMesh[0].velocityX / (i * 4), -document.global.sphereMesh[0].velocityY / (i * 4), document.global.sphereMesh[0].velocityZ);
			else if (i < document.global.powerUp.ultimate.count / 2)
				createSphereMesh(document.global.arena3D, document.global.sphereMesh[0].velocityX / (i * 2), document.global.sphereMesh[0].velocityY / (i * 2), document.global.sphereMesh[0].velocityZ);
			else if (i < document.global.powerUp.ultimate.count * 3 / 4)
				createSphereMesh(document.global.arena3D, -document.global.sphereMesh[0].velocityX / (i * 3 / 4), document.global.sphereMesh[0].velocityY / (i * 3 / 4), document.global.sphereMesh[0].velocityZ);
			else
				createSphereMesh(document.global.arena3D, document.global.sphereMesh[0].velocityX / i, -document.global.sphereMesh[0].velocityY / i, document.global.sphereMesh[0].velocityZ);
			document.global.sphereMesh.forEach(sphereMesh=>{
				sphereMesh.children[0].material.dispose();
				sphereMesh.children[1].material.dispose();
				sphereMesh.children[0].material = circleMaterial;
				sphereMesh.children[1].material = circleMaterial;
				sphereMesh.children[0].visible = true;
				sphereMesh.children[1].visible = true;
			})
		}
	}
}

export function resetPowerUp() {
	if (document.global.powerUp.enable) {
		//reset settings for all powerup and randomise powerup rendering.
		document.global.powerUp.mesh[document.global.powerUp.index].visible = false;
		
		//reset visibile for sphere circle radius
		document.global.sphereMesh.forEach(sphereMesh=>{
			sphereMesh.children[0].visible = false;
			sphereMesh.children[1].visible = false;
		})

		//individual RESETS
		//large paddles reset
		if (document.global.powerUp.index === 0) {
			const paddleGeometry = new THREE.BoxGeometry(document.global.paddle.width, document.global.paddle.height, document.global.paddle.thickness )
			document.global.paddle.paddles.forEach(paddle=>{
				paddle.largePaddle = 0;
				paddle.geometry = paddleGeometry;
			});
		}
		//shake reset
		else if (document.global.powerUp.index === 1) {
			document.global.arena3D.position.set(0,0,0);
		}
		//invisibility reset
		else if (document.global.powerUp.index === 2) {
			document.global.sphereMesh.forEach(sphereMesh=>{
				sphereMesh.material.opacity = 1;
			});
			document.global.paddle.paddles.forEach(paddle=>{
				if (paddle.invisibility) 
					paddle.invisibility = 0;
			});
		}
		//double reset
		else if (document.global.powerUp.index === 3) {
			if (document.global.sphereMesh.length > 1) {
				document.global.arena3D.children.pop();
				document.global.sphereMesh.pop();
			}
		}
		//ultimate reset
		else if (document.global.powerUp.index === 4) {
			if (document.global.sphereMesh.length > 1) {
				for (let i = 0; i < document.global.powerUp.ultimate.count; i++) {
					document.global.arena3D.children.pop();
					document.global.sphereMesh.pop();
				}
			}
		}
		//set new random powerup and position
		document.global.powerUp.index = Math.floor(Math.random() * 5);
		document.global.powerUp.positionX = Math.floor((Math.random() * (document.global.arena.width - document.global.powerUp.circleRadius)) - (document.global.arena.width - document.global.powerUp.circleRadius)/ 2);
		document.global.powerUp.positionY = Math.floor((Math.random() * (document.global.arena.height - document.global.powerUp.circleRadius)) - (document.global.arena.height -document.global.powerUp.circleRadius) / 2);
		document.global.powerUp.positionZ = Math.floor((Math.random() * (document.global.arena.depth / 3)) - (document.global.arena.depth / 3));
		document.global.powerUp.mesh[document.global.powerUp.index].position.set(document.global.powerUp.positionX, document.global.powerUp.positionY, document.global.powerUp.positionZ);
		document.global.powerUp.mesh[document.global.powerUp.index].visible = true;
	}
}

function updateSpherePosition(sphereMesh) {
	sphereMesh.position.x += sphereMesh.velocityX;
	sphereMesh.position.y += sphereMesh.velocityY;
	sphereMesh.position.z += sphereMesh.velocityZ;
}

export function processSphereMovement() {
	if (document.global.gameplay.gameStart) {
		document.global.sphereMesh.forEach(sphereMesh=>{
			updateSpherePosition(sphereMesh);
			if(isXCollision(sphereMesh)) {
				sphereMesh.velocityX *= -1;
			}
			if(isYCollision(sphereMesh)) {
				sphereMesh.velocityY *= -1;
			}
			if(isZCollision(sphereMesh)) {
				//for gameplay debugging
				if (document.global.gameplay.immortality) {
					sphereMesh.velocityZ *= -1;
				}
				else {
					document.global.pointLight.castShadow = false;
					document.global.gameplay.shadowFrame = 0;
					document.global.gameplay.gameStart = 0;
					sphereMesh.position.set(0,0,0);
					sphereMesh.velocityX = document.global.sphere.velocityX;
					sphereMesh.velocityY = document.global.sphere.velocityY;
					sphereMesh.velocityZ = document.global.sphere.velocityZ;
					resetPowerUp();
				}
			}
			if (document.global.powerUp.enable && document.global.powerUp.mesh[document.global.powerUp.index].visible === true && isPowerUpCollision()) {
				powerUpCollisionEffect();
			}
			let paddleCollisionIndex = isPaddleCollision(document.global.paddle.paddles, sphereMesh);
			if(paddleCollisionIndex !== false)
				hitSphereBack(document.global.paddle.paddles[paddleCollisionIndex], sphereMesh);
		})
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








