// I'm responsible for the filters the user applies to the matrix and the recommendation 
// table
infekt.factory( 'FilterFactory', function() {

	// I hold the filters that the user applied
	// Each object (bacterium etc.) has a KEY that corresponds to the bacterium's property that is filtered
	// and a VALUE that contains an array of searchTableFactory objects (value, name, humanValue, humanName, containers)
	var filters = {
		diagnosis 		: {}
		, bacterium 	: {}
		, antibiotic 	: {}
	}


	var factory = {};



	// I return the property of filters that corresponds to the
	// type of obj
	function getFilterType( obj ) {

		// Missing type
		if( !obj.type ) {
			return false;
		}

		if( obj.type == "antibiotic" ) {
			return filters.antibiotic;
		}
		else if( obj.type == "diagnosis" ) {
			return filters.diagnosis;
		}
		else if( obj.type == "bacterium" ) {
			return filters.bacterium;
		}

		return false;

	}




	factory.getFilterCount = function( name ) {

		if( !filters[ name ] ) {
			console.error( "infektController: getFilterCount called with name that doesn't exist in filters: %o vs %o", name, filters );
			return 0;
		}

		var len = 0;
		for( var i in filters[ name ] ) {
			len++;
		}

		return len;

	}




	factory.getFilters = function( name ) {

		if( name ) {

			if( !filters[ name ] ) {
				//console.error( "infektController: getFilters called with name that doesn't exist in filters: %o vs %o", name, filters );
				return [];
			}

			else {
				//console.log( "infektControler: getFilters returns %o for name %s", filters[ name ], name );
				return filters[ name ];
			}


		}

		//console.log( "infektController: getFilters returns all filters %o", filters );
		return filters;

	}






	/**
	* Adds a searchTableFactory object to filter. Object has properties humanName, humanValue, name, value and containers. 
	* Containers contains all objects that match this filter
	*
	* @param {searchTableFactoryObject} obj		Filter to be added
	* @returns 	null
	*/ 
	factory.addFilter = function( obj ) {

		// Get obje
		var filter = getFilterType( obj.containers[ 0 ] );

		if( !filter ) {
			console.error( "Unknown type for adding filter: %o", obj );
			return;
		}

		// If object filter doesn't yet have a property corresponding to the type of
		// obj, initialize it (empty array)
		if( !filter[ obj.name ] ) {
			filter[ obj.name ] = [];
		}

		filter[ obj.name ].push( obj );

		console.log( "FilterFactory: add property %o to filter %o", obj, filter );

	}





	/**
	* @param {searchTableFactoryObject} obj 	See addFilter()
	*/
	factory.removeFilter = function( obj ) {

		var filter = getFilterType( obj.containers[ 0 ] );

		// Filters not found for type of obj (bact/ab)
		if( !filter ) {
			console.error( "Uknown type for removing filter: %o", obj );
			return;
		}

		// No filter of this type is available (substance, gram)
		if( !filter[ obj.name ] ) {
			console.error( "No filter of type %o is available in %s (%o)", obj.name, obj.containers[ 0 ].type, filter );
			return;
		}

		// Loop all filters of this type, splice obj when found
		for( var i = 0;  i < filter[ obj.name ].length; i++ ) {
			if( filter[ obj.name ][ i ] == obj ) {
				filter[ obj.name ].splice( i, 1 );

				// If filter for this type doesn't contain any objects any more: 
				// Remove whole filter type
				if( filter[ obj.name ].length === 0 ) {
					delete filter[ obj.name ];
				}

				return;
			}
		}

		// obj not found in filters of this type
		console.error( "Filter %o could not be removed from filters %o, because it was not found", obj, filter );


	}

	return factory;

} );




