// register the service
var TrueSmoothService = function(instance) { this.register(instance) };
// any further logic before declaring the application
// ...
;TrueSmoothService.prototype.register = function(instance) {
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

	/**
	 * registerItem() registers a new item
	 *
	 * @return object
	 */
	this.registerItem = (el) => {
		return new TrueSmoothItem(el, instance);
	};

	return this;
}
;var TrueSmoothItem = function(el, instance) {
	this.error = [];
	this.instance = instance;
	this.el = el;
	this.anchor = null;
	this.zIndex = el.dataset.zIndex || 1;
	this.scrollRatio = el.dataset.scrollRatio || 1;

	this.setAnchor();

	if (this.error.length) {
		console.log(this.error);
	}

	return this;
};

TrueSmoothItem.prototype.setAnchor = function() {
	this.anchor = {};
	// anchor set in the dataset
	if (this.el.dataset.anchor) {
		let parts = this.el.dataset.anchor.split(":");
		var anchorSelector = parts[0],
		    anchorPoint = parts[1] || null,
		    itemAnchorPoint = parts[2] || null,
		    anchorMargin = parseInt(parts[3]) || null;

		// determine the anchor element
		this.anchor.el = this.instance.container;
		if (anchorSelector !== "_parent") {
			this.anchor.el = document.querySelector(anchorSelector);
		}
		// unable to find anchor element
		if (! this.anchor.el) {
			this.error.push("Item not found");
			return;
		}
	}
	// default anchor points
	else {
		var anchorPoint = "bottom",
		    itemAnchorPoint = "bottom",
		    anchorMargin = null;
		this.anchor.el = this.instance.container;
	}
	// determine Y offset anchor point
	this.anchor.offsetY = this.anchor.el.offsetTop;
	if (anchorPoint === "bottom") {
		this.anchor.offsetY += this.anchor.el.offsetHeight;
	}
	// determine Y offset adjusted for item height
	// ...
	// determine Y offset with specified margin
	if (anchorMargin !== null) {
		this.anchor.offsetY -= anchorMargin
	}

	console.log(this.anchor);
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
;var TrueSmooth = function(el) {
	var context = this;

	this.service = new TrueSmoothService(this);

	this.container = el;
	this.items = [];
	getItems();

	function getItems() {
		context.container.querySelectorAll('[data-true-smooth-item]').forEach((el, i) => {
			context.items.push(context.service.registerItem(el));
		});
		console.log(context.items);
	}

	this.service.onScroll((distance) => {
		console.log('scroll distance: '+distance);
		this.items.forEach((item) => {
			if (item.anchor.offsetY >= distance) {
				item.el.style.transform = "translate3d(0, "+distance+"px, 0)";
			}
		});
	});


}



var container = document.querySelector(".true-smooth");
var test = new TrueSmooth(container);
