var dom = require('cheerio'),
	marked = require('marked'),
	request = require('request'),
	fs = require('fs'),
	prime = require('prime'),
	mixin = require('prime-util/prime/mixin'),
	options = require('prime-util/prime/options'),
	emitter = require('prime/emitter'),
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
		buildTemplate: './tpl/download.tpl',
		pageTemplate: './tpl/page.tpl',
		ok: '✔'
	},

	constructor: function(markdown, options){
		this.setOptions(options);
		this.buildDocs(markdown);
	},

	getDocs: function(){
		return fs.readFileSync(this.options.source, 'utf-8');
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

	extractHeadings: function($){
		var sections = $('#sections'),
			last,
			previousEl,
			self = this;

		var fixHeading = function(text){
			text = text.toLowerCase();
			return text.replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, '-');
		};

		$('h2,h3').each(function(){
			var tag = this[0].name.replace(/^\D/, ''),
				text = $(this).text(),
				id = fixHeading(text),
				anchor,
				target;

			if (tag === 3) {
				// it needs namespacing. get previous h2
				var previous = $(this).prev('h2');
				if (previous.length) {
					id = previous.attr('id') + '/' + id;
				}
			}
			anchor = '#' + id;
			// console.log(text, tag, id);

			// for headings. h2
			if (tag === '2') {
				previousEl = $('<li />').addClass('l2').html("<a href='" + anchor + "'>" + text + "</a>");
				$(sections).append(previousEl);
				// console.log(text, ' as h2 to sections ');
			}
			else {
				// it's a h3.
				if (last === tag) {
					// should have a ul already
					target = $(sections).find('ul').last();
					// console.log(text, ' as h3 to last ul in sections');
				}
				else {
					target = $('<ul></ul>');
					(previousEl && previousEl.length ? previousEl : sections).append(target);
					// console.log(text, ' as h3 to a new ul in sections');
				}

				target.append($('<li />').addClass('l3').html("<a href='" + anchor + "'>" + text + "</a>"));
			}

			last = tag;

			$(this).attr('id', id);
		});
	},

	fixHTML: function(body){
		var $ = dom.load(body),
			scripts = [
				'js/ace/ace.js',
				'js/mootools-yui-compressed.js',
				'js/moostrap-scrollspy.js',
				'js/prettify.js',
				'js/Handlebars.js',
				'js/docs.js'
			], css = [
				'css/bootstrap.css'
			],
			html;

		scripts.forEach(function(script){
			var s = $('<script>').attr('src', script);
			$('body').append(s);
		});

		$('#content').addClass('container');

		css.forEach(function(css){
			var c = $('<link />').attr({
				href: css,
				type: 'text/css',
				rel: 'stylesheet'
			});

			$('head').append(c);
		});

		// prettify
		$('pre').each(function(i, el){
			var demo = $(el).find('.lang-demo').length,
				sh = $(el).find('.lang-sh').length;

			if (!demo && !sh){
				$(el).addClass('prettyprint linenums');
			}
		});

		this.extractHeadings($);

		this.emit('html', $.html());
	}

});


mixin(builder, emitter);
mixin(builder, options);

module.exports = builder;