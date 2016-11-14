( function() {

	'use strict';

	var gulp				= require( 'gulp' )
		, uglify			= require( 'gulp-uglify' )
		, concat			= require( 'gulp-concat' )
		, sass				= require( 'gulp-sass' )
		, gutil				= require( 'gulp-util' )
		, rename			= require( 'gulp-rename' )
		, sourcemap			= require( 'gulp-sourcemaps' )
		//, gulpPrint			= require( 'gulp-print' )

		//, gutil				= require( 'gulp-util' )
		, minifyCSS			= require( 'gulp-minify-css' )
		, gulpExpect		= require( 'gulp-expect-file')
		, babel				= require('gulp-babel')

		//, replace			= require( 'gulp-replace' )
		, debug				= require( 'gulp-debug' )
		, runSequence		= require('run-sequence');



	// Paths
	var config = {
		bower					: {
			srcFolder			: 'src/bower_components'
		}
		, js					: {
			srcFolder			: 'src/js'
			, destFolder		: 'dist/js'
		}
		, css					: {
			srcFolder			: 'src/scss'
			, destFolder		: 'dist/css'
		}
	};




	const jsFiles = [
		
		// Methods on Maps
		'node_modules/babel-polyfill/dist/polyfill.js'

		, 'src/bower_components/d3/d3.js'
		, 'src/bower_components/zepto/zepto.js'
		, 'src/bower_components/angular/angular.js'
		, 'src/bower_components/fxstr-angular-typeahead/fxstr-angular-typeahead/typeaheadDirective.js'
		, 'src/bower_components/angular-translate/angular-translate.js'

		// Plugins
		, 'js/plugins.js'
		, 'js/matrix/resistency-matrix.js'

		// App
		, 'js/angular/infekt/app.js'

		// Factories
		, 'js/angular/infekt/translationFactory.js'
		, 'js/angular/infekt/antibioticsFactory.js'
		, 'js/angular/infekt/bacteriaFactory.js'
		, 'js/angular/infekt/searchTableFactory.js'
		, 'js/angular/infekt/resistanceFactory.js'
		, 'js/angular/infekt/filterFactory.js'

		// Controllers
		, 'js/angular/infekt/infektController.js'

		// Directives
		, 'js/angular/infekt/resistanceMatrixComponent.js'
		, 'js/angular/infekt/legal-notice.js'

		// Filters
		, 'js/angular/infekt/joinFilter.js'

		// View stuff
		, 'js/main.js'
	];




	gulp.task('babel', () => {

		return gulp.src('**/*.es2015.js')
			.pipe(debug())
			.pipe(sourcemap.init())
				.pipe(babel({
					presets: ['es2015']
				}))
			.pipe(sourcemap.write())
			.pipe(rename((path) => {
				path.basename = path.basename.replace( /\.es2015/, '' );
			}))
			.pipe(gulp.dest(''));

	});




	gulp.task('mergeScripts', () => {

		return gulp.src(jsFiles)
			.pipe(debug())
			.pipe(gulpExpect(jsFiles))
			.pipe(sourcemap.init())
				.pipe(concat('scripts.js'))
				//.pipe(uglify())
			.pipe(sourcemap.write())
			//.pipe(gutil.beep())
			.pipe(gulp.dest('dist/js'));

	});

	gulp.task('scripts', runSequence('babel', 'mergeScripts'));



	gulp.task('watchScripts', ['scripts'], () => {
		gulp.watch('**/*.es2015.js', ['babel']);		
		gulp.watch('**/*[^es2015].js', ['mergeScripts']);
	});




	/**
	* Concat and minify styles
	*/
	gulp.task( 'minifyStyles', function() {

		return gulp.src( [ config.css.srcFolder + '/main.scss' ] )

			.pipe( concat ( 'main.min.css' ) )
			.pipe( sass().on('error', gutil.log) )
			.pipe( minifyCSS() )
			.pipe( gulp.dest( config.css.destFolder ) );

	} );





	gulp.task( 'watch', function() {

		gulp.watch( config.js.srcFolder + '/**/*.js', [ 'concatScripts' ] );
		gulp.watch( config.bower.srcFolder + '/**/*.js', [ 'concatScripts' ] );

		gulp.watch( config.css.srcFolder + '/**/*.scss', [ 'minifyStyles' ] );

	} );


	// ONLY concatenates styles
	gulp.task( 'devCSS', [ 'minifyStyles', 'watch' ] );






} )();
