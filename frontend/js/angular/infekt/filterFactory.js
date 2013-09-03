// I'm responsible for the filters the user applies to the matrix and the recommendation 
// table
Infekt.factory( 'FilterFactory', function() {

	// I hold the filters that the user applied
	var filters = {
		diagnosis: []
		, bacterium: []
		, antibiotic: []
	}

	var factory = {};



	// I return the property of filters that corresponds to the
	// type of obj
	function getFilterArray( obj ) {

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

		return filters[ name ].length;

	}



	factory.getFilters = function( name ) {

		if( name ) {

			if( !filters[ name ] ) {
				console.error( "infektController: getFilters called with name that doesn't exist in filters: %o vs %o", name, filters );
				return [];
			}

			else {
				console.log( "infektControler: getFilters returns %o for name %s", filters[ name ], name );
				return filters[ name ];
			}


		}

		console.log( "infektController: getFilters returns all filters %o", filters );
		return filters;

	}



	factory.addFilter = function( obj ) {

		var filter = getFilterArray( obj.containers[ 0 ] );

		if( !filter ) {
			console.error( "Unknown type for adding filter: %o", obj );
			return;
		}

		filter.push( obj );
		console.log( "FilterFactory: add property %o to filter %o", obj, filter );

	}



	factory.removeFilter = function( obj ) {

		var filter = getFilterArray( obj.containers[ 0 ] );

		if( !filter ) {
			console.error( "Uknown type for removing filter: %o", obj );
			return;
		}

		// Loop all filters of this type, splice obj when found
		for( var i = 0;  i < filter.length; i++ ) {
			if( filter[ i ] == obj ) {
				filter.splice( i, 1 );
				return;
			}
		}

		// obj not found in filters of this type
		console.error( "Filter %o could not be removed from filters %o, because it was not found", obj, filter );


	}

	return factory;

} );




