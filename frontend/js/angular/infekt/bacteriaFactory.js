// I contain all the bacteria
infekt.factory( 'BacteriaFactory', function( $http, $q, $timeout ) {



	/*var bacteria = [ {
			name: "one"
			, id: 1 
			, ltainName: "teas klsdjf lkj flös"
			, species: "spec-34afd"
			, genus: "genus-dfjdsf"
			, shape: "kugel"
			, aerobic: true
			, gram: "gram+"
			, type: "bacterium"
		}, {
			name: "two"
			, id: 2 
			, ltainName: "latin sdkjf lkfjs"
			, species: "spec-34afd"
			, genus: "genus-asd"
			, shape: "eckig"
			, aerobic: true
			, anaerobicOptional: true
			, gram: "other"
			, type: "bacterium"
		}, {
			name: "tree"
			, id: 3
			, ltainName: "sadfk kj fkjokl"
			, species: "spec-asdfkfe"
			, genus: "genus-23412"
			, shape: "stab"
			, aerobic: false
			, anaerobic: true
			, gram: "gram-"
			, type: "bacterium"
		} ]*/







	/***********************************************************************************************
	/
	/  Helper functions
	/
	***********************************************************************************************/




	/***********************************************************************************************
	/  Parse server data
	***********************************************************************************************/
	
	var parseShapes = function( shapes ) {

		var ret = [];
		for( var i = 0; i < shapes.length; i++ ) {
			ret.push( shapes[ i ].name );
		}

	};


	function parseBacteria( data ) {

		// debug
		window.bacteria = data;

		var bacts = [];

		// Loop data
		for( var i = 0; i < data.length; i++ ) {

			// Transform rawBact to bact
			var rawBact 	= data[ i ]
				, bact 		= {
					id 				: rawBact.id
					, latinName 	: rawBact.name
					, species 		: rawBact.species
					, genus 		: rawBact.genus
					, shape 		: rawBact.shape
					, shapeLocales 	: parseShapes( rawBact.shapeLocales ) // locales in an array
					, aerobic 		: rawBact.aerobic
					, anaerobic 	: rawBact.anaerobic
					, gram 			: rawBact.gram
					, type 			: "bacterium"
				};	


			bacts.push( bact );

		}

		console.log( "parsedBacteria - made %o from %o", bacts, data );

		return bacts;

	}







	/***********************************************************************************************
	/  Get server data
	***********************************************************************************************/

	var httpPromise;
	var fetchBacteria = function() {

		var url = infektSettings.apiUrls.base + "/" + infektSettings.apiUrls.bacteria + "?" + infektSettings.apiKeyName + "=" + infektSettings.apiKey + "&noc=" + new Date().getTime();
		console.log( "ULR for bacteria: %o", url );

		if( !httpPromise ) {
			httpPromise = $http( { method: "GET", url: url } );	
		} 

		return httpPromise;

	};







	/***********************************************************************************************
	/
	/  FACTORY
	/
	***********************************************************************************************/


	var factory = {};


	/**
	*
	*/
	factory.bacteria = [];
	factory.promiseObject = null;


	factory.getBacteria = function() {


		// Should be
		// RequestFactory.get( url, parseFunction, variableToStore );
			
		console.log( "getBacteria");

		var deferred = $q.defer();

		// Request is running:
		// Return promiseObject, that has a .then method attached
		/*if( factory.promiseObject ) {
			console.log( "RETURN http-PROMISE %o", factory.promiseObject );
			return factory.promiseObject;
		}*/

		// Bacteria not yet gotten: Make call to server
		if( factory.bacteria.length === 0 ) {
			
			factory.promiseObject = fetchBacteria().then( function( response ) {
				factory.promiseObject = null;

				// Bacteria hasn't been set before 
				if( factory.bacteria.length === 0 ) {
					factory.bacteria = parseBacteria( response.data );
				}

				//console.log( "Resolve getBacteria - return %o from server data %o", factory.bacteria, response.data );
				deferred.resolve( factory.bacteria );

			}, function() {
				alert( "Couldn't fetch bacteria from server" );
			} );
		
		}

		// Bacteria ready: return
		else {
			deferred.resolve( factory.bacteria );
		}

		return deferred.promise;

	};


	// Return bacterium with id id
	factory.getById = function( id ) {

		for( var i = 0; i < factory.bacteria.length; i++ ) {

			if( factory.bacteria [ i ].id == id ) {
				return factory.bacteria[ i ];
			}

		} 

	};



	return factory;

} );

