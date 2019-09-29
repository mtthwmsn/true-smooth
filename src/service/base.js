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
