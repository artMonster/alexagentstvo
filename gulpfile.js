var syntax        		= 'sass', // Syntax: sass or scss;
	gulpversion   		= '4'; // Gulp version: 3 or 4

	var gulp          	= require('gulp'),
		gutil         	= require('gulp-util' ),
		sass          	= require('gulp-sass'),
		webp 			= require('gulp-webp'),
		browserSync   	= require('browser-sync'),
		concat        	= require('gulp-concat'),
		uglify        	= require('gulp-uglify'),
		cleancss      	= require('gulp-clean-css'),
		rename        	= require('gulp-rename'),
		del            	= require('del'),
		cache          	= require('gulp-cache'),
		autoprefixer  		= require('gulp-autoprefixer'),
		notify        		= require('gulp-notify'),
		imagemin      		= require('imagemin'),
		imageminWebptran    = require('imagemin-webp'),
		responsive 			= require('gulp-responsive'),
		imageminJpegtran 	= require('imagemin-jpegtran'),
		imageminJpegoptim 	= require('imagemin-jpegoptim'),
		imageminPngquant 	= require('imagemin-pngquant'),
		fileinclude    		= require('gulp-file-include'),
		gulpRemoveHtml 		= require('gulp-remove-html'),
		bourbon       		= require('node-bourbon'),
		ftp           		= require('vinyl-ftp'),
		gulpIf 				= require('gulp-if'),
		rsync         		= require('gulp-rsync');

gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: 'app'
		},
		notify: true,
		//open: false,
		// online: false, // Work Offline Without Internet Connection
		// tunnel: true, tunnel: "projectname", // Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('headersass', function() {
	return gulp.src('app/header.sass')
		.pipe(sass({
			includePaths: bourbon.includePaths
		}).on("error", notify.onError()))
		.pipe(rename({suffix: '.min', prefix : ''}))
		.pipe(autoprefixer(['last 15 versions']))
		.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
		.pipe(gulp.dest('app/'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('styles', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'expanded' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('scripts', function() {
	return gulp.src([
		'app/libs/modernizr-custom.js',
		'app/libs/jquery/dist/jquery.min.js',
		'node_modules/bootstrap/dist/js/bootstrap.min.js',
		'app/libs/magnific-popup/jquery.magnific-popup.min.js',
		'app/libs/intlTelInput/intlTelInput-jquery.min.js',
		'app/js/common.js',
		'app/libs/lazysizes.min.js',
		])
	.pipe(concat('scripts.min.js'))
	.pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({ stream: true }))
});

gulp.task('code', function() {
	return gulp.src('app/*.*')
	.pipe(browserSync.reload({ stream: true }))
});


gulp.task('webpImages', function () {
	(async () => {
		const imageminWebp = await imagemin(['app/img/src/*.{jpg,png}'], 'app/img', {use: [imageminWebptran({quality: 95})]}).then(() => {
			console.log('webp -- [ ok ]');
		});
 
		const imageminJpg = await imagemin(['app/img/src/*.jpg'], 'app/img', {use: [imageminJpegtran()]}).then(() => {
    		console.log('jpg -- [ ok ]');
		});
		

		const imageminPng = await imagemin(['app/img/src/*.png'], 'app/img', {use: [imageminPngquant()]}).then(() => {
			console.log('png -- [ ok ]');
		});

	})();
});

gulp.task('watch', function() {
	//gulp.watch('app/header.sass', gulp.parallel('headersass'));
	gulp.watch('app/'+syntax+'/**/*.'+syntax+'', gulp.parallel('styles'));
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], gulp.parallel('scripts'));
	gulp.watch('app/*.*', gulp.parallel('code'));
	//gulp.watch('app/*.*', gulp.parallel('buildhtmlwatch'));
	gulp.watch('app/img/src/**/*', gulp.parallel('webpImages'));
});



gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', gulp.parallel('webpImages', 'styles', 'scripts', 'browser-sync', 'watch'));

