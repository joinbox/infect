var Infekt = angular.module( 'infekt', [] );


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
	}
};



Infekt

	// Prevent angular from causing problems with CORS
	// http://stackoverflow.com/questions/16661032/http-get-is-not-allowed-by-access-control-allow-origin-but-ajax-is
	.config(function($httpProvider){
    	delete $httpProvider.defaults.headers.common[ 'X-Requested-With' ];
	} );
