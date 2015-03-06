'use strict';

var dom = require('cheerio'),
	marked = require('marked'),
	fs = require('fs'),
	fse = require('fs-extra'),
	primish = require('primish'),
	options = require('primish/options'),
	emitter = require('primish/emitter'),
	hbs = require('handlebars'),
	_ = require('lodash'),
	path = require('path'),
	less = require('less');

// cli colours
require('colors');

marked.setOptions({
	gfm: true,
	tables: true
});

var builder = primish({

	implement: [options, emitter],

	options: {
		title: 'Built by doctors',
		output: 'build',
		target: 'index.html',
		source: 'README.md',
		// twitter: 'D_mitar',
		// github: ''
		// analytics: '', // id here
		// disqus: '',
		// travis: 'UA-1199722-4',
		logo: 'images/logo.png',
		pageTemplate: 'tpl/page.hbs',
		js: 'lib/js',
		images: 'lib/images',
		less: 'less/bootstrap.less',
		ok: '✔'.green
	},

	constructor: function(options){
		this.basePath = __dirname.match('lib') ? path.join(__dirname, '../') : __dirname;
		this.setOptions(options);
	},

	compileLess: (function(){
		var lessOptions = {
			parse: ['paths', 'optimization', 'filename', 'strictImports', 'syncImport', 'dumpLineNumbers', 'relativeUrls', 'rootpath'],
			render: ['compress', 'cleancss', 'ieCompat', 'strictMath', 'strictUnits',
				'sourceMap', 'sourceMapFilename', 'sourceMapURL', 'sourceMapBasepath', 'sourceMapRootpath', 'outputSourceFiles']
		};

		var minify = function(tree, options){
			var result = {
				min: tree.toCSS(options)
			};
			if (!_.isEmpty(options)){
				result.max = tree.toCSS();
			}
			return result;
		};

		return function(srcFile, options, callback){
			options = _.assign({filename: srcFile}, options);
			options.paths = options.paths || [path.dirname(srcFile)];

			var css;
			var srcCode = fs.readFileSync(srcFile, 'utf-8');

			var parser = new less.Parser(_.pick(options, lessOptions.parse));

			parser.parse(srcCode, function(parse_err, tree){
				if (parse_err){
					callback('', parse_err);
					return;
				}

				var minifyOptions = _.pick(options, lessOptions.render);

				css = minify(tree, minifyOptions);
				callback(css, false);
			});
		};

	}()),

	getDocs: function(){
		return fs.readFileSync(this.options.source, 'utf-8');
	},

	buildDocs: function(markdown){
		var self = this,
			obj = this.options,
			body,
			error = false;

		if (!fs.existsSync(self.pageTemplate)){
			console.log('ERROR:'.red + ' failed to find template source ' + self.pageTemplate);
			error = true;
		}

		if (!fs.existsSync(self.less)){
			console.log('ERROR:'.red + ' failed to find less source ' + self.less);
			error = true;
		}

		if (!fs.existsSync(self.js)){
			console.log('ERROR:'.red + ' failed to find js folder ' + self.js);
			error = true;
		}

		if (!fs.existsSync(self.images)){
			console.log('ERROR:'.red + ' failed to find images folder ' + self.js);
			error = true;
		}

		if (error){
			console.log('Exiting early...' + ':('.red + '\n');

			process.exit(2);
		}

		body = fs.readFileSync(this.pageTemplate, 'utf-8');

		obj.body = marked(markdown || this.getDocs());

		body = hbs.compile(body);

		this.on('html', function(){
			this.trigger('pre'); // can adjust this.html via scripting, sync
			var html = self.html,
				file = path.resolve(self.options.output, self.options.target),
				css = path.resolve(self.options.output, 'css');

			// prep dif structure
			fse.mkdirs(self.options.output);
			fse.mkdirs(path.resolve(self.options.output, 'js'));
			fse.mkdirs(path.resolve(self.options.output, 'images'));
			fse.mkdirs(css);

			self.tasks = 3;

			// write file
			fs.writeFile(file, html, function(error){
				if (error){
					self.trigger('error', error);
				}
				else {
					self.trigger('docs', file);
					self.tasks--;
					self.trigger('taskdone');
					console.log(self.options.ok + ' HTML Docs generated ' + file.green);
				}
			});

			// copy the js files
			fse.copy(self.js, path.resolve(self.options.output, 'js'), function(error){
				if (!error){
					console.log(self.options.ok + ' Copied supplementary js');
					self.trigger('js');
					self.tasks--;
					self.trigger('taskdone');
				}
				else {
					console.log('Failed to copy supplementary js files');
					self.trigger('error', error);
				}
			});

			// copy the images files
			fse.copy(self.images, path.resolve(self.options.output, 'images'), function(error){
				if (!error){
					console.log(self.options.ok + ' Copied supplementary images');
					self.trigger('images');
					self.tasks--;
					self.trigger('taskdone');
				}
				else {
					console.log('Failed to copy supplementary images files');
					self.trigger('error', error);
				}
			});

			self.on('taskdone', function(){
				if (self.tasks > 0){
					return;
				}

				// build less files last when all is said and done.
				self.compileLess(self.less, {
					compress: true
				}, function(cssDone, error){
					var t = path.resolve(css, 'doctor.css');

					if (error){
						console.log('\nLESSC Error:'.red + ' failed to compile ' + self.options.less.red);
						console.log(error);
						self.trigger('error', error);
					}
					else {
						console.log('\nLESSC Success:'.green + ' compiled ' + self.options.less.green + ' to ' + t.green);
						console.log(t);
						fs.writeFile(t, cssDone.min, function(error){
							if (error){
								self.trigger('error', error);
							}
							else {
								self.trigger('css', file);
								console.log(self.options.ok + ' CSS exported and file saved ' + t.green);
							}
						});
					}
				});
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

		var lastH2;

		$('h2,h3').each(function(){
			var tag = this.name.replace(/^\D/, ''),
				text = $(this).text(),
				id = fixHeading(text),
				anchor,
				target;

			if (tag === '3'){
				// it needs namespacing. get previous h2 - need semantic headings with cascading.
				var previous = lastH2;
				if (previous && previous.length){
					id = previous.attr('id') + '/' + id;
				}
			}
			anchor = '#' + id;
			// console.log(text, tag, id);

			// for headings. h2
			if (tag === '2'){
				lastH2 = $(this);

				previousEl = $('<li />').addClass('l2').html('<a href="' + anchor + '">' + text + '</a>');
				$(sections).append(previousEl);
				// console.log(text, ' as h2 to sections ');
			}
			else {
				// it's a h3.
				if (last === tag){
					// should have a ul already
					target = $(sections).find('ul').last();
				}
				else {
					target = $('<ul></ul>');
					(previousEl && previousEl.length ? previousEl : sections).append(target);
				}

				target.append($('<li />').addClass('l3').html('<a href="' + anchor + '">' + text + '</a>'));
			}

			last = tag;

			$(this).attr('id', id);
		});
	},

	fixHTML: function(body){
		var $ = dom.load(body);

		$('#content').addClass('container');

		// prettify
		$('pre').each(function(i, el){
			var demo = $(el).find('.lang-demo').length,
				sh = $(el).find('.lang-sh').length;

			if (!demo && !sh){
				$(el).addClass('prettyprint linenums');
			}
		});

		$('table').each(function(i, el){
			$(el).addClass('table table-striped').find('td').each(function(){
				var html = $(this).html().trim();
				html || $(this).html('&nbsp;');
			});
		});

		this.extractHeadings($);

		this.html = $.html();
		this.trigger('html');
	}

});


module.exports = builder;
