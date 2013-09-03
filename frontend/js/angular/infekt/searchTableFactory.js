

// I create a hashTable for all values of antibiotics, bacteria and diagnosis to speed up searches
Infekt.factory( 'SearchTableFactory', function( AntibioticsFactory, BacteriaFactory ) {

	// I contain hashes for fast searching, i.e. Objects looking like 
	// { 
	// 	name: string
	//	 , value: string
	//   , containers: [ pointer to antibiotic | diagnosis | bacterium ]
	// }

	var searchTable = [];
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

		var allData = AntibioticsFactory.getAntibiotics().concat( BacteriaFactory.getBacteria() )

		// Loop through all bacteria, ab, diagnosis
		for( var i = 0; i < allData.length; i++ ) {
			
			// Loop through the properties of bact, ab, diag
			for( var j in allData[ i ] ) {

				// If value of property j is an array, call addToTable for every single array item
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

		console.error( "HashTable: %o", searchTable );

	}




	// Takes an obj, structured like the one for searchTable*, and adds it to the searchTable
	// If an object with the respective values does already exist, a new container is added 
	// that points to the original data source
	// {
	//	  name: string	
	//	  , value: string	
	//	  , pointer: pointer to antibio, bact, diagnosis	
	// }

	function addToTable( obj ) {

		var inTable = isInTable( obj.name, obj.value );

		// Value and name were already in table: push obj to containers of the match
		if( inTable.length > 0 ) {
			console.log( "hashTable: push %o to existing object %o", obj, inTable );
			inTable[ 0 ].containers.push( obj.pointer );
		}

		else {
			var newObj = {
				name 			: obj.name
				, value 		: obj.value
				, containers	: [ obj.pointer ]
			}
			console.log( "create object %o for hashTable", newObj );

			searchTable.push( newObj );
		}

	}






	// I go through the searchTable array and return all elements, whose values match searchString, as an array
	factory.findTerm = function( searchString ) {

		if( searchTable.length == 0 ) {
			generateSearchTable();
		}

		var results = [];

		// Go through searchTable, look up searchString in it's values
		for( var i = 0; i < searchTable.length; i++ ) {
			// Make searchTable[ i ].value to a string, as int won't know indexOf
			if( ( searchTable[ i ].value + "" ).indexOf( searchString ) > -1 ) {
				results.push( searchTable[ i ] );
			}
		}

		console.log( "findTerm returns %o", results );
		return results;

	}

	return factory;

} );

