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


	;(function() {
		// custom download
		var modules = {
			"epitome": [],
			"epitome-model": ["epitome","epitome-isequal"],
			"epitome-model-sync": ["epitome","epitome-isequal","epitome-model"],
			"epitome-collection": ["epitome","epitome-isequal","epitome-model"],
			"epitome-collection-sync": ["epitome","epitome-isequal","epitome-model","epitome-collection"],
			"epitome-template": ["epitome"],
			"epitome-view": ["epitome","epitome-isequal","epitome-model","epitome-collection","epitome-template"],
			"epitome-storage": ["epitome"],
			"epitome-router": ["epitome"]
		};

		var builder = document.id('builder').getFirst(),
			defaultURL = 'http://fragged.org:39170/',
			downloadLink = document.getElement('a.download-link'),
			setURL = function() {
				var deps = document.getElements('input.epitome-builder:checked').get('name'),
					url = deps.length ? defaultURL + '?build=' + deps.join(',') : defaultURL;

				downloadLink.set('href', url);
			};

		downloadLink.addEvent('click', setURL);

		Object.each(modules, function(deps, module) {
			var tr = new Element('tr'),
				td1 = new Element('td.small').inject(tr),
				td2 = new Element('td').inject(tr);

			var label = new Element('label[for=input-'+module+'][html=" ' + module +'"]').inject(td2)
			new Element('input.epitome-builder[type=checkbox][name=' + module + ']#input-'+module, {
				events: {
					change: function() {
						var deps = this.retrieve('deps'),
							checked = this.get('checked'),
							vals,
							already;

						if (checked) {
							vals = deps.map(function(dep) {
								return 'input[name=' + dep + ']';
							});
							document.getElements(vals.join(',')).set('checked', checked);
							setURL();
						}
					}
				}
			}).inject(td1, 'top').store('deps', deps);
			tr.inject(builder);
		});
	}());
}());
