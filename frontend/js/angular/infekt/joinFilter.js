/* Joins items of an array by a joiner, else returns input */

infekt.filter('join', function() {
	return function( input, joiner ) {

		if( Object.prototype.toString.call( input ) === "[object Array]" ) {
			return input.join( joiner );
		}

		return input;

	};
} );