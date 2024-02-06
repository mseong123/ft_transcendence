import * as THREE from 'https://threejs.org/build/three.module.js';
import {processBallMovement} from './gameplay.js';
import {movePaddle} from './gameplay.js';


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

function createShadowPlanes(arena) {
	const geometrySides = new THREE.PlaneGeometry( document.global.clientWidth / document.global.aspect /document.global.widthDivision, document.global.clientWidth  / document.global.aspect );
	const geometryTopBottom = new THREE.PlaneGeometry( document.global.clientWidth /document.global.widthDivision, document.global.clientWidth  / document.global.aspect );
	// const material = new THREE.MeshBasicMaterial({color:"white", side:THREE.DoubleSide});
	const material = new THREE.ShadowMaterial({side:THREE.DoubleSide});
	material.opacity = 0.3;
	const shadowPlanes = [];

	//sides
	for (let i = 0; i < 2; i++) {
		const plane = new THREE.Mesh( geometrySides, material );
		plane.rotateX( Math.PI /2 );
		plane.rotateY( Math.PI /2 );
		plane.receiveShadow = true;
		arena.add( plane );
		shadowPlanes[i] = plane;
	}
	shadowPlanes[0].position.set(-document.global.clientWidth / document.global.widthDivision/2,0,0);
	shadowPlanes[1].position.set(document.global.clientWidth / document.global.widthDivision/2,0,0);
	//top bottom
	for (let i = 2; i < 4; i++) {
		const plane = new THREE.Mesh( geometryTopBottom, material );
		plane.rotateX( Math.PI /2 );
		plane.receiveShadow = true;
		arena.add( plane );
		shadowPlanes[i] = plane;
	}
	shadowPlanes[2].position.set(0,document.global.clientWidth / document.global.aspect/ document.global.widthDivision/2,0);
	shadowPlanes[3].position.set(0,-document.global.clientWidth / document.global.aspect/ document.global.widthDivision/2,0);
	document.global.shadowPlanes = shadowPlanes;
}

function createArenaMesh(thickness, arena) {
	const arenaMaterial = new THREE.LineBasicMaterial( { color: document.global.arenaColor } );
	const arenaMesh = [];
	for (let i = 0; i < thickness; i++) {
		const arenaGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry( (document.global.clientWidth + i) / document.global.widthDivision,
		(document.global.clientWidth + i) / document.global.aspect / document.global.widthDivision , (document.global.clientWidth + 1) / document.global.aspect));
		arenaMesh.push(new THREE.LineSegments( arenaGeometry, arenaMaterial ));
		arena.add(arenaMesh[i]);
	}
	document.global.arenaMesh = arenaMesh;
}

function createPaddleMesh() {
	const paddleThickness = document.global.clientWidth / document.global.aspect / 150;
	const paddleWidth = document.global.clientWidth / document.global.widthDivision / 5;
	const paddleHeight = document.global.clientWidth  / document.global.widthDivision / document.global.aspect / 7;

	const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, paddleThickness )
	const paddleMaterial = new THREE.MeshPhongMaterial( { color: document.global.paddleInfo.color, emissive: document.global.paddleInfo.color, transparent:true, opacity:0.5  } );
	const paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
	paddleMesh.receiveShadow = true;
	return paddleMesh;

}

function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	const scene = new THREE.Scene();
	renderer.setClearColor( 0x000000, 0 );
	renderer.shadowMap.enabled = true;

	//create arena scenegraph including arena and ball
	const arena = new THREE.Object3D();

	//create arena;
	createArenaMesh(document.global.arenaThickness, arena);

	//create ball
	const radius =  document.global.clientWidth / document.global.ballInfo.radiusDivision;
	const widthSegments = 12;
	const heightSegments = 12;
	const ballGeometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
	const ballMaterial = new THREE.MeshPhongMaterial( { color: document.global.ballInfo.color, emissive: document.global.ballInfo.color, shininess:30} );
	const ballMesh = new THREE.Mesh( ballGeometry, ballMaterial );
	ballMesh.position.set(0,50,50);
	ballMesh.castShadow=true;
	document.global.ballMesh = ballMesh;
	arena.add(ballMesh);

	document.global.arena = arena;
	scene.add(arena);

	//create camera
	const fov = 60;
	const aspect = document.global.aspect; // the canvas default
	const near = 0.1;
	const far = 3000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = document.global.clientWidth / document.global.aspect;	

	//create paddles
	const paddleOne = createPaddleMesh();
	const paddleTwo = createPaddleMesh();
	const paddleThickness = document.global.clientWidth / document.global.aspect / 150;
	paddleOne.position.set(0, 0, document.global.clientWidth / document.global.aspect / 2 - (paddleThickness * 3));
	paddleTwo.position.set(0, 0, - (document.global.clientWidth / document.global.aspect / 2) + (paddleThickness * 3));
	document.global.paddleOne = paddleOne;
	document.global.paddleTwo = paddleTwo;
	arena.add(paddleOne);
	arena.add(paddleTwo);


	//create directional light
	const directionalLightColor = 0xFFFFFF;
	const directionalLightIntensity = 10;
	const light = new THREE.DirectionalLight(directionalLightColor, directionalLightIntensity);
	light.position.set(document.global.clientWidth,document.global.clientWidth, 0);
	document.global.light = light;
	arena.add(light);

	//create point light for shadow
	const pointLightColor = 0xFFFFFF;
	const pointLightIntensity = 10;
	const pointLight = new THREE.PointLight(pointLightColor, pointLightIntensity);
	document.global.pointLight = pointLight;
	// pointLight.castShadow=true;
	arena.add(pointLight);



	//create shadow planes
	createShadowPlanes(arena);

	function render( time ) {
		time *= 0.001;
	
		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}
		processBallMovement();
		movePaddle();
		document.global.arena.position.z += document.global.clientWidth / document.global.aspect;
		// document.global.arena.rotation.y = -1.571;
		document.global.arena.rotation.y += document.global.rotationY;
		// document.global.arena.rotation.x += 0.01;
		document.global.arena.position.z -= document.global.clientWidth / document.global.aspect;
		document.global.frame++;
		document.global.shadowFrame++;
		if (document.global.shadowFrame === 10) {
			document.global.pointLight.castShadow = true;
		}
		if (document.global.frame == 500) {
			document.global.rotationY = 0.005;
		}

		
		
	
		
	
		renderer.render( scene, camera );
		requestAnimationFrame(render);
		
	
	}
	requestAnimationFrame(render);
}

main();