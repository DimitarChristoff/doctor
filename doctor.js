#!/usr/bin/env node
var builder = require('./lib/builder'),
	request = require('request');

request('https://raw.github.com/DimitarChristoff/Epitome/master/README.md', function (error, response, body) {
	if (!error && response.statusCode == 200) {
		new builder(body);
	}
});