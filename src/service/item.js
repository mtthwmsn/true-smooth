var TrueSmoothItem = function(el, instance) {
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
