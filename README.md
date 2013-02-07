doctor
======

Doctor is MD (er. markdown) to HTML doc generator for node. The viewer is powered by Bootstrap and MooTools. 

This is still very much WIP, but it's quite usable.

## Using as a CLI tool

You can just clone the repo and run it.

```sh
npm link
# run against a local file
./doctor.js README.md
# run against a remote file
./doctor.js https://raw.github.com/DimitarChristoff/Epitome/master/README.md
# custom title and build loc
./doctor.js docs.md ../built/ "My documentation"
```

## Using under nodejs

You can also use it as an npm module from within nodejs scripts.

```javascript
var doctor require('doctor-md');
doc.process('readme.md', '../docs/', 'My title', 'D_mitar');
```
Just add it to your package.json

## Using globally

```sh
# npm install -g doctor-md
# doctor README.md
```

## Customisation

You can change the page.hbs handlebars template and edit the .less files, which are compiled in the build. If you edit
`builder.js` and add properties to the template engine - it will accept `github` and `travis` already.

## Todo

- add support for `.mdrc` to pass on full options to builder / template, inc twitter, github, travis etc.


