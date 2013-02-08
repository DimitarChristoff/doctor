doctor
======

Doctor is MD (er. markdown) to HTML doc generator for node. The viewer is powered by Bootstrap and MooTools. 

This is still very much WIP, but it's quite usable.

## Using as a CLI tool

You can just clone the repo and run it.

```sh
npm link
# run against a local file
./doctor.js -i README.md
# run against a remote file
./doctor.js -i https://raw.github.com/DimitarChristoff/Epitome/master/README.md -o ../www/webclient/src/docs/
# custom title and build loc
./doctor.js -i docs.md -o ../built/ -t "My documentation"
```

## Using under nodejs

You can also use it as an npm module from within nodejs scripts.

```javascript
var doctor = require('doctor-md');
doc.process({
    source: 'readme.md',
    output: '../docs/',
    title: 'My title',
    twitter: 'D_mitar'
});
```
Just add it to your package.json

## Using globally

```sh
# npm install -g doctor-md
# doctor

 , , , __ __. _ . . _
 / / doctor-md 0.0.4

  --help, -h    : Help using doctor
  --input, -i   : Input file or URI -i path/to/file.md or -i http://domain.com/file.md
  --output, -o  : Output folder -o ./build, defaults to ./build
  --title, -t   : Set page title -t "My title here", defaults to "Built by doctors"
  --twitter, -@ : Add twitter follow button -@ D_mitar
  --github, -g  : Add github repo link, issues and fork ribbon -g https://github.com/mootools/prime/
  --ci, -c      : Add TravisCI build status badge -c http://travis-ci.org/DimitarChristoff/Epitome

doctor -i README.md -@ D_mitar -g https://github.com/DimitarChristoff/Epitome -t 'Epitome MVC Framework' -c http://travis-ci.org/DimitarChristoff/Epitome
```

## Customisation

You can change the page.hbs handlebars template and edit the .less files, which are compiled in the build. If you edit
`builder.js` and add properties to the template engine - it will accept `github` and `travis` already.

## Todo

- add support for `.mdrc` to pass on full options to builder / template, inc twitter, github, travis etc.


