infekt.factory( 'ResistanceFactory', function( AntibioticsFactory, BacteriaFactory, $http, $q ) {


		/*return [ { 
			bacterium		: BacteriaFactory.getBacteria()[ 0 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 0 ]
			, value			: 0.3
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 1 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 0 ]
			, value			: 0.1
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 2 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 0 ]
			, value			: 0.5
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 0 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 1 ]
			, value			: 0.9
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 1 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 1 ]
			, value			: 0.8
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 2 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 1 ]
			, value			: 0.4
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 0 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 2 ]
			, value			: 0.4
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 1 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 2 ]
			, value			: 0.4
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 2 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 2 ]
			, value			: 0.2
		} ];	*/








	// Creates the relation between bacteria, antibiotics
	function parseResistances( data ) {

		console.log( "Parse resistances" );

		// debug
		window.resistances = data;

		var res = [];

		// Loop data
		for( var i = 0; i < data.length; i++ ) {

			// Get bacterium, antibiotic and resistance
			var abId 				= data[ i ].id_compound
				, bactId 			= data[ i ].id_bacteria
				, bact 				= BacteriaFactory.getById( bactId )
				, ab 				= AntibioticsFactory.getById( abId )
				, resistance		= data.resistanceImport
				, resistanceType
				, resistanceOrder 	= [ 'resistanceImport', 'resistanceUser', 'resistanceDefault']; //'classResistanceUser', 'classResistanceDefault', 'resistanceDefault' ]; // classResistanceDefault and resistanceDefault: Don't display number

			/*if( bact.id === 33 ) {
				console.error( data[ i ] );
			}*/


			// Get resistance (by checking, if data.orderName is given)
			for( var n = 0; n < resistanceOrder.length; n++ ) {

				// Result found
				if( data[ i ][ resistanceOrder[ n ] ] ) {
					resistance = data[ i ][ resistanceOrder[ n ] ];
					resistanceType = resistanceOrder[ n ];
					break;
				}

			}

			// Value missing: set to null
			if( !resistance ) {
				resistance = null;
			}

			//console.error( "connect %o to %o with resistance %o (type %o)", bact.latinName, ab.name, resistance, resistanceType );

			var entry ={
				bacterium		: bact
				, antibiotic 	: ab
				, value			: resistance
				, type			: resistanceType
			};

			// TODO: REMOVE!
			/*if (Math.random() < 0.3) {
				var rand = Math.random();
				entry.type = 'resistanceUser';
				entry.value = rand < 0.3 ? 1 : rand < 0.6 ? 2 : 3;
			}

			else {
				entry.type = 'resistanceImport';
				entry.value = Math.random() * 100;
			}*/


			res.push(entry);

			// Debug
			/*if( bact.id === 33 ) {
				console.error( res[ res.length - 1 ] );
			}*/

			/*if( bact.latinName.indexOf( 'Neisseria' ) > -1 ) {
				console.error( 'ness %o, %o, %o', ab, resistance, resistanceType );
				console.error( bact );
			}*/

		}

		return res;

	} 




	var httpPromise;
	var fetchResistances = function() {

		var url = infektSettings.apiUrls.base + "/" + infektSettings.apiUrls.resistances + "?" + infektSettings.apiKeyName + "=" + infektSettings.apiKey + "&noc=" + new Date().getTime();

		if( !httpPromise ) {
			httpPromise = $http( { method: "GET", url: url } );
		}

		return httpPromise;

	}



	/* REIHENFOLGE:*/
		
		/*"resistanceImport  - Prozent anzeigen
        "resistanceUser": 1, // Prozent anzeigen
		"classRresistanceDefault": 1,  // Nicht als Zahl, nur als Codierung anzeigen
        "resistanceDefault": 1, // Nur als Codierung anzeigen!
       */


	var factory = {};



	factory.resistances = [];
	
	// Deferred for getResistances	
	var deferred = $q.defer();

	// I get the resistance data from the server, then call then() :-)
	factory.getResistances = function() {



		// Antibiotics not yet ready: delay execution for later. Until then, return promise that will
		// be fulfilled by getResistances();
		// #todo: check only after http-request was made

		if( AntibioticsFactory.antibiotics.length == 0 ) {

			AntibioticsFactory.getAntibiotics().then( function() {
				factory.getResistances();
			} );
			return deferred.promise;
		
		}



		// Bacteria not yet ready; see above (antibiotics );

		if( BacteriaFactory.bacteria.length == 0 ) {

			BacteriaFactory.getBacteria().then( function() {
				factory.getResistances();
			} );
			return deferred.promise;
		
		}




		// Data is ready: resolve promise
		if( factory.resistances.length > 0 ) {
			deferred.resolve( factory.reistances );
		}

		// Bacteria and antibiotics ready: 

		else {

			fetchResistances().then( function( resp ) {

				factory.resistances = parseResistances( resp.data );
				console.log( "ResistanceFactory.resistances is %o" );

				deferred.resolve( factory.resistances );

			}, function() {
				alert( "Couldn't fetch resitances" );
			} );

		}

		return deferred.promise;


	}




	return factory;

} );



