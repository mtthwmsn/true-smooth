TrueSmoothHelper.prototype.registerHelperScroll = function(helper, callback) {
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
