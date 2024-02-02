function resizeAspect(e) {
	let canvas = document.querySelector("#c");
	canvas.style.height = (canvas.clientWidth / document.global.aspect) + 'px';
}


function init() {

	let global = {
		aspect: 4/3,
		arenaColor:"#808080",
		ballInfo:{
			color:"#ff0000",
			radiusDivision:50,
			x:0,
			y:0,
			z:0,
			velocityX:3,
			velocityY:3,
			velocityZ:3,
		}
		
	}
	document.global = global;
	resizeAspect();
	window.addEventListener("resize", resizeAspect);
}

init();