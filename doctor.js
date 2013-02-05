#!/usr/bin/env node

var builder = require('./lib/builder'),
	request = require('request'),
	fs = require('fs');


(function(){
	var args = process.argv.splice(2);
	if (!args.length){
		console.log('Doctor needs to be passed some arguments.');
		console.log('\tLocal: ./doctor.js README.md');
		console.log('\tRemote: ./doctor.js https://raw.github.com/DimitarChristoff/doctor/master/README.md');
		return;
	}

	var getFile = function(uri, callback){
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
	};

	getFile(args[0], function(body){
		new builder(body, {
			title: 'hai'
		});
	});
}());