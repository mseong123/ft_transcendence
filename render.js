import * as THREE from 'https://threejs.org/build/three.module.js';
import {processGame} from './gameplay.js';
import {movePaddle} from './gameplay.js';
import {keyBinding} from './gameplay.js';
import {createPowerUp} from './powerup.js';
import {createFirstHalfCircleGeometry} from './powerup.js';
import {createSecondHalfCircleGeometry} from './powerup.js';
import {resetPowerUp} from './gameplay.js'

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

			if (i == 0) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialOne);
				paddleMesh.castShadow = true;
				if (document.global.gameplay.playerCount > 2) {
					paddleMeshProperty.positionX = -document.global.paddle.width / 4;
					paddleMeshProperty.positionY = -document.global.paddle.height / 4;
					paddleMeshProperty.positionZ = (document.global.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier)
				}
				else {
					paddleMeshProperty.positionX = 0;
					paddleMeshProperty.positionY = 0;
					paddleMeshProperty.positionZ = (document.global.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier)
				}
			}
			else if (i == 1) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialTwo);
				paddleMesh.castShadow = true;
				if (document.global.gameplay.playerCount == 4) {
					paddleMeshProperty.positionX = -document.global.paddle.width / 4;
					paddleMeshProperty.positionY = -document.global.paddle.height / 4;
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
					paddleMeshProperty.positionX = document.global.paddle.width / 4;
					paddleMeshProperty.positionY = document.global.paddle.height / 4;
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
				paddleMeshProperty.positionX = document.global.paddle.width / 4;
				paddleMeshProperty.positionY = document.global.paddle.height / 4;
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

function processSphere() {
	document.global.sphere.sphereMesh.forEach((sphereMesh,idx)=>{
		
	})
	
	
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

function arenaRotateY() {
	if (document.global.gameplay.initRotateY) {
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
	if (document.global.gameplay.initRotateX) {
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
	//gamestart shadow issue actions for ALL CLIENTS
	if (document.global.gameplay.gameStart === 0) {
		document.global.pointLight.castShadow = false;
		document.global.gameplay.shadowFrame = 0;
	}
	if (document.global.gameplay.gameStart === 1)
		document.global.gameplay.shadowFrame++;
	if (document.global.gameplay.shadowFrame === document.global.gameplay.shadowFrameLimit)
		document.global.pointLight.castShadow = true;

	// Below gameplay delay and powerup executed by mainClient
	if (document.global.gameplay.local || !document.global.gameplay.local && document.global.gameplay.mainClient) {
		if (document.global.gameplay.gameStart === 0) 
			document.global.gameplay.gameStartFrame++;
		
		if (document.global.gameplay.gameStartFrame === document.global.gameplay.gameStartFrameLimit) {
			document.global.gameplay.gameStart = 1;
			document.global.gameplay.gameStartFrame =0;
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

function main() {
	//render background
	document.querySelector(".canvas-background-1").classList.add(document.global.gameplay.backgroundClass[document.global.gameplay.backgroundIndex]);
	document.querySelector(".canvas-background-2").classList.add(document.global.gameplay.backgroundClass[document.global.gameplay.backgroundIndex]);
	keyBinding();

	const canvas = document.querySelector( '#c' );
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
		if ( resizeRendererToDisplaySize( renderer ) ) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		processSphere();
		processPaddle();
		processPowerUp();
		processGame();
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
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();