Infekt.controller( 'InfektController', function( $scope, AntibioticsFactory, BacteriaFactory, ResistanceFactory, SearchTableFactory, FilterFactory ) {

	$scope.antibiotics = [];
	$scope.bacteria = [];
	$scope.resistances = [];



	// Get antibiotics
	AntibioticsFactory
		.getAntibiotics()
		.then( function( data ) {

			$scope.antibiotics = data;

		} );


	// Get bacteria
	BacteriaFactory
		.getBacteria()
		.then( function( data ) {

			$scope.bacteria = data;

		} );


	// Get and calculate resistances
	ResistanceFactory
		.getResistances()
		.then( function( data ) {
			$scope.resistances = data;
		} );






	/***********************************************************************************************
	/
	/  SORT & HELPER FUNCTIONS
	/
	***********************************************************************************************/

	// I'm there to sort the antibiotics (needed by getAntibioticsSorted)
	// must be the same as antibioticResistanceSortFunction
	var antibioticSortFunction = function( a, b ) {
		return a.name > b.name;
	}

	// I'm there to sort the resistance table returned by getResistanceTable
	// must be the same as antibioticSortFunction
	var antibioticResistanceSortFunction = function( a, b ) {
		return a.antibiotic.name > b.antibiotic.name;
	}

	// I sort bacteria (getResistanceTable stuff) alphabetically for rows
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
	/  resistance TABLE 
	/
	***********************************************************************************************/


	// I return the $scope.antibiotics array, sorted alphabetically
	$scope.getAntibioticsSorted = function() {
		return $scope.antibiotics.sort( antibioticSortFunction );
	}

	// I return the $scope.bacteria, sorted by the same mechanism that sorts me for the display
	// of the resistanceMatrix. I'm needed to filter the reistencyMatrix table. 
	$scope.getBacteriaSorted = function() {
		return $scope.bacteria.sort( bacteriumSortFunction );
	}



	// I return the matrix, i.e. the table body of the resistances
	// formatted to match the matrix structure; I'm needed to output
	// the table
	$scope.getResistanceTable = function() {


		// ResistanceTable's not yet ready (data not yet gotten from server) 
		if( !$scope.resistances || $scope.resistances.length == 0 ) {
			console.error( "getResistanceTable returns empty result" );
			return [];
		}

		// I'm an array, containing «rows» of bacteria and their resistances in relation
		// to antibiotics
		//
		//	[ { bacterium: bacterium 			-- row
		//		, resistances: [ {      		-- sorted with antibioticSortFunction
		//			antibiotic: antibiotic 		-- column
		//			, value: int(0-100)
		//		} );
		//	} ] ;
		//
		//
		var ret = [];



		// Go through bacteria 
		// (and not resistances, because not all resistance data may be availalble, therefore
		// rows may be missing )
		for( var i = 0; i < $scope.bacteria.length; i++ ) {

			var bact = $scope.bacteria[ i ];


			// Create bootstrap row for this bacterium: 
			// {
			// 		bacterium 		: *bacteriumObject*
			// 		resistances 	: []
			// }
			
			var row = {
				bacterium 		: $scope.bacteria[ i ] 
				, resistances 	: []
			};


			// Push 
			//
			// {
			// 		antibiotic: *antibioticObject*
			// 		resistance: { value: *val*, type: *type* }
			// } 
			//
			// to row.resistances

			// Loop antibiotics 
			for( var j = 0; j < $scope.antibiotics.length; j++ ) {

				var ab 		= $scope.antibiotics[ j ]
					, res 	= getResistance( bact, ab );

				row.resistances.push( {
					antibiotic 		: ab
					, resistances  	: {
						value  		: res.value
						, type 		: res.type
					}
				} )
			
			}

			// Push row to return value
			ret.push( row );

		}



		// Returns the resistance object for the bacterium bact and the
		// antibiotic ab (helper function)
		function getResistance( bact, ab ) {

			for( var i = 0; i < $scope.resistances.length; i++ ) {
				var res = $scope.resistances[ i ];
				if( res.antibiotic == ab && res.bacterium == bact ) {
					return res;
				}
			}

			return {
				value 		: "0"
				, type 		: "missing"
			};

		}

		console.error( "getResistanceTable: ret before sorting: %o", ret );



		// Sort resistances
		for( var i = 0; i < ret.length; i++ ) {
			//console.error( "sort %o by .antibiotic.name", ret[ i ].resistances )
			ret[ i ].resistances.sort( antibioticResistanceSortFunction );
		}	

		console.error( "get bacterium row returns unsorted %o", ret );
		return ret.sort( bacteriumRowSortFunction );

	}


} );




