function windowResize(e) {
	const canvas = document.querySelector(".canvas-container");
	canvas.style.height = (canvas.clientWidth / document.global.arena.aspect) + 'px';
	updateGlobal();
}

function updateGlobal() {
	const canvas = document.querySelector(".canvas-container");
	const clientWidth = canvas.clientWidth;

	//initiate global variable
	if (!document.global) {
		document.global = {};
		document.global.clientWidth = clientWidth;
	}

	//arena info
	if (!document.global.arena) {
		document.global.arena = {};
		document.global.arena.widthDivision = 2.5;
		document.global.arena.aspect = 4 / 3;
		document.global.arena.color = "#fff";
		document.global.arena.thickness = 6;
		document.global.arena.width = clientWidth / document.global.arena.widthDivision;
		document.global.arena.height = clientWidth / document.global.arena.aspect / document.global.arena.widthDivision;
		document.global.arena.depth = clientWidth / document.global.arena.aspect;
	}

	//sphere info
	if (!document.global.sphere) {
		document.global.sphere = {};
		document.global.sphere.sphereMesh = [];
		document.global.sphere.sphereMeshProperty = [];
		document.global.sphere.radiusDivision = 100; //to change to be based on clientwidth
		document.global.sphere.widthSegments = 12;
		document.global.sphere.heightSegments = 12;
		document.global.sphere.shininess = 60;
		document.global.sphere.velocityTopLimit = 3;
		document.global.sphere.velocityBottomLimit = 1;
		document.global.sphere.color = "#686868";
		document.global.sphere.velocityDivision = 200;
		document.global.sphere.radius = clientWidth / document.global.sphere.radiusDivision;
		document.global.sphere.circleRadius = document.global.sphere.radius * 2;
	}
	document.global.sphere.velocityX = clientWidth / document.global.sphere.velocityDivision;
	document.global.sphere.velocityY = clientWidth / document.global.sphere.velocityDivision;
	document.global.sphere.velocityZ = clientWidth / document.global.sphere.velocityDivision;

	//camera info
	if (!document.global.camera) {
		document.global.camera = {};
		document.global.camera.fov = 60;
		document.global.camera.near = 0.1;
		document.global.camera.far = 3000;
		document.global.camera.positionZ = clientWidth / document.global.arena.aspect;
	}
	

	//paddle info
	if (!document.global.paddle) {
		const colorSpace = ["#0E2954","#1F6E8C","#2E8A99","#84A7A1"];
		const colorOcean = ["#F6F4EB","#91C8E4","#749BC2","#4682A9"];
		const colorAlien = ["#635985","#443C68","#393053","#18122B"];
		const colorDesert = ["#472D2D","#553939","#704F4F","#A77979"];
		document.global.paddle={};
		document.global.paddle.paddles = [];
		document.global.paddle.paddlesProperty = [];
		document.global.paddle.color = [colorSpace, colorOcean, colorAlien, colorDesert];
		document.global.paddle.opacity = 0.9;
		document.global.paddle.distanceFromEdgeModifier= 2;
		document.global.paddle.hitBackModifier = 5;
		document.global.paddle.defaultWidth = clientWidth / document.global.arena.widthDivision / 5; //5
		document.global.paddle.defaultHeight = clientWidth / document.global.arena.aspect / document.global.arena.widthDivision / 7 //7;
		document.global.paddle.thickness = clientWidth / document.global.arena.aspect / 100;
	}

	//directional light info
	if (!document.global.directionalLight) {
		document.global.directionalLight = {};
		document.global.directionalLight.color = "#FFF";
		document.global.directionalLight.intensity = 15;
		document.global.directionalLight.positionZ = 0;
	}
	document.global.directionalLight.positionX = clientWidth;
	document.global.directionalLight.positionY = clientWidth;
	
	
	//point light info
	if (!document.global.pointLight) {
		document.global.pointLight = {};
		document.global.pointLight.color = "#FFF";
		document.global.pointLight.intensity = 10;
		document.global.pointLight.distance = 5000;
	}
	

	//shadow planes info
	if (!document.global.shadowPlane) {
		document.global.shadowPlane = {};
		document.global.shadowPlane.opacity = 0.3
		document.global.shadowPlane.sideWidth = clientWidth / document.global.arena.aspect / document.global.arena.widthDivision;
		document.global.shadowPlane.sideHeight = clientWidth  / document.global.arena.aspect;
		document.global.shadowPlane.TopBottomWidth = clientWidth / document.global.arena.widthDivision;
	}
	
	//overall powerup info
	if (!document.global.powerUp) {
		document.global.powerUp = {};
		document.global.powerUp.visible = false;
		document.global.powerUp.widthSegments = 6;
		document.global.powerUp.heightSegments = 6;
		document.global.powerUp.index = Math.floor(Math.random() * 5);
		// document.global.powerUp.index = 3;
		document.global.powerUp.radius = document.global.sphere.radius;
		document.global.powerUp.circleRadius = document.global.powerUp.radius * 3;
		document.global.powerUp.shininess = 60;
		document.global.powerUp.circleRotation = 0.1;
		document.global.powerUp.index;
		document.global.powerUp.durationFrame = 0; //miliseconds
		document.global.powerUp.durationFrameLimit = 1000; //miliseconds
		document.global.powerUp.mesh = [];
		document.global.powerUp.meshProperty = [];
		document.global.powerUp.color = ["#FFA500", "#088F8F", "#686868", "#B22222", "#123456"];
		document.global.powerUp.positionX = Math.floor((Math.random() * (document.global.arena.width - document.global.powerUp.circleRadius)) - (document.global.arena.width - document.global.powerUp.circleRadius)/ 2);
		document.global.powerUp.positionY = Math.floor((Math.random() * (document.global.arena.height - document.global.powerUp.circleRadius)) - (document.global.arena.height -document.global.powerUp.circleRadius) / 2);
		document.global.powerUp.positionZ = Math.floor((Math.random() * (document.global.arena.depth / 3)) - (document.global.arena.depth / 3));
		
		if (!document.global.powerUp.largePaddle) {
			document.global.powerUp.largePaddle = {};
			document.global.powerUp.largePaddle.multiplier = 4;
		}
		if (!document.global.powerUp.shake) {
			document.global.powerUp.shake = {};
			document.global.powerUp.shake.multiplier = 4;
			document.global.powerUp.shake.enable = 0;
		}
		if (!document.global.powerUp.invisibility) {
			document.global.powerUp.invisibility = {};
			document.global.powerUp.invisibility.opacity = 0.5;
		}
		if (!document.global.powerUp.ultimate) {
			document.global.powerUp.ultimate = {};
			document.global.powerUp.ultimate.count = 10;
		}

	}

	//gameplay
	if (!document.global.gameplay) {
		document.global.gameplay = {};
		document.global.gameplay.backgroundClass = ["canvas-url-space", "canvas-url-ocean", "canvas-url-alien", "canvas-url-desert"];
		document.global.gameplay.backgroundIndex = Math.floor(Math.random() * 4); 
		document.global.gameplay.gameStart = 1;
		document.global.gameplay.immortality = 1; //for gameplay debugging purpose
		document.global.gameplay.initRotateY = 1;
		document.global.gameplay.initRotateX = 0;
		document.global.gameplay.rotationY = 0.005;
		document.global.gameplay.rotationX = 0.005;
		document.global.gameplay.rotate90 = 0;
		document.global.gameplay.gameStartFrame = 0;
		document.global.gameplay.gameStartFrameLimit = 25;
		document.global.gameplay.shadowFrame = 0;
		document.global.gameplay.shadowFrameLimit = 5;

		//local or multiplayer game
		document.global.gameplay.local = 1;
		document.global.gameplay.computer = 0;
		document.global.gameplay.mainClient = 0;
		
		//other game info
		document.global.gameplay.playerNum = 0;
		document.global.gameplay.playerCount = 4;
	}

	
	
	if (!document.global.keyboard) {
		//keyboard
		document.global.keyboard = {};
		document.global.keyboard.w = 0;
		document.global.keyboard.a = 0;
		document.global.keyboard.s = 0;
		document.global.keyboard.d = 0;
		document.global.keyboard.up = 0;
		document.global.keyboard.down = 0;
		document.global.keyboard.left = 0;
		document.global.keyboard.right = 0;
		document.global.keyboard.speed = 5;
	}
}

function init() {
	window.addEventListener("resize", windowResize);
	updateGlobal();
	windowResize();
}

init();