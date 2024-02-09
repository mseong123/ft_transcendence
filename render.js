import * as THREE from 'https://threejs.org/build/three.module.js';
import {processSphereMovement} from './gameplay.js';
import {movePaddle} from './gameplay.js';
import {keyBinding} from './gameplay.js';
import {createPowerUp} from './powerup.js';

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
	const arenaMaterial = new THREE.LineBasicMaterial( { color: document.global.arenaColor } );
	const arenaMesh = [];
	for (let i = 0; i < document.global.arena.thickness; i++) {
		const arenaGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry( (document.global.arena.clientWidth + i) / document.global.arena.widthDivision,
		(document.global.arena.clientWidth + i) / document.global.arena.aspect / document.global.arena.widthDivision , (document.global.arena.clientWidth + 1) / document.global.arena.aspect));
		arenaMesh.push(new THREE.LineSegments( arenaGeometry, arenaMaterial ));
		arena3D.add(arenaMesh[i]);
	}
	document.global.arenaMesh = arenaMesh;
}

function createSphereMesh(arena3D) {
	const sphereGeometry = new THREE.SphereGeometry( document.global.sphere.radius, document.global.sphere.widthSegments, document.global.sphere.heightSegments );
	const sphereMaterial = new THREE.MeshPhongMaterial( { color: document.global.sphere.color, emissive: document.global.sphere.color, shininess:document.global.sphere.shininess} );
	const sphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
	sphereMesh.castShadow=true;
	document.global.sphereMesh = sphereMesh;
	arena3D.add(sphereMesh);
}

function createCamera() {
	const camera = new THREE.PerspectiveCamera( document.global.camera.fov, document.global.arena.aspect, document.global.camera.near, document.global.camera.far );
	camera.position.z = document.global.camera.positionZ;
	return camera;
}

function createPaddleMesh(arena3D) {
	const colorPalette = document.global.paddle.color[document.global.gameplay.backgroundIndex];
	const paddleGeometry = new THREE.BoxGeometry(document.global.paddle.width, document.global.paddle.height, document.global.paddle.thickness )
	const paddleMaterialOne = new THREE.MeshPhongMaterial( { color: colorPalette[0], emissive: colorPalette[0], transparent:true, opacity:document.global.paddle.opacity });
	const paddleMaterialTwo = new THREE.MeshPhongMaterial( { color: colorPalette[1], emissive: colorPalette[1], transparent:true, opacity:document.global.paddle.opacity });
	const paddleMaterialThree = new THREE.MeshPhongMaterial( { color: colorPalette[2], emissive: colorPalette[2], transparent:true, opacity:document.global.paddle.opacity });
	const paddleMaterialFour = new THREE.MeshPhongMaterial( { color: colorPalette[3], emissive: colorPalette[3], transparent:true, opacity:document.global.paddle.opacity });
	
	if (document.global.gameplay.local) {
		for (let i = 0; i < 2; i++) {
			let paddleMesh;
			if (i === 0) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialOne);
				paddleMesh.castShadow = true;
				paddleMesh.receiveShadow = true;
				paddleMesh.position.set(0, 0, (document.global.arena.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier));
			}
			else {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialTwo);
				paddleMesh.castShadow = true;
				paddleMesh.receiveShadow = true;
				paddleMesh.position.set(0, 0, -(document.global.arena.clientWidth / document.global.arena.aspect / 2) + (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier));
			}
			document.global.paddle.paddles.push(paddleMesh);
			arena3D.add(paddleMesh);
		}
	}
	if (document.global.gameplay.multi) {
		for (let i = 0; i < document.global.gameplay.playerCount; i++) {
			let paddleMesh;
			if (i == 0) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialOne);
				paddleMesh.receiveShadow = true;
				paddleMesh.castShadow = true;
				if (document.global.gameplay.playerCount > 2) 
					paddleMesh.position.set( -document.global.paddle.width / 4, -document.global.paddle.height / 4, (document.global.arena.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier));
				else
					paddleMesh.position.set(0, 0, (document.global.arena.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier));
			}
			else if (i == 1) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialTwo);
				paddleMesh.receiveShadow = true;
				paddleMesh.castShadow = true;
				if (document.global.gameplay.playerCount == 4) 
					paddleMesh.position.set(-document.global.paddle.width / 4, -document.global.paddle.height / 4, -(document.global.arena.clientWidth / document.global.arena.aspect / 2) + (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier));
				else
					paddleMesh.position.set(0, 0, -(document.global.arena.clientWidth / document.global.arena.aspect / 2) + (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier));
			}
				
			else if (i == 2) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialThree);
				paddleMesh.receiveShadow = true;
				paddleMesh.castShadow = true;
				if (document.global.gameplay.playerCount > 2)
					paddleMesh.position.set(document.global.paddle.width / 4, document.global.paddle.height / 4, (document.global.arena.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier * 4));
				else 
					paddleMesh.position.set(0, 0, (document.global.arena.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier * 4));
			}
			else if (i = 3) {
				paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterialFour);
				paddleMesh.receiveShadow = true;
				paddleMesh.castShadow = true;
				paddleMesh.position.set(document.global.paddle.width / 4, document.global.paddle.height / 4, -(document.global.arena.clientWidth / document.global.arena.aspect / 2) + (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier * 4));
			}
			document.global.paddle.paddles.push(paddleMesh);
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
	shadowPlanes[0].position.set(-document.global.arena.clientWidth / document.global.arena.widthDivision / 2, 0, 0);
	shadowPlanes[1].position.set(document.global.arena.clientWidth / document.global.arena.widthDivision / 2, 0, 0);
	//top bottom
	for (let i = 2; i < 4; i++) {
		const plane = new THREE.Mesh( geometryTopBottom, material );
		plane.rotateX( Math.PI /2 );
		plane.receiveShadow = true;
		arena3D.add( plane );
		shadowPlanes[i] = plane;
	}
	shadowPlanes[2].position.set(0, document.global.arena.clientWidth / document.global.arena.aspect/ document.global.arena.widthDivision / 2, 0);
	shadowPlanes[3].position.set(0,-document.global.arena.clientWidth / document.global.arena.aspect/ document.global.arena.widthDivision / 2, 0);
	document.global.shadowPlanes = shadowPlanes;
}



function arenaRotateY() {
	if (document.global.gameplay.initRotateY) {
		document.global.arena3D.position.z += document.global.arena.depth;
		document.global.arena3D.rotation.y += document.global.gameplay.rotationY;
		for (let i = 0; i < document.global.powerUp.mesh.length; i++) {
			document.global.powerUp.mesh[i].rotation.y -= document.global.gameplay.rotationY * 2;
		}
		document.global.arena3D.rotation.y += document.global.gameplay.rotationY;
		document.global.arena3D.position.z -= document.global.arena.depth;
	}
	
}

function arenaRotateX() {
	if (document.global.gameplay.initRotateX) {
		document.global.arena3D.position.z += document.global.arena.depth;
		document.global.arena3D.rotation.x += document.global.gameplay.rotationX;
		for (let i = 0; i < document.global.powerUp.mesh.length; i++) {
			document.global.powerUp.mesh[i].rotation.x -= document.global.gameplay.rotationX;
		}
		document.global.arena3D.position.z -=document.global.arena.depth;
	}
}

function rotatePowerUp() {
	if (document.global.powerUp.enable)
		document.global.powerUp.mesh[document.global.powerUp.index].rotation.z += document.global.powerUp.circleRotation;
	
}

function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	const scene = new THREE.Scene();
	renderer.setClearColor( 0x000000, 0 );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	//create arena scenegraph
	const arena3D = new THREE.Object3D();

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
	keyBinding();

	function render( time ) {
		if ( resizeRendererToDisplaySize( renderer ) ) {
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		
		rotatePowerUp();
		processSphereMovement();
		arenaRotateY();
		arenaRotateX();
		if (document.global.gameplay.rotate90) {
			document.global.arena3D.rotation.y = -Math.PI / 2;
			for (let i = 0; i < document.global.powerUp.mesh.length; i++) {
				document.global.powerUp.mesh[i].children[0].rotation.y += Math.PI / 2 * 2;
			}
		}
		movePaddle();
		
		//gamestart shadow issue actions
		if (document.global.gameplay.gameStart === 1)
			document.global.gameplay.shadowFrame++;
		if (document.global.gameplay.shadowFrame === document.global.gameplay.shadowFrameLimit)
			document.global.pointLight.castShadow = true;

		//gamestart delay
		// if (document.global.gameplay.gameStart === 0)
		// 	document.global.gameplay.gameStartFrame++;
		// if (document.global.gameplay.gameStartFrame === document.global.gameplay.gameStartFrameLimit) {
		// 	document.global.gameplay.gameStart = 1;
		// 	document.global.gameplay.gameStartFrame =0;
		// }

		
			


		renderer.render( scene, camera );
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();