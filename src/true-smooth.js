var TrueSmooth = function(el) {
	var context = this;

	this.service = new TrueSmoothService(this);

	this.container = el;
	this.items = [];
	getItems();

	function getItems() {
		context.container.querySelectorAll('[data-true-smooth-item]').forEach((el, i) => {
			context.items.push(context.service.registerItem(el));
		});
		console.log(context.items);
	}

	this.service.onScroll((distance) => {
		console.log('scroll distance: '+distance);
		this.items.forEach((item) => {
			if (item.anchor.offsetY >= distance) {
				item.el.style.transform = "translate3d(0, "+distance+"px, 0)";
			}
		});
	});


}



var container = document.querySelector(".true-smooth");
var test = new TrueSmooth(container);
