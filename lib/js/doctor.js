(function(){
	var nav = document.id('nav');

	nav && new moostrapScrollspy('sections', {
		offset: -40,
		onReady: function(){
			this.scroll();
		},
		onActive: function(el, target){
			var g = el.getParents("li").getLast();
			g.addClass('active');
			target.addClass('active');
			nav.scrollTo(0, g.getPosition(this.element).y);
		},
		onInactive: function(el, target){
			target.removeClass('active');
			this.element.getElements('li.active').removeClass('active');
		}
	});

	prettyPrint();

}());
