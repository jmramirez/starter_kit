const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
var exec = require('child_process').exec;



gulp.task('styles', () => {
    return gulp
        .src('assets/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed'}).on('error',sass.logError))
        .pipe(autoprefixer({ browsers: ['last 2 versions']}))
        .pipe(gulp.dest('./public/css'))
        .pipe(browserSync.stream());
});

gulp.task('webpack', cb => {
	exec('npm run dev:webpack', function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('browser-sync', function() {
	browserSync.init({
		server: './public',
		notify: false,
		open: true //change this to true if you want the broser to open automatically
    });
});

gulp.task('browser-sync-proxy', function() {
	// THIS IS FOR SITUATIONS WHEN YOU HAVE ANOTHER SERVER RUNNING
	browserSync.init({
		proxy: {
			target: 'http://localhost:3333/', // can be [virtual host, sub-directory, localhost with port]
			ws: true // enables websockets
		}
		// serveStatic: ['.', './public']
	});
});

gulp.task('watch-proxy', gulp.parallel(['webpack', 'styles', 'browser-sync-proxy']), () => {
	gulp.watch('./assets/scss/**/*', ['styles']);
	gulp.watch('./assets/js/**/*', ['webpack']);
	gulp
		.watch([
			'./public/**/*',
			'./public/*',
			'!public/js/**/.#*js',
			'!public/css/**/.#*css'
		])
		.on('change', browserSync.reload);
});


gulp.task('build', gulp.series(['styles']), cb => {
	exec('npm run build:webpack', function(err, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		cb(err);
	});
});

gulp.task('watch',function(){
	gulp.watch('./assets/scss/**/*',gulp.series('styles'));
	gulp.watch('./assets/js/**/*', gulp.series('webpack'));
	gulp
		.watch([
			'./public/**/*',
			'./public/*',
			'!public/js/**/.#*js',
			'!public/css/**/.#*css'
		],browserSync.reload);
});



gulp.task('default', gulp.parallel(['webpack', 'styles', 'browser-sync','watch']));


