import * as THREE from 'https://threejs.org/build/three.module.js';
import {processBallMovement} from './gameplay.js';
import {movePaddle} from './gameplay.js';
import {keyBinding} from './gameplay.js';


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
	if (document.global.gameplay.local) {
		for (let i = 0; i < 2; i++) {
			const paddleGeometry = new THREE.BoxGeometry(document.global.paddle.width, document.global.paddle.height, document.global.paddle.thickness )
			const paddleMaterial = new THREE.MeshPhongMaterial( { color: document.global.paddle.color, emissive: document.global.paddle.color, transparent:true, opacity:document.global.paddle.opacity });
			const paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
			paddleMesh.receiveShadow = true;
			if (i === 0)
				paddleMesh.position.set(0, 0, (document.global.arena.clientWidth / document.global.arena.aspect / 2) - (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier));
			else
				paddleMesh.position.set(0, 0, -(document.global.arena.clientWidth / document.global.arena.aspect / 2) + (document.global.paddle.thickness * document.global.paddle.distanceFromEdgeModifier));
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
	document.global.arena.position.z += document.global.arena.depth;
	document.global.arena.rotation.y += document.global.gameplay.rotationY;
	document.global.arena.position.z -= document.global.arena.depth;
}

function arenaRotateX() {
	document.global.arena.position.z += document.global.arena.depth;
	document.global.arena.rotation.x += document.global.gameplay.rotationX;
	document.global.arena.position.z -=document.global.arena.depth;
}

function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	const scene = new THREE.Scene();
	renderer.setClearColor( 0x000000, 0 );
	renderer.shadowMap.enabled = true;

	//create arena scenegraph
	const arena3D = new THREE.Object3D();

	createArenaMesh(arena3D);
	createSphereMesh(arena3D);
	const camera = createCamera();
	createPaddleMesh(arena3D);
	createDirectionalLight(arena3D);
	createPointLight(arena3D);
	createShadowPlanes(arena3D);

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
		if (document.global.gameplay.gameStart)
			processBallMovement();
		if (document.global.gameplay.initRotateY)
			arenaRotateY();
		if (document.global.gameplay.initRotateX)
			arenaRotateX();
		movePaddle();
		
		//gamestart shadow issue actions
		document.global.gameplay.shadowFrame++;

		if (document.global.shadowFrame === document.global.shadowFrameLimit) {
			document.global.pointLight.castShadow = true;
		}
		renderer.render( scene, camera );
		requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
}

main();