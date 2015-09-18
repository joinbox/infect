'use strict';

var infekt = angular.module( 'infekt', [ "fxstr.directives.typeahead", "pascalprecht.translate"] );


var env = window.location.search.indexOf('dev') > 0 ? "dev" : "live";

var infektSettings = {
	apiKey 			: "abcdef1234567890"
	, apiKeyName 	: "apikey"
	, environment 	: env
	, apiUrls: {
		base		: ( env == "dev" ) ? "http://infekt.local:12001" : "http://api.infekt.in:80"
		, antibiotics 	: "antibiotic"
		, bacteria 		: "bacteria"
		, resistances 	: "resistance"
		, diagnosis		: "diagnosis"
	}
};



//
// TRANSLATIONS
//

infekt
	.config( function( $translateProvider ) { 

		$translateProvider.translations( "de", {
			"antibiotic" 				: "Antibiotikum"
			, "bacterium" 				: "Bakterium"
			, 'diagnosis'				: 'Diagnose'
		} );

		$translateProvider.preferredLanguage( 'de' );
	
	} );





//
// CORS STUFF
//

infekt
	// Prevent angular from causing problems with CORS
	// http://stackoverflow.com/questions/16661032/http-get-is-not-allowed-by-access-control-allow-origin-but-ajax-is
	.config( function( $httpProvider){
    	delete $httpProvider.defaults.headers.common[ 'X-Requested-With' ];
	} );



var getLanguage = function() {
	return $( "html" ).attr( "lang" ).substr( 0, 2 );
};


var countProperties = function( obj ) {
	var len = 0; 
	for( var i in obj ) {
		len++;
	}
	return len;
};