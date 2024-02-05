function resizeAspect(e) {
	let canvas = document.querySelector(".canvas-container");
	canvas.style.height = (canvas.clientWidth / document.global.aspect) + 'px';
			
}

function init() {
	let global = {
		minWidth:500,
		minWidthDivision:2.5,
		aspect: 4/3,
		arenaColor:"#ffffff",
		arenaThickness:3,
		paddleInfo:{
			color:"#686868",
		},
		paddleOneInfo:{
			x:0,
			y:0,
			z:0,
			velocityX:3,
			velocityY:3,
		},
		ballInfo:{
			color:"#686868",
			radiusDivision:70,
			rotationX:0.01,
			rotationY:0.01,
			x:0,
			y:0,
			z:0,
			velocityX:1,
			velocityY:1,
			velocityZ:1,
		}
		
	}
	document.global = global;
	resizeAspect();
	window.addEventListener("resize", resizeAspect);
}

init();