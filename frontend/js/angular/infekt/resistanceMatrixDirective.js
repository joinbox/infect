
// I'm the directive for the resistance matrix, and I do
// - create the table
// - highlight elements on hover
// - Adjust column and row visibility depending on the filters applied
// 
// All data must be loaded, before I am called
infekt.directive( "resistanceMatrix", function( $compile, FilterFactory ) {

	// Sort function for bacteria (alphabetically)
	function sortByGenus( a, b ) {
		return a.bacterium.genus + a.bacterium.species < b.bacterium.genus + b.bacterium.species ? -1 : 1;
	}

	// Sort function for antibiotics
	function sortByAntibiotic( a, b ) {
		return a.antibiotic.name < b.antibiotic.name ? -1 : 1;
	}

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
			for( var i = 0; i < data[ 0 ].resistances.sort( sortByAntibiotic ).length; i++ ) {
				table.push( "<th scope='col' class='vertical'><span>" + data[ 0 ].resistances[ i ].antibiotic.name + "</span></th>" );
			}
			table.push( "</thead></tr>" );



			//
			// table body
			//
			table.push( "<tbody>" );

			// Sort bacteria alphabetically
			data.sort( sortByGenus );

			// Go through 
			for( var i = 0; i < data.length; i++ ) {

				// Row
				table.push( "<tr>" );

				// Row title
				table.push( "<th scope='row'>" + data[ i ].bacterium.genus + " " + data[ i ].bacterium.species + "</th>" );
				
				// Cells with resistances
				var sortedResistances = data[ i ].resistances.sort( sortByAntibiotic );
				for( var j = 0; j < sortedResistances.length; j++ ) {

					var resistance 			= sortedResistances[ j ].resistances;

					var className
						, cellValue;


					// Default resistances: 
					// 1: low
					// 2: intermediate
					// 3: high
					// Only display H/L/I, but not values
					if( resistance.type === 'classResistanceDefault' || resistance.type === 'resistanceDefault' ) {
						cellValue = '';
						switch( resistance.value ) {
							case 1: 
								className = 'low';
								cellValue = 'L';
								break;
							case 2:
								className = 'intermediate';
								cellValue = 'I';
								break;
							case 3:
								className = 'high';
								cellValue = 'H';
								break;
							default:
								className = 'not-available';
						}
					}


					// Detailed values: numbers betwee 0 and 1, 
					// < 0.33: low
					// < 0.66: intermediate
					// < 1: high
					else {
	
						// Add classes to cells, depending on resistance data
						if( resistance.value === null ) {
							className	= 'not-available';
							cellValue	= '&nbsp'; // Line needs to have a certain height
						}

						else if( resistance.value < 0.33 ) {
							className	= 'low';
							cellValue	= 'L';
						}

						else if (resistance.value < 0.66 ) {
							className	= 'intermediate';
							cellValue	= 'I';
						}

						else {
							className	= 'high';
							cellValue	= 'H';
						}

					}

					table.push( "<td data-resistance-type=\'" + resistance.type + "\' data-resistance-value=\'" +  resistance.value + "\' class='animated resistance-" + className + "'>" + cellValue + "</td>" );

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
				
				
				//
				// Highlight ROW
				//

				// If on title on a row (first-child of a tr): set highlightRow to row number			
				var highlightRow = $( this ).is( ":first-child" );

				// Get row number
				var rowNr = element.find( "tr" ).index( $( this ).parent() );


				//
				// Highlight COLUMN
				//

				// If on title of a col: set highlightCol to true
				var highlightCol = $( this ).is( "th" ) && $( this ).attr( 'scope' ) == "col";

				// Get column number
				if( highlightCol ) {
					var colNr = $( ".resistanceMatrix tr:first th" ).index( $( this ) ) + 1;
				}
				else {
					var colNr = $( $( this ).closest( "tr" ).find( "td" ) ).index( $( this ) ) + 1;
				}

				console.log( "highlightRow: %o rowNr %o, highlightCol: %o colNr %o", highlightRow, rowNr, highlightCol, colNr );

				// Mouse over top left cell: Don't do anything;
				if( highlightRow === 0 || highlightCol === 0 ) {
					return true;
				}


				// Lighten all elements
				var highlightedClass = 'highlighted';

				// Remove old highlight
				element.find( "th." + highlightedClass + ", td." + highlightedClass ).removeClass( highlightedClass );

				// Highlight row
				if( highlightRow ) {
					element.find( "tr:nth-child( " + rowNr + ") td, tr:nth-child( " + rowNr + ") th" ).addClass( highlightedClass );
				}

				// Highlight col
				else if( highlightCol ) {
					element.find( "tr" ).find( "td:nth-child(" + colNr + "), th[scope='col']:nth-child(" + colNr + ")" ).addClass( highlightedClass );
				}

				// Highlight single cell
				else {
					//$( this ).css( 'opacity', 1 );
					// col title
					element.find( "th[scope='col']:nth-child(" + ( colNr + 1 ) + ")").addClass( highlightedClass );
					// row title
					element.find( "tr:nth-child(" + rowNr + ") th[scope='row']" ).addClass( highlightedClass );
				}


				// Display resistance value
				if( $( this ).is( 'td') ) {
					displayHoverValue( $( this ) );
				}


			} )
			.on( "mouseleave", 'th, td', function() {

				// Display letter (H, L, I)
				if( $( this ).is( 'td' ) ) {
					displayRegularValue( $( this ) );
				}

			} );



		/**
		* On hovering, display value (number)
		*/
		function displayHoverValue( td ) {

			var type		= td.data( 'resistanceType' )
				, value		= td.data( 'resistanceValue' );

			// Type is (class)ResistanceDefault: Don't display numbers
			if( type === 'classResistanceDefault' || type === 'resistanceDefault' ) {
				return;
			}

			td
				// Store original text (for mouseleave)
				.data( 'originalText', $( this ).text() )
				.text( $( this ).data( 'resistanceValue' ) );

		}


		/**
		* On mouseleave, display simpler value 
		*/
		function displayRegularValue( td ) {

			if( td.data( 'originalText' ) ) {
				td.text( $( this ).data( 'originalText' ) );
			}
		}




		// FILTER CHANGES
		// I listen to changes of the filter and adjust the visiblity of columns/rows
		// depending on it

		// Watch for changes of getFilters in $scope (watch deeply!); when they change, update the table
		$scope.$watch( 'getFilters()', function( newFilter, oldFilter) {
			
			// Check for type of filter that changed (bacterium, antibiotic, diagnosis) -- every change leads to a change in the length 
			// of the array, as there's no replacement option
			/*var changedFilter;
			for( var i in newFilter ) {
				console.log( countProperties( newFilter[ i ] ) );
				if( countProperties( newFilter[ i ] ) !== countProperties( oldFilter[ i ] ) ) {
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
			}*/

			// #todo
			updateColVisibility();
			updateRowVisibility();

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

			//console.error( "allAntibiotics: %o", allAntibiotics );

			var toHide = [];
			var toShow = [];

			for( var i = 0; i < allAntibiotics.length; i++ ) {

				//console.error( "check antibiotic %o", allAntibiotics[ i ].name );

				var itemVisible 	= checkItemAgainstFilters( allAntibiotics[ i ], filters ) ? "show" : "hide";
				var colNr = i + 2;

				var cells 		= $( ".resistanceMatrix" ).find( "td:nth-child(" + colNr + "), th:nth-child(" + ( colNr ) + ")" );

				cells[ itemVisible ]();

			}

		};






		// Scroll: FIX table head (add class .fixed to tableHead after scrolling too much)
		$( window ).scroll( function() {
			var tableHead 		= element.find( "thead:first" )
				, tableHeadTop 	= tableHead.offset().top - parseInt( $( "#content" ).css( 'margin-top' ), 10 )
				, scrollTop 	= $( document ).scrollTop();

			if( tableHeadTop < scrollTop ) {
				tableHead.addClass( "fixed" );
			}
			else {
				tableHead.removeClass( "fixed" );
			}

		} );







		// I check, if the item i matches filters, i.e. if it's properties and their values are the same
		// as the ones given in filters. Item is an antibiotic or a bacterium, filter is an array with items from 
		// SearchTableFactory.searchTable
		// If item matches filters, returns true. Else false.
		function checkItemAgainstFilters( item, filters ) {

			//console.log( "resistanceMatrixDirective: check if item %o matches filters %o", item, filters );

			// Loop through filter types (substance, gram etc)
			for( var type in filters ) {

				var filterType 					= filters[ type ]
					, filtersMatched 			= 0;

				// Loop through filters for each filter type
				for( var i = 0; i < filterType.length; i++ ) {

					// item is not contained in filter[ i ].containers: return false as soon as this happens, 
					// no need to continue
					// Test with $( "body").scope().getFilters().bacterium[ 0 ].containers.indexOf( $( "body" ).scope().getBacteriaSorted()[ 2 ] );

					if( filterType[ i ].containers.indexOf( item ) !== -1 ) {
						//console.log( "resistanceMatrixDirective: item %o doesnt match filter %o", item, filters[ i ] );
						filtersMatched++;
					}

				}

				// No filter matched for this type
				if( filtersMatched == 0 ) {
					return false;
				}

			}

			// item was in all filters.containers: return true
			//console.log( "resistanceMatrixDirective: item %o did match all filters %o", item, filters );
			return true;

		}





	}

	return {
		restrict: "C"
		, link	: link
	}

} );










