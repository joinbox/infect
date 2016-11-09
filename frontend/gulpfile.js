( function() {

	'use strict';

	var gulp				= require( 'gulp' )
		, uglify		= require( 'gulp-uglify' )
		, concat		= require( 'gulp-concat' )
		, sass			= require( 'gulp-sass' )
		, gutil			= require( 'gulp-util' )
		, rename			= require( 'gulp-rename' )
		, sourcemap			= require( 'gulp-sourcemaps' )
		, gulpPrint			= require( 'gulp-print' )

		, util				= require( 'gulp-util' )
		, minifyCSS			= require( 'gulp-minify-css' )
		, gulpExpect		= require( 'gulp-expect-file')

		, replace			= require( 'gulp-replace' )
		, debug				= require( 'gulp-debug' );



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




	var jsPaths = [

	];



	var cssPaths = [

		// All styles
		, {
			dest				: 'main'
			, src				: [
				config.css.srcFolder + '/main.scss'
			]
		}

	];




	// Dest files must be deleted before they're recreated. Fluffy doesn't recognize change and delivers old files
	// if we don't.
	gulp.task( 'cleanScripts', function( cb) {

		console.log( 'Delete all JS files in' + config.js.destFolder );
		del( [ config.js.destFolder + '/**.js' ], function( err, delFiles ) {

			if( delFiles ) {
				console.log( 'Deleted files ' + delFiles.join( ', 	') );
			}
			else {
				console.log( 'Didn\'t delete any files' );
			}
			if( err ) {
				console.error( 'Problem on deleting files: ' + err );
			}
			cb.call();

		} );

	} );



	/**
	* Concats scripts. Do stuff async, as later scripts may be based on previous ones
	*/
	gulp.task( 'concatScripts', [ 'cleanScripts' ], function() {

		var promises = [];

		// Prepare all calls, put them into promise
		for( var i = 0; i < jsPaths.length; i++ ) {

			( function() {

				var path = jsPaths[ i ];

				if( !path.dest || !path.src ) {
					return;
				}

				var promise = function() {

					var deferred = q.defer();

					console.log( 'Gulp JS ' + path.dest );
					gulp.src( path.src )
						.pipe( gulpExpect( path.src ) )
						.pipe( sourcemap.init( { debug: true } ) )
							.pipe( concat( path.dest + '.js' ) )
						.pipe( sourcemap.write( 'map' ) )
						.pipe( gulp.dest( config.js.destFolder ) )
						.on( 'end', function() {
							deferred.resolve();
							console.log( 'Done with ' + path.dest );
						} );

					return deferred.promise;

				};

				promises.push( promise );

			} )();

		}

		// Work one promise after another
		return promises.reduce( function( previous, item ) {
			return previous.then( function() {
				return item();
			} );
		}, q.when( true ) );

	} );







	/**
	* Minifies all concatenated scripts – only done on live task
	* Make sure we return a promise so that replaceSources is only executed afterwards.
	*/
	gulp.task( 'minifyScripts', function() {

		//return replaceSources( new Date().getTime() );

		var promises = [];

		var timeStamp = new Date().getTime();
		console.log( 'Create minified files for timestamp ' + timeStamp );

		for( var i = 0; i < jsPaths.length; i++ ) {

			( function() {

				var path = jsPaths[ i ];
				if( !path.dest ) {
					return;
				}


				// Path of concatenated files
				var concatPath = config.js.destFolder + '/' + path.dest + '.js';
				//console.log( 'Minify ' + concatPath );

				var deferred = q.defer();

				gulp.src( concatPath )
					.pipe( debug() )
					.pipe( sourcemap.init( { debug: true } ) )

						// Uglify. Use separate step as sourcemap won't return files that
						// might afterwards be parsed by uglify()
						.pipe( uglify( {
							compress: {
								// Don't drop console. Is needed for track.js and overwritten for the prod environment
								// in evironment.js.
							}
						} ) )
						.pipe( rename( path.dest + '.min.js' ) )

					.pipe( sourcemap.write( 'map' ) )
					.pipe( gulp.dest( config.js.destFolder ) )

					.pipe( gulpPrint( function( filepath) {
						return 'Min Done with ' + filepath;
					} ) )
					.on( 'end', function() {
						console.log( 'Done with ' + concatPath );
						deferred.resolve();
					} )
					.on( 'error', function( err ) {
						console.error( 'ERROR ', err );
						deferred.reject();
					} );

				promises.push( deferred.promise );

			} )();

		}

		console.error( 'Minifyscripts has ' + promises.length + ' tasks' );

		return q.all( promises );
			/*.then( function() {
				console.log( 'DONE with minifyScripts' );
				return replaceSources( timeStamp );
			} );*/

	} );





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


	// ONLY concatenates scripts – main method when developing JS, speeds shit up
	gulp.task( 'devJS', [ 'concatScripts', 'watch' ] );

	// ONLY concatenates styles
	gulp.task( 'devCSS', [ 'minifyStyles', 'watch' ] );



	// LIVE – Done by GitHub pre-commit hook
	gulp.task( 'live', [ 'minifyScripts' ] );




} )();
