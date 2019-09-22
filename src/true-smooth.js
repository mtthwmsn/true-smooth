
var TrueSmooth = function() {
	this.helper = new TrueSmoothHelper();
	this.helper.onScroll((distance) => {
		console.log('scroll distance: '+distance);
	});
}



var test = new TrueSmooth();
