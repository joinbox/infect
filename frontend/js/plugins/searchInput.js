// Functionality for search auto suggestion (implements jquery autoselect)



( function() {

	$.widget("custom.searchComplete", $.ui.autocomplete, {

		// Render item specificially
		_renderItem: function( ul, item ) {
			return $( "<li class='filter-list-item'></li>" )
				.append( "<a><span class='filter-item-category'>" + item.humanName + "</span>" + item.humanValue + "</a>" )
				.appendTo( ul );
		}

		// Add class to ul 
		, _renderMenu: function( ul, items ) {
			var that = this;
			$.each( items, function( index, item ) {
				that._renderItemData( ul, item );
			} );
			ul.addClass( 'flat-list filter-suggestion-list' );
		}

	});









	$( function() {



		$( ".searchInput" ).searchComplete({

			// ! All objects in the array need to have a «value» property or jQuery UI will break bad.
			source: function( request, response ) {
				var term = request.term
					, results = $( "body" ).scope().filterSearchList( term );
				console.error( "results for searchInput: %o", results );
				response( results );
			}
			, delay: 0
			, autoFocus: true // focus first item
			, messages: {
				noResults: ""
				, results: function() {}
			}
			, appendTo: "#filter-suggestion-overlay"
			, select: function( ev, ui ) {

				$(this).val(''); 

				var scope = $( "body" ).scope();
				
				scope.$apply( function() {
					scope.addFilter( ui.item );
				} );

				return false;

			}
		} );

	} ); 

} )();


