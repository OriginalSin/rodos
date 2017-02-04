var inputData = require('./input/input.data'),
    parser = require('./js/parser.js'),
    fs = require('fs'),
	gulp = require('gulp'),
	root = './';

gulp.task('default', [], function(cb) {
    fs.mkdir('json/', function() {
		var distPath = root + 'data/';

		inputData.map(function(it, i) {
			// console.log(inputData);
			fs.writeFileSync(distPath + i + '.json', JSON.stringify(parser(it.str), null, 2));
		});
		cb();
    });
});
