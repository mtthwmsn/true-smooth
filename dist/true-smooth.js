console.log('welcome! start scrolling.');

// register the service
var TrueSmoothService = function() { this.register() };
;TrueSmoothService.prototype.register = function() {
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
		this.registerServiceScroll(this, callback);
	};

	return this;
}
;TrueSmoothService.prototype.item = function(el) {
	let item = {};
	    item.el = el;
	    item.zIndex = el.dataset.zIndex || 1;
	    item.scrollRatio = el.dataset.scrollRatio || 1;

	return item;
};
;TrueSmoothService.prototype.registerServiceScroll = function(service, callback) {
	let lastScrollTop = service.getScrollDistance();
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
		let scrollTop = service.getScrollDistance();
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
var TrueSmooth = function(el) {
	var context = this;

	this.service = new TrueSmoothService();
	this.service.onScroll((distance) => {
		console.log('scroll distance: '+distance);
	});

	this.container = el;
	this.items = [];
	getItems();

	function getItems() {
		context.container.querySelectorAll('[data-true-smooth-item]').forEach((el, i) => {
			context.items.push(context.service.item(el));
		});
		console.log(context.items);
	}

}



var container = document.querySelector(".true-smooth");
var test = new TrueSmooth(container);
