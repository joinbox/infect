Infekt.factory( 'ResistencyFactory', function( AntibioticsFactory, BacteriaFactory ) {

	var resistencies = [ { 
			bacterium		: BacteriaFactory.getBacteria()[ 0 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 0 ]
			, value			: 0.3
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 1 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 0 ]
			, value			: 0.1
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 2 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 0 ]
			, value			: 0.5
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 0 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 1 ]
			, value			: 0.9
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 1 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 1 ]
			, value			: 0.8
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 2 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 1 ]
			, value			: 0.4
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 0 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 2 ]
			, value			: 0.4
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 1 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 2 ]
			, value			: 0.4
		}, { 
			bacterium		: BacteriaFactory.getBacteria()[ 2 ]
			, antibiotic	: AntibioticsFactory.getAntibiotics()[ 2 ]
			, value			: 0.2
		} ];


	var factory = {};
	factory.getResistencies = function() {
		console.error( "resistencies: %o", resistencies );
		return resistencies;
	}

	return factory;

} );
