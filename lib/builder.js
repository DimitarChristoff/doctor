'use strict';

var dom = require('cheerio'),
	marked = require('marked'),
	fs = require('fs'),
	fse = require('fs-extra'),
	prime = require('prime'),
	options = require('prime-util/prime/options'),
	emitter = require('prime/emitter'),
	hbs = require('handlebars'),
	recess = require('recess'),
	greenOn = '\u001b[32m',
	greenOff = '\u001b[39m',
	path = require('path'),
	redOn = '\u001b[31m',
	redOff = greenOff;

marked.setOptions({
	gfm: true
});

var builder = prime({

	options: {
		title: 'Epitome - MVC/MVP framework for MooTools',
		output: 'build',
		target: 'index.html',
		source: 'README.md',
		twitter: 'D_mitar',
		pageTemplate: 'tpl/page.hbs',
		ok: '✔',
		analytics: '' // id here
	},

	constructor: function(markdown, options){
		this.basePath = __dirname.match('lib') ? path.join(__dirname, '../') : __dirname;
		this.setOptions(options);
		this.buildDocs(markdown);
	},

	getDocs: function(){
		return fs.readFileSync(this.options.source, 'utf-8');
	},

	buildDocs: function(markdown){
		var self = this,
			obj = this.options,
			body = fs.readFileSync(path.resolve(this.basePath, this.options.pageTemplate), 'utf-8');

		obj.body = marked(markdown || this.getDocs())

		body = hbs.compile(body);

		this.on('html', function(html){
			var file = self.options.output + '/' + self.options.target,
				css = self.options.output + '/css/';

			// prep dif structure
			fse.mkdirs(self.options.output);
			fse.mkdirs(self.options.output + '/js/');
			fse.mkdirs(css);

			// write file
			fs.writeFile(file, html);

			// copy the js files
			fse.copy(path.resolve(self.basePath, 'lib/js/'), self.options.output + '/js/', function(error){
				if (!error){
					console.log(greenOn + self.options.ok + greenOff + ' Docs generated ' + file);
				}
				else {
					console.log('Failed to copy supplementary js files');
				}
			});

			// build less files
			recess('./less/bootstrap.less', {
				compress: true
			}, function(error, obj){
				fs.writeFile(css + 'doctor.css', obj.output);
			});
		});

		this.fixHTML(body(obj));
	},

	extractHeadings: function($){
		var sections = $('#sections'),
			last,
			previousEl;

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
			html;

		$('#content').addClass('container');

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


builder.implement(new emitter);
builder.implement(new options);

module.exports = builder;