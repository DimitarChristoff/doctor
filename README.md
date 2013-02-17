Doctor, MD to HTML documentation generator for nodejs
=====================================================

Doctor is MD (er. markdown) to HTML doc generator for node. The viewer is powered by Bootstrap and MooTools. Generation
 happens entirely client-side and can work offline or through remote URLs of markdown documents.

## Using as a CLI tool

You can just clone the repo and run it.

```sh
$ git clone https://github.com/DimitarChristoff/doctor
$ npm install .
$ ./doctor.js -i README.md # agaist a local file
$ ./doctor.js -i https://raw.github.com/DimitarChristoff/Epitome/master/README.md -o ../www/webclient/src/docs/ # run against a remote file
$ ./doctor.js -i docs.md -o ../built/ -t "My documentation" --logo http://domain.io/img/logo.png # custom title and build loc
```

## Using under nodejs

You can also use it as an npm module from within nodejs scripts.

```javascript
var doc = require('doctor-md');
doc.process({
    source: 'readme.md',
    output: '../docs/',
    title: 'My title',
    twitter: 'D_mitar',
    pageTemplate: 'tpl/mydocs.hbs', // handlebars,
    less: '../bootstrap/less/bootstrap.less' // custom less file
});
```
Just add it to your package.json, `npm install` or `npm link` and start requiring it. See `lib/builder.js` to get an idea
of the methods you can call and use.

### Events under nodejs

The `builder` supports the following events

 - `html` - fired when HTML processing is done. `this.html` points to processed markup.
 - `pre` - fired before writing of files takes place, allowing to script any last minute changes
 - `docs` - fired when the HTML file is written to the file system
 - `css` - fired when the compiled (via recess) CSS is written to the file system
 - `js` - fired when the extra js files are copied to the build folder
 - `error` - fired when any file operation or compilation fails.

The `builder` instance is available on the `doctor` instance as `this.builder`.

Here is an example use under nodejs:
```javascript
var doc = require('doctor-md');

doc.builder.on('error', function(msg){
    console.log('error', msg);
});

doc.builder.on('html', function(){
    console.log('html ready!');
});

doc.builder.on('pre', function(){
    console.log(this.html); // can mod this.html before it's written
});

doc.process({
    source: 'readme.md'
});
```

## Using globally

```sh
$ npm install -g doctor-md
$ doctor
  .         .
,-| ,-. ,-. |- ,-. ,-.
| | | | |   |  | | |
`-^ `-' `-' `' `-' ' 0.1.3

  --help, -h      : Help using doctor
  --input, -i     : Input file or URI -i path/to/file.md or -i http://domain.com/file.md
  --output, -o    : Output folder -o ./build, defaults to ./build
  --title, -t     : Set page title -t "My title here", defaults to "Built by doctors"
  --twitter, -@   : Add twitter follow button -@ D_mitar
  --github, -g    : Add github repo link, issues and fork ribbon -g https://github.com/mootools/prime/
  --analytics, -a : Add google analytics tracking id -a UA-1199722-4
  --disqus, -d    : Add disqus comments, pass disqus forum name -d doctor-md
  --ci, -c        : Add TravisCI build status badge -c http://travis-ci.org/DimitarChristoff/Epitome
  --template      : Use a custom handlebars template file --template ./tpl/docs.hbs
  --js            : Use a custom js/ folder to deploy to dist/js --js ./lib/js
  --less, -l      : Use a custom less/bootstrap.less dir to compile css --l ./less/custom.less
  --logo          : Use a custom logo in header --logo http://domain.io/img/logo.png

$ doctor -i README.md -@ D_mitar -g https://github.com/DimitarChristoff/Epitome -t 'Epitome MVC Framework' -c http://travis-ci.org/DimitarChristoff/Epitome --logo https://github.com/DimitarChristoff/Epitome/raw/master/example/epitome-logo.png -a UA-1199722-4
```

## Customisation

You can change the page.hbs handlebars template and edit the .less files, which are compiled in the build. If you edit
`builder.js` and add properties to the template engine - it will accept `github` and `travis` already.

## Deployment

You can use in projects to create `gh-pages` on the fly. If your git implementation supports `git subtreee`, you can:

```sh
$ git subtree push --prefix build origin gh-pages
```

The above will take the contents of the `build` folder or wherever your output is and push it into the `gh-pages` branch.

{{>todo.md}}
