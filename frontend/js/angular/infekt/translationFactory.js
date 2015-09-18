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
	// If property should not be displayed, return false. 
	//
	// «values» may be a function that takes the value of the object as an argument and
	// needs to return a string




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
		// no need to translate id / make it human readable
		, id 			: false



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
		, substanceClasses : {
			name 		: "Substanzklasse(n)"
			, values	: function( propertyValue ) {
				//console.error( propertyValue );
				return propertyValue.localeName + " (" + propertyValue.names.join( ", " ) + ")";
			}
		}




		// SUBSTANCES
		, substances : {
			name 		: "Substanzen"
			, values	: function( propertyValue ) {
				return propertyValue.localeName + " (" + propertyValue.names.join( ", " ) + ")";
			}
		}


		// TYPE
		, type 			: {
			name 		: "Typ"
			, values	: {
				"bacterium" 		: "Bakterium"
				, "antibiotic" 		: "Antibiotikum"
				, "diagnosis"		: "Diagnose"
			}
		}


		// LATIN
		, latinName 	: {
			name 		: "Name (Latein)"
		}


	};






	var factory = {};



	// Takes an object and a name (of a property) of this object that is to be translated;
	// returns the translated form of it
	factory.translate = function( object, propertyName, propertyValue ) {


		// Prefill returned object; take over name and
		// get default value of object
		var ret = {
			name: propertyName
			, value: object[ propertyName ]
		};


		// (Temporarily) store translation for property and values
		var translation = propertyTranslator[ propertyName ];



		// Translation returns false: Explicitly ignore this value
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


		// value returns a function
		if( angular.isFunction( translation.values ) ) {
			ret.value = translation.values( propertyValue );
		}
		
		// No translation found for value
		else if( !translation.values || !translation.values[ propertyValue ] ) {
			// Don't do anything
		}

		// Use regular translation
		else {
			ret.value = translation.values[ propertyValue ];
		}

		return ret;


	};

	return factory;

} );
