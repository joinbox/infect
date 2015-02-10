//
// Translates properties and values of antibiotics and bacteria object to «human readable»
// words ( i.e. { gram: 1 } becomes {name: "Gram", value: "Gram Positiv" } )
//

infekt.factory( 'TranslationFactory', function( $http, $q ) {

	// Contains translations for all properties of bacteria and antibiotics

	// Format: 
	// 	
	// 		propertyName 		: {
	// 			name 			: "translationForThePropertyName"
	//			, values  		: {
	//				value1 		: "translationForValue1"
	//				, value2	: "translationForValue2"
	//			}
	//		}
	// 
	// If property should not be displayed, the following format is
	// used: 
	

	// 		propertyName 		: false



	var propertyTranslator = {

		// AEROBIC
		aerobic 		:  {
			name 		: "Aerob"
			, values 	: {
				1 		: "Aerob"
				, 0 	: "Nicht aerob"
			}
		}

		// ANAEROBIC
		, anaerobic 	: {
			name 		: "Anaerob"
			, values 	: {
				1 		: "Anaerob"
				, 0 	: "Nicht anaerob"
			}
		}

		// GENUS
		, genus 		: {
			name 		: "Genus"
			// Don't translate value
		}


		// GRAM
		, gram 			: {
			name 		: "Gram"
			, values 	: {
				1 		: "Gram+"
				, 0 	: "Gram-"
			}
		}


		// ID
		, id 			: false
		// no need to translate id / make it human readable



		// IV
		, iv			: {
			name  		: "Intravenös"
			, values 	: {
				1 		: "Ja"
				, 0 	: "Nein"
			}
		}



		// NAME
		, name 			: {
			name 		: "Name"
		}



		// PO
		, po  			: {
			name 		: "Per oss"
			, values 	: {
				1 		: "Ja"
				, 0 	: "Nein"
			}
		}


		// SHAPE
		, shape 		: {
			name 		: "Form"
			, values 	: {
				"cocci" 	: "Kokken"
				, "rod" 	: "Stäbchen"
			}
		}

		// SPECIES
		, species 		: {
			name 		: "Spezies"
			// Don't translate value
		}


		// SUBSTANCE CLASSES
		/*, substanceClasses : {
			name 		: "Substanzklasse(n)"
		}*/




		// SUBSTANCES
		, substances : {
			name 		: "Substanzen"
		}


		// TYPE
		, type 			: {
			name 		: "Typ"
			, values	: {
				"bacterium" 		: "Bakterium"
				, "antibiotic" 		: "Antibiotikum"
			}
		}


		// LATIN
		, latinName 	: {
			name 		: "Name (Latein)"
		}


	}






	var factory = {};



	// Takes an object and a name (of a property) of this object that is to be translated;
	// returns the translated form of it
	factory.translate = function( object, propertyName, propertyValue ) {

		//console.log( "translate object %o - propertyName %o", object, propertyName );

		// Prefill returned object; take over name and
		// get default value of object
		var ret = {
			name: propertyName
			, value: object[ propertyName ]
		}


		if( propertyName === "substances" ) {
			return {
				name 	: "Substanz"
				, value : propertyValue.localeName + " (" + propertyValue.names.join( ", " ) + ")"
			}
		};


		if( propertyName === "substanceClasses" ) {
			//console.error(" SUBSTCLA %o - obj %o, propName %o", object.substanceClasses, object, propertyName );
			return {
				name 	: "Substanzklassen"
				, value : propertyValue.localeName + " (" + propertyValue.names.join( ", " ) + ")"
			}
		};



		// (Temporarily) store translation for property and values
		var translation = propertyTranslator[ propertyName ];


		// Translation returns false
		if( translation === false ) {
			return false;
		}


		// No translation found for propertyName: 
		// Terminate by returning the default values (not translated)
		if( !translation ) {
			return ret;
		}



		//
		// Set translated NAME
		//

		ret.name = propertyTranslator[ propertyName ].name;



		//
		// Get translation for propertyName's VALUE
		//

		var value = object[ propertyName ];
		
		// No translation found for value
		//console.log( "check translation %o for value %o", translation, value )
		if( !translation.values || !translation.values[ value ] ) {
			return ret;
		}

		ret.value = translation.values[ value ];

		return ret;


	}

	return factory

} );
