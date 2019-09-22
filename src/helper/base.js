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
