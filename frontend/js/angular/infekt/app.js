var Infekt = angular.module( 'infekt', [] );

var infektSettings = {
	apiKey 			: "abcdef1234567890"
	, apiKeyName 	: "apikey"
	, apiUrls: {
		base		: "http://infekt.local:12001"
		, antibiotics 	: "antibiotic"
		, bacteria 		: "bacteria"
		, resistances 	: "resistance"
	}
};


Infekt
	.config(function($httpProvider){
    	delete $httpProvider.defaults.headers.common[ 'X-Requested-With' ];
	} );
