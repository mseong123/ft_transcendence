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


function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	const scene = new THREE.Scene();
	scene.background = new THREE.Color( "#FFFFFF" );

	//create arena scenegraph including arena and ball
	const arena = new THREE.Object3D();

	//create arena;
	const arenaGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry( canvas.clientWidth / 2.5, canvas.clientHeight / 2.5, canvas.clientHeight));
	const arenaMaterial = new THREE.LineBasicMaterial( { color: document.global.arenaColor } );
	const arenaMesh = new THREE.LineSegments( arenaGeometry, arenaMaterial );
	document.global.arenaMesh = arenaMesh;
	arena.add(arenaMesh);

	//create ball
	const radius =  canvas.clientWidth / document.global.ballInfo.radiusDivision;
	const widthSegments = 18;
	const heightSegments = 18;
	const ballGeometry = new THREE.SphereGeometry( radius, widthSegments, heightSegments );
	const ballMaterial = new THREE.MeshPhongMaterial( { color: document.global.ballInfo.color, emissive:document.global.ballInfo.color} );
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
	camera.position.z = canvas.clientHeight;
	
	
	

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
		document.global.arena.position.z += canvas.clientHeight;
		document.global.arena.rotation.y += 0.01;
		
		document.global.arena.position.z -= canvas.clientHeight;

		
		
	
		
	
		renderer.render( scene, camera );
		requestAnimationFrame(render);
		
	
	}
	requestAnimationFrame(render);
}

main();