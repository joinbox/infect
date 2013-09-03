Infekt.factory( 'AntibioticsFactory', function() {

	var antibiotics = [ {
			name: "a"
			, id: 1 
			, productNames: [ "name1", "nam32" ]
			, substances: [ "substance1", "substance2" ]
			, classes: [ "class1", "class2", "class12" ]
			, iv: true
			, type: "antibiotic"
		}, {
			name: "b"
			, id: 2 
			, productNames: [ "name121", "nam3222" ]
			, substances: [ "substance122", "substance2213" ]
			, classes: [ "class1", "class2", "class1232" ]
			, po: true
			, iv: false
			, type: "antibiotic"
		}, {
			name: "c"
			, id: 3
			, productNames: [ "name121", "nam3222" ]
			, substances: [ "substance122", "substance2213" ]
			, classes: [ "class1", "class2", "class1232" ]
			, po: true
			, iv: false
			, type: "antibiotic"
		} ];

	var factory = {};

	factory.getAntibiotics = function() {
		return antibiotics;
	}

	return factory;


})