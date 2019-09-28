var TrueSmoothItem = function(el, instance) {
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
