// Functionality for search auto suggestion (implements jquery autoselect)
/*$( function() {



	$( ".searchInput" ).autocomplete({

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

		// on open, add div around ul class -- see appendTo
		/*, open: function () {
			var $dropDown = $( this ).data( "autocomplete" ).menu.element.clone()
				, $dropDownContainer = $( "<div style='background-color:red'></div>" );
			
			$dropDownContainer.append( $dropDown );

			$dropDownContainer.insertAfter( ".searchInput" );
		}*/

/*		, appendTo: "#filter-suggestion-overlay"
		, select: function( ev, ui ) {

			$(this).val(''); 

			var scope = $( "body" ).scope();
			
			scope.$apply( function() {
				scope.addFilter( ui.item );
			} );

			return false;

		}
	} )
		.data( "autocomplete" )._renderItemData = function( ul, item ) {
			return $( "<li class='filter-list-item'></li>" )
				.data( "item.autocomplete", item )
				.append( "<span class='filter-item-category'>" + item.containers[ 0 ].type + " - " + item.name + "</span>" + item.value )
				.appendTo( ul )
	};



} ); */



( function() {

	$.widget("custom.searchComplete", $.ui.autocomplete, {

		_renderItem: function( ul, item ) {
			return $( "<li class='filter-list-item'></li>" )
				.append( "<a><span class='filter-item-category'>" + item.containers[ 0 ].type + " - " + item.name + "</span>" + item.value + "</a>" )
				.appendTo( ul );
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


