angular.module( "fxstr.directives.typeahead", [] )





.service( 'typeaheadFilter', function() {

	this.filter = function( data, searchTermFunction, searchString ) {
		
		//console.log( "typeahead-filter %o", data );
		var rgx = new RegExp( "([^a-z0-9]|\\b)" + searchString, "i" );

		var ret = [];
		for( var i = 0; i < data.length; i++ ) {
			var term = searchTermFunction()( data[ i ] );
			if( rgx.test( term ) ) {
				ret.push( data[ i ] );
			}
		}

		return ret;

	}

} )



.directive( "typeaheadDirective", function( $compile, $parse, typeaheadFilter, $document ) {

	function link( originalScope, element, attributes, modelCtrl ) {

		// Get max number of results to display
		var maxResultCount = originalScope.$eval( attributes.typeaheadMaxResults ) || 0;

		// Create new scope (clone from original) to not mess original scope up
		var scope = originalScope.$new();
		originalScope.$on('$destroy', function(){
			scope.$destroy();
		} );
		var scope = originalScope;

		// Function needed on esc, after enter and to initialize
		scope.elementFocussed = false;

		function resetMatches() {
			scope.tooManyResults = false;
			scope.noResults = true;
			scope.activeIndex = 0;
			scope.matches = [];
		}


		// Empties input (needed after esc/enter/click). 
		// As it calls $parsers on modelCtrl, resetMatches is called as well
		function emptyInput() {
			element.val( "" );
			element.trigger( "input" );
			//modelCtrl.$setViewValue( "" );
			//scope.$digest();
		}



		// Add variables to scope
		resetMatches();



		//Plug filter into $parsers pipeline (intercepts inputs from view)
		modelCtrl.$parsers.unshift( function( inputValue ) {
	
			compileMatches( inputValue );
			return inputValue;

		} );



		// Update scope (matches, tooManyResults, noResults) to fit user's input (searchTerm)
		function compileMatches( searchTerm ) {

			// Reset all variables
			resetMatches();

			// Result (matches)
			var res;

			// Empty search term and special function for empty search term is defined
			if( !searchTerm && scope.emptyDataSource ) {
				res = scope.emptyDataSource()();
			}

			// Search term provided or empty search term function not given
			else {
				 res = typeaheadFilter.filter( scope.dataSource, scope.searchTermFunction, searchTerm );
			}

			//console.log( "results: %o", res );

			// Check if matching results are longer than maxResultCount
			if( maxResultCount && res.length > maxResultCount ) {
				scope.tooManyResults = res.length - maxResultCount;
				res = res.splice( 0, maxResultCount );
			}
			else {
				scope.tooManyResults = false;
			}

			// Check, if no results were found
			scope.noResults = ( res.length == 0 );

			// Update matches on scope
			scope.matches = res;

		}

		// Compile matches for default value
		compileMatches( modelCtrl.$modelValue || "" );




		element
			.on( "focus", function() {
				scope.$apply( function() {
					scope.elementFocussed = true;
					//console.log( "focus" );
					//console.log( "matches on focus: %o", scope.matches );
				} );
			} )
			.on( "blur", function() {
				scope.$apply( function() {
					scope.elementFocussed = false;
				} );
			} );



		// Watch element for arrow, esc and enter
		// Propagate them to the resultList afterwards
		element.on( 'keydown', function( ev ) {
			
			switch (ev.keyCode ) {


				//DN
				case 40: 
					ev.preventDefault();
					if( scope.activeIndex < scope.matches.length - 1 ) {
						scope.$apply( function() {
							scope.activeIndex++
						} );
					}
					//console.log( " + " + scope.activeIndex );
					break;


				// UP
				case 38: 
					ev.preventDefault();
					if( scope.activeIndex > 0 ) {
						scope.$apply( function() {
							scope.activeIndex--;
						} );
					}
					//console.log( " - " + scope.activeIndex );
					break;


				// ESC
				case 27:
					ev.preventDefault();

					// Just hide input
					scope.elementFocussed = false;
					scope.$digest();
					break;


				// ENTER
				case 13:
					ev.preventDefault();
					var match = scope.matches[ scope.activeIndex ];
					scope.elementSelectedHandler( match );
					break;

			}

		} );




		scope.elementSelectedHandler = function( item ) {

			scope.selectHandler()( item );
			emptyInput();

		}





		// Generate resultList
		var resultListElement = angular.element( "<div ng-show='elementFocussed' class='typeahead-result-list'></div>" ); 
		resultListElement.attr( {
			matches 				: 'matches'
			, "too-many-results" 	: 'tooManyResults'
			, "active-index" 		: 'activeIndex'
			, "no-results" 			: "noResults"
			, "max-result-count"	: maxResultCount
			, "select-handler" 		: "elementSelectedHandler"
		} );


		if( attributes.typeaheadTemplateUrl ) {
			resultListElement.attr( 'template-url', attributes.typeaheadTemplateUrl );
		}


		// Insert resultList after typeahead-insert-after or input
		var compiled = $compile( resultListElement )( scope );
		if( scope.insertAfter ) {
			$document.find( scope.insertAfter ).after( compiled );
		}
		else {
			element.after( compiled );
		}

	



	}



	return {
		require 		: 'ngModel'
		, restrict 		: "C"
		, link 			: link
		, scope 		: {

			// List containing all data
			dataSource				: "=typeaheadDataSource"

			// Function that returns the data to be displayed when no search term is entered
			, emptyDataSource 		: "&typeaheadEmptyDataSource"

			// Function that returns the term a given data item is searched for («data item» is a dataSource[ i ])
			, searchTermFunction	: "&typeaheadSearchTermFunction"

			// Function to be called on select
			, selectHandler 		: "&typeaheadSelectHandler" 

			, insertAfter 			: "@typeaheadInsertAfter"

		}
	}


} )









.directive( "typeaheadResultList", [ "$http", "$templateCache", "$compile", function( $http, $templateCache, $compile ) {

	function link( scope, element, attributes ) {


		// Returns true, if idx is the currently active index (selected by mouse/arrow keys)
		scope.isActive = function( idx ) {
			return scope.activeIndex == idx;
		}


		// Templating stuff
		var templateUrl = attributes.templateUrl || "templates/resultListTemplate.html";

		$http.get( templateUrl, { cache: $templateCache } ).success( function (templateContent ) {
			element.empty().append( $compile( templateContent )( scope ) );
		} );



		element.bind( 'mousedown', function( ev ) {

			ev.preventDefault();

			//console.log( "click %o", ev.target );


			// Didn't click a li
			if( !angular.element( ev.target ).is( "li" ) ) {
				console.log( "Clicked outside of a li, don't call selectHandler" );
				return;
			}


			var liNr 		= angular.element( ev.target ).index()
				, match 	= scope.matches[ liNr ];

			// No result or moreResults
			if( liNr > scope.maxResultCount - 1 ) {
				console.log( "Clicked «more results», don't call selectHandler" );
				return;
			}

			// NO results
			if( scope.noResults ) {
				console.log( "Can't call selectHandler, no results" );
			}

			scope.selectHandler()( match );
				

		} );

	

	}


	return {
		restrict 		: "C"
		, link 			: link
		/*, templateUrl	: "templates/resultListTemplate.html"*/
		, scope 		: {

			// List of all matches
			matches 			: '='

			// False, if matches.length < maxResultCount, else number that machtes.lenght exceeds maxResultCount
			, tooManyResults 	: '='

			// Currently selected index (mouse/arrow keys), may be < 0 and > machtes.length
			, activeIndex 		: '='

			// True, if no results were found; else false
			, noResults 		: '='

			// Max number of results to be displayed
			, maxResultCount 	: '='

			// Handler to be called on select
			, selectHandler 	: '&'

		}
	}
} ] )





.run(function($templateCache) {
	$templateCache.put( "templates/resultListTemplate.html", "<div class='no-results' ng-show='noResults'>NOPE</div><ul ng-hide='noResults'><li ng-repeat='match in matches' ng-class='{active: isActive($index)}'>{{match.id}}<br/>{{match.name}}</li><li class='more-results' ng-show='tooManyResults'>… and {{tooManyResults}} more</li></ul>" );
});










