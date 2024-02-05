import * as THREE from 'https://threejs.org/build/three.module.js';
import {processBallMovement} from './gamePlay.js';


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
	const paddleMaterial = new THREE.MeshPhongMaterial( { color: document.global.paddleInfo.color, emissive: document.global.paddleInfo.color  } );
	const paddleMesh = new THREE.Mesh(paddleGeometry, paddleMaterial);
	return paddleMesh;

}

function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	const scene = new THREE.Scene();
	renderer.setClearColor( 0x000000, 0 )

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
	const paddleThickness = document.global.clientWidth / document.global.aspect / 150;
	paddleOne.position.set(0, 0, document.global.clientWidth / document.global.aspect / 2 - (paddleThickness * 3));
	arena.add(paddleOne);


	//create directional light
	const color = 0xFFFFFF;
	const intensity = 10;
	const light = new THREE.DirectionalLight(color, intensity);
	light.position.set(document.global.clientWidth,document.global.clientWidth, 0);
	document.global.light = light;
	scene.add(light);
	

	// const helper = new THREE.DirectionalLightHelper( light );
	// scene.add( helper );
	
	function render( time ) {
		const ballInfo =  document.global.ballInfo;
		time *= 0.001;
	
		if ( resizeRendererToDisplaySize( renderer ) ) {
	
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
	
		}
		processBallMovement();
		document.global.ballMesh.position.set(ballInfo.x, ballInfo.y, ballInfo.z);
		document.global.arena.position.z += document.global.clientWidth / document.global.aspect;
		document.global.arena.rotation.y += 0.005;
		// document.global.arena.rotation.x += 0.01;
		document.global.arena.position.z -= document.global.clientWidth / document.global.aspect;

		
		
	
		
	
		renderer.render( scene, camera );
		requestAnimationFrame(render);
		
	
	}
	requestAnimationFrame(render);
}

main();