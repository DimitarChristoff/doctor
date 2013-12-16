#!/usr/bin/env node
'use strict';

var doctor = require('../');

process.chdir('../');

doctor.process({
	source: 'README.md',
	output: 'build/',
	title: 'Doctor, MD to HTML documentation generator for nodejs',
	twitter: 'D_mitar',
	pageTemplate: 'tpl/page.hbs', // handlebars,
	analytics: 'UA-1199722-4', // id here
	github: 'https://github.com/DimitarChristoff/doctor',
	disqus: 'doctor-md',
	// travis: '',
	logo: 'images/logo.png',
	less: 'less/bootstrap.less'
});
