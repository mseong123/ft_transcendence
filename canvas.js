import * as THREE from 'https://threejs.org/build/three.module.js';

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

function resizeArena() {
	let existingWidth = document.global.arenaMesh.geometry.parameters.geometry.parameters.width;
	let existingHeight = document.global.arenaMesh.geometry.parameters.geometry.parameters.height;
	let existingDepth = document.global.arenaMesh.geometry.parameters.geometry.parameters.depth;
	console.log(existingWidth);
	console.log(existingHeight);
	console.log(existingDepth);
}


function main() {
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	const scene = new THREE.Scene();
	scene.background = new THREE.Color( "#FFFFFF" );

	//create arena;
	const arenaGeometry = new THREE.EdgesGeometry(new THREE.BoxGeometry( canvas.clientWidth / 2.5, canvas.clientHeight / 2.5, canvas.clientHeight));
	const arenaMaterial = new THREE.LineBasicMaterial( { color: document.global.arenaColor } );
	const arenaMesh = new THREE.LineSegments( arenaGeometry, arenaMaterial );
	document.global.arenaMesh = arenaMesh;
	scene.add(arenaMesh);

	//create camera
	const fov = 60;
	const aspect = document.global.aspect; // the canvas default

	const near = 0.1;
	const far = 3000;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.z = canvas.clientHeight;

	function render( time ) {

		time *= 0.001;
	
		if ( resizeRendererToDisplaySize( renderer ) ) {
	
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
	
		}
		document.global.arenaMesh.position.z += canvas.clientWidth;
		document.global.arenaMesh.rotation.y += 2;
		document.global.arenaMesh.position.z -= canvas.clientWidth;
		resizeArena();
		
	
		// objects.forEach( ( obj, ndx ) => {
	
		// 	const speed = .1 + ndx * .05;
		// 	const rot = time * speed;
		// 	obj.rotation.x = rot;
		// 	obj.rotation.y = rot;
	
		// } );
	
		renderer.render( scene, camera );
	
		
	
	}
	requestAnimationFrame(render);
}

main();