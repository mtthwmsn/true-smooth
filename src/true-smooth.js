
var TrueSmooth = function(el) {
	var context = this;

	this.service = new TrueSmoothService();
	this.service.onScroll((distance) => {
		console.log('scroll distance: '+distance);
	});

	this.container = el;
	this.items = [];
	getItems();

	function getItems() {
		context.container.querySelectorAll('[data-true-smooth-item]').forEach((el, i) => {
			context.items.push(context.service.item(el));
		});
		console.log(context.items);
	}

}



var container = document.querySelector(".true-smooth");
var test = new TrueSmooth(container);
