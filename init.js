function resizeAspect(e) {
	let canvas = document.querySelector("#c");
	canvas.style.height = (canvas.clientWidth / document.global.aspect) + 'px';
}


function init() {

	let global = {
		aspect: 4/3,
		arenaColor:"#808080",
		
	}
	document.global = global;
	resizeAspect();
	window.addEventListener("resize", resizeAspect);
}

init();