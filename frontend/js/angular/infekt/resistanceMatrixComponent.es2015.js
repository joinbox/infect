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
				// Let's assume this is the initial rendering and won't be called afterwards
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
				//const internalData = this._prepareMatrixForComponent(intermediateData);
				//console.log('ResistanceMatrixController / $onChanges: internalData is %o', internalData);
				const internalData = intermediateData;

				let dontUpdateScale = true;

				// Draw matrix, because it has not yet been initialized
				// Afterwards only update data and don't change scale
				if (!this._matrix) {
					this.$element.empty();
					this._matrix = new infect.ResistencyMatrix(this.$element[0]);
					dontUpdateScale = false;
				}
				this._matrix.updateData(internalData, 'value', dontUpdateScale);

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
			const remodeled = [];

			// Sort antibiotics (as they will be re-used when creating the cols)
			const sortedAntibiotics = antibiotics
				.sort((a, b) => a.name < b.name ? -1 : 1);

			// Create rows (bacteria) with cols (antibiotics)
			bacteria
				.sort((a, b) => a.latinName < b.latinName ? -1 : 1 )
				.forEach((bacterium) => {
					const row = [];
					sortedAntibiotics.forEach((antibiotic) => {
						row.push({
							antibiotic		: antibiotic
							// null is the default resistance
							, value			: null
						});
					});				
					remodeled.push({
						bacterium			: bacterium
						, antibiotics		: row
					});
				});


			// Write resistance on value property of the mapping between antibiotic and bacterium
			resistances.forEach((resistance) => {

				// Get bacterium
				const bacterium = remodeled.find((row) => row.bacterium === resistance.bacterium);
				if (!bacterium) return;

				const antibiotic = bacterium.antibiotics.find((col) => col.antibiotic === resistance.antibiotic);
				if (!antibiotic) return;

				antibiotic.value = resistance.value;

			});

			return remodeled;

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
