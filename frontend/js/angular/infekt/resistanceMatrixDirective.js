
// I'm the directive for the resistance matrix, and I do
// - create the table
// - highlight elements on hover
// - Adjust column and row visibility depending on the filters applied
// 
// All data must be loaded, before I am called
infekt.directive( "resistanceMatrix", function( $compile, FilterFactory ) {


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
				table.push( "<th scope='col' class='vertical' data-antibiotic-id='" + data[ 0 ].resistances[ i ].antibiotic.id + "'><span>" + data[ 0 ].resistances[ i ].antibiotic.name + "</span></th>" );
			}
			table.push( "</thead></tr>" );



			//
			// table body
			//
			table.push( "<tbody>" );

			// Go through data
			// Sort is done in the controller
			for( var i = 0; i < data.length; i++ ) {

				// Row
				table.push( "<tr data-bacterium-id='" + data[ i ].bacterium.id + "'>" );

				// Row title
				table.push( "<th scope='row'>" + data[ i ].bacterium.genus + " " + data[ i ].bacterium.species + "</th>" );
				
				// Cells with resistances
				for( var j = 0; j < data[ i ].resistances.length; j++ ) {

					var resistance 			= data[ i ].resistances[ j ].resistances;

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


					// Type is missing: No data available.
					// Don't display anything at all
					else if( !resistance.type ) {

						className = 'not-available';
						cellValue = '&nbsp;';

					}


					// Detailed values: numbers betwee 0 and 1, 
					// < 0.33: low
					// < 0.66: intermediate
					// < 1: high
					else {

						//console.error( resistance );
	
						// Add classes to cells, depending on resistance data
						if( resistance.value === null ) {
							className	= 'not-available';
							cellValue	= '&nbsp'; // Gives the cell some height
						}

						else if( resistance.value < 33 ) {
							className	= 'low';
							cellValue	= 'L';
						}

						else if (resistance.value < 66 ) {
							className	= 'intermediate';
							cellValue	= 'I';
							//cellValue = resistance.value;
						}

						else {
							className	= 'high';
							cellValue	= 'H';
						}

						//console.error( cellValue );

					}

					table.push( "<td data-resistance-type=\'" + resistance.type + "\' data-resistance-value=\'" +  resistance.value + "\' class='animated resistance-" + className + "'>" + cellValue + "</td>" );

				}

				table.push( "</tr>" );
			}

			table.push( "</tbody>" );


			$compile( table.join( "" ) )( $scope )
				.appendTo( $( ".resistanceMatrix" ) );

			// Make thead sticky
			//$( '.resistanceMatrix' ).floatThead();

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

				//console.log( "highlightRow: %o rowNr %o, highlightCol: %o colNr %o", highlightRow, rowNr, highlightCol, colNr );

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
					element.find( "tbody tr:nth-child( " + rowNr + ") td, tbody tr:nth-child( " + rowNr + ") th" ).addClass( highlightedClass );
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

			//console.error( '%o - %o', type, value );

			// Type is (class)ResistanceDefault: Don't display numbers
			if( type === 'classResistanceDefault' || type === 'resistanceDefault' || type === 'undefined' ) {
				return;
			}

			td
				// Store original text (for mouseleave)
				.data( 'originalText', td.text() )
				.text( value );

		}


		/**
		* On mouseleave, display simpler value 
		*/
		function displayRegularValue( td ) {
			if( td.data( 'originalText' ) ) {
				td.text( td.data( 'originalText' ) );
				td.removeData( 'originalText' );
			}
		}




		// FILTER CHANGES
		// I listen to changes of the filter and adjust the visiblity of columns/rows
		// depending on it

		// Watch for changes of getFilters in $scope (watch deeply!); when they change, update the table
		$scope.$watch( 'getFilters()', function( newFilter, oldFilter) {
			
			updateColVisibility();
			updateRowVisibility();

		}, true )






	

		function updateRowVisibility() {

			// Get filters for ba	cteria
			var filters = FilterFactory.getFilters( 'bacterium' );

			console.log( 'Bacteria filters: %o', filters );

			// Loop through all bacterias – they need to have the same order that was used to create the table;
			// If they don't match filter, hide them. Else show them.
			var allBacteria = $scope.getBacteriaSorted();
			for( var i = 0; i < allBacteria.length; i++ ) {

				var itemVisible = checkItemAgainstFilters( allBacteria[ i ], filters ) ? "show" : "hide";

				// Add 1 to i for the table header row
				var row 		= element.find( "tbody tr[data-bacterium-id='" + allBacteria[ i ].id + "']" );

				row[ itemVisible ]();

			}

		}



		function updateColVisibility() {

			// Get filters for bacteria
			var filters = FilterFactory.getFilters( 'antibiotic' );

			// Loop through all antibiotics – they need to have the same order that was used to create the table;
			// If they don't match filter, hide them. Else show them.
			var allAntibiotics = $scope.getAntibioticsSorted();

			var toHide = [];
			var toShow = [];

			for( var i = 0; i < allAntibiotics.length; i++ ) {

				// Check if current item should be visible or not
				var itemVisible 	= checkItemAgainstFilters( allAntibiotics[ i ], filters ) ? "show" : "hide";

				// Get column number for current antibiotic
				var colNr			= $( '.resistanceMatrix thead [data-antibiotic-id=\'' + allAntibiotics[ i ].id + '\'' ).index();

				console.error( colNr );

				// Get all cells of current antibiotic; index is 0-based, nth-child not
				var cells 			= $( ".resistanceMatrix" ).find( "td:nth-child(" + ( colNr + 1 ) + "), th:nth-child(" + ( ( colNr + 1 ) ) + ")" );

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







		/**
		* I check, if the item i matches filters, i.e. if it's properties and their values are the same
		* as the ones given in filters. 
		*
		* @param item			antibiotic or bacterium
		* @param filter			Array with items from SearchTableFactory.searchTable
		*
		* @return <Boolean>		true if item matches filter, else false
		*/
		function checkItemAgainstFilters( item, filters ) {

			console.log( "resistanceMatrixDirective: check if item %o matches filters %o", item, filters );


			// For this type of item (bacteria or antibiotic) no filters were chosen, i.e. filter object has no properties: 
			// There's nothing to hide, just return true
			var filterPropertyCount = 0; 
			for( var i in filters ) {
				filterPropertyCount++;
			}
			if( filterPropertyCount == 0 ) {
				return true;
			}


			// Loop through filter types (substance, gram etc) – contains multiple results for that type of filter
			for( var type in filters ) {

				var filterType 					= filters[ type ]

					// Number of filters that have matched for this type; if type is gram and value is 1 or 0, 
					// and bacterium is gram+, filtersMatched will be 1
					, filtersMatched 			= 0;

				// Loop through filters for each filter type
				for( var i = 0; i < filterType.length; i++ ) {

					//console.error( "is match? %o %o %o %o", item.genus, filterType[ i ].containers.indexOf( item ), item );

					if( filterType[ i ].containers.indexOf( item ) !== -1 ) {
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










