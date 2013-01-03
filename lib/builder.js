var dom = require('jsdom'),
	request = require('request'),
	fs = require('fs'),
	prime = require('prime'),
	mixin = require('prime-util/prime/mixin'),
	emitter = require('prime/util/emitter'),
	marked = require('marked'),
	greenOn = '\033[32m',
	greenOff = '\033[39m',
	hbs = require('handlebars');

marked.setOptions({
	gfm: true
});

var builder = prime({

	options: {
		title: 'Epitome - MVC/MVP framework for MooTools',
		target: './index.html',
		source: './README.md',
		twitter: 'D_mitar',
		buildTemplate: './download.tpl',
		pageTemplate: './page.tpl',
		ok: '✔'
	},

	constructor: function(markdown){
		this.buildDocs(markdown);
	},

	getDocs: function(){
		return fs.readFileSync('./README.md', 'utf-8');
	},

	buildDocs: function(markdown){
		mootools = 'js/mootools-yui-compressed.js';

		var self = this,
			obj = {
				title: this.options.title,
				body: marked(markdown || this.getDocs())
			},
			body = fs.readFileSync(this.options.pageTemplate, 'utf-8');

		body = hbs.compile(body);

		this.on('html', function(html){
			fs.writeFile(self.options.target, html);
			console.log(greenOn + self.options.ok + greenOff + ' Docs generated.');
		});

		this.fixHTML(body(obj));
	},

	extractHeadings: function(window){
		var headings = [],
			sections = window.document.id('sections'),
			last,
			previousEl;

		var fixHeading = function(text){
			text = window.String.clean(text.toLowerCase());
			return text.replace('.', '-').replace(/[^a-z0-9 -]/g, '').replace(/\s+/g, '-');
		};


		window.document.getElements('h2,h3').forEach(function(heading){
			var tag = heading.get('tag').replace(/^\D/, ''),
				text = heading.get('text'),
				id = fixHeading(text),
				anchor,
				target;

			if (tag == 3) {
				// it needs namespacing. get previous h2
				var previous = heading.getPrevious('h2');
				if (previous){
					id = previous.get('id') + '/' + id;
				}
			}

			anchor = '#' + id;

			// for headings. h2
			if (tag == 2){
				previousEl = new window.Element('li.l2', {
					html: "<a href='"+anchor+"'>"+text+"</a>"
				}).inject(sections);
			}
			else {
				// it's a h3.
				if (last == tag) {
					// should have a ul already
					target = sections.getElements('ul').getLast();
				}
				else {
					console.log(previousEl.get('text'));
					target = new window.Element('ul').inject(previousEl || sections);
				}
				new window.Element('li.l3', {
					html: "<a href='"+anchor+"'>"+text+"</a>"
				}).inject(target);
			}

			last = tag;

			heading.set('id', id);
		});

	},

	fixHTML: function(body){
		var self = this,
			mootools = 'http://ajax.googleapis.com/ajax/libs/mootools/1.4.5/mootools-yui-compressed.js',
			template = fs.readFileSync(this.options.buildTemplate);

		dom.env(body, [
			mootools
		], function(errors, window) {
			var head = window.getDocument().getElement('head'),
				css = head.getElement('link');

			window.document.getElement('#content img[alt=Epitome]').dispose();
			window.document.getElements('#content').addClass('container');
			window.document.getElements('#customDownload').set('html', template);

			// add custom stylesheet
			var bootstrap = new window.Element('link', {
				href: 'css/bootstrap.css',
				type: 'text/css',
				rel: 'stylesheet'
			}).inject(head);

			// move the scripts to the head
			window.document.getElements('.jsdom').removeClass('jsdom').inject(head);

			// prettify
			window.document.getElements('pre').each(function(el){
				var sh = el.getElements('code.lang-sh').length;
				sh || el.addClass('prettyprint linenums');
			});

			self.extractHeadings(window);

			// fix doctype
			html = ['<!DOCTYPE html>', window.document.documentElement.outerHTML].join('');

			html = html.replace(mootools, 'js/mootools-yui-compressed.js');

			self.emit('html', html);
		});
	}

});


mixin(builder, emitter);

module.exports = builder;