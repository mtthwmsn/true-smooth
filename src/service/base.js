TrueSmoothService.prototype.register = function(instance) {
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
