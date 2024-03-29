import * as THREE from 'https://threejs.org/build/three.module.js';
import {processGame} from './gameplay.js';
import {movePaddle} from './gameplay.js';
import {keyBinding} from './gameplay.js';
import {createPowerUp} from './powerup.js';
import {createFirstHalfCircleGeometry} from './powerup.js';
import {createSecondHalfCircleGeometry} from './powerup.js';
import {resetPowerUp} from './gameplay.js'
import {init} from './init.js'

function resizeRendererToDisplaySize( renderer ) {

	const canvas = renderer.domElement;
	const width = canvas.clientWidth;
	const height = canvas.clientHeight;
	const needResize = canvas.width !== width || canvas.height !== height;
	if ( needResize ) {
		renderer.setSize( width, height, false );
	}
	return needResize;
}

function createArenaMesh(arena3D) {
	const arenaMaterial = new THREE.LineBasicMaterial( { color: document.global.arena.color } );
	
	const arenaMesh = [];
	for (let i = 0; i < document.global.arena.thickness; i++) {
		const arenaGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry( (document.global.clientWidth + i) / document.global.arena.widthDivision,
		(document.global.clientWidth + i) / document.global.arena.aspect / document.global.arena.widthDivision , (document.global.clientWidth + 1) / document.global.arena.aspect));
		arenaMesh.push(new THREE.LineSegments( arenaGeometry, arenaMaterial ));
		arena3D.add(arenaMesh[i]);
	}
	document.global.arenaMesh = arenaMesh;
}

function createPowerUpCircle(sphereMesh) {
	const firstHalfCircleGeometry = createFirstHalfCircleGeometry(document.global.sphere.circleRadius);
	const SecondHalfCircleGeometry = createSecondHalfCircleGeometry(document.global.sphere.circleRadius);
	const circleMaterial = new THREE.LineBasicMaterial( { color: "#fff", transparent:true, opacity:1});
	const firstHalfCircleMesh = new THREE.Line( firstHalfCircleGeometry, circleMaterial);
	const secondHalfCircleMesh = new THREE.Line( SecondHalfCircleGeometry, circleMaterial);
	firstHalfCircleMesh.visible = false;
	secondHalfCircleMesh.visible = false;
	sphereMesh.add(firstHalfCircleMesh);
	sphereMesh.add(secondHalfCircleMesh);

}

export function createSphereMesh(arena3D) {
	const sphereGeometry = new THREE.SphereGeometry( document.global.sphere.radius, document.global.sphere.widthSegments, document.global.sphere.heightSegments );
	const sphereMaterial = new THREE.MeshPhongMaterial( { color: document.global.sphere.color, emissive: document.global.sphere.color, shininess:document.global.sphere.shininess, transparent:true, opacity:1 } );
	
	for (let i = 0; i < document.global.powerUp.ultimate.count; i++) {
		const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
		const sphereMeshProperty = {
			positionX:0,
			positionY:0,
			positionZ:0,
			velocityX:document.global.sphere.velocityX,
			velocityY:document.global.sphere.velocityY,
			velocityZ:document.global.sphere.velocityZ,
			opacity:1,
			visible:false,
			circleVisible:false,
			circleColor:"#fff",
			circleOpacity:1,
		}
		if (i === 0)
			sphereMeshProperty.visible = true;
		//create powerup surrounding circle timer
		createPowerUpCircle(sphereMesh);
		sphereMesh.castShadow=true;
		document.global.sphere.sphereMesh.push(sphereMesh);
		document.global.sphere.sphereMeshProperty.push(sphereMeshProperty);
		arena3D.add(sphereMesh);
	}
}

function createCamera() {
	const camera = new THREE.PerspectiveCamera( document.global.camera.fov, document.global.arena.aspect, document.global.camera.near, document.global.camera.far );
	camera.position.z = document.global.camera.positionZ;
	// camera.position.y = document.global.arena.width;
	// 	camera.rotation.x = -Math.PI/5
	return camera;
}

function createPaddleMesh(arena3D) {
	const colorPalette = document.global.paddle.color[document.global.gameplay.backgroundIndex];
	const paddleGeometry = new THREE.BoxGeometry(document.global.paddle.defaultWidth, document.global.paddle.defaultHeight, document.global.paddle.thickness )
	const paddleMaterialOne = new THREE.MeshPhongMaterial( { color: colorPalette[0], emissive: colorPalette[0], transparent:true, opacity:document.global.paddle.opacity });
	const paddleMaterialTwo = new THREE.MeshPhongMaterial( { color: colorPalette[1], emissive: colorPalette[1], transparent:true, opacity:document.global.paddle.opacity });
	const paddleMaterialThree = new THREE.MeshPhongMaterial( { color: colorPalette[2], emissive: colorPalette[2], transparent:true, opacity:document.global.paddle.opacity });
	const paddleMaterialFour = new THREE.MeshPhongMaterial( { color: colorPalette[3], emissive: colorPalette[3], transparent:true, opacity:document.global.paddle.opacity });
	const paddleMeshPropertyTemplate = {
		positionX:0,
		positionY:0,
		positionZ:0,
		largePaddle:0,
		invisibility:0,
		width:document.global.paddle.defaultWidth,
		height:document.global.paddle.defaultHeight
	}
	
	if (document.global.gameplay.local) {
		for (let i = 0; i < 2; i++) {
			let paddleMesh;
			const paddleMeshProperty = {...paddleMeshPropertyTemplate};
			if (i === 0) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialOne);
				paddleMesh.castShadow = true;
				paddleMeshProperty.positionX = 0;
				paddleMeshProperty.positionY = 0;
				paddleMeshProperty.positionZ = (document.global.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier);
			}
			else {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialTwo);
				paddleMesh.castShadow = true;
				paddleMeshProperty.positionX = 0;
				paddleMeshProperty.positionY = 0;
				paddleMeshProperty.positionZ = -(document.global.clientWidth / document.global.arena.aspect / 2) + (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier)
			}
			document.global.paddle.paddles.push(paddleMesh);
			document.global.paddle.paddlesProperty.push(paddleMeshProperty);
			arena3D.add(paddleMesh);
		}
	}
	else if (!document.global.gameplay.local) {
		for (let i = 0; i < document.global.gameplay.playerCount; i++) {
			let paddleMesh;
			const paddleMeshProperty = {...paddleMeshPropertyTemplate};

			if (i === 0) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialOne);
				paddleMesh.castShadow = true;
				if (document.global.gameplay.playerCount > 2) {
					paddleMeshProperty.positionX = -document.global.paddle.defaultWidth / 4;
					paddleMeshProperty.positionY = -document.global.paddle.defaultHeight / 4;
					paddleMeshProperty.positionZ = (document.global.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier)
				}
				else {
					paddleMeshProperty.positionX = 0;
					paddleMeshProperty.positionY = 0;
					paddleMeshProperty.positionZ = (document.global.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier)
				}
			}
			else if (i === 1) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialTwo);
				paddleMesh.castShadow = true;
				if (document.global.gameplay.playerCount == 4) {
					paddleMeshProperty.positionX = -document.global.paddle.defaultWidth / 4;
					paddleMeshProperty.positionY = -document.global.paddle.defaultHeight / 4;
					paddleMeshProperty.positionZ = -(document.global.clientWidth / document.global.arena.aspect / 2) + (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier)
				}
				else {
					paddleMeshProperty.positionX = 0;
					paddleMeshProperty.positionY = 0;
					paddleMeshProperty.positionZ = -(document.global.clientWidth / document.global.arena.aspect / 2) + (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier)
				}
			}
			else if (i === 2) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialThree);
				paddleMesh.castShadow = true;
				if (document.global.gameplay.playerCount > 2) {
					paddleMeshProperty.positionX = document.global.paddle.defaultWidth / 4;
					paddleMeshProperty.positionY = document.global.paddle.defaultHeight / 4;
					paddleMeshProperty.positionZ = (document.global.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier * 4)
				}
				else {
					paddleMeshProperty.positionX = 0;
					paddleMeshProperty.positionY = 0;
					paddleMeshProperty.positionZ = (document.global.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier * 4)
				}
			}
			else if (i === 3) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialFour);
				paddleMesh.castShadow = true;
				paddleMeshProperty.positionX = document.global.paddle.defaultWidth / 4;
				paddleMeshProperty.positionY = document.global.paddle.defaultHeight / 4;
				paddleMeshProperty.positionZ = -(document.global.clientWidth / document.global.arena.aspect / 2) + (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier * 4)
			}
			document.global.paddle.paddles.push(paddleMesh);
			document.global.paddle.paddlesProperty.push(paddleMeshProperty);
			arena3D.add(paddleMesh);
		}
	}
	
}

function createDirectionalLight(arena3D) {
	const directionalLight = new THREE.DirectionalLight(document.global.directionalLight.color, document.global.directionalLight.intensity);
	directionalLight.position.set(document.global.directionalLight.positionX,document.global.directionalLight.positionY, document.global.directionalLight.positionZ);
	document.global.directionalLight = directionalLight;
	arena3D.add(directionalLight);
}

function createPointLight(arena3D) {
	const pointLight = new THREE.PointLight(document.global.pointLight.color , document.global.pointLight.intensity, document.global.pointLight.distance);
	document.global.pointLight = pointLight;
	arena3D.add(pointLight);
}

function createShadowPlanes(arena3D) {
	const geometrySides = new THREE.PlaneGeometry( document.global.shadowPlane.sideWidth, document.global.shadowPlane.sideHeight );
	const geometryTopBottom = new THREE.PlaneGeometry( document.global.shadowPlane.TopBottomWidth, document.global.shadowPlane.sideHeight );
	const material = new THREE.ShadowMaterial({side:THREE.DoubleSide});
	material.opacity = document.global.shadowPlane.opacity;
	const shadowPlanes = [];

	//sides
	for (let i = 0; i < 2; i++) {
		const plane = new THREE.Mesh( geometrySides, material );
		plane.rotateX( Math.PI /2 );
		plane.rotateY( Math.PI /2 );
		plane.receiveShadow = true;
		arena3D.add( plane );
		shadowPlanes[i] = plane;
	}
	shadowPlanes[0].position.set(-document.global.clientWidth / document.global.arena.widthDivision / 2, 0, 0);
	shadowPlanes[1].position.set(document.global.clientWidth / document.global.arena.widthDivision / 2, 0, 0);
	//top bottom
	for (let i = 2; i < 4; i++) {
		const plane = new THREE.Mesh( geometryTopBottom, material );
		plane.rotateX( Math.PI /2 );
		plane.receiveShadow = true;
		arena3D.add( plane );
		shadowPlanes[i] = plane;
	}
	shadowPlanes[2].position.set(0, document.global.clientWidth / document.global.arena.aspect/ document.global.arena.widthDivision / 2, 0);
	shadowPlanes[3].position.set(0,-document.global.clientWidth / document.global.arena.aspect/ document.global.arena.widthDivision / 2, 0);
	document.global.shadowPlanes = shadowPlanes;
}

function processCamera(camera) {
	if (!document.global.gameplay.gameStart || document.global.gameplay.gameEnd) {
		camera.position.y = document.global.camera.initPositionY;
		camera.rotation.x = document.global.camera.initRotationX;
	}
	else {
		camera.position.y = 0;
		camera.rotation.x = 0;
	}
	camera.updateProjectionMatrix();
}

function processSphere() {
	document.global.sphere.sphereMesh.forEach((sphereMesh,idx)=>{
		//update position
		sphereMesh.position.set(document.global.sphere.sphereMeshProperty[idx].positionX, document.global.sphere.sphereMeshProperty[idx].positionY, document.global.sphere.sphereMeshProperty[idx].positionZ)
		//render visibility
		if (document.global.sphere.sphereMeshProperty[idx].visible)
			sphereMesh.visible = true;
		else
			sphereMesh.visible = false;
		
		//render surrounding circle color and opacity
		const circleMaterial = new THREE.LineBasicMaterial( { color: document.global.sphere.sphereMeshProperty[idx].circleColor, transparent:true, opacity:document.global.sphere.sphereMeshProperty[idx].circleOpacity});
		sphereMesh.children[0].material.dispose();
		sphereMesh.children[1].material.dispose();
		sphereMesh.children[0].material = circleMaterial;
		sphereMesh.children[1].material = circleMaterial;

		//render surrounding circle visibility
		if (document.global.sphere.sphereMeshProperty[idx].circleVisible) {
			sphereMesh.children[0].visible = true;
			sphereMesh.children[1].visible = true;
		}
		else {
			sphereMesh.children[0].visible = false;
			sphereMesh.children[1].visible = false;
		}
		//render opacity
		const sphereMaterial = new THREE.MeshPhongMaterial( { color: document.global.sphere.color, emissive: document.global.sphere.color, shininess:document.global.sphere.shininess, transparent:true, opacity:document.global.sphere.sphereMeshProperty[idx].opacity } );
		sphereMesh.material.dispose();
		sphereMesh.material = sphereMaterial;
	})
}

function processPaddle() {
	document.global.paddle.paddles.forEach((paddle,idx)=>{
		//Update position each paddle
		paddle.position.set(document.global.paddle.paddlesProperty[idx].positionX, document.global.paddle.paddlesProperty[idx].positionY, document.global.paddle.paddlesProperty[idx].positionZ);
		//Update height and width of each paddle
		if (document.global.paddle.paddlesProperty[idx].width != paddle.geometry.width || document.global.paddle.paddlesProperty[idx].height != paddle.geometry.height) {
			const paddleGeometry = new THREE.BoxGeometry(document.global.paddle.paddlesProperty[idx].width, document.global.paddle.paddlesProperty[idx].height, document.global.paddle.thickness );
			paddle.geometry.dispose()
			paddle.geometry = paddleGeometry;
		}
	})
}

function processPowerUp() {
	document.global.powerUp.mesh.forEach((mesh, idx)=>{
		//rotate circle around each powerup
		mesh.rotation.z += document.global.powerUp.circleRotation;
		//render visible 
		if (document.global.powerUp.meshProperty[idx].visible)
			mesh.visible = true;
		else
			mesh.visible = false;
		//update position
		mesh.position.set(document.global.powerUp.meshProperty[idx].positionX, document.global.powerUp.meshProperty[idx].positionY, document.global.powerUp.meshProperty[idx].positionZ)
	})
	//rotate circle around each sphere
	document.global.sphere.sphereMesh.forEach(sphereMesh=>{
		sphereMesh.children[0].rotation.z += document.global.powerUp.circleRotation;
		sphereMesh.children[1].rotation.z += document.global.powerUp.circleRotation;
	})
}

function updateGameSummary() {
	const parent = document.querySelector(".game-summary-display");
	if (document.global.gameplay.local && document.global.gameplay.single) {
		if (parent.children.length === 0) {
			const roundSpan = document.createElement("span");
			const singleName = document.createElement("span");
			const singleScore = document.createElement("span");
			const AIname = document.createElement("span");
			const AIscore = document.createElement("span");
			singleName.textContent = document.global.gameplay.localSingleInfo.player[0].alias;
			singleScore.textContent = document.global.gameplay.localSingleInfo.player[0].score;
			singleScore.classList.add('single-'+document.global.gameplay.localSingleInfo.player[0].alias + "-score")
			AIname.textContent = "A.I."
			AIscore.textContent = document.global.gameplay.computerScore;
			AIscore.classList.add("AI-score")
			const roundDiv = document.createElement("div");
			const singleDiv = document.createElement("div");
			const AIDiv = document.createElement("div");
			roundDiv.appendChild(roundSpan);
			singleDiv.appendChild(singleName);
			singleDiv.appendChild(singleScore);
			AIDiv.appendChild(AIname)
			AIDiv.appendChild(AIscore);
			const containerDiv = document.createElement("div");
			containerDiv.classList.add("game-summary-items");
			containerDiv.appendChild(roundDiv);
			containerDiv.appendChild(singleDiv);
			containerDiv.appendChild(AIDiv);
			parent.appendChild(containerDiv);
		}
		else {
			document.querySelector(".single-" + document.global.gameplay.localSingleInfo.player[0].alias + "-score").textContent = document.global.gameplay.localSingleInfo.player[0].score;
			document.querySelector(".AI-score").textContent = document.global.gameplay.computerScore;
		}
		if (document.global.gameplay.localSingleInfo.player[0].winner)
			document.querySelector(".game-summary-display").children[0].children[1].classList.add("won");
		else if (document.global.gameplay.computerWinner)
			document.querySelector(".game-summary-display").children[0].children[2].classList.add("won");
		
	}
	else if (document.global.gameplay.local && document.global.gameplay.two) {
		if (parent.children.length === 0) {
			const parent = document.querySelector(".game-summary-display");
			const roundSpan = document.createElement("span");
			const twoFirstName = document.createElement("span");
			const twoFirstScore = document.createElement("span");
			const twoSecondName = document.createElement("span");
			const twoSecondScore = document.createElement("span");
			twoFirstName.textContent = document.global.gameplay.localTwoInfo.player[0].alias;
			twoFirstScore.textContent = document.global.gameplay.localTwoInfo.player[0].score;
			twoFirstScore.classList.add("two-" + document.global.gameplay.localTwoInfo.player[0].alias + "-score")
			twoSecondName.textContent = document.global.gameplay.localTwoInfo.player[1].alias;
			twoSecondScore.textContent = document.global.gameplay.localTwoInfo.player[1].score;
			twoSecondScore.classList.add("two-" + document.global.gameplay.localTwoInfo.player[1].alias + "-score")
			const roundDiv = document.createElement("div");
			const twoFirstDiv = document.createElement("div");
			const twoSecondDiv = document.createElement("div");
			roundDiv.append(roundSpan);
			twoFirstDiv.appendChild(twoFirstName);
			twoFirstDiv.appendChild(twoFirstScore);
			twoSecondDiv.appendChild(twoSecondName)
			twoSecondDiv.appendChild(twoSecondScore);
			const containerDiv = document.createElement("div");
			containerDiv.classList.add("game-summary-items")
			containerDiv.appendChild(roundDiv);
			containerDiv.appendChild(twoFirstDiv);
			containerDiv.appendChild(twoSecondDiv);
			parent.appendChild(containerDiv);
		}
		else {
			document.querySelector(".two-" + document.global.gameplay.localTwoInfo.player[0].alias + "-score").textContent = document.global.gameplay.localTwoInfo.player[0].score;
			document.querySelector(".two-" + document.global.gameplay.localTwoInfo.player[1].alias + "-score").textContent = document.global.gameplay.localTwoInfo.player[1].score;
		}
		if (document.global.gameplay.localTwoInfo.player[0].winner)
			document.querySelector(".game-summary-display").children[0].children[1].classList.add("won");
		else if (document.global.gameplay.localTwoInfo.player[1].winner)
			document.querySelector(".game-summary-display").children[0].children[2].classList.add("won");
	}
	else if (document.global.gameplay.local && document.global.gameplay.tournament) {
		if (parent.children.length === 0) {
			document.global.gameplay.localTournamentInfo.playerGame.forEach((playerGame,idx)=>{
				const roundSpan = document.createElement("span");
				const firstName = document.createElement("span");
				const firstScore = document.createElement("span");
				const secondName = document.createElement("span");
				const secondScore = document.createElement("span");
				roundSpan.textContent = "Game " + (idx + 1);
				firstName.textContent = playerGame[0].alias;
				firstScore.textContent = playerGame[0].score;
				firstScore.setAttribute("data-player","tournament-" + playerGame[0].alias + '-' + idx + "-score")
				secondName.textContent = playerGame[1].alias;
				secondScore.textContent = playerGame[1].score;
				secondScore.setAttribute("data-player", "tournament-" + playerGame[1].alias + '-' + idx + "-score")
				const roundDiv = document.createElement("div");
				const firstDiv = document.createElement("div");
				const secondDiv = document.createElement("div");
				roundDiv.append(roundSpan);
				firstDiv.appendChild(firstName);
				firstDiv.appendChild(firstScore);
				secondDiv.appendChild(secondName)
				secondDiv.appendChild(secondScore);
				const containerDiv = document.createElement("div");
				containerDiv.classList.add("game-summary-items")
				containerDiv.appendChild(roundDiv);
				containerDiv.appendChild(firstDiv);
				containerDiv.appendChild(secondDiv);
				parent.appendChild(containerDiv);
			})
		}
		else {
			document.global.gameplay.localTournamentInfo.playerGame.forEach((playerGame,idx)=>{
				parent.children[idx].children[1].children[0].textContent = playerGame[0].alias;
				parent.children[idx].children[2].children[0].textContent = playerGame[1].alias;
			})
			document.querySelector('[data-player='+'"tournament-' + document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][0].alias + "-" +document.global.gameplay.localTournamentInfo.currentRound + '-score"]').textContent = document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][0].score;
			document.querySelector('[data-player='+'"tournament-' + document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][1].alias + "-" +document.global.gameplay.localTournamentInfo.currentRound + '-score"]').textContent = document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][1].score;
		}
		document.global.gameplay.localTournamentInfo.playerGame.forEach((playerGame,idx)=>{
			if (playerGame[0].winner) {
				document.querySelector(".game-summary-display").children[idx].children[1].classList.add("won");
			}
				
			else if (playerGame[1].winner)
				document.querySelector(".game-summary-display").children[idx].children[2].classList.add("won");
			parent.children[idx].children[1].children[1].setAttribute("data-player","tournament-" + playerGame[0].alias + '-' + idx + "-score")
			parent.children[idx].children[2].children[1].setAttribute("data-player","tournament-" + playerGame[1].alias + '-' + idx + "-score")
			
		})
	}
}

function processUI() {
	if (document.global.ui.toggleCanvas)
		document.querySelector(".menu-canvas").classList.remove("display-none");
	else
		document.querySelector(".menu-canvas").classList.add("display-none");
	if (document.global.ui.toggleChat)
		document.querySelector(".menu-chat").classList.remove("display-none");
	else
		document.querySelector(".menu-chat").classList.add("display-none");
	if (document.global.ui.toggleGame)
		document.querySelector(".menu-game").classList.remove("display-none");
	else
		document.querySelector(".menu-game").classList.add("display-none");
	if (document.global.ui.chat) {
		document.querySelector(".chat-container").classList.add("display-block");
		document.querySelector(".canvas-container").classList.add("display-none");
	}
	else {
		document.querySelector(".chat-container").classList.remove("display-block");
		document.querySelector(".canvas-container").classList.remove("display-none");
	}
	document.global.ui.mainMenu?
		document.querySelector(".main-menu").classList.add("display-block"):document.querySelector(".main-menu").classList.remove("display-block");
	document.global.ui.local?
		document.querySelector(".local-menu").classList.add("display-block"):document.querySelector(".local-menu").classList.remove("display-block");
	document.global.ui.single?
		document.querySelector(".single-menu").classList.add("display-block"):document.querySelector(".single-menu").classList.remove("display-block");
	document.global.ui.two?
		document.querySelector(".two-menu").classList.add("display-block"):document.querySelector(".two-menu").classList.remove("display-block");
	document.global.ui.tournament?
		document.querySelector(".tournament-menu").classList.add("display-block"):document.querySelector(".tournament-menu").classList.remove("display-block");
	document.global.gameplay.ludicrious?
		document.querySelector(".timer").classList.add("timer-ludicrious"):document.querySelector(".timer").classList.remove("timer-ludicrious");
	
	
	for (let i = 0; i < document.global.gameplay.localSingleInfo.player.length; i++) {
		const parent = document.querySelector(".single-alias-display-inside");
		const target = document.querySelector(".single-" + document.global.gameplay.localSingleInfo.player[i].alias)
		
		if (!target) {
			const element = document.createElement('p');
			const button = document.createElement('button');
			button.setAttribute("type", "button")
			const xmark = document.createElement('i');
			xmark.classList.add("fa", "fa-xmark");
			xmark.setAttribute("single-identifier",document.global.gameplay.localSingleInfo.player[i].alias);
			button.addEventListener("click", (e)=>{
				for (let i = 0; i < document.global.gameplay.localSingleInfo.player.length; i++) {
					if (document.global.gameplay.localSingleInfo.player.length && document.global.gameplay.localSingleInfo.player[i] && document.global.gameplay.localSingleInfo.player[i].alias === e.target.getAttribute("single-identifier"))
						document.global.gameplay.localSingleInfo.player = [...document.global.gameplay.localSingleInfo.player.slice(0, i),...document.global.gameplay.localSingleInfo.player.slice(i + 1)];
				}
			})
			element.classList.add("single-" + document.global.gameplay.localSingleInfo.player[i].alias)
			element.textContent = document.global.gameplay.localSingleInfo.player[i].alias;
			parent.appendChild(element).appendChild(button).appendChild(xmark);
		}
	}

	for (let i = 0; i < document.global.gameplay.localTwoInfo.player.length; i++) {
		const parent = document.querySelector(".two-alias-display-inside");
		const target = document.querySelector(".two-" + document.global.gameplay.localTwoInfo.player[i].alias)
		
		if (!target) {
			const element = document.createElement('p');
			const button = document.createElement('button');
			button.setAttribute("type", "button")
			const xmark = document.createElement('i');
			xmark.classList.add("fa", "fa-xmark");
			xmark.setAttribute("two-identifier",document.global.gameplay.localTwoInfo.player[i].alias);
			button.addEventListener("click", (e)=>{
				for (let i = 0; i < document.global.gameplay.localTwoInfo.player.length; i++) {
					if (document.global.gameplay.localTwoInfo.player.length && document.global.gameplay.localTwoInfo.player[i] && document.global.gameplay.localTwoInfo.player[i].alias === e.target.getAttribute("two-identifier"))
						document.global.gameplay.localTwoInfo.player = [...document.global.gameplay.localTwoInfo.player.slice(0, i),...document.global.gameplay.localTwoInfo.player.slice(i + 1)];
				}
			})
			element.classList.add("two-" + document.global.gameplay.localTwoInfo.player[i].alias)
			element.textContent = document.global.gameplay.localTwoInfo.player[i].alias;
			parent.appendChild(element).appendChild(button).appendChild(xmark);
		}
	}

	for (let i = 0; i < document.global.gameplay.localTournamentInfo.player.length; i++) {
		const parent = document.querySelector(".tournament-alias-display-inside");
		const target = document.querySelector(".tournament-" + document.global.gameplay.localTournamentInfo.player[i].alias)
		
		if (!target) {
			const element = document.createElement('p');
			const button = document.createElement('button');
			button.setAttribute("type", "button")
			const xmark = document.createElement('i');
			xmark.classList.add("fa", "fa-xmark");
			xmark.setAttribute("tournament-identifier",document.global.gameplay.localTournamentInfo.player[i].alias);
			button.addEventListener("click", (e)=>{
				for (let i = 0; i < document.global.gameplay.localTournamentInfo.player.length; i++) {
					if (document.global.gameplay.localTournamentInfo.player.length && document.global.gameplay.localTournamentInfo.player[i] && document.global.gameplay.localTournamentInfo.player[i].alias === e.target.getAttribute("tournament-identifier"))
						document.global.gameplay.localTournamentInfo.player = [...document.global.gameplay.localTournamentInfo.player.slice(0, i),...document.global.gameplay.localTournamentInfo.player.slice(i + 1)];
				}
			})
			element.classList.add("tournament-" + document.global.gameplay.localTournamentInfo.player[i].alias)
			element.textContent = document.global.gameplay.localTournamentInfo.player[i].alias;
			parent.appendChild(element).appendChild(button).appendChild(xmark);
		}
	}
	document.getElementById("single-duration").value = document.global.gameplay.localSingleInfo.duration;
	document.getElementById("two-duration").value = document.global.gameplay.localTwoInfo.duration;
	document.getElementById("tournament-duration").value = document.global.gameplay.localTournamentInfo.duration;
	document.global.gameplay.localSingleInfo.powerUp? document.getElementById("single-powerup").checked=true:document.getElementById("single-powerup").checked=false;
	document.global.gameplay.localSingleInfo.ludicrious? document.getElementById("single-ludicrious").checked=true:document.getElementById("single-ludicrious").checked=false;
	document.global.gameplay.localTwoInfo.powerUp? document.getElementById("two-powerup").checked=true:document.getElementById("two-powerup").checked=false;
	document.global.gameplay.localTwoInfo.ludicrious? document.getElementById("two-ludicrious").checked=true:document.getElementById("two-ludicrious").checked=false;
	document.global.gameplay.localTournamentInfo.powerUp? document.getElementById("tournament-powerup").checked=true:document.getElementById("tournament-powerup").checked=false;
	document.global.gameplay.localTournamentInfo.ludicrious? document.getElementById("tournament-ludicrious").checked=true:document.getElementById("tournament-ludicrious").checked=false;
	
	const parentSingle = document.querySelector(".single-alias-display-inside")
	Array.from(parentSingle.children).forEach(child=>{
		if (document.global.gameplay.localSingleInfo.player.every(player=>{
			return "single-" + player.alias !== child.classList[0]
		}))
			parentSingle.removeChild(child);
	})
	const parentTwo = document.querySelector(".two-alias-display-inside")
	Array.from(parentTwo.children).forEach(child=>{
		if (document.global.gameplay.localTwoInfo.player.every(player=>{
			return "two-" + player.alias !== child.classList[0]
		}))
		parentTwo.removeChild(child);
	})
	const parentTournament = document.querySelector(".tournament-alias-display-inside")
	Array.from(parentTournament.children).forEach(child=>{
		if (document.global.gameplay.localTournamentInfo.player.every(player=>{
			return "tournament-" + player.alias !== child.classList[0]
		}))
		parentTournament.removeChild(child);
	})
	
	
	if (document.global.gameplay.gameStart && !document.global.gameplay.gameEnd) {
		//during gameStart and before gameEnd screen
		document.querySelector(".banner").classList.add("display-none");
		document.querySelector(".scoreboard").classList.remove("display-none");
		document.querySelector(".toggle-game").classList.remove("display-none");
		document.querySelector(".game-end-display-container").classList.add("display-none");
		if (document.global.gameplay.cheat)
			document.querySelector(".toggle-cheat").classList.remove("display-none");
		else
			document.querySelector(".toggle-cheat").classList.add("display-none");
		document.querySelector(".reset-game").classList.add("display-none");
		if (document.global.gameplay.local && document.global.gameplay.single) {
			document.querySelector(".scoreboard-one-name").textContent = document.global.gameplay.localSingleInfo.player[0].alias;
			document.querySelector(".scoreboard-one-score").textContent = document.global.gameplay.localSingleInfo.player[0].score;
			document.querySelector(".scoreboard-two-name").textContent = "A.I.";
			document.querySelector(".scoreboard-two-score").textContent = document.global.gameplay.computerScore;
			document.querySelector(".timer").textContent = document.global.gameplay.localSingleInfo.durationCount;
		}
		else if (document.global.gameplay.local && document.global.gameplay.two) {
			document.querySelector(".scoreboard-one-name").textContent = document.global.gameplay.localTwoInfo.player[0].alias;
			document.querySelector(".scoreboard-one-score").textContent = document.global.gameplay.localTwoInfo.player[0].score;
			document.querySelector(".scoreboard-two-name").textContent = document.global.gameplay.localTwoInfo.player[1].alias;
			document.querySelector(".scoreboard-two-score").textContent = document.global.gameplay.localTwoInfo.player[1].score;
			document.querySelector(".timer").textContent = document.global.gameplay.localTwoInfo.durationCount;
		}
		else if (document.global.gameplay.local && document.global.gameplay.tournament) {
			document.querySelector(".scoreboard-one-name").textContent = document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][0].alias;
			document.querySelector(".scoreboard-one-score").textContent = document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][0].score;
			document.querySelector(".scoreboard-two-name").textContent = document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][1].alias;
			document.querySelector(".scoreboard-two-score").textContent = document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][1].score;
			document.querySelector(".timer").textContent = document.global.gameplay.localTournamentInfo.durationCount;
			
		}
		updateGameSummary();
	}
	else if (document.global.gameplay.gameStart && document.global.gameplay.gameEnd) {
		//for gameEnd screen
		updateGameSummary();
		document.querySelector(".game-summary-container").classList.remove("display-none");
		if (document.global.gameplay.single || document.global.gameplay.two || document.global.gameplay.tournament && (document.global.gameplay.localTournamentInfo.currentRound === document.global.gameplay.localTournamentInfo.round - 1))
			document.querySelector(".game-end-display-container").classList.remove("display-none");
		document.querySelector(".banner").classList.add("display-none");
		document.querySelector(".scoreboard").classList.add("display-none");
		document.querySelector(".toggle-game").classList.add("display-none");
		document.querySelector(".toggle-cheat").classList.add("display-none");
		document.querySelector(".reset-game").classList.remove("display-none");
	}
	else { 
		//for starting screen before gameStart
		document.querySelector(".game-summary-display").innerHTML = '';
		document.querySelector(".game-end-display-container").classList.add("display-none");
		document.querySelector(".banner").classList.remove("display-none");
		document.querySelector(".scoreboard").classList.add("display-none");
		document.querySelector(".toggle-game").classList.add("display-none");
		document.querySelector(".toggle-cheat").classList.add("display-none");
	}
	
	if (document.global.gameplay.pause) 
		document.querySelector(".pause").classList.remove("display-none");
	else 
		document.querySelector(".pause").classList.add("display-none");
	if (document.global.gameplay.gameSummary && !document.global.gameplay.gameEnd) 
		document.querySelector(".game-summary-container").classList.remove("display-none");
	else if (!document.global.gameplay.gameSummary && !document.global.gameplay.gameEnd)
		document.querySelector(".game-summary-container").classList.add("display-none");
}

function arenaRotateY() {
	if (document.global.gameplay.initRotateY && !document.global.gameplay.pause && !document.global.gameplay.gameEnd) {
		document.global.arena3D.position.z += document.global.arena.depth;
		document.global.arena3D.rotation.y += document.global.gameplay.rotationY;
		document.global.powerUp.mesh.forEach(mesh=>{
			mesh.rotation.y = -document.global.arena3D.rotation.y;
		})
		document.global.sphere.sphereMesh.forEach(sphereMesh=>{
			sphereMesh.rotation.y = -document.global.arena3D.rotation.y;
		})
		
		document.global.arena3D.position.z -= document.global.arena.depth;
	}
}

function arenaRotateX() {
	if (document.global.gameplay.initRotateX && !document.global.gameplay.pause && !document.global.gameplay.gameEnd) {
		document.global.arena3D.position.z += document.global.arena.depth;
		document.global.arena3D.rotation.x += document.global.gameplay.rotationX;
		document.global.powerUp.mesh.forEach(mesh=>{
			mesh.rotation.x = -document.global.arena3D.rotation.x;
		})
		document.global.sphere.sphereMesh.forEach(sphereMesh=>{
			sphereMesh.rotation.x = -document.global.arena3D.rotation.x;
		})
		
		document.global.arena3D.position.z -=document.global.arena.depth;
	}
}



function shakeEffect() {
	const arena3D = document.global.arena3D;
	if (document.global.powerUp.shake.enable) {
		const randomNum = Math.floor(Math.random() * 6);
		if (randomNum === 0)
			arena3D.position.x += 1 * document.global.powerUp.shake.multiplier;
		else if (randomNum === 1)
			arena3D.position.x -= 1 * document.global.powerUp.shake.multiplier;
		else if (randomNum === 2)
			arena3D.position.y += 1 * document.global.powerUp.shake.multiplier;
		else if (randomNum === 3)
			arena3D.position.y -= 1 * document.global.powerUp.shake.multiplier;
		else if (randomNum === 4)
			arena3D.position.z += 1 * document.global.powerUp.shake.multiplier;
		else if (randomNum === 5)
			arena3D.position.z -= 1 * document.global.powerUp.shake.multiplier;
	}
	else 
		arena3D.position.set(0,0,0);
}

function setTimer() {
	if (document.global.gameplay.gameStart && !document.global.gameplay.pause && !document.global.gameplay.gameEnd) {
		//roundStart shadow issue actions for ALL CLIENTS
		if (document.global.gameplay.roundStart === 0) {
			document.global.pointLight.castShadow = false;
			document.global.gameplay.shadowFrame = 0;
		}
		if (document.global.gameplay.roundStart === 1)
			document.global.gameplay.shadowFrame++;
		if (document.global.gameplay.shadowFrame === document.global.gameplay.shadowFrameLimit)
			document.global.pointLight.castShadow = true;
	
		// Below gameplay delay and powerup executed by mainClient
		if (document.global.gameplay.local || !document.global.gameplay.local && document.global.gameplay.mainClient) {
			if (document.global.gameplay.roundStart === 0) 
				document.global.gameplay.roundStartFrame++;
			
			if (document.global.gameplay.roundStartFrame === document.global.gameplay.roundStartFrameLimit) {
				document.global.gameplay.roundStart = 1;
				document.global.gameplay.roundStartFrame = 0;
			}
			// powerup timer
			if (document.global.powerUp.enable) {
				if (document.global.powerUp.meshProperty.every(meshProperty=>{
					return !meshProperty.visible;
				}))
					document.global.powerUp.durationFrame++;
				if (document.global.powerUp.durationFrame === document.global.powerUp.durationFrameLimit) {
					resetPowerUp();
					document.global.powerUp.durationFrame = 0;
				}
			}
		}
	}
}

export function populateWinner() {
	if (document.global.gameplay.local && document.global.gameplay.single) {
		const scoreOne = parseInt(document.global.gameplay.localSingleInfo.player[0].score);
		const scoreAI = parseInt(document.global.gameplay.computerScore);
		if (scoreOne > scoreAI) {
			document.global.gameplay.localSingleInfo.player[0].winner = true;
			document.global.gameplay.computerWinner = false;
		}
		else if (scoreAI > scoreOne) {
			document.global.gameplay.localSingleInfo.player[0].winner = false;
			document.global.gameplay.computerWinner = true;
		}
	}
	else if (document.global.gameplay.local && document.global.gameplay.two) {
		const scoreOne = parseInt(document.global.gameplay.localTwoInfo.player[0].score);
		const scoreTwo = parseInt(document.global.gameplay.localTwoInfo.player[1].score);
		if (scoreOne > scoreTwo) {
			document.global.gameplay.localTwoInfo.player[0].winner = true;
			document.global.gameplay.localTwoInfo.player[1].winner = false;
		}
		else if (scoreTwo > scoreOne) {
			document.global.gameplay.localTwoInfo.player[0].winner = false;
			document.global.gameplay.localTwoInfo.player[1].winner = true;
		}
	}
	else if (document.global.gameplay.local && document.global.gameplay.tournament) {
		const scoreOne = parseInt(document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][0].score);
		const scoreTwo = parseInt(document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][1].score);
		let winnerAlias;
		if (scoreOne > scoreTwo) {
			document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][0].winner = true;
			document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][1].winner = false;
			winnerAlias = document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][0].alias;
		}
		else if (scoreTwo > scoreOne) {
			document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][1].winner = true;
			document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][0].winner = false;
			winnerAlias = document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][1].alias;
		}
		else {
			const randomWinner = Math.floor(Math.random() * 1)
			if (randomWinner === 0)
				winnerAlias = document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][0].alias;
			else
				winnerAlias = document.global.gameplay.localTournamentInfo.playerGame[document.global.gameplay.localTournamentInfo.currentRound][1].alias;
		}

		for (let i = 0; i < document.global.gameplay.localTournamentInfo.playerGame.length; i++) {
			if (document.global.gameplay.localTournamentInfo.playerGame[i][0].alias === "<Player>") {
				document.global.gameplay.localTournamentInfo.playerGame[i][0].alias = winnerAlias;
				break;
			}
			else if (document.global.gameplay.localTournamentInfo.playerGame[i][1].alias === "<Player>") {
				document.global.gameplay.localTournamentInfo.playerGame[i][1].alias = winnerAlias;
				break;
			}
		}
	}

}

function reduceTime(info) {
	const [minute, second] = info.durationCount.split(':')
	const date = new Date(1970, 0, 1, 0, minute, second);
	const newDate = date.getTime() - 1000;
	date.setTime(newDate);
	info.durationCount = date.getMinutes().toString().padStart(2, '0') + ':' + date.getSeconds().toString().padStart(2, '0');
	//set ludicrious mode
	if (info.ludicrious) {
		if (date.getMinutes() < document.global.gameplay.ludicriousYminuteUpper && date.getMinutes() >= document.global.gameplay.ludicriousYminuteLower 
		&& date.getSeconds() < document.global.gameplay.ludicriousYsecondUpper  && date.getSeconds() >= document.global.gameplay.ludicriousYsecondLower) {
			document.global.gameplay.initRotateY = 1;
			document.global.gameplay.initRotateX = 0;
			document.global.gameplay.ludicrious = 1;
		}
		if (date.getMinutes() < document.global.gameplay.ludicriousXminuteUpper && date.getMinutes() >= document.global.gameplay.ludicriousXminuteLower 
			&& date.getSeconds() < document.global.gameplay.ludicriousXsecondUpper  && date.getSeconds() >= document.global.gameplay.ludicriousXsecondLower){
				document.global.gameplay.initRotateY = 0;
				document.global.gameplay.initRotateX = 1;
				document.global.gameplay.ludicrious = 1;
		}
		if (date.getMinutes() < document.global.gameplay.ludicriousYXminuteUpper && date.getMinutes() >= document.global.gameplay.ludicriousYXminuteLower 
			&& date.getSeconds() < document.global.gameplay.ludicriousYXsecondUpper  && date.getSeconds() >= document.global.gameplay.ludicriousYXsecondLower){
				document.global.gameplay.initRotateY = 1;
				document.global.gameplay.initRotateX = 1;
				document.global.gameplay.ludicrious = 1;
		}
	}
	if (minute === '00' && second === '01') {
		populateWinner()
		document.global.gameplay.gameEnd = 1; 
	}
		
}

function processCountDown(frameTimer) {
	if (document.global.gameplay.gameStart && !document.global.gameplay.pause && !document.global.gameplay.gameEnd) {
		if (document.global.gameplay.local && document.global.gameplay.single) {
			if (frameTimer.now - frameTimer.prev > 0) {
				reduceTime(document.global.gameplay.localSingleInfo)
				frameTimer.prev = frameTimer.now;
			}
		}
		else if (document.global.gameplay.local && document.global.gameplay.two) {
			if (frameTimer.now - frameTimer.prev > 0) {
				reduceTime(document.global.gameplay.localTwoInfo)
				frameTimer.prev = frameTimer.now;
			}
		}
		else if (document.global.gameplay.local && document.global.gameplay.tournament) {
			if (frameTimer.now - frameTimer.prev > 0) {
				reduceTime(document.global.gameplay.localTournamentInfo)
				frameTimer.prev = frameTimer.now;
			}
		}
		

	}
}


export function main() {
	const frameTimer = {
		now:0,
		prev:0,
	};

	init();
	//render background
	document.querySelector(".canvas-background-1").classList.add(document.global.gameplay.backgroundClass[document.global.gameplay.backgroundIndex]);
	document.querySelector(".canvas-background-2").classList.add(document.global.gameplay.backgroundClass[document.global.gameplay.backgroundIndex]);
	keyBinding();
	
	const canvas = document.querySelector( '.canvas' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	const scene = new THREE.Scene();
	renderer.setClearColor( 0x000000, 0 );
	renderer.shadowMap.enabled = true;

	//create arena scenegraph
	const arena3D = new THREE.Object3D();

	//create all other Pong objects
	createArenaMesh(arena3D);
	createSphereMesh(arena3D);
	const camera = createCamera();
	createPaddleMesh(arena3D);
	createDirectionalLight(arena3D);
	createPointLight(arena3D);
	createShadowPlanes(arena3D);
	createPowerUp(arena3D);
	//attach arena and add to scene
	document.global.arena3D = arena3D;
	scene.add(arena3D);

	function render( time ) {
		if (document.global.gameplay.gameStart)
			frameTimer.now = Math.floor(time * 0.001);
		else {
			frameTimer.now = 0;
			frameTimer.prev = 0;
		}
		
		if ( resizeRendererToDisplaySize( renderer ) ) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		processCountDown(frameTimer);
		processCamera(camera);
		
		processSphere();
		processPaddle();
		processPowerUp();
		processGame();
		processUI();
		shakeEffect();
		arenaRotateY();
		arenaRotateX();
		if (document.global.gameplay.rotate90) {
			document.global.arena3D.rotation.y = -Math.PI / 2;
			for (let i = 0; i < document.global.powerUp.mesh.length; i++) {
				document.global.powerUp.mesh[i].rotation.y = Math.PI / 2;
			}
			document.global.sphere.sphereMesh.forEach(sphereMesh=>{
				sphereMesh.rotation.y = Math.PI / 2;
			})
		}
		movePaddle();
		setTimer();
		renderer.render( scene, camera );
		document.global.requestID = requestAnimationFrame(render);
	}
	document.global.requestID = requestAnimationFrame(render);
}

main();