console.log('welcome! start scrolling.');

const helper = new Helper();
helper.onScroll((distance) => {
	console.log('scroll distance: '+distance);
});
