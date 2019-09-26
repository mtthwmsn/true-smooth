TrueSmoothService.prototype.item = function(el) {
	let item = {};
	    item.el = el;
	    item.zIndex = el.dataset.zIndex || 1;
	    item.scrollRatio = el.dataset.scrollRatio || 1;

	return item;
};
