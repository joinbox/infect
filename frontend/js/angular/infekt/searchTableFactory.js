

// I create a hashTable for all values of antibiotics, bacteria and diagnosis to speed up searches
infekt.factory( 'SearchTableFactory', function( AntibioticsFactory, BacteriaFactory, TranslationFactory ) {



	// I contain hashes for fast searching, i.e. Objects looking like @see addToTable(), 
	// called searchTableFactoryObjects
	var searchTable = [];

	// Factory that will be returned
	var factory = {};

	

	// I return an array with pointers to an object contained in searchTable with name «name» (and value, if provided), 
	// if it is there; else false
	function isInTable( name, value ) {

		var ret = [];

		for( var i = 0; i < searchTable.length; i++ ) {
			if( searchTable[ i ].name == name ) {

				// Value was provided, but didnt' match value of searchTable
				if( value && value !== searchTable[ i ].value ) {
					continue;
				}

				ret.push( searchTable[ i ] );

			}
		}

		return ret || false;

	}





	// I generate the searchTable array from the data in AntibioticFactory, BacteriaFactory and DiagnosisFactory
	// by taking all their object's properties and valuesand making single objects out of them that point to their original
	// object
	function generateSearchTable() {

		// Bacteria or AB not yet ready
		if( AntibioticsFactory.antibiotics.length === 0 || BacteriaFactory.bacteria.length === 0 ) {
			console.error( "AB/Bact not yet ready; dint generateSearchTable()" );
			return;
		}


		var allData = AntibioticsFactory.antibiotics.concat( BacteriaFactory.bacteria )
		console.error( "generateSearchTable - allData: %o", allData );

		// Loop through all bacteria, ab, diagnosis
		for( var i = 0; i < allData.length; i++ ) {
			
			// Loop through the properties of bact, ab, diag
			for( var j in allData[ i ] ) {

				// If value of property j is an array, call addToTable for every single array item
				// Is especially the case on substances and substanceClasses
				if( Object.prototype.toString.call( allData[ i ][ j ] ) === '[object Array]' ) {
					for( var n in allData[ i ][ j ] ) {
						addToTable( {
							value: allData[ i ][ j ][ n ]
							, name: j
							, pointer: allData[ i ]
						} );
					}
				}

				// value of property j is a string
				else {
					addToTable( {
						value: allData[ i ][ j ]
						, name: j
						, pointer: allData[ i ]
					} );
				}

			}

		}


		console.error( "Hash Table:" );
		for( var i = 0; i < searchTable.length; i++ ) {
			console.log( "%s - %s", searchTable[ i ].humanName, searchTable[ i ].humanValue )
		}

		window.st = searchTable;

	}







	// Takes an obj, structured like the one for searchTable, and adds it to the searchTable
	// If an object with the respective values does already exist, a new container is added 
	// that points to the original data source
	// {
	//	  name: string	
	//	  , humanName: string	/* human readable name, localized */
	//	  , humanValue: string	/* human readable value, localized */
	//	  , value: string	
	//	  , pointer: pointer to antibio, bact, diagnosis	
	// }

	// @param {Object} obj  	obj with properties: name, value, pointer, @see generateSearchTable()
	
	function addToTable( obj ) {

		if( obj.name == "substanceClasses" ) {
			console.error( "addToTable %o", obj );
		}

		// Translate value and name of property that has to be stored into 
		// human readables
		var translatedObj = TranslationFactory.translate( obj.pointer, obj.name, obj.value );
		//console.log( "translated is %o", translatedObj.value );


		// Translator says property is not human readable (returns false): 
		// Don't addd it to table
		if( translatedObj === false ) {
			//console.log( "Don't add property %o to table", obj.name );
			return false;
		}


		//console.error( "translated %o: %o into %o: %o", obj.name, obj.value, translatedObj.name, translatedObj.value );

		var inTable = isInTable( obj.name, obj.value );
		//console.log( "addToTable %s - %s - %o", obj.name, obj.value, obj.pointer );

		// Value and name were already in table: push obj to containers of the match
		if( inTable.length > 0 ) {
			inTable[ 0 ].containers.push( obj.pointer );
		}

		else {
			//console.error( "searchTable – start new object with %o", obj );
			var newObj = {
				name 			: obj.name
				, type 			: obj.pointer.type
				, value 		: obj.value
				, humanName 	: translatedObj.name
				, humanValue 	: translatedObj.value
				, containers	: [ obj.pointer ]
			}

			//console.log( "Create object %o for hash table - %o", translatedObj.name, obj.pointer );

			searchTable.push( newObj );

		}

	}



	// I return the whole searchTable
	factory.getTerms = function() {

		if( searchTable.length == 0 ) {
			generateSearchTable();
		}

		return searchTable;

	}




	// I go through the searchTable array and return all elements, whose values match searchString, as an array
	/*factory.findTerm = function( searchString ) {

		if( searchTable.length == 0 ) {
			generateSearchTable();
		}

		var results = [];

		// Go through searchTable, look up searchString in it's values
		for( var i = 0; i < searchTable.length; i++ ) {
			// Make searchTable[ i ].value to a string, as int won't know indexOf
			console.error( searchTable[ i ].humanValue );
			if( ( searchTable[ i ].humanValue + "" ).toLowerCase().indexOf( searchString.toLowerCase() ) > -1 || 
				(  searchTable[ i ].humanName + "").toLowerCase().indexOf( searchString.toLowerCase() ) > -1 ) {
				results.push( searchTable[ i ] );
			}
		}

		console.log( "findTerm returns %o – searched in table %o", results, searchTable );
		return results;

	}*/

	return factory;

} );

