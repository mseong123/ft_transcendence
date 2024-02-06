function resizeAspect(e) {
	let canvas = document.querySelector(".canvas-container");
	canvas.style.height = (canvas.clientWidth / document.global.aspect) + 'px';
			
}

function init() {
	let global = {
		clientWidth:document.getElementById("c").clientWidth,
		widthDivision:2.5,
		aspect: 4/3,
		arenaColor:"#ffffff",
		arenaThickness:3,
		paddleInfo:{
			color:"rgb(128,128,128)",
		},
		paddleOneInfo:{
			x:0,
			y:0,
			z:0,
		},
		paddleTwoInfo:{
			x:0,
			y:0,
			z:0,
		},
		keyboard:{
			w:0,
			s:0,
			a:0,
			d:0,
			up:0,
			down:0,
			left:0,
			right:0,
			speed:5,
		},
		ballInfo:{
			color:"#686868",
			radiusDivision:70,
			rotationX:0.01,
			rotationY:0.01,
			velocityX:3,
			velocityY:3,
			velocityZ:3,
		}
		
	}
	
	document.global = global;
	console.log(document.global.clientWidth)
	resizeAspect();
	window.addEventListener("resize", resizeAspect);
}

init();