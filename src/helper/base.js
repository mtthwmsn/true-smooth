TrueSmoothHelper.prototype.register = function() {
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
