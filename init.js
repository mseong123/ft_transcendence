function windowResize(e) {
	const canvas = document.querySelector(".canvas-container");
	canvas.style.height = (canvas.clientWidth / document.global.arena.aspect) + 'px';
	updateGlobal();
}

function updateGlobal() {
	const canvas = document.querySelector(".canvas-container");
	const clientWidth = canvas.clientWidth;
	//arena info
	if (!document.global.arena) {
		document.global.arena = {};
		document.global.arena.widthDivision = 2.5;
		document.global.arena.aspect = 4 / 3;
		document.global.arena.color = "#fff";
		document.global.arena.thickness = 5;
		document.global.arena.clientWidth = clientWidth;
		document.global.arena.width = clientWidth / document.global.arena.widthDivision;
		document.global.arena.height = clientWidth / document.global.arena.aspect / document.global.arena.widthDivision;
		document.global.arena.depth = clientWidth / document.global.arena.aspect;
	}

	//sphere info
	if (!document.global.sphere) {
		document.global.sphere = {};
		document.global.sphere.radiusDivision = 100; //to change to be based on clientwidth
		document.global.sphere.widthSegments = 12;
		document.global.sphere.heightSegments = 12;
		document.global.sphere.shininess = 60;
		document.global.sphere.color = "#686868";
		document.global.sphere.velocityDivision = 200;
		document.global.sphere.radius = clientWidth / document.global.sphere.radiusDivision;
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
		document.global.paddle={};
		document.global.paddle.colorEarth = ["#472D2D","#553939","#704F4F","#A77979"];
		document.global.paddle.colorTwo = ["#40A2E3","#FFF6E9","#BBE2EC","#0D9276"];
		document.global.paddle.opacity = 0.9;
		document.global.paddle.distanceFromEdgeModifier= 2;
		document.global.paddle.hitBackModifier = 5;
		document.global.paddle.width = clientWidth / document.global.arena.widthDivision / 5;
		document.global.paddle.height = clientWidth / document.global.arena.aspect / document.global.arena.widthDivision / 7;
		document.global.paddle.thickness = clientWidth / document.global.arena.aspect / 100;
	}
	
	if (!document.global.paddle.paddles || !document.global.paddle.paddles.length) {
		document.global.paddle.paddles = [];
	}
		
	//directional light info
	if (!document.global.directionalLight) {
		document.global.directionalLight = {};
		document.global.directionalLight.color = "#FFF";
		document.global.directionalLight.intensity = 10;
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
	}
	document.global.shadowPlane.sideWidth = clientWidth / document.global.arena.aspect / document.global.arena.widthDivision;
	document.global.shadowPlane.sideHeight = clientWidth  / document.global.arena.aspect;
	document.global.shadowPlane.TopBottomWidth = clientWidth / document.global.arena.widthDivision;
	

	//gameplay
	if (!document.global.gameplay) {
		document.global.gameplay = {};
		document.global.gameplay.gameStart = 1;
		document.global.gameplay.initRotateY = 0;
		document.global.gameplay.initRotateX = 0;
		document.global.gameplay.rotationY = 0.005;
		document.global.gameplay.rotationX = 0.005;
		document.global.gameplay.rotate90 = 0;
		document.global.gameplay.sphereOutModifier = clientWidth / 15;
		document.global.gameplay.gameStartFrame = 0;
		document.global.gameplay.gameStartFrameLimit = 25;
		document.global.gameplay.shadowFrame = 0;
		document.global.gameplay.shadowFrameLimit = 5;

		//local game
		document.global.gameplay.local = 1;
		document.global.gameplay.computer = 0;
		//remote and multiplayer game
		document.global.gameplay.multi = 0;
		
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
	document.global = {};
	updateGlobal();
	windowResize();
}

init();