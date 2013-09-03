// I contain all the bacteria
Infekt.factory( 'BacteriaFactory', function() {

	var bacteria = [ {
			name: "one"
			, id: 1 
			, ltainName: "teas klsdjf lkj flös"
			, species: "spec-34afd"
			, genus: "genus-dfjdsf"
			, shape: "kugel"
			, aerobic: true
			, gram: "gram+"
			, type: "bacterium"
		}, {
			name: "two"
			, id: 2 
			, ltainName: "latin sdkjf lkfjs"
			, species: "spec-34afd"
			, genus: "genus-asd"
			, shape: "eckig"
			, aerobic: true
			, anaerobicOptional: true
			, gram: "other"
			, type: "bacterium"
		}, {
			name: "tree"
			, id: 3
			, ltainName: "sadfk kj fkjokl"
			, species: "spec-asdfkfe"
			, genus: "genus-23412"
			, shape: "stab"
			, aerobic: false
			, anaerobic: true
			, gram: "gram-"
			, type: "bacterium"
		} ]

	var factory = {};
	factory.getBacteria = function() {
		return bacteria;
	}

	return factory;

} );

