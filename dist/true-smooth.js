function Helper() {
	//this.scroll = new HelperScroll();


	this.getScrollDistance = () => {
		return window.pageYOffset
		    | (document.documentElement||document.body.parentNode||document.body).scrollTop;
	};

	this.onScroll = (callback) => {
		if (typeof callback === "function") {
			return new HelperScroll(callback);
		}
	}

	return this;
}
;function HelperScroll(callback) {
	let lastScrollTop = helper.getScrollDistance();
	let rAF = window.requestAnimationFrame ||
	          window.webkitRequestAnimationFrame ||
	          window.mozRequestAnimationFrame ||
	          window.msRequestAnimationFrame ||
	          window.oRequestAnimationFrame;

	// start listening immediateley
	if (typeof callback === "function") {
		listen();
	}

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
;console.log('welcome! start scrolling.');

const helper = new Helper();
helper.onScroll((distance) => {
	console.log('scroll distance: '+distance);
});
