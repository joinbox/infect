

// I create a hashTable for all values of antibiotics, bacteria and diagnosis to speed up searches
infekt.factory( 'SearchTableFactory', function( AntibioticsFactory, BacteriaFactory, DiagnosisFactory, TranslationFactory ) {



	// I contain hashes for fast searching, i.e. Objects looking like @see addToTable(), 
	// called searchTableFactoryObjects
	var searchTable = [];

	// Factory that will be returned
	var factory = {};

	

	/** 
	* Returns an array with pointers to an object contained in searchTable with name «name» (and value, if provided), 
	* if it is there; else false
	* @param <String> name			Name of the object, as provided by the server
	* @param <String> value			Value of the object, as provided by the server
	* @returns <Object|Boolean>		See object generated by addToTable; reference to object
	* 								contained in this.searchTable
	*/
	function isInTable( name, value ) {

		for( var i = 0; i < searchTable.length; i++ ) {
			
			if( searchTable[ i ].humanName === name && searchTable[ i ].humanValue === value ) {

				return searchTable[ i ];

			}
		}

		return false;

	}





	// I generate the searchTable array from the data in AntibioticFactory, BacteriaFactory and DiagnosisFactory
	// by taking all their object's properties and valuesand making single objects out of them that point to their original
	// object
	function generateSearchTable() {

		// Bacteria or AB not yet ready
		if( AntibioticsFactory.antibiotics.length === 0 || BacteriaFactory.bacteria.length === 0 || DiagnosisFactory.getDiagnosis().length === 0 ) {
			return;
		}


		var allData = AntibioticsFactory.antibiotics.concat( BacteriaFactory.bacteria );
		allData = allData.concat( DiagnosisFactory.getDiagnosis() );

		console.group( 'generateSearchTable' );
		console.log( "SearchTableFactory: generateSearchTable - allData: %o", allData );

		// Loop through all bacteria, ab, diagnosis
		for( var i = 0; i < allData.length; i++ ) {
			
			// Loop through the properties of bact, ab, diag
			for( var j in allData[ i ] ) {

				// If value of property j is an array, call addToTable for every single array item
				// Is especially the case on substances and substanceClasses
				if( angular.isArray( allData[ i ][ j ] ) ) {
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


		console.log( "Hash Table: %o", searchTable );

		window.st = searchTable; // Debug 
		console.groupEnd();

	}







	// Takes an obj, structured like the one for searchTable, and adds it to the searchTable
	// If an object with the respective values does already exist, a new container is added 
	// that points to the original data source
	// {
	//	  name: string	
	//	  , humanName: string	/* human readable name, localized */
	//	  , humanValue: string	/* human readable value, localized */
	//	  , value: string	
	//	  , containers: pointer to antibio, bact, diagnosis	
	// }

	// @param {Object} obj  	obj with properties: 
	// - name
	// - value
	// - pointer,
	// @see generateSearchTable()
	
	function addToTable( obj ) {

		// Translate value and name of property that has to be stored into 
		// human readables
		var translatedObj = TranslationFactory.translate( obj.pointer, obj.name, obj.value );

		// Translator says property is not human readable (returns false): 
		// Don't addd it to table
		if( translatedObj === false ) {
			return false;
		}


		// Value and name were already in table: push obj to containers of the match
		// Use *translated* name and value, as object's value might be an array and can't be
		// compared to another array through ==
		var inTable = isInTable( translatedObj.name, translatedObj.value );
		
		if( inTable ) {
			inTable.containers.push( obj.pointer );
		}

		// Create object, add to searchTable
		else {
			var newObj = {
				name 			: obj.name
				, type 			: obj.pointer.type
				, value 		: obj.value
				, humanName 	: translatedObj.name
				, humanValue 	: translatedObj.value
				, containers	: [ obj.pointer ]
			};

			searchTable.push( newObj );

		}

	}



	// I return the whole searchTable
	factory.getTerms = function() {

		if( searchTable.length === 0 ) {
			generateSearchTable();
		}

		return searchTable;

	};




	return factory;

} );

