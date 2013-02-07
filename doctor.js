#!/usr/bin/env node
'use strict';

var pathPrefix = __dirname.substr(-3, 3) == 'bin' ? '../' : './',
	builder = require(pathPrefix + 'lib/builder'),
	request = require('request'),
	prime = require('prime'),
	fs = require('fs');

var doctor = new (prime({
	process: function(uri, output, title, twitter){
		args = {};
		output && (args.output = output);
		title && (args.title = title);
		twitter && (args.twitter = twitter);

		this.getData(uri, function(body){
			new builder(body, args);
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

var args = process.argv.splice(2);
if (!args.length){
	console.log('Usage:\n\n doctor file.md build "my title"');
	console.log(' doctor https://raw.github.com/jshint/jshint/master/README.md build "JSHINT documentation"');
	console.log('\nFor more and how to use under nodejs, see the docs https://github.com/DimitarChristoff/doctor');
}
else {
	doctor.process.apply(doctor, args);
}