/*jshint mootools:true */
/*global moostrapScrollspy, prettyPrint */
(function(){
	"use strict";

	var nav = document.id('nav');

	nav && new moostrapScrollspy('sections', {
		offset: -40,
		onReady: function(){
			this.scroll();
			var main = this.main = document.id('content'),
				body = document.id(document.body),
				handleClicks = function(e, el){
					e.stop();
					var target = el.get('href');
					window.location.hash = target;
					body.scrollTo(0, main.getElement(target).getPosition().y - 40);
				};

			this.element.addEvent('click:relay(li > a)', handleClicks);
			this.main.addEvent('click:relay(a[href^=#])', handleClicks);
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
