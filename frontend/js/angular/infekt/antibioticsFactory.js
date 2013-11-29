Infekt.factory( 'AntibioticsFactory', function( $http, $q ) {



	/*var abTest = [ {
			name: "a"
			, id: 1 
			, productNames: [ "name1", "nam32" ]
			, substances: [ "substance1", "substance2" ]
			, classes: [ "class1", "class2", "class12" ]
			, iv: true
			, type: "antibiotic"
		}, {
			name: "b"
			, id: 2 
			, productNames: [ "name121", "nam3222" ]
			, substances: [ "substance122", "substance2213" ]
			, classes: [ "class1", "class2", "class1232" ]
			, po: true
			, iv: false
			, type: "antibiotic"
		}, {
			name: "c"
			, id: 3
			, productNames: [ "name121", "nam3222" ]
			, substances: [ "substance122", "substance2213" ]
			, classes: [ "class1", "class2", "class1232" ]
			, po: true
			, iv: false
			, type: "antibiotic"
		} ];*/




	//
	// REFORMAT data gotten from server
	//

	// Reformat antibiotics (server data) to match client side structure
	var parseAntibiotics = function( data ) {

		// Will be returned
		var ab = [];

		for( var i = 0; i < data.length; i++ ) {
			var antibiotic = {
				id 					: data[ i ].id 
				, name 				: data[ i ].substances[ 0 ].name || "no name"
				, substances		: [] // Array with all substanceClass names contained in this antibiotic
				, substanceClasses 	: [] // Array with all substance names contained in this antibiotic
				, po 				: data[ i ].po
				, iv 				: data[ i ].iv
				, type 				: "antibiotic"
			}

			// Get substances
			for( var j = 0; j < data[ i ].substances.length; j++ ) {
				antibiotic.substances.push( data[ i ].substances[ j ].name );
			}

			// Get substanceClasses (parents of substances)
			for( var j = 0; j < data[ i ].substanceClasses.length; j++ ) {
				antibiotic.substanceClasses.push( data[ i ].substanceClasses[ j ].name );
			}

			//console.log( "Formatted antibiotic to return: %o", antibiotic );
			ab.push( antibiotic );

		}


		console.log( "AntibioticsFactory: newly formatted antibiotics %o", ab );
		return ab;

	}





	var httpPromise;

	var fetchAntibiotics = function() {
	
		var url = infektSettings.apiUrls.base + "/" + infektSettings.apiUrls.antibiotics + "?" + infektSettings.apiKeyName + "=" + infektSettings.apiKey + "&noc=" + new Date().getTime();
		console.log( "AntibioticsFactory getAntibiotics: URL for getting antibiotics: %o", url );

		if( !httpPromise ) {
			httpPromise = $http( { method: "GET", url: url } );
		}
		
		return httpPromise;

	}









	//
	// FACTORY
	//

	var factory = {};

	factory.antibiotics = [];


	factory.getAntibiotics = function() {
			
		var deferred = $q.defer();


		if( factory.antibiotics.length > 0 ) {
			deferred.resolve( factory.antibiotics );
		}

		else {

			fetchAntibiotics().then( function( response ) {

				if( factory.antibiotics.length == 0 ) {
					factory.antibiotics = parseAntibiotics( response.data );
				}

				deferred.resolve( factory.antibiotics );

			}, function() {
				alert( "Couldn't fetch antibiotics from server" );
			} );

		}

		return deferred.promise;

	}




	// Return antibiotic with id id
	factory.getById = function( id ) {

		for( var i = 0; i < factory.antibiotics.length; i++ ) {

			if( factory.antibiotics[ i ].id == id ) {
				return factory.antibiotics[ i ];
			}

		} 

	}





	return factory;


})