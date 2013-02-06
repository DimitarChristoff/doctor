#!/usr/bin/env node

var builder = require('./lib/builder'),
	request = require('request'),
	prime = require('prime'),
	fs = require('fs');

var doctor = new (prime({
	process: function(uri, output, title, twitter){
		args = {
			title: title || '',
			twitter: twitter || ''
		};

		output && (args.output = output);

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
	return 'See documentation'
}
else {
	doctor.process.apply(doctor, args);
}
