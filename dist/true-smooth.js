console.log('welcome! start scrolling.');

// register the helper
var TrueSmoothHelper = function() { this.register() };
;TrueSmoothHelper.prototype.register = function() {
	/**
	 * getScrollDistance() returns the vertical scroll distance
	 *
	 * @return void
	 */
	this.getScrollDistance = () => {
		return window.pageYOffset
		    || (document.documentElement||document.body.parentNode||document.body).scrollTop;
	};

	/**
	 * onScroll()
	 *
	 * @return void
	 */
	this.onScroll = (callback) => {
		this.registerHelperScroll(this, callback);
	};

	return this;
}
;TrueSmoothHelper.prototype.registerHelperScroll = function(helper, callback) {
	let lastScrollTop = helper.getScrollDistance();
	let rAF = window.requestAnimationFrame ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame ||
	          window.msRequestAnimationFrame ||
	          window.oRequestAnimationFrame;

	// start listening immediately
	listen();

	/**
	* listen() continously triggers on requestAnimationFrame, executing the
	* callback if scroll distance has changed
	*
	* return void
	*/
	function listen() {
		let scrollTop = helper.getScrollDistance();
		if (lastScrollTop === scrollTop) {
			rAF(listen);
			return;
		}
		lastScrollTop = scrollTop;
		callback(lastScrollTop);
		rAF(listen);
	}
}
;
var TrueSmooth = function() {
	this.helper = new TrueSmoothHelper();
	this.helper.onScroll((distance) => {
		console.log('scroll distance: '+distance);
	});
}



var test = new TrueSmooth();
