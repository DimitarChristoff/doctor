#!/usr/bin/env node
'use strict';

var pathPrefix = __dirname.substr(-3, 3) == 'bin' ? '../' : './',
	builder = require(pathPrefix + 'lib/builder'),
	request = require('request'),
	prime = require('prime'),
	clint  = require('clint')(),
	json   = require(pathPrefix + 'package'),
	fs = require('fs');


var doctor = new (prime({
	process: function(options){
		this.getData(options.source, function(body){
			new builder(body, options);
		})
	},
	getData: function(uri, callback){
		if (uri.match('http')){
			request(uri, function(error, response, body){
				if (!error && response.statusCode == 200){
					callback(body);
				}
			});
		}
		else {
			callback(fs.readFileSync(uri, 'utf-8'));
		}
	}
}))();

module.exports = doctor;

clint.command('--help', '-h', 'Help using doctor');
clint.command('--input', '-i', 'Input file or URI ' + '-i path/to/file.md'.green + ' or ' + '-i http://domain.com/file.md'.green);
clint.command('--output', '-o', 'Output folder ' + '-o ./build'.green + ', defaults to ./build');
clint.command('--title', '-t', 'Set page title ' + '-t "My title here"'.green + ', defaults to "Built by doctors"');
clint.command('--twitter', '-@', 'Add twitter follow button ' + '-@ D_mitar'.green);
clint.command('--github', '-g', 'Add github repo link, issues and fork ribbon ' + '-g https://github.com/mootools/prime/'.green);
clint.command('--ci', '-c', 'Add TravisCI build status badge ' + '-c http://travis-ci.org/DimitarChristoff/Epitome'.green);


var help = function(err){
	// header
	console.warn(" , , , __ __. _ . . _ ".white);
	console.warn(" / / " + json.name.green + ' ' + json.version.white + "\n");

	console.log(clint.help(2, " : ".grey));
	process.exit(err)
};



var args = process.argv.splice(2);
if (!args.length){
	help(0);
	console.log('Usage:\n\n doctor file.md build "my title"');
	console.log(' doctor https://raw.github.com/jshint/jshint/master/README.md build "JSHINT documentation"');
	console.log('\nFor more and how to use under nodejs, see the docs https://github.com/DimitarChristoff/doctor');
}
else {
	var options = {};

	clint.on('command', function(name, value){
		switch (name){
			case "--help": help(0); break;
			case "--version": console.log(json.version); process.exit(0); break;
			case "--input":
				if (value)
					options.source = value;
				break;
			case "--output":
				if (value)
					options.output = value;
				break;
			case '--title':
				if (value)
					options.title = value;
				break;
			case '--twitter':
				if (value)
					options.twitter = value;
				break;
			case '--github':
				if (value)
					options.github = value;
				break;
			case "--ci" :
				if (value)
					options.travis = value;
				break;
		}
	});


	clint.on('complete', function(){

		if (!options.source){
			console.log()
			console.warn('ERROR:'.red + ' Missing input file or url, see help below on ' + '-i'.green);
			help(2);
		}
		else {
			doctor.process(options);
		}
	});

	clint.parse(args);
}