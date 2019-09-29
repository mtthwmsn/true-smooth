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
	}

	this.service.onScroll((scroll) => {

		//console.log(scroll.y, scroll.dir);

		this.items.forEach((item) => {

			console.log('offsetY', item.getOffsetY(scroll.y), item.anchor.offsetY);

			//
			if (item.getOffsetY(scroll.y) > item.anchor.offsetY) {
				item.scrollAnchor(scroll.y);
			}
			else {
				item.scroll(scroll.y);
			}

		});
	});



	//this.service.onScroll((distance) => {
	//	this.items.forEach((item) => {
	//		let treshold = (item.el.offsetTop + item.el.offsetHeight + (distance * 2));
	//		console.log(treshold, item.anchor.offsetY);
	//		if (item.anchor.offsetY > treshold) {
	//			item.el.style.transform = "translate3d(0, "+distance+"px, 0)";
	//			setTimeout(function() {
	//				item.el.style.transition = "transform 0.125s ease";
	//			}, 0);
	//			item.el.style.position = "fixed";
	//			item.el.dataset.on = 1;
	//		}
	//		else {
	//			if (item.el.dataset.on == 1) {
	//				console.log("HERE", item.el.offsetTop, item.top, item.el.offsetHeight, item.anchor.offsetY);
	//				item.el.dataset.on = null;
	//				item.el.style.transition = "";
	//				item.el.style.transform = "translate3d(0, "+(item.anchor.offsetY - item.el.offsetHeight - item.top)+"px, 0)";
	//				item.el.style.position = "absolute";
	//			}
	//		}
	//	});
	//});


}



var container = document.querySelector(".true-smooth");
var test = new TrueSmooth(container);
