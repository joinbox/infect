(() => {

	/* global angular, infect */

	class ResistanceMatrixController {

		constructor($element) {
			this.$element = $element;
		}

		$onChanges(changesObj) {
			
			// Concerns the data property:
			// Upgrade data to have the format that ResistencyMatrix requires
			if ((changesObj.resistances || changesObj.bacteria || changesObj.antibiotics) && (this.antibiotics && this.bacteria && this.resistances) && (this.antibiotics.length && this.bacteria.length && this.resistances.length)) {
				
				console.warn('ResistanceMatrixController / $onChange: resistances is %o, antibiotics %o, bacteria %o', this.resistances, this.antibiotics, this.bacteria);

				// Conversion 1
				const intermediateData = this._remodelMatrix(this.bacteria, this.antibiotics, this.resistances);
				console.log('ResistanceMatrixController / $onChanges: intermediateData is %o', intermediateData);

				// Conversion 2
				this.internalData = this._prepareMatrixForComponent(intermediateData);
				console.log('ResistanceMatrixController / $onChanges: internalData is %o', this.internalData);

				// Draw matrix
				this.$element.empty();
				const matrix = new infect.ResistencyMatrix(this.$element[0]);
				matrix.updateData(this.internalData, 'value');

			}

		}


		/**
		* Takes bacteria, antibiotics and resistances and creates a table consisting of Maps
		*
		* {
		*	[bacteriumObject]		: {
		*		[antibioticObject]	: resistance
		*		[antibioticObject]	: resistance
		*	}
		* }, {
		*	[bacteriumObject]		: {
		*		[antibioticObject]	: resistance
		*		[antibioticObject]	: resistance
		*	}
		* }
		*
		*/
		_remodelMatrix(bacteria, antibiotics, resistances) {

			// Map with key: bacterium, value: Map with key: antibiotic, value: reistance
			const remodeled = new Map();

			// Sort antibiotics (as they will be re-used when creating the cols)
			const sortedAntibiotics = antibiotics
				.sort((a, b) => a.name < b.name ? -1 : 1);

			// Create rows (bacteria) with cols (antibiotics)
			bacteria
				.sort((a, b) => a.name < b.name ? -1 : 1 )
				.forEach((bacterium) => {
					const map = new Map();
					sortedAntibiotics.forEach((antibiotic) => {
						map.set(antibiotic, null); // null is the default resistance
					});				
					remodeled.set(bacterium, map);
				});

			// Set resistances on the remodeled row
			resistances.forEach((resistance) => {
				remodeled.get(resistance.bacterium).set(resistance.antibiotic, resistance.value / 10);
			});

			return remodeled;

		}



		/**
		* Takes the matrx returned by _remodelMatrix, prepares it to be used with 
		* ResistencyMatrix, i.e.
		* {
		* 	bact1Name		: {
		*		ab1Name		: {data}
		*		, ab2Name	: {data}
		* }, {
		* 	bact2Name		: {
		*		ab1Name		: {data}
		*		, ab2Name	: {data}
		*	}
		* }
		*
		* where {data} at least contains a value (0-1)
		*/
		_prepareMatrixForComponent(data) {
			const ret = {};
			data.forEach((rowValue, rowKey) => {
				const col = {};
				rowValue.forEach((colValue, colKey) => {
					col[colKey.name] = { value: colValue };
				});
				ret[rowKey.latinName] = col;
			});
			return ret;
		}

	}


	ResistanceMatrixController.$inject = ['$element'];


	angular
	.module('infekt')
	.component('resistanceMatrix', {
		templateUrl			: '/js/angular/infekt/resistanceMatrixTemplate.html'
		, controller		: ResistanceMatrixController
		, bindings			: {
			resistances		: '<' // One-way from parent
			, antibiotics	: '<'
			, bacteria		: '<'
		}
	});

})();
