function windowResize(e) {
	const canvas = document.querySelector(".canvas-container");
	canvas.style.height = (canvas.clientWidth / document.global.arena.aspect) + 'px';
	updateGlobal();
}

function updateGlobal() {
	const canvas = document.querySelector(".canvas-container");
	const clientWidth = canvas.clientWidth;
	//arena info
	document.global.arena = {};
	document.global.arena.clientWidth = clientWidth;
	document.global.arena.widthDivision = 2.5;
	document.global.arena.aspect = 4 / 3;
	document.global.arena.width = clientWidth / document.global.arena.widthDivision;
	document.global.arena.height = clientWidth / document.global.arena.aspect / document.global.arena.widthDivision;
	document.global.arena.depth = clientWidth / document.global.arena.aspect;
	document.global.arena.color = "#fff";
	document.global.arena.thickness = 5;

	//sphere info
	document.global.sphere = {};
	document.global.sphere.radiusDivision = 80; //to change to be based on clientwidth
	document.global.sphere.widthSegments = 12;
	document.global.sphere.heightSegments = 12;
	document.global.sphere.shininess = 60;
	document.global.sphere.color = "#686868";
	document.global.sphere.radius = clientWidth / document.global.sphere.radiusDivision;
	document.global.sphere.velocityDivision = 150;
	document.global.sphere.velocityX = clientWidth / document.global.sphere.velocityDivision;
	document.global.sphere.velocityY = clientWidth / document.global.sphere.velocityDivision;
	document.global.sphere.velocityZ = clientWidth / document.global.sphere.velocityDivision;

	//camera info
	document.global.camera = {};
	document.global.camera.fov = 60;
	document.global.camera.near = 0.1;
	document.global.camera.far = 3000;
	document.global.camera.positionZ = clientWidth / document.global.arena.aspect;

	//paddle info
	document.global.paddle={};
	document.global.paddle.color = "#686868";
	document.global.paddle.width = clientWidth / document.global.arena.widthDivision / 5;
	document.global.paddle.height = clientWidth / document.global.arena.aspect / document.global.arena.widthDivision / 7;
	document.global.paddle.thickness = clientWidth / document.global.arena.aspect / 150;
	document.global.paddle.opacity = 0.5;
	document.global.paddle.distanceFromEdgeModifier= 3;
	document.global.paddle.hitBackModifier = 5;
	document.global.paddle.paddles = [];

	//directional light info
	document.global.directionalLight = {};
	document.global.directionalLight.color = "#FFF";
	document.global.directionalLight.intensity = 10;
	document.global.directionalLight.positionX = clientWidth;
	document.global.directionalLight.positionY = clientWidth;
	document.global.directionalLight.positionZ = 0;
	
	//point light info
	document.global.pointLight = {};
	document.global.pointLight.color = "#FFF";
	document.global.pointLight.intensity = 10;
	document.global.pointLight.distance = 5000;

	//shadow planes info
	document.global.shadowPlane = {};
	document.global.shadowPlane.sideWidth = clientWidth / document.global.arena.aspect / document.global.arena.widthDivision;
	document.global.shadowPlane.sideHeight = clientWidth  / document.global.arena.aspect;
	document.global.shadowPlane.TopBottomWidth = clientWidth / document.global.arena.widthDivision;
	document.global.shadowPlane.opacity = 0.3

	//gameplay
	document.global.gameplay = {};
	document.global.gameplay.gameStart = 0;
	document.global.gameplay.initRotateY = 0;
	document.global.gameplay.initRotateX = 0;
	document.global.gameplay.rotateY = 0.005;
	document.global.gameplay.rotateX = 0.005;
	document.global.gameplay.sphereOutDivision = 50;
	document.global.gameplay.shadowFrame = 0;
	document.global.gameplay.shadowFrameLimit = 0;


	//local game
	document.global.gameplay.local = 1
	//remote and multiplayer game
	document.global.gameplay.multi = 0
	
	//other game info
	document.global.gameplay.playerNum = 0;
	document.global.gameplay.player = [];//Paddles are rendered based on 1 to 4 in a specific manner yet to be approached and fixed. Player num is sent through from server then attach key and mouse to the specific paddles.
	document.global.gameplay.player.push({playerNum:1}) //default is 2 players (no computer for now)
	document.global.gameplay.player.push({playerNum:2})

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

function init() {
	window.addEventListener("resize", windowResize);
	document.global = {};
	updateGlobal();
	windowResize();
}

init();