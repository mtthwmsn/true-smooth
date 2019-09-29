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
	 * @param object callback
	 * @return void
	 */
	this.onScroll = (callback) => {
		this.registerServiceScroll(this, callback);
	};

	/**
	 * registerItem() registers a new item
	 *
	 * @param object el
	 * @return object
	 */
	this.registerItem = (el) => {
		return new TrueSmoothItem(el, instance);
	};

	// create an event and fire on debounced viewport resize
	var resizeDebouncedEvent = new Event('ts.resize.debounced');
	window.addEventListener('resize', debounce(() => {
		window.dispatchEvent(resizeDebouncedEvent);
	}));

	/**
	 * onViewportResize() fires the passed callback on resize (debounced) of the
	 * viewport. Callback returns object with width and height of viewport 
	 *
	 * @param object callback
	 * @return void
	 */
	this.onViewportResize = (callback) => {
		window.addEventListener('ts.resize.debounced', () => {
			callback({
				width: window.innerWidth,
				height: window.innerHeight
			});
		});
	};

	return this;
////////////////////////////////////////////////////////////////////////////////

	/**
	 * debounce()
	 *
	 * @param object func
	 * @param integer wait
	 * @return object func
	 */
	function debounce(func, wait) {
		var timeout,
		    wait = wait || 200;
		return () => {
			var context = this,
			    args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				timeout = null;
				func.apply(context, args);
			}, wait);
		};
	};
}
;var TrueSmoothItem = function(el, instance) {
	var context = this;

	this.error = [];
	this.instance = instance;
	this.el = el;
	this.anchor = null;
	this.state = "initial";
	this.offsetY = 0;
	this.zIndex = el.dataset.zIndex || 1;
	this.scrollRatio = el.dataset.scrollRatio || 1;
	this.initialStyle = {};

	// set initial styles and listen for viewport changes to set again
	this.setInitialStyle();
	//instance.service.onViewportResize((v) => {
	//	context.setInitialStyle.apply(context);
	//});

	this.setAnchor();


	if (this.error.length) {
		console.log(this.error);
	}

	return this;
};


TrueSmoothItem.prototype.scroll = function(scrollY) {
	//this.el.style.transform = "translate3d(0, "+scrollY+"px, 0)";
	if (this.state === "scroll") return;
	this.state = "scroll";

	console.log('keep scrolling');

	this.el.style.position = "fixed";
	let offsetY = 0;
	    offsetY += parseInt(this.initialStyle.top);
	    offsetY += parseInt(this.initialStyle.marginTop);
	this.el.style.transform = "translate3d(0, "+offsetY+"px, 0)";
};

TrueSmoothItem.prototype.scrollAnchor = function(scrollY) {
	if (this.state === "anchored") return;
	this.state = "anchored";

	console.log('STOP scrolling', this.getOffsetY(scrollY));

	// fix absolutely to anchor point
	this.el.style.position = "absolute";
	let offsetY = this.anchor.offsetY;
	if (this.anchor.itemPoint === "bottom") {
		offsetY -= parseInt(this.el.offsetHeight);
	}
	this.el.style.transform = "translate3d(0, "+offsetY+"px, 0)";
};


TrueSmoothItem.prototype.getOffsetY = function(scrollY) {
	let offsetY = this.offsetY;
	// offset by height of element if point is bottom
	if (this.anchor.itemPoint === "bottom") {
		offsetY += this.el.offsetHeight;
	}
	// offset by the scroll distance
	offsetY += scrollY;

	return offsetY;
};

/**
 * setInitialStyle()
 *
 * @return void
 */
TrueSmoothItem.prototype.setInitialStyle = function() {
	this.initialStyle = {};
	let initialStyles = window.getComputedStyle(this.el);
	['position', 'top', 'right', 'bottom', 'left', 'marginTop'].forEach((prop) => {
		this.initialStyle[ prop ] = initialStyles[ prop ] || null;
	});

	// remove top margins and replace with transform
	this.el.style.top = "0px";
	this.el.style.marginTop = "0px";
	let offsetY = 0;
	    offsetY += parseInt(this.initialStyle.top);
	    offsetY += parseInt(this.initialStyle.marginTop);
	this.el.style.transform = "translate3d(0, "+offsetY+"px, 0)";
	// update offsetY
	this.offsetY = offsetY;

	// do the smooth
	//this.el.style.transition = "transform 0.1s ease";
};

/**
 * setAnchor()
 *
 * @return void
 */
TrueSmoothItem.prototype.setAnchor = function() {
	this.anchor = {};
	// anchor set in the dataset
	if (this.el.dataset.anchor) {
		let parts = this.el.dataset.anchor.split(":");
		this.anchor.selector = parts[0];
		this.anchor.point = parts[1] || null;
		this.anchor.itemPoint = parts[2] || null;
		this.anchor.anchorMargin = parseInt(parts[3]) || 0;

		// determine the anchor element
		this.anchor.el = this.instance.container;
		if (this.anchor.selector !== "_parent") {
			this.anchor.el = document.querySelector(this.anchor.selector);
		}
		// unable to find anchor element
		if (! this.anchor.el) {
			this.error.push("Item not found");
			return;
		}
	}
	// default anchor points
	else {
		this.anchor.selector = "_parent";
		this.anchor.point = "bottom";
		this.anchor.itemPoint = "bottom";
		this.anchor.anchorMargin = 0;
		this.anchor.el = this.instance.container;
	}
	// determine Y offset anchor point
	this.anchor.offsetY = this.anchor.el.offsetTop;
	if (this.anchor.point === "bottom") {
		this.anchor.offsetY += this.anchor.el.offsetHeight;
	}
	// determine Y offset with specified margin
	this.anchor.offsetY -= this.anchor.anchorMargin
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
		let scrollDir = scrollTop > lastScrollTop ? "down" : "up";
		lastScrollTop = scrollTop;
		callback({
			y: lastScrollTop,
			dir: scrollDir
		});
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
	}

	this.service.onScroll((scroll) => {

		//console.log(scroll.y, scroll.dir);

		this.items.forEach((item) => {

			console.log('offsetY', item.getOffsetY(scroll.y), item.anchor.offsetY);

			//
			if (item.getOffsetY(scroll.y) > item.anchor.offsetY) {
				item.scrollAnchor(scroll.y);
			}
			else {
				item.scroll(scroll.y);
			}

		});
	});



	//this.service.onScroll((distance) => {
	//	this.items.forEach((item) => {
	//		let treshold = (item.el.offsetTop + item.el.offsetHeight + (distance * 2));
	//		console.log(treshold, item.anchor.offsetY);
	//		if (item.anchor.offsetY > treshold) {
	//			item.el.style.transform = "translate3d(0, "+distance+"px, 0)";
	//			setTimeout(function() {
	//				item.el.style.transition = "transform 0.125s ease";
	//			}, 0);
	//			item.el.style.position = "fixed";
	//			item.el.dataset.on = 1;
	//		}
	//		else {
	//			if (item.el.dataset.on == 1) {
	//				console.log("HERE", item.el.offsetTop, item.top, item.el.offsetHeight, item.anchor.offsetY);
	//				item.el.dataset.on = null;
	//				item.el.style.transition = "";
	//				item.el.style.transform = "translate3d(0, "+(item.anchor.offsetY - item.el.offsetHeight - item.top)+"px, 0)";
	//				item.el.style.position = "absolute";
	//			}
	//		}
	//	});
	//});


}



var container = document.querySelector(".true-smooth");
var test = new TrueSmooth(container);
