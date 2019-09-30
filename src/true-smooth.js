var TrueSmooth = function(el) {
	// store context to this instance
	var context = this;
	// register the service
	this.service = new TrueSmoothService(this);

	this.container = el;
	this.items = [];
	this.scrollY = 0;
	registerItems();

	this.getItems = function() {
		let items = [];
		context.items.forEach((item) => { items.push(item.el) });
		return items;
	};

	// start listening for scroll
	this.service.onScroll((scroll) => {
		// update the vertical scroll position in this instance
		this.scrollY = scroll.y;
		// scroll or anchor each item
		this.items.forEach((item) => {
			if (item.getOffsetY(scroll.y) > item.anchor.offsetY)
				item.scrollAnchor(scroll.y);
			else
				item.scroll(scroll.y);
		});
	});

	// define properties to expose
	return {
		getItems: this.getItems
	}
////////////////////////////////////////////////////////////////////////////////

	function registerItems() {
		context.container.querySelectorAll('[data-true-smooth-item]').forEach((el, i) => {
			context.items.push(context.service.registerItem(el));
		});
	}
};
