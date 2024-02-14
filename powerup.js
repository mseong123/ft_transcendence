import * as THREE from 'https://threejs.org/build/three.module.js';

export function createFirstHalfCircleGeometry(radius) {
	const circleRadius = radius;
	const circleSegments = 32;
	const circlePoints = [];
	
	for (let i = 0; i <= 12; i++) {
		{
			const theta = (i / circleSegments) * Math.PI * 2;
			const x = circleRadius * Math.cos(theta);
			const y = circleRadius * Math.sin(theta);
			const z = 0; // Set to 0 to lie on the surface of the sphere
			circlePoints.push(new THREE.Vector3(x, y, z));
		}
	}
	return new THREE.BufferGeometry().setFromPoints(circlePoints);
}

export function createSecondHalfCircleGeometry(radius) {
	const circleRadius = radius;
	const circleSegments = 32;
	const circlePoints = [];
	
	for (let i = 16; i <= 28; i++) {
		{
			const theta = (i / circleSegments) * Math.PI * 2;
			const x = circleRadius * Math.cos(theta);
			const y = circleRadius * Math.sin(theta);
			const z = 0; // Set to 0 to lie on the surface of the sphere
			circlePoints.push(new THREE.Vector3(x, y, z));
		}
	}
	return new THREE.BufferGeometry().setFromPoints(circlePoints);
}

export function createLargePaddle(arena3D, sphereGeometry, firstHalfCircleGeometry, SecondHalfCircleGeometry) {
	const sphereMaterial = new THREE.MeshPhongMaterial( { color: document.global.powerUp.color[0], emissive: document.global.powerUp.color[0], shininess:document.global.powerUp.shininess} );
	const circleMaterial = new THREE.LineBasicMaterial( { color: document.global.powerUp.color[0]} );
	const largePaddleSphereMesh = new THREE.Mesh( sphereGeometry, sphereMaterial );
	const firstHalfCircleMesh = new THREE.Line( firstHalfCircleGeometry, circleMaterial);
	const secondHalfCircleMesh = new THREE.Line( SecondHalfCircleGeometry, circleMaterial);
	largePaddleSphereMesh.add(firstHalfCircleMesh);
	largePaddleSphereMesh.add(secondHalfCircleMesh);
	largePaddleSphereMesh.visible = false;
	document.global.powerUp.mesh.push(largePaddleSphereMesh);
	arena3D.add(largePaddleSphereMesh);
}


export function createPowerUp(arena3D) {
	const sphereGeometry = new THREE.SphereGeometry( document.global.powerUp.radius, document.global.powerUp.widthSegments, document.global.powerUp.heightSegments );
	const firstHalfCircleGeometry = createFirstHalfCircleGeometry(document.global.powerUp.circleRadius);
	const SecondHalfCircleGeometry = createSecondHalfCircleGeometry(document.global.powerUp.circleRadius);
	
	if (document.global.powerUp.enable) {
		//create all powerUp objects
		createLargePaddle(arena3D, sphereGeometry, firstHalfCircleGeometry, SecondHalfCircleGeometry);

		//initial render
		document.global.powerUp.mesh[document.global.powerUp.index].visible = true;
		document.global.powerUp.mesh[document.global.powerUp.index].position.set(document.global.powerUp.positionX, document.global.powerUp.positionY, document.global.powerUp.positionZ);
	}

}