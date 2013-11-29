
// I'm the directive for the resistance matrix, and I do
// - create the table
// - highlight elements on hover
// - Adjust column and row visibility depending on the filters applied
// 
// All data must be loaded, before I am called
Infekt.directive( "resistanceMatrix", function( $compile, FilterFactory ) {

	function link( $scope, element, attributes ) {

		// I create the HTML code for the resistance-matrix table. 
		// Afterwards I call $compile on it and add the compiled code to 
		// the DOM (.resistanceMatrix)
		function createTable( data ) {

			console.log( "Create matrix with data %o", data );

			var table 	= [];

			//
			// create table head
			//
			table.push( "<thead><tr><th></th>" );

			// Take first row of data (bacterium; see getResistanceTable) to get antibacteria's names; take resistance
			// property that contains all antibiotics
			for( var i = 0; i < data[ 0 ].resistances.length; i++ ) {
				table.push( "<th scope='col' class='vertical'><span>" + data[ 0 ].resistances[ i ].antibiotic.name + "</span></th>" );
			}
			table.push( "</thead></tr>" );

			//
			// table body
			//
			table.push( "<tbody>" );


			// Go through 
			for( var i = 0; i < data.length; i++ ) {

				// Row
				table.push( "<tr>" );

				// Row title
				table.push( "<th scope='row'>" + data[ i ].bacterium.species + " " + data[ i ].bacterium.genus + "</th>" );
				
				// Cells with resistances
				for( var j = 0; j < data[ i ].resistances.length; j++ ) {

					var resistance 		= data[ i ].resistances[ j ].resistances.value

					// Add classes to cells, depending on resistance data
					var className 	= "bad";

					if( resistance > 0.6 ) { 
						className = "good";
					}
					else if ( resistance > 0.3 ) {
						className = "fair";
					}

					table.push( "<td class='animated resistance-" + className + "'>" + resistance + "</td>" );

				}

				table.push( "</tr>" );
			}

			table.push( "</tbody>" );


			$compile( table.join( "" ) )( $scope )
				.appendTo( $( ".resistanceMatrix" ) );

		}






		//
		// Create the table
		//

		// Redraw table every time resistances change

		// antibiotics and bacteria do not need to be watched, as changes on them automatically
		// call ResistanceFactory.getResistances()
		$scope.$watch( 'resistances', function() {

			console.log( "REDRAW table with %o", $scope.antibiotics )

			var tableContents = $scope.getResistanceTable();

			// Table can't be drawn, because there's no content: return
			if( tableContents.length == 0 ) {
				return;
			}

			createTable( tableContents );

		}, true );








		// MOUSE OVER
		// I listen to mouseovers of cells; if it happens, I determine if 
		// the user hovered a colum or row title. If he did, I highlight the whole
		// row/col, else just the single cell and it's titles (row/col).
		element.on( "mouseenter", "th, td", function() {
				
				
				// If on title on a row: set highlightRow to row number			
				var highlightRow = $( this ).is( ":first-child" );
				var rowNr = element.find( "tr" ).index( $( this ).parent() );

				// If on title on a col: set highlightCol to col number
				var highlightCol = $( this ).is( "th" );
				// Get colNr, when col is highlighted
				if( highlightCol ) {
					var colNr = $( ".resistanceMatrix th" ).index( $( this ) ) + 1;
				}
				else {
					var colNr = $( $( this ).parents( "tr:first" ).find( "td" ) ).index( $( this ) ) + 1;
				}

				//console.log( "highlightRow: %o rowNr %o, highlightCol: %o colNr %o", highlightRow, rowNr, highlightCol, colNr );

				// Mouse over top left cell: Don't do anything;
				if( highlightRow === 0 || highlightCol === 0 ) {
					return true;
				}


				// Lighten all elements
				element.find( "th, td" ).css( 'opacity', 0.3 );

				// Highlight row
				if( highlightRow ) {
					element.find( "tr:nth-child( " + rowNr + ") td, tr:nth-child( " + rowNr + ") th" ).css( 'opacity', 1 );
				}

				// Highlight col
				else if( highlightCol ) {
					element.find( "tr" ).find( "td:nth-child(" + colNr + "), th:nth-child(" + colNr + ")" ).css( 'opacity', 1 );
				}

				// Highlight single cell
				else {
					$( this ).css( 'opacity', 1 );
					element.find( "th:nth-child(" + ( colNr + 1 ) + ")").css( 'opacity', 1 );
					element.find( "tr:nth-child(" + rowNr + ") th:first" ).css( 'opacity', 1 );
				}



			} )
			.on( "mouseleave", function() {
				element.find( "th, td" ).css( 'opacity', 1 );
			} );




		// FILTER CHANGES
		// I listen to changes of the filter and adjust the visiblity of columns/rows
		// depending on it

		// Watch for changes of getFilters in $scope (watch deeply!); when they change, update the table
		$scope.$watch( 'getFilters()', function( newFilter, oldFilter) {
			
			// Check for type of filter that changed (bacterium, antibiotic, diagnosis) -- every change leads to a change in the length 
			// of the array, as there's no replacement option
			var changedFilter;
			for( var i in newFilter ) {
				console.log( newFilter[ i ].length );
				if( newFilter[ i ].length !== oldFilter[ i ].length ) {
					changedFilter = i;
					break;
				}
			}

			// Filter didn't change
			if( !changedFilter ) {
				console.error( "Filter didn't change though $watch fired: old %o vs. new %o", oldFilter, newFilter );
				return;
			}

			console.log( "resistanceMatrixDirective: filter that changed was %o, update Table", changedFilter );
			
			if( changedFilter == "bacterium" ) {
				updateRowVisibility();
			}

			else if ( changedFilter == "antibiotic" ) {
				updateColVisibility();
			}

		}, true )






	

		function updateRowVisibility() {

			// Get filters for bacteria
			var filters = FilterFactory.getFilters( 'bacterium' );

			// Loop through all bacterias – they need to have the same order that was used to create the table;
			// If they don't match filter, hide them. Else show them.
			var allBacteria = $scope.getBacteriaSorted();
			for( var i = 0; i < allBacteria.length; i++ ) {

				var itemVisible = checkItemAgainstFilters( allBacteria[ i ], filters ) ? "show" : "hide";

				// Add 1 to i for the table header row
				var row 		= element.find( "tbody tr:nth-child(" + ( i + 1 ) + ")" );

				// Call hide/show
				row[ itemVisible ]();

			}

		}



		function updateColVisibility() {

			// Get filters for bacteria
			var filters = FilterFactory.getFilters( 'antibiotic' );

			// Loop through all antibiotics – they need to have the same order that was used to create the table;
			// If they don't match filter, hide them. Else show them.
			var allAntibiotics = $scope.getAntibioticsSorted();

			console.error( "allAntibiotics: %o", allAntibiotics );

			var toHide = [];
			var toShow = [];

			for( var i = 0; i < allAntibiotics.length; i++ ) {

				console.error( "check antibiotic %o", allAntibiotics[ i ].name );

				var itemVisible 	= checkItemAgainstFilters( allAntibiotics[ i ], filters ) ? "show" : "hide";
				var colNr = i + 2;

				var cells 		= $( ".resistanceMatrix" ).find( "td:nth-child(" + colNr + "), th:nth-child(" + ( colNr ) + ")" );

				cells[ itemVisible ]();

			}

		};








		// I check, if the item i matches filters, i.e. if it's properties and their values are the same
		// as the ones given in filters. Item is an antibiotic or a bacterium, filter is an array with items from 
		// SearchTableFactory.searchTable
		function checkItemAgainstFilters( item, filters ) {

			console.log( "resistanceMatrixDirective: check if item %o matches filters %o", item, filters );

			// Loop through filter array
			for( var i = 0; i < filters.length; i++ ) {

				// item is not contained in filter[ i ].containers: return false as soon as this happens, 
				// no need to continue
				// Test with $( "body").scope().getFilters().bacterium[ 0 ].containers.indexOf( $( "body" ).scope().getBacteriaSorted()[ 2 ] );
				if( filters[ i ].containers.indexOf( item ) == -1 ) {
					console.log( "resistanceMatrixDirective: item %o doesnt match filter %o", item, filters[ i ] );
					return false;
				}
			}

			// item was in all filters.containers: return true
			console.log( "resistanceMatrixDirective: item %o did match all filters %o", item, filters );
			return true;

		}





	}

	return {
		restrict: "C"
		, link	: link
	}

} );










