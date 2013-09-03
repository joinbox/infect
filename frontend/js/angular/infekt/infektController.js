Infekt.controller( 'InfektController', function( $scope, AntibioticsFactory, BacteriaFactory, ResistencyFactory, SearchTableFactory, FilterFactory ) {


	$scope.bacteria = BacteriaFactory.getBacteria();
	$scope.antibiotics = AntibioticsFactory.getAntibiotics();
	$scope.resistencies = ResistencyFactory.getResistencies();




	/***********************************************************************************************
	/
	/  SORT & HELPER FUNCTIONS
	/
	***********************************************************************************************/

	// I'm there to sort the anitiobitcs (needed by getAntibioticsSorted)
	// must be the same as antibioticResistencySortFunction
	var antibioticSortFunction = function( a, b ) {
		return a.name > b.name;
	}

	// I'm there to sort the resistency table returned by getResistencyTable
	// must be the same as antibioticSortFunction
	var antibioticResistencySortFunction = function( a, b ) {
		return a.antibiotic.name > b.antibiotic.name;
	}

	// I sort bacteria (getResistencyTable stuff) alphabetically for rows
	// must be the same as bacteriumSortFunction
	var bacteriumRowSortFunction = function( a, b ) {
		return a.bacterium.name > b.bacterium.name;
	}

	// I sort bacteria; must be the same as bacteriumRowSortFunction
	var bacteriumSortFunction = function( a, b ) {
		return a.name > b.name;
	}






	/***********************************************************************************************
	/
	/  FILTERS
	/
	***********************************************************************************************/

	// I return the list of filters that match term
	$scope.filterSearchList = function( term ) {
		var results = SearchTableFactory.findTerm( term );
		console.log( "filter for %s returns %o", term, results );
		return results;
	}



	$scope.addFilter = function( obj ) {
		console.log( "infektController: add to filter %o", obj );
		FilterFactory.addFilter( obj );
	}


	$scope.getFilters = function( name ) {
		return FilterFactory.getFilters( name );
	}
	
	$scope.getFilterCount = function( name ) {
		return FilterFactory.getFilterCount( name );
	}

	$scope.removeFilter = function( obj ) {
		console.log( "infectController: remove filter %o", obj );
		FilterFactory.removeFilter( obj );
	}


















	/***********************************************************************************************
	/
	/  RESISTENCY TABLE 
	/
	***********************************************************************************************/


	// I return the $scope.antibiotics array, sorted alphabetically
	$scope.getAntibioticsSorted = function() {
		return $scope.antibiotics.sort( antibioticSortFunction );
	}

	// I return the $scope.bacteria, sorted by the same mechanism that sorts me for the display
	// of the resistencyMatrix. I'm needed to filter the reistencyMatrix table. 
	$scope.getBacteriaSorted = function() {
		return $scope.bacteria.sort( bacteriumSortFunction );
	}



	// I return the matrix, i.e. the table body of the resistencies
	// formatted to match the matrix structure; I'm needed to output
	// the table
	$scope.getResistencyTable = function() {

		// I'm an array, containing «rows» of bacteria and their resistencies in relation
		// to antibiotics
		//
		//	[ { bacterium: bacterium
		//		, resistencies: [ {            -- sorted with antibioticSortFunction
		//			antibiotic: antibiotic
		//			, value: int(0-100)
		//		} );
		//	} ] ;
		//
		//
		var ret = [];

		for( var i = 0; i < $scope.resistencies.length; i++ ) {

			var row = getBacteriumRow( $scope.resistencies[ i ].bacterium );
			row.resistencies.push( {
				antibiotic 	: $scope.resistencies[ i ].antibiotic 
				, value 	: $scope.resistencies[ i ].value
			} );

		}



		// Returns the «row» of ret containing a certain bacterium; 
		// row.bacterium contains the bacterium's name, row.resistencies the resistencies (not yet sorted or complete)
		// If the row doesn't exist yet, it's created
		function getBacteriumRow( bacterium ) {

			// Go through ret table, return ret[ i ], if it's bacterium matches
			// bacterium
			for( var i = 0; i < ret.length; i++ ) {
				if( ret[ i ].bacterium == bacterium ) {
					return ret[ i ];
				}
			}

			// No matches found; create row
			var newRow = {
				bacterium 		: bacterium
				, resistencies 	: []
			};
			console.error( "created row %o", newRow );
			ret.push( newRow );
			return newRow;

		}


		console.error( "ret before sorting: %o", ret );


		// Sort resistencies
		for( var i = 0; i < ret.length; i++ ) {
			console.error( "sort %o by .antibiotic.name", ret[ i ].resistencies )
			ret[ i ].resistencies.sort( antibioticResistencySortFunction );
		}	

		console.error( ret );
		return ret.sort( bacteriumRowSortFunction );

	}


} );




