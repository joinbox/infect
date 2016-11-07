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
		, del				= require( 'del' )
		, util				= require( 'gulp-util' )
		, minifyCSS			= require( 'gulp-minify-css' )
		, gulpExpect		= require( 'gulp-expect-file')
		, q					= require( 'q' )
		, replace			= require( 'gulp-replace' )
		, debug				= require( 'gulp-debug' );



	// Paths
	var config = {
		bower					: {
			srcFolder			: 'www/src/bower_components'
		}
		, js					: {
			srcFolder			: 'www/src/js'
			, destFolder		: 'www/dist/js'
		}
		, css					: {
			srcFolder			: 'www/src/scss'
			, destFolder		: 'www/dist/css'
		}
	};




	var jsPaths = [

		// Base that's required on _every_ site
		// - console polyfill
		// - no console.log for live
		// - browser error message
		{
			dest		: 'base'
			, src		: [

				  // Browser support (display errors instantly)
				  config.js.srcFolder + '/vendor/browser.js'
				, config.js.srcFolder + '/plugins/browserTest.js'

				  // Console, environment …
				, config.bower.srcFolder + '/console-polyfill/index.js'
				, config.js.srcFolder + '/environment.js'

				// TBD: Only load if necessary
				, config.bower.srcFolder + '/picturefill/dist/picturefill.js'

				// Menu, which is displayed on almost all pages
				, config.js.srcFolder + '/plugins/menu.js'

				// Fabian's stuff
				, config.js.srcFolder + '/main.js'

			]
		}



		, {
			dest			: 'video'
			, src			: [
				// Video.js
				  config.bower.srcFolder + '/video.js/dist/video-js/video.dev.js'
				, config.js.srcFolder + '/vendor/dash.js/dist/dash.all.js'
				, config.js.srcFolder + '/vendor/videojs-tech-dashjs.js'
				, config.js.srcFolder + '/angular/directives/videoJsDirective.js'
			]
		}



		, {
			dest			: 'time'
			, src			: [
				  // Time and date
				  config.bower.srcFolder + '/moment/moment.js'
				, config.bower.srcFolder + '/moment/locale/de.js'
				, config.bower.srcFolder + '/moment/locale/fr.js'
				, config.bower.srcFolder + '/moment/locale/it.js'
				, config.js.srcFolder + '/angular/filters/momentFilter.js'
			]
		}



		// Minimal stuff that's needed to use the user and the language menu
		, {
			dest			: 'user-and-language'
			, src			: [
				  config.js.srcFolder + '/angular/user/user.js'
				, config.js.srcFolder + '/angular/base/common.js'
				, config.js.srcFolder + '/angular/user/userService.js'
				, config.js.srcFolder + '/angular/directives/userMenuDirective.js'
				, config.js.srcFolder + '/angular/base/languageService.js'
				, config.js.srcFolder + '/angular/directives/languageMenuDirective.js'
			]
		}



		// Used on detail pages and front page
		, {
			dest		: 'slideshow'
			, src		: [
				  config.bower.srcFolder + '/flickity/dist/flickity.pkgd.js'
				, config.js.srcFolder + '/plugins/init-slideshow.js'
			]
		}




		// Detail site
		, {
			dest		: 'detail'
			, src		: [

				  // Carts
				  config.js.srcFolder + '/angular/detail/detail.js'
				, config.js.srcFolder + '/angular/cart/cartStoreService.js'
				, config.js.srcFolder + '/angular/cart/cartController.js'
				, config.js.srcFolder + '/angular/cart/cartService.js'

				// Youtube movie (within slideshow)
				, config.js.srcFolder + '/angular/directives/youtube-player-directive.js'

			]
		}





		// Full fledged angular support, to be imported by other
		// paths
		, {
			dest		: 'angular'
			, src		: [

				  config.bower.srcFolder + '/jquery/jquery.js'
				, config.bower.srcFolder + '/angular/angular.js'
				, config.bower.srcFolder + '/angular-route/angular-route.js'

				, config.bower.srcFolder + '/angular-translate/angular-translate.js'

				, config.bower.srcFolder + '/jb-api-wrapper/src/apiWrapperService.js'

				// Language and user stuff (see above)
				, config.js.destFolder + '/user-and-language.js'

			]
		}



		, {
			dest			: 'profile'
			, src			: [

				config.js.destFolder + '/angular.js'

				, config.bower.srcFolder + '/eb-language-loader/src/languageLoaderService.js'

				, config.js.srcFolder + '/angular/directives/errorMessageDirective.js'
				, config.js.srcFolder + '/angular/directives/floatingLabelDirective.js'
				, config.js.srcFolder + '/angular/directives/dateSelectorDirective.js'
				, config.js.srcFolder + '/angular/directives/placeholderPolyfillDirective.js'

				, config.js.srcFolder + '/angular/profile/profileController.js'
				, config.js.srcFolder + '/angular/orderCreditCard/orderCreditCardController.js'

			]
		}




		// Super-slick site for specials (initial load)
		, {
			dest		: 'specials'
			, src		: [

				  // Load user menu with a delay
				  // Console and browser stuff is duplicated – should not matter
				  config.js.srcFolder + '/plugins/minimal-script-loader.js'
				, config.bower.srcFolder + '/squeezetext/src/squeezetext.js'

			]
		}



		// Events and cinema (front and detail)
		// They share most components – use one JS file to optimize caching.
		, {
			dest			: 'events-and-cinema'
			, src			: [

				  config.js.destFolder + '/angular.js' // Anulgar must be loaded _before_ eventListController etc.

				, config.bower.srcFolder + '/squeezetext/src/squeezetext.js'
				, config.bower.srcFolder + '/squeezetext/src/squeezetext-directive.js'

				, config.bower.srcFolder + '/eb-language-loader/src/languageLoaderService.js'

				, config.js.srcFolder + '/angular/directives/eventListLoaderDirective.js'
				, config.js.srcFolder + '/angular/directives/picturefill-directive.js'

				, config.js.srcFolder + '/angular/filters/momentFilter.js'
				, config.js.srcFolder + '/angular/filterForm/filterFormDatesService.js'
				, config.js.srcFolder + '/angular/filterForm/filterFormDataService.js'

				, config.js.destFolder + '/time.js'


				// Event specific
				, config.js.srcFolder + '/angular/eventList/eventListController.js'


				// Movie specific
				, config.js.destFolder + '/video.js'

				, config.js.srcFolder + '/angular/directives/geopositionButton.js'
				, config.bower.srcFolder + '/jb-relation-input/src/jb-relation-input.js'

				, config.js.srcFolder + '/angular/movieList/movieListController.js'
				, config.js.srcFolder + '/angular/movieList/movieListDirective.js'
				, config.js.srcFolder + '/angular/movieList/movieFlyoutDirective.js'

				, config.js.srcFolder + '/angular/moviePlaytimes/moviePlaytimesDirective.js'

				// Detail pages
				, config.js.destFolder + '/detail.js'

				// Movie Detail
				, config.js.srcFolder + '/angular/movieDetail/movieDetailController.js'
				, config.js.srcFolder + '/angular/directives/googleMapsDirective.js'

				// Cinema Detail
				, config.js.srcFolder + '/angular/cinemaDetail/cinemaDetailController.js'


			]
		}



		// Minimal sites (terms, specials etc.) that only have
		// - a user icon
		// - a language menu
		// They don't need no jquery
		, {
			dest		: 'minimal'
			, src		: [

				  config.bower.srcFolder + '/angular/angular.js'
				, config.bower.srcFolder + '/jb-api-wrapper/src/apiWrapperService.js'

				// user & language: see above
				, config.js.destFolder + '/user-and-language.js'

				, config.js.srcFolder + '/angular/base/defaultPage.js'
			]

		}




		// Movie detail sites  (in addition to events-and-cinema)
		// - cinema
		// - movie
		, {
			dest		: 'movie-detail'
			, src		: [
				// Cinema stuff
				config.bower.srcFolder + '/jb-relation-input/src/jb-relation-input.js'

				, config.js.srcFolder + '/angular/movieDetail/movieDetailController.js'
				, config.js.srcFolder + '/angular/cinemaDetail/cinemaDetailController.js'

				// EventList for cinema and movie detail
				, config.js.srcFolder + '/angular/directives/eventListLoaderDirective.js'

				// FormDates (front and all movie sites)
				, config.js.srcFolder + '/angular/filterForm/filterFormDatesService.js'
				, config.js.srcFolder + '/angular/filterForm/filterFormDataService.js'

				// GeoPosition (front and all movie sites)
				, config.js.srcFolder + '/angular/directives/geopositionButton.js'
				, config.js.srcFolder + '/angular/moviePlaytimes/moviePlaytimesDirective.js'

			]
		}



		// Movie front page (in addition to events-and-cinema)
		, {
			dest			: 'movie-front'
			, src			: [
				// FormDates (front and all movie sites)
				config.bower.srcFolder + '/jb-relation-input/src/jb-relation-input.js'
				, config.js.srcFolder + '/angular/filterForm/filterFormDatesService.js'
				, config.js.srcFolder + '/angular/filterForm/filterFormDataService.js'

				// GeoPosition (front and all movie sites)
				, config.js.srcFolder + '/angular/directives/geopositionButton.js'
				, config.js.srcFolder + '/angular/moviePlaytimes/moviePlaytimesDirective.js'
			]

		}





		// Checkout
		, {
			dest		: 'checkout'
			, src		: [

				config.js.destFolder + '/angular.js'


				// Language stuff
				, config.js.srcFolder + '/angular/base/languageParser.js'
				, config.bower.srcFolder + '/eb-language-loader/src/languageLoaderService.js'


				// Checkout
				, config.js.srcFolder + '/angular/checkout/checkout.js'
				, config.js.srcFolder + '/angular/checkout/checkoutController.js'
				, config.js.srcFolder + '/angular/checkout/checkoutService.js'
				, config.js.srcFolder + '/angular/checkout/checkoutRoutingIdTranslationService.js'

				// Cart
				, config.js.srcFolder + '/angular/checkout/checkoutCartService.js'
				, config.js.srcFolder + '/angular/checkout/checkoutCartController.js'
				, config.js.srcFolder + '/angular/cart/cartStoreService.js'

				// Conditions
				, config.js.srcFolder + '/angular/checkout/checkoutConditionsService.js'
				, config.js.srcFolder + '/angular/checkout/checkoutStepController.js'
				, config.js.srcFolder + '/angular/init/initController.js'

				// User
				, config.js.srcFolder + '/angular/user/userService.js'
				, config.js.srcFolder + '/angular/user/loginController.js'
				, config.js.srcFolder + '/angular/user/registerController.js'
				, config.js.srcFolder + '/angular/user/recoverPasswordController.js'
				, config.js.srcFolder + '/angular/user/passwordRecoveredController.js'

				// Single steps
				, config.js.srcFolder + '/angular/address/addressController.js'
				, config.js.srcFolder + '/angular/binOptional/binOptionalController.js'
				, config.js.srcFolder + '/angular/guests/guestsController.js'
				, config.js.srcFolder + '/angular/payment/paymentController.js'
				, config.js.srcFolder + '/angular/questions/questionsController.js'
				, config.js.srcFolder + '/angular/lottery/lotteryController.js'
				, config.js.srcFolder + '/angular/confirmOrder/confirmOrderController.js'
				, config.js.srcFolder + '/angular/externalFulfillment/externalFulfillmentController.js'
				, config.js.srcFolder + '/angular/checkout/checkoutAnalyticsService.js'

				// Error
				, config.js.srcFolder + '/angular/error/errorController.js'

				// General directives
				, config.js.srcFolder + '/angular/directives/errorMessageDirective.js'
				, config.js.srcFolder + '/angular/directives/floatingLabelDirective.js'
				, config.js.srcFolder + '/angular/directives/binDirective.js'
				, config.js.srcFolder + '/angular/directives/dateSelectorDirective.js'
				, config.js.srcFolder + '/angular/directives/autoRequireIndicatorDirective.js'
				, config.js.srcFolder + '/angular/directives/autoFocusDirective.js'
				, config.js.srcFolder + '/angular/directives/placeholderPolyfillDirective.js'

				// Request Cornèrcard stuff
				, config.bower.srcFolder + '/jquery-srcset/src/jquery.srcset.js'
				, config.js.srcFolder + '/angular/orderCreditCard/orderCreditCardController.js'

			]
		}



	];






	var cssPaths = [

		// IE9
		{
			dest				: 'ie9'
			, src				: [
				config.css.srcFolder + '/layout/ie9.less'
			]
		}

		// All styles
		, {
			dest				: 'main'
			, src				: [
				config.css.srcFolder + '/main.less'
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

				if( !path.dest || !path.src ) {
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

	} );




	/**
	*
	*/
	/*function replaceSources( timeStamp ) {

		console.error( timeStamp );

		return gulp.src( 'templates/*.html' )
			.pipe( debug() )
			.pipe( replace( /<!--\s*min-js\s*:\s*([^(\s|(-->))]*)\s*-->/g, function( result, name ) {
				return name.replace( /.js$/, '.min-' + timeStamp + '.js' );
			} ) )
			.pipe( gulp.dest( './test' ) );

	}*/



	/**
	* Replaces all JS files with the min version of them.
	*/
	/*gulp.task( 'replaceSources', [ 'minifyScripts' ], function() {

		return gulp.src( 'templates//.html' )
			.pipe( debug() )
			.pipe( htmlreplace( {
				'base'
			} ) );


	} );*/









	/**
	* Concat and minify styles
	*/
	gulp.task( 'minifyStyles', function() {

		return gulp.src( [ config.css.srcFolder + '/main.scss' ] )

			.pipe( concat ( 'main.min.css' ) )
			.pipe( sass().on('error', gutil.log) )
			//.pipe( minifyCSS() )
			.pipe( gulp.dest( config.css.destFolder ) );

	} );














	gulp.task( 'watch', function() {

		gulp.watch( config.js.srcFolder + '/**/*.js', [ 'concatScripts' ] );
		gulp.watch( config.bower.srcFolder + '/**/*.js', [ 'concatScripts' ] );

		gulp.watch( config.css.srcFolder + '/**/*.scss', [ 'minifyStyles' ] );

	} );


	// ONLY concatenates scripts – main method when developing JS, speeds shit up
	gulp.task( 'devJS', [ 'concatScripts', 'watch' ] );

	// ONLY concatenates styles
	gulp.task( 'devCSS', [ 'minifyStyles', 'watch' ] );



	// LIVE – Done by GitHub pre-commit hook
	gulp.task( 'live', [ 'minifyScripts' ] );




} )();
