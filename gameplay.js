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
	const canvas = document.querySelector(".canvas");
	const canvasContainer = document.querySelector(".canvas-container");
	let paddleWidth = document.global.paddle.defaultWidth;
	let paddleHeight = document.global.paddle.defaultHeight;
	const canvasWidth = canvas.clientWidth;
	const canvasHeight = canvas.clientHeight;
	const arenaWidth = document.global.arena.width;
	const arenaHeight = document.global.arena.height;
	const offsetTop = canvasContainer.offsetTop;
	const offsetLeft = canvasContainer.offsetLeft;
    const mouseX = e.clientX - offsetLeft;
	const mouseY = e.clientY - offsetTop;
	const paddlesProperty = document.global.paddle.paddlesProperty;

	//large paddle power up modification
	if ((document.global.gameplay.local && paddlesProperty[0].largePaddle) || (!document.global.gameplay.local && paddlesProperty[document.global.gameplay.playerNum].largePaddle)) { 
		paddleWidth = paddleWidth * document.global.powerUp.largePaddle.multiplier;
		paddleHeight = paddleHeight * document.global.powerUp.largePaddle.multiplier;
	}
	

	//calculation of positionX and positionY for paddle
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
	
	if (!document.global.gameplay.pause) {
		// For local game, mouse is attached to paddle nearest to camera
		if (document.global.gameplay.local) {
			if ((document.global.arena3D.rotation.x - Math.PI / 2) % (Math.PI * 2) > 0 && (document.global.arena3D.rotation.x - Math.PI/2) % (Math.PI * 2) < Math.PI)
				paddlesProperty[0].positionY = -positionY;
			else
				paddlesProperty[0].positionY = positionY;
			if ((document.global.arena3D.rotation.y - Math.PI / 2) % (Math.PI * 2) > 0 && (document.global.arena3D.rotation.y - Math.PI/2) % (Math.PI * 2) < Math.PI)
				paddlesProperty[0].positionX = -positionX;
			else
				paddlesProperty[0].positionX = positionX;
		}
		//For multi, mouse is attached to player num
		if (!document.global.gameplay.local) {
			if ((document.global.arena3D.rotation.x - Math.PI / 2) % (Math.PI * 2) > 0 && (document.global.arena3D.rotation.x - Math.PI/2) % (Math.PI * 2) < Math.PI)
				paddlesProperty[document.global.gameplay.playerNum].positionX = -positionX;
			else
				paddlesProperty[document.global.gameplay.playerNum].positionX = positionX;
			if ((document.global.arena3D.rotation.y - Math.PI / 2) % (Math.PI * 2) > 0 && (document.global.arena3D.rotation.y - Math.PI/2) % (Math.PI * 2) < Math.PI)
				paddlesProperty[document.global.gameplay.playerNum].positionY = -positionY;
			else
				paddlesProperty[document.global.gameplay.playerNum].positionY = positionY;
		}
	}
}

function gameStart() {
	document.global.gameplay.gameStart = 1;
	document.global.gameplay.initRotateY = 0;
	document.global.arena3D.rotation.y = 0;
	document.global.powerUp.mesh.forEach(mesh=>{
		mesh.rotation.y = 0;
		mesh.rotation.x = 0;
	})
	document.global.sphere.sphereMesh.forEach(sphereMesh=>{
		sphereMesh.rotation.y = 0;
		sphereMesh.rotation.x = 0;
	})

}

function populateGameSummary() {
	const parent = document.querySelector(".game-summary-display");
	if (document.global.gameplay.single) {
		const singleName = document.createElement("span");
		const singleScore = document.createElement("span");
		const AIname = document.createElement("span");
		const AIscore = document.createElement("span");
		singleName.textContent = document.global.gameplay.localInfo.player[0].alias;
		singleScore.textContent = document.global.gameplay.localInfo.player[0].score;
		singleScore.classList.add(document.global.gameplay.localInfo.player[0].alias + "-score")
		AIname.textContent = "A.I."
		AIscore.textContent = document.global.gameplay.computerScore;
		AIscore.classList.add("AI-score")
		const singleDiv = document.createElement("div");
		const AIDiv = document.createElement("div");
		singleDiv.appendChild(singleName);
		singleDiv.appendChild(singleScore);
		AIDiv.appendChild(AIname)
		AIDiv.appendChild(AIscore);
		const containerDiv = document.createElement("div");
		containerDiv.classList.add("game-summary-items")
		containerDiv.appendChild(singleDiv);
		containerDiv.appendChild(AIDiv);
		parent.appendChild(containerDiv);

	}
}

//addeventlistener
export function keyBinding() {
	const canvas = document.querySelector(".canvas");
	canvas.addEventListener("mousemove", canvasMouseMove);
	canvas.addEventListener("keydown", canvasKeydown);
	canvas.addEventListener("keyup", canvasKeyup);
	document.addEventListener("keydown", (e)=>{
		if (e.keyCode === 27 && document.global.gameplay.gameStart && !document.global.gameplay.gameEnd)
			document.global.gameplay.pause? document.global.gameplay.pause = 0 :document.global.gameplay.pause = 1;
		if (e.keyCode === 9)
			e.preventDefault();
		if (e.keyCode === 9 && document.global.gameplay.gameStart)
			document.global.gameplay.gameSummary = 1;

	})
	document.addEventListener("keyup", (e)=>{
		if (e.keyCode === 9)
			e.preventDefault();
		if (e.keyCode === 9 && document.global.gameplay.gameStart) 
			document.global.gameplay.gameSummary = 0;
	})
	
	document.addEventListener("click", (e)=>{
		if (!e.target.classList.contains("toggle-canvas")) {
			const menuCanvasChild = document.querySelector(".menu-canvas").querySelectorAll("*");
			if (Array.from(menuCanvasChild).every(child=>e.target !== child) && e.target !== document.querySelector(".menu-canvas"))
				document.global.ui.toggleCanvas = 0;
		}
		if (!e.target.classList.contains("toggle-chat")) {
			const menuChatChild = document.querySelector(".menu-chat").querySelectorAll("*");
			if (Array.from(menuChatChild).every(child=>e.target !== child) && e.target !== document.querySelector(".menu-chat"))
				document.global.ui.toggleChat = 0;
		}
		if (!e.target.classList.contains("toggle-game")) {
			const menuGameChild = document.querySelector(".menu-game").querySelectorAll("*");
			if (Array.from(menuGameChild).every(child=>e.target !== child) && e.target !== document.querySelector(".menu-game"))
				document.global.ui.toggleGame = 0;
		}
	})

	const toggleCanvas = document.querySelector(".toggle-canvas");
	toggleCanvas.addEventListener("click", (e)=>{
		document.global.ui.toggleCanvas? document.global.ui.toggleCanvas = 0:document.global.ui.toggleCanvas = 1;
		e.stopPropagation();
	})
	const toggleChat = document.querySelector(".toggle-chat");
	toggleChat.addEventListener("click", (e)=>{
		document.global.ui.toggleChat? document.global.ui.toggleChat = 0:document.global.ui.toggleChat = 1;
		e.stopPropagation();
	})
	const toggleGame = document.querySelector(".toggle-game");
	toggleGame.addEventListener("click", (e)=>{
		document.global.ui.toggleGame? document.global.ui.toggleGame = 0:document.global.ui.toggleGame = 1;
		e.stopPropagation();
	})
	const toggleCheat = document.querySelector(".toggle-cheat");
	toggleCheat.addEventListener("click", (e)=>{
		if (document.global.powerUp.meshProperty.some(meshProperty=>meshProperty.visible))
			powerUpCollisionEffect(document.global.sphere.sphereMeshProperty[0])
	})
	const navChat = document.querySelectorAll(".nav-chat");
	navChat.forEach(navchat=>navchat.addEventListener("click", (e)=>{
		document.global.ui.chat? document.global.ui.chat = 0:document.global.ui.chat = 1;
	}))
	const navCanvas = document.querySelector(".nav-canvas");
	navCanvas.addEventListener("click", (e)=>{
		document.global.ui.chat? document.global.ui.chat = 0:document.global.ui.chat = 1;
	})
	const local = document.querySelector(".nav-local");
	local.addEventListener("click", (e)=>{
		document.global.ui.mainMenu = 0;
		document.global.ui.local = 1;
	})
	const localBack = document.querySelector(".local-back");
	localBack.addEventListener("click", (e)=>{
		document.global.ui.mainMenu = 1;
		document.global.ui.local = 0;
	})
	const single = document.querySelector(".nav-single");
	single.addEventListener("click", (e)=>{
		document.global.ui.local = 0;
		document.global.ui.single = 1;
		
	})
	const singleBack = document.querySelector(".single-back");
	singleBack.addEventListener("click", (e)=>{
		document.global.ui.local = 1;
		document.global.ui.single = 0;
	})
	const singleAlias = document.querySelector(".single-alias");
	singleAlias.addEventListener("submit", (e)=>{
		e.preventDefault();
		const newPlayer = {
			alias:document.getElementById("single-alias-text").value,
			score:0,
		}
		document.getElementById("single-alias-text").value = "";
		if (document.global.gameplay.localInfo.player.every(player=>{
			return player.alias !== newPlayer.alias;
		}) && document.global.gameplay.localInfo.player.length < 1)
			document.global.gameplay.localInfo.player.push(newPlayer);
	})
	const singleDuration = document.getElementById("single-duration");
	singleDuration.addEventListener("change", (e)=>{
		document.global.gameplay.localInfo.duration = e.target.value;
	})
	const singlePowerup = document.getElementById("single-powerup");
	singlePowerup.addEventListener("change", (e)=>{
		document.global.gameplay.localInfo.powerUp ? document.global.gameplay.localInfo.powerUp = 0:document.global.gameplay.localInfo.powerUp = 1;
	})
	const singleLudicrious = document.getElementById("single-ludicrious");
	singleLudicrious.addEventListener("change", (e)=>{
		document.global.gameplay.localInfo.ludicrious ? document.global.gameplay.localInfo.ludicrious = 0:document.global.gameplay.localInfo.ludicrious = 1;
	})
	const singleStart = document.querySelector(".single-start");
	singleStart.addEventListener("click", (e)=>{
		if (document.global.gameplay.localInfo.player.length === 1) {
			document.global.gameplay.local = 1;
			document.global.gameplay.single = 1;
			document.global.gameplay.localInfo.durationCount = document.global.gameplay.localInfo.duration;
			document.global.powerUp.enable = document.global.gameplay.localInfo.powerUp;
			gameStart()
			populateGameSummary();
		}
	})

	const navPause = document.querySelector(".nav-pause");
	navPause.addEventListener("click", (e)=>{
		if (!document.global.gameplay.gameEnd) {
			document.global.gameplay.pause = 1;
			document.global.ui.toggleGame = 0;
		}
	})
	const pause = document.querySelector(".pause");
	pause.addEventListener("click", (e)=>{
		if (!document.global.gameplay.gameEnd)
			document.global.gameplay.pause = 0;
	})
	const gameSummary = document.querySelector(".game-summary-container");
	gameSummary.addEventListener("click", (e)=>{
		if (!document.global.gameplay.gameSummary)
			document.global.gameplay.gameSummary = 0;
	})
	const menuHome = document.querySelectorAll(".menu-home");
		menuHome.forEach(menuHome=>menuHome.addEventListener("click", (e)=>{
			document.global.gameplay.localInfo = {
				player:[],
				ludicrious:1,
				powerUp:1,
				duration:document.global.gameplay.defaultDuration,
				durationCount:document.global.gameplay.defaultDuration
			};
			document.global.ui.mainMenu = 1;
			document.global.ui.local = 0;
			document.global.ui.single = 0;
		})
	)
}

function isBallAlignedWithPaddleX(paddlesProperty, sphereMeshProperty) {
	const halfPaddleWidth = paddlesProperty.width / 2;
	const sphereX = sphereMeshProperty.positionX;
	const paddleX = paddlesProperty.positionX;

	return sphereX >= paddleX - halfPaddleWidth && sphereX <= paddleX + halfPaddleWidth;
}

function isBallAlignedWithPaddleY(paddlesProperty, sphereMeshProperty) {
	const halfPaddleHeight = paddlesProperty.height / 2;
	const sphereY = sphereMeshProperty.positionY;
	const paddleY = paddlesProperty.positionY;

	return sphereY >= paddleY - halfPaddleHeight && sphereY <= paddleY + halfPaddleHeight;
}

function isPaddleCollision(sphereMeshProperty) {
	const sphereRadius =  document.global.sphere.radius;
	const paddleThickness = document.global.paddle.thickness;
	const paddlesProperty = document.global.paddle.paddlesProperty;
	
	for (let i = 0; i < paddlesProperty.length; i++) {
		let paddleZ = paddlesProperty[i].positionZ;
		let sphereZ = sphereMeshProperty.positionZ;
		if (paddleZ <= 0 && sphereZ - sphereRadius <= paddleZ && sphereZ - sphereRadius >= paddleZ - paddleThickness && isBallAlignedWithPaddleX(paddlesProperty[i], sphereMeshProperty) && isBallAlignedWithPaddleY(paddlesProperty[i], sphereMeshProperty))
			return i;
		else if (paddleZ > 0 && sphereZ + sphereRadius >= paddleZ - paddleThickness && sphereZ + sphereRadius <= paddleZ && isBallAlignedWithPaddleX(paddlesProperty[i], sphereMeshProperty) && isBallAlignedWithPaddleY(paddlesProperty[i], sphereMeshProperty))
			return i;
	}
	return false;
}

function hitSphereBack(paddlesProperty, sphereMeshProperty) {
	const velocityTopLimit = document.global.sphere.velocityTopLimit;
	const velocityBottomLimit = document.global.sphere.velocityBottomLimit;
	//invisibility effect
	if (paddlesProperty.invisibility) {
		sphereMeshProperty.circleOpacity = document.global.powerUp.invisibility.opacity;
		sphereMeshProperty.opacity = document.global.powerUp.invisibility.opacity;
	}
	else {
		sphereMeshProperty.circleOpacity = 1;
		sphereMeshProperty.opacity = 1;
	}
	sphereMeshProperty.velocityX = (sphereMeshProperty.positionX - paddlesProperty.positionX) / document.global.paddle.hitBackModifier; 
	sphereMeshProperty.velocityY = (sphereMeshProperty.positionY - paddlesProperty.positionY) / document.global.paddle.hitBackModifier;
	if (sphereMeshProperty.velocityY < velocityBottomLimit && sphereMeshProperty.velocityY > 0)
		sphereMeshProperty.velocityY = velocityBottomLimit;
	if (sphereMeshProperty.velocityY > -velocityBottomLimit && sphereMeshProperty.velocityY < 0)
		sphereMeshProperty.velocityY = -velocityBottomLimit;
	if (sphereMeshProperty.velocityX < velocityBottomLimit && sphereMeshProperty.velocityX > 0)
		sphereMeshProperty.velocityX = velocityBottomLimit;
	if (sphereMeshProperty.velocityX > -velocityBottomLimit && sphereMeshProperty.velocityX < 0)
		sphereMeshProperty.velocityX = -velocityBottomLimit;
	if (sphereMeshProperty.velocityX > velocityTopLimit)
		sphereMeshProperty.velocityX = velocityTopLimit;
	if (sphereMeshProperty.velocityX < -velocityTopLimit)
		sphereMeshProperty.velocityX = -velocityTopLimit;
	if (sphereMeshProperty.velocityY > velocityTopLimit)
		sphereMeshProperty.velocityY = velocityTopLimit;
	if (sphereMeshProperty.velocityY < -velocityTopLimit)
		sphereMeshProperty.velocityY = -velocityTopLimit;
	sphereMeshProperty.velocityZ *= -1;
  }

function isXCollision(sphereMeshProperty) {
	const radius = document.global.sphere.radius;
	const halfArenaWidth = document.global.arena.width / 2;
	const sphereX = sphereMeshProperty.positionX;
	return sphereX - radius <= -halfArenaWidth || sphereX + radius >= halfArenaWidth;
			
}

function isYCollision(sphereMeshProperty) {
	const radius = document.global.sphere.radius;
	const halfArenaHeight = document.global.arena.height / 2;
	const sphereY = sphereMeshProperty.positionY;
	return sphereY - radius <= -halfArenaHeight || sphereY + radius >= halfArenaHeight;
}

function isZCollision(sphereMeshProperty) {
	const radius = document.global.sphere.radius;
	const halfArenaDepth = document.global.arena.depth / 2;
	const sphereZ = sphereMeshProperty.positionZ;
	return sphereZ - radius <= -halfArenaDepth || sphereZ + radius >= halfArenaDepth
}

function isPowerUpCollision(sphereMeshProperty) {
	
	const sphereRadius = document.global.sphere.radius;
	const powerUpCircleRadius = document.global.powerUp.circleRadius;
	const vectorSphereMesh = new THREE.Vector3(sphereMeshProperty.positionX, sphereMeshProperty.positionY, sphereMeshProperty.positionZ);
	let vectorPowerUpMesh;

	document.global.powerUp.meshProperty.forEach(meshProperty=>{
		if (meshProperty.visible)
			vectorPowerUpMesh = new THREE.Vector3(meshProperty.positionX, meshProperty.positionY, meshProperty.positionZ);
	})
	if (vectorPowerUpMesh) {
		const distance = vectorSphereMesh.distanceTo(vectorPowerUpMesh);
		if (distance <= sphereRadius + powerUpCircleRadius)
			return true;
	}
	return false;
}

function adjustPaddles(paddlesProperty) {
	const halfArenaWidth = document.global.arena.width / 2;
	const halfArenaHeight = document.global.arena.height / 2;

	if (paddlesProperty.positionX + paddlesProperty.width /2 > halfArenaWidth)
		paddlesProperty.positionX = halfArenaWidth - paddlesProperty.width / 2;
	if (paddlesProperty.positionX - paddlesProperty.width /2 < -halfArenaWidth)
		paddlesProperty.positionX = -halfArenaWidth + paddlesProperty.width / 2;
	if (paddlesProperty.positionY + paddlesProperty.height /2 > halfArenaHeight)
		paddlesProperty.positionY = halfArenaHeight - paddlesProperty.height / 2;
	if (paddlesProperty.positionY - paddlesProperty.height/2  < -halfArenaHeight)
		paddlesProperty.positionY = -halfArenaHeight + paddlesProperty.height / 2;
}

function powerUpCollisionEffect(sphereMeshProperty) {
	let index;
	
	//set visibility of powerup sphere to false;
	document.global.powerUp.meshProperty.forEach((meshProperty,idx)=>{
		if (meshProperty.visible)
			index = idx;
	})
	document.global.powerUp.meshProperty[index].visible = false;
	//change color of rotating circle around each sphere to current powerup color and render visible
	document.global.sphere.sphereMeshProperty.forEach(property=>{
		property.circleColor = document.global.powerUp.color[index];
		property.circleVisible = true;
	})
	
	//INDIVIDUAL POWERUP effects
	//large paddle
	if (index === 0) {
		if (sphereMeshProperty.velocityZ <= 0) {
			document.global.paddle.paddlesProperty[0].largePaddle = 1;
			document.global.paddle.paddlesProperty[0].width *= document.global.powerUp.largePaddle.multiplier;
			document.global.paddle.paddlesProperty[0].height *= document.global.powerUp.largePaddle.multiplier;
			adjustPaddles(document.global.paddle.paddlesProperty[0])
			if (document.global.paddle.paddlesProperty[2]) {
				document.global.paddle.paddlesProperty[2].largePaddle = 1;
				document.global.paddle.paddlesProperty[2].width *= document.global.powerUp.largePaddle.multiplier;
				document.global.paddle.paddlesProperty[2].height *= document.global.powerUp.largePaddle.multiplier;
				adjustPaddles(document.global.paddle.paddlesProperty[2])
			}
		}
		else if (sphereMeshProperty.velocityZ > 0) {
			document.global.paddle.paddlesProperty[1].largePaddle = 1;
			document.global.paddle.paddlesProperty[1].width *= document.global.powerUp.largePaddle.multiplier;
			document.global.paddle.paddlesProperty[1].height *= document.global.powerUp.largePaddle.multiplier;
			adjustPaddles(document.global.paddle.paddlesProperty[1])
			if (document.global.paddle.paddlesProperty[3]) {
				document.global.paddle.paddlesProperty[3].largePaddle = 1;
				document.global.paddle.paddlesProperty[3].width *= document.global.powerUp.largePaddle.multiplier;
				document.global.paddle.paddlesProperty[3].height *= document.global.powerUp.largePaddle.multiplier;
				adjustPaddles(document.global.paddle.paddlesProperty[3])
			}
		}
		
	}
	//shake
	else if (index === 1)
		document.global.powerUp.shake.enable = 1;

	//invisibility
	else if (index === 2) {
		if (sphereMeshProperty.velocityZ <= 0) {
			document.global.paddle.paddlesProperty[0].invisibility = 1;
			if (document.global.paddle.paddlesProperty[2])
				document.global.paddle.paddlesProperty[2].invisibility = 1;
		}
		else if (sphereMeshProperty.velocityZ > 0) {
			document.global.paddle.paddlesProperty[1].invisibility = 1;
			if (document.global.paddle.paddlesProperty[3]) {
				document.global.paddle.paddlesProperty[3].invisibility = 1;
			}
		}
		sphereMeshProperty.opacity = document.global.powerUp.invisibility.opacity;
		sphereMeshProperty.circleOpacity = document.global.powerUp.invisibility.opacity;
	}

	//double 
	else if (index === 3) {
		document.global.sphere.sphereMeshProperty.forEach((property,idx)=>{
			if (idx === 0 || idx === 1) {
				if (idx === 1) {
					property.positionX = document.global.powerUp.meshProperty[index].positionX;
					property.positionY = document.global.powerUp.meshProperty[index].positionY;
					property.positionZ = document.global.powerUp.meshProperty[index].positionZ;
					property.velocityZ = document.global.sphere.sphereMeshProperty[0].velocityZ;
				}
				property.visible = true;
			}
			else
				property.visible = false;
		})
	}
	//ultimate
	else if (index === 4) {
		const sphereMeshPropertyOne = document.global.sphere.sphereMeshProperty[0];

		document.global.sphere.sphereMeshProperty.forEach((property,idx)=>{
			if (idx > 0) {
				if (idx < document.global.powerUp.ultimate.count / 4) {
					property.velocityX = -sphereMeshPropertyOne.velocityX / idx;
					property.velocityY = -sphereMeshPropertyOne.velocityY / idx;
					property.velocityZ = sphereMeshPropertyOne.velocityZ;
				}
				else if (idx < document.global.powerUp.ultimate.count / 2) {
					property.velocityX = sphereMeshPropertyOne.velocityX / idx;
					property.velocityY = sphereMeshPropertyOne.velocityY / idx;
					property.velocityZ = sphereMeshPropertyOne.velocityZ;
				}
				else if (idx < document.global.powerUp.ultimate.count * 3 / 4) {
					property.velocityX = -sphereMeshPropertyOne.velocityX / idx;
					property.velocityY = sphereMeshPropertyOne.velocityY / idx;
					property.velocityZ = sphereMeshPropertyOne.velocityZ;
				}
				else {
					property.velocityX = sphereMeshPropertyOne.velocityX / idx;
					property.velocityY = -sphereMeshPropertyOne.velocityY / idx;
					property.velocityZ = sphereMeshPropertyOne.velocityZ;
				}
				property.positionX = document.global.powerUp.meshProperty[index].positionX;
				property.positionY = document.global.powerUp.meshProperty[index].positionY;
				property.positionZ = document.global.powerUp.meshProperty[index].positionZ;
				property.velocityZ = sphereMeshPropertyOne.velocityZ;
				property.visible = true;
			}
		})
	}
}

export function resetPowerUp() {
		document.global.sphere.sphereMeshProperty.forEach((sphereMeshProperty, idx)=>{
			//reset visible for sphere circle
			sphereMeshProperty.circleVisible = false;
			//invisibility reset
			sphereMeshProperty.opacity = 1;
			//double and ultimate sphere reset
			if (idx === 0)
				sphereMeshProperty.visible = true;
			else
				sphereMeshProperty.visible = false;

		})
		//reset visible for powerup mesh
		document.global.powerUp.meshProperty.forEach(meshProperty=>{
			meshProperty.visible = false;
		})
		
		document.global.paddle.paddlesProperty.forEach(paddleProperty=>{
			//large paddles reset
			paddleProperty.largePaddle = 0;
			paddleProperty.width = document.global.paddle.defaultWidth;
			paddleProperty.height = document.global.paddle.defaultHeight;
			//paddles invisibility reset
			paddleProperty.invisibility = 0;
		});
		//shake reset
		document.global.powerUp.shake.enable = 0;

		//set new random powerup and position
		const random = Math.floor(Math.random() * 5);
		document.global.powerUp.meshProperty[random].visible = true;
		document.global.powerUp.meshProperty[random].positionX = Math.floor((Math.random() * (document.global.arena.width - document.global.powerUp.circleRadius)) - (document.global.arena.width - document.global.powerUp.circleRadius)/ 2);
		document.global.powerUp.meshProperty[random].positionY = Math.floor((Math.random() * (document.global.arena.height - document.global.powerUp.circleRadius)) - (document.global.arena.height -document.global.powerUp.circleRadius) / 2);
		document.global.powerUp.meshProperty[random].positionZ = Math.floor((Math.random() * (document.global.arena.depth / 3)) - (document.global.arena.depth / 3));
}

function updateSpherePosition(sphereMeshProperty) {
	sphereMeshProperty.positionX += sphereMeshProperty.velocityX;
	sphereMeshProperty.positionY += sphereMeshProperty.velocityY;
	sphereMeshProperty.positionZ += sphereMeshProperty.velocityZ;
}

export function processGame() {
	if (document.global.gameplay.local || !document.global.gameplay.local && document.global.gameplay.mainClient) {
		if (document.global.gameplay.roundStart && document.global.gameplay.gameStart && !document.global.gameplay.pause && !document.global.gameplay.gameEnd) {
			document.global.sphere.sphereMeshProperty.forEach(sphereMeshProperty=>{
				if (sphereMeshProperty.visible) {
					updateSpherePosition(sphereMeshProperty)
					if(isXCollision(sphereMeshProperty)) {
						sphereMeshProperty.velocityX *= -1;
					}
					if(isYCollision(sphereMeshProperty)) {
						sphereMeshProperty.velocityY *= -1;
					}
					if(isZCollision(sphereMeshProperty)) {
						//for gameplay debugging
						if (document.global.gameplay.immortality) {
							sphereMeshProperty.velocityZ *= -1;
						}
						else {
							document.global.gameplay.roundStart = 0;
							if (document.global.gameplay.single) {
								if (sphereMeshProperty.positionZ > 0)
									document.global.gameplay.computerScore += 1;
								else {
									document.global.gameplay.localInfo.player[0].score += 1;
								}
							}
							document.global.sphere.sphereMeshProperty.forEach(sphereMeshProperty=>{
								sphereMeshProperty.positionX = 0;
								sphereMeshProperty.positionY = 0;
								sphereMeshProperty.positionZ = 0;
								sphereMeshProperty.velocityX = document.global.sphere.velocityX;
								sphereMeshProperty.velocityY = document.global.sphere.velocityY;
								sphereMeshProperty.velocityZ = document.global.sphere.velocityZ;
							})
							resetPowerUp();
						}
					}
					if (document.global.powerUp.enable && isPowerUpCollision(sphereMeshProperty)) {
						powerUpCollisionEffect(sphereMeshProperty);
					}
					let paddleCollisionIndex = isPaddleCollision(sphereMeshProperty);
					if(paddleCollisionIndex !== false)
						hitSphereBack(document.global.paddle.paddlesProperty[paddleCollisionIndex], sphereMeshProperty);
					
				}
			})
		}
		
	}
	
	
}


export function movePaddle() {
	let arenaWidth = document.global.arena.width;
	let arenaHeight = document.global.arena.height;
	let paddleWidth = document.global.paddle.defaultWidth;
	let paddleHeight = document.global.paddle.defaultHeight;
	let largePaddleWidth = paddleWidth * document.global.powerUp.largePaddle.multiplier;
	let largePaddleHeight = paddleHeight * document.global.powerUp.largePaddle.multiplier;
	let paddleOne;
	let paddleTwo;

	//local game or multiplayer
	if (document.global.gameplay.local) {
		paddleOne = document.global.paddle.paddlesProperty[0];
		paddleTwo = document.global.paddle.paddlesProperty[1];
	}
	else if (!document.global.gameplay.local)
		paddleOne = document.global.paddle.paddlesProperty[document.global.gameplay.playerNum];

	//modification for large paddle powerup
	if (paddleOne.largePaddle) {
		paddleWidth = largePaddleWidth;
		paddleHeight = largePaddleHeight;
	}
	if (!document.global.gameplay.pause && !document.global.gameplay.gameEnd) {
		if ((document.global.arena3D.rotation.x - Math.PI / 2) % (Math.PI * 2) > 0 && (document.global.arena3D.rotation.x - Math.PI/2) % (Math.PI * 2) < Math.PI) {
			if (paddleOne.positionY < (arenaHeight / 2) - (paddleHeight/2))
				paddleOne.positionY += document.global.keyboard.s * document.global.keyboard.speed;
			if (paddleOne.positionY > (-arenaHeight / 2) + (paddleHeight/2))
				paddleOne.positionY -= document.global.keyboard.w * document.global.keyboard.speed;
		}
		else {
			if (paddleOne.positionY < (arenaHeight / 2) - (paddleHeight/2))
				paddleOne.positionY += document.global.keyboard.w * document.global.keyboard.speed;
			if (paddleOne.positionY > (-arenaHeight / 2) + (paddleHeight/2))
				paddleOne.positionY -= document.global.keyboard.s * document.global.keyboard.speed;
		}
		if ((document.global.arena3D.rotation.y - Math.PI / 2) % (Math.PI * 2) > 0 && (document.global.arena3D.rotation.y - Math.PI/2) % (Math.PI * 2) < Math.PI) {
			if (paddleOne.positionX < (arenaWidth / 2) - (paddleWidth/2))
				paddleOne.positionX += document.global.keyboard.a * document.global.keyboard.speed;
			if (paddleOne.positionX > (-arenaWidth / 2) + (paddleWidth/2))
				paddleOne.positionX -= document.global.keyboard.d * document.global.keyboard.speed;
		}
		else {
			if (paddleOne.positionX < (arenaWidth / 2) - (paddleWidth/2))
				paddleOne.positionX += document.global.keyboard.d * document.global.keyboard.speed;
			if (paddleOne.positionX > (-arenaWidth / 2) + (paddleWidth/2))
				paddleOne.positionX -= document.global.keyboard.a * document.global.keyboard.speed;
		}
	}
	if (document.global.gameplay.local && !document.global.gameplay.single) {
		let paddleWidth = document.global.paddle.defaultWidth;
		let paddleHeight = document.global.paddle.defaultHeight;
			//modification for large paddle powerup
		if (paddleTwo.largePaddle) {
			paddleWidth = largePaddleWidth;
			paddleHeight = largePaddleHeight;
		}
		if (!document.global.gameplay.pause && !document.global.gameplay.gameEnd) {
			if ((document.global.arena3D.rotation.x - Math.PI / 2) % (Math.PI * 2) > 0 && (document.global.arena3D.rotation.x - Math.PI/2) % (Math.PI * 2) < Math.PI) {
				if (paddleTwo.positionY < (arenaHeight / 2) - (paddleHeight/2))
					paddleTwo.positionY += document.global.keyboard.down * document.global.keyboard.speed;
				if (paddleTwo.positionY > (-arenaHeight / 2) + (paddleHeight/2))
					paddleTwo.positionY -= document.global.keyboard.up * document.global.keyboard.speed;
			}
			else {
				if (paddleTwo.positionY < (arenaHeight / 2) - (paddleHeight/2))
					paddleTwo.positionY += document.global.keyboard.up * document.global.keyboard.speed;
				if (paddleTwo.positionY > (-arenaHeight / 2) + (paddleHeight/2))
					paddleTwo.positionY -= document.global.keyboard.down * document.global.keyboard.speed;
			}
			if ((document.global.arena3D.rotation.y - Math.PI / 2) % (Math.PI * 2) > 0 && (document.global.arena3D.rotation.y - Math.PI/2) % (Math.PI * 2) < Math.PI) {
				if (paddleTwo.positionX < (arenaWidth / 2) - (paddleWidth/2))
					paddleTwo.positionX += document.global.keyboard.left * document.global.keyboard.speed;
				if (paddleTwo.positionX > (-arenaWidth / 2) + (paddleWidth/2))
					paddleTwo.positionX -= document.global.keyboard.right * document.global.keyboard.speed;
			}
			else {
				if (paddleTwo.positionX < (arenaWidth / 2) - (paddleWidth/2))
					paddleTwo.positionX += document.global.keyboard.right * document.global.keyboard.speed;
				if (paddleTwo.positionX > (-arenaWidth / 2) + (paddleWidth/2))
					paddleTwo.positionX -= document.global.keyboard.left * document.global.keyboard.speed;
			}
		}
		
	}
}








