var inputData = require('./input/input.data'),
    parser = require('./js/parser.js'),
    fs = require('fs'),
	gulp = require('gulp'),
	root = './';

gulp.task('default', [], function(cb) {
    fs.mkdir('json/', function() {
		var distPath = root + 'data/';

		// Запись JSON и JSONP файлов по родословным
		inputData.map(function(it, i) {
			// console.log(inputData);
			fs.writeFileSync(distPath + i + '.json', JSON.stringify(parser(it.str), null, 2));
			fs.writeFileSync(distPath + i + '.jsonp', 'rodos.jsonpCallback(' + JSON.stringify(parser(it.str), null, 2) +')');
		});
		fs.readdir(distPath, function(err, files) {
		  var out = [];
		  files.forEach(function(file) {
			if (file.indexOf('.jsonp') !== -1) {
				out.push(file);
			}
			// console.log(file);
		  });
		  fs.writeFileSync(root + 'json/config.jsonp', 'rodos.jsonpCallback(' + JSON.stringify(out, null, 2) +')');
		});
		cb();
    });
});
