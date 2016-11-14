(() => {

	/* global angular, infect */

	class ResistanceMatrixController {

		constructor($element) {
			this.$element = $element;
		}



		/**
		* Change handler for the component's bindings
		*/
		$onChanges(changesObj) {

			// Filters changed: Update visibility – but only if data is available. If it's not, 
			// there's no need to filter, as table is empty.
			if (changesObj.filters && (this.bacteria && this.antibiotics && this.resistances) && (this.bacteria.length && this.antibiotics.length && this.resistances.length)) {
				this._updateVisibility();
			}

			// Change concerns the data property:
			// Upgrade data to have the format that ResistencyMatrix requires
			// Ignore empty data
			if ((changesObj.resistances || changesObj.bacteria || changesObj.antibiotics) && (this.antibiotics && this.bacteria && this.resistances) && (this.antibiotics.length && this.bacteria.length && this.resistances.length)) {
				this._handleDataUpdate(this.antibiotics, this.bacteria, this.resistances);
			}

		}



		/**
		* Updates visibility of rows and columsn to match this.filters. Handler for changes on this.filters.
		*/
		_updateVisibility() {

			let antibiotics = JSON.parse(JSON.stringify(this.antibiotics))
				, bacteria = JSON.parse(JSON.stringify(this.bacteria));

			console.error('_updateVisibility', antibiotics, bacteria, this.filters);

			if (Object.entries(this.filters.antibiotic).length) {
				console.error(this.filters.antibiotic);
				antibiotics = this._filterAntibiotics(antibiotics, this.filters.antibiotic);
			}

			if (Object.entries(this.filters.bacterium).length) {
				bacteria = this._filterBacteria(bacteria, this.filters.bacterium);
			}

			console.log('ResistanceMatrixController: Filtered ab %o, bacteria %o', antibiotics, bacteria);
			this._handleDataUpdate(antibiotics, bacteria, this.resistances);

		}



		/**
		* Filters bacteria (clone from this.bacteria) with filters from this.filters
		*/
		_filterBacteria(bacteria, filters) {
			return bacteria;
		}


		/**
		* Filters antibiotics (clone from from this.antibiocs) with filters from 
		* this.filters
		*/
		_filterAntibiotics(antibiotics, filters) {

			const filtered = [];

			Object.keys(filters).forEach((filterKey) => {
				// Go through filters on a type, e.g. substances
				filters[filterKey].forEach((filter) => {

					// Go through all antibiotics and check if they're part of 
					// the container
					antibiotics.forEach((antibiotic) => {
						if (filter.containers.map((containerValue) => containerValue.id).indexOf(antibiotic.id) > -1) {
							filtered.push(antibiotic);
						}
					});

				});
			});

			console.error('filtered: %o', filtered);
			return filtered;

		}



		/**
		* Called whenever reistance, bacteria or antibiotics change: 
		* Re-format data and update matrix
		*/
		_handleDataUpdate(antibiotics, bacteria, resistances) {

				console.warn('ResistanceMatrixController / $onChange: resistances is %o, antibiotics %o, bacteria %o', resistances, antibiotics, bacteria);

				// Conversion 1
				const intermediateData = this._remodelMatrix(bacteria, antibiotics, resistances);
				console.log('ResistanceMatrixController / $onChanges: intermediateData is %o', intermediateData);

				// Conversion 2
				const internalData = this._prepareMatrixForComponent(intermediateData);
				console.log('ResistanceMatrixController / $onChanges: internalData is %o', internalData);

				// Draw matrix
				this.$element.empty();
				const matrix = new infect.ResistencyMatrix(this.$element[0]);
				matrix.updateData(internalData, 'value');

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
				// We must find the key by its ID as we're working on pseudo-immutable data
				const matchedBacteriumKey = Array.from(remodeled.keys()).find((bacterium) => bacterium.id === resistance.bacterium.id);
				if (!matchedBacteriumKey) return;
				const matchedBacterium = remodeled.get(matchedBacteriumKey);
				const antibioticKey = Array.from(matchedBacterium.keys()).find((antibiotic) => antibiotic.id === resistance.antibiotic.id);
				if (!antibioticKey) return;
				matchedBacterium.set(antibioticKey, resistance.value);
				//if (bacterium) bacterium.set(resistance.antibiotic, resistance.value);
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
		controller			: ResistanceMatrixController
		//, template			: 'test {{$ctrl.filters | json}}#'
		, bindings			: {
			resistances		: '<' // One-way from parent
			, antibiotics	: '<'
			, bacteria		: '<'
			, filters		: '<'
		}
	});

})();
