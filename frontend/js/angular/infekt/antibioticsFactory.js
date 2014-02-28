infekt.factory( 'AntibioticsFactory', function( $http, $q ) {






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
			/*for( var j = 0; j < data[ i ].substances.length; j++ ) {
				antibiotic.substances.push( data[ i ].substances[ j ].name );
			}*/
			antibiotic.substances = parseSubstances( data[ i ].substances );

			antibiotic.substanceClasses = parseSubstances( data[ i ].substanceClasses );

			console.error( antibiotic.substanceClasses );

			//Get substanceClasses (parents of substances)
			/*for( var j = 0; j < data[ i ].substanceClasses.length; j++ ) {
				antibiotic.substanceClasses.push( data[ i ].substanceClasses[ j ].name );
			}*/

			//console.log( "Formatted antibiotic to return: %o", antibiotic );
			ab.push( antibiotic );

		}

		console.log( "AntibioticsFactory: newly formatted antibiotics %o, was %o", ab, data );
		return ab;

	}










	/**
	* Formats
	* @param {Array} substanceArray 	Array of substances as gotten from server
	* 									looks like [ { id: 42, id_language: 1, language: "de", name: "Fulsäure" } ]
	* @return {Object}					Re-formated substances, optimized for typeahead. Looks like 
	*									[ { id: 42, localeName: "Fulsäure", names: [ "name1", "name2" ] } ]
	*/
	var parseSubstances = function( substanceArray ) {



		/**
		* Checks, if substance with id is present in array of substances (i.e. in array that will be returned)
		*
		* @param {Integer} id 			ID substances have to be searched for
		* @param {Array} substances		Array of substances; all substances must have a property id
		* @return {Object|Boolean}		false, if not found. Else match.
		*/
		var getSubstanceById= function( id, substances ) {
			for( var i = 0; i < substances.length; i++ ) {
				if( substances[ i ].id === id ) {
					return substances[ i ];
				}
				return false;
			}
		}




		// Return value
		var ret = [];

		for( var i = 0; i < substanceArray.length; i++ ) {

			var subsData = substanceArray[ i ];

			// Does substance already exist in ret?
			var retEntry = getSubstanceById( subsData.id, ret );


			// Substance exists in ret array
			if( retEntry ) {

				// Is user's current language: Set localeName
				if( subsData.language == getLanguage() ) {
					retEntry.localeName = subsData.name;
				}

				// Not user's language: push to names
				else {

					// Only add lang, if it doesn't exist
					if( retEntry.names.indexOf( subsData.name ) === -1 ) {
						retEntry.names.push( subsData.name );
					}
				}

			}

			// Entry with id doesn't yet exist: Create substance
			else {
				ret.push( {
					id 				: subsData.id 
					, names 		: [ subsData.name ]
					, localeName 	: subsData.language === getLanguage() ? subsData.name : false
				} );
			}
				
		}

		return ret;

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


	//
	// Array with all antibiotics; ab looks like:
	//
	/*{
			name: "c"
			, id: 3
			, productNames: [ "name121", "nam3222" ]
			, substances: [ {
					localeName: "substance122", 
					name: [ "substance2213" 
					id: 41
			} ]
			, classes: [ "class1", "class2", "class1232" ]
			, po: true
			, iv: false
			, type: "antibiotic"
		}*/
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


} );