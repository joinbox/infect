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

			console.log('ResistanceMatrixController: filters are %o', this.filters);

			if (!this._data) return;



			// Filter BACTERIA
			this._data.forEach((bacterium) => {
				const match = this._matchesFilter(bacterium.bacterium, this.filters.bacterium);
				if (match) console.log('ResistanceMatrixController: Matches: %o', bacterium);
				bacterium.bacterium.hidden = !match;
			});



			// Filter ANTIBIOTICS
			const antibiotics = this._data[0].antibiotics;

			// Get indexes of all visible antibiotics; we only want to calculate the filters once
			const visibleAntibioticIndexes = [];
			antibiotics.forEach((cell, index) => {
				if (this._matchesFilter(cell.antibiotic, this.filters.antibiotic)) {
					visibleAntibioticIndexes.push(index);
				}
			});
			
			// Go through rows, then antibiotics, and update the «hidden» property on them
			this._data.forEach((row) => {
				row.antibiotics.forEach((ab, abIndex) => {
					ab.hidden = visibleAntibioticIndexes.indexOf(abIndex) > -1 ? false : true;
				});
			});



			this._matrix.updateData(this._data);


		}


		/**
		* Takes bacterium or ab as item and the corresponding filters as filters and returns true if
		* the item is part of the filters. 
		*/
		_matchesFilter(item, filters) {

			// Types of filters as array (e.g. ['gram'])
			const filterTypes = Object.keys(filters);

			// Return value – true if all filter types are matched
			let matchesAllFilters = true;

			// Loop filter types – e.g. name, gram etc.
			filterTypes.some((type) => {

				// Same type of filter: They are additional, take all values
				const filtersForType = filters[type];
				//console.log('ResistanceMatrixController: Filter by type %o', type);
					
				// Is item part of the current filter type?
				let isInFilterType = false;
				filtersForType.some((filter) => {

					// Filter is in container
					const inContainer = filter.containers.find((container) => container.id === item.id);
					isInFilterType = !!inContainer;

					// Break
					if (isInFilterType) return true;
					
				});

				if (!isInFilterType) {
					//console.log('ResistanceMatrixController: %o is not in filters %o', item, filters[type]);
					matchesAllFilters = false;
					return true;
				}

			});

			return matchesAllFilters;

		}



		/**
		* Filters bacteria (clone from this.bacteria) with filters from this.filters
		*/
		_filterBacteria(bacteria, filters) {
			console.error(filters);
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

				console.warn('ResistanceMatrixController: resistances is %o, antibiotics %o, bacteria %o', resistances, antibiotics, bacteria);

				// Conversion 1
				const intermediateData = this._remodelMatrix(bacteria, antibiotics, resistances);
				console.log('ResistanceMatrixController: intermediateData is %o', intermediateData);

				// Conversion 2
				//const internalData = this._prepareMatrixForComponent(intermediateData);
				//console.log('ResistanceMatrixController / $onChanges: internalData is %o', internalData);
				this._data = intermediateData;

				// Draw matrix, because it has not yet been initialized
				// Afterwards only update data and don't change scale
				if (!this._matrix) {

					this.$element.empty();

					// Create matrix
					this._matrix = new infect.ResistanceMatrix(this.$element[0], this._data, {
						columnHeaderTransformer				: (data) => {
								return data[0].antibiotics.map((item) => item);
							}
						, columnLabelValue					: (item) => item.antibiotic.name
						, columnHeaderIdentifier			: (item) => item.antibiotic.id
						, rowDataTransformer				: (item) => item.antibiotics
						, rowIdentifier						: (item) => item.bacterium.id
						, colorValue						: (item) => item.colorValue
						, cellLabelValue					: (item) => item.labelValue === null ? '' : item.labelValue
						, rowLabelValue						: (item) => item.bacterium.latinName
						, rowHidden							: (item) => item.bacterium.hidden
					});

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
							, colorValue	: null
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

				if (resistance.type === 'resistanceDefault') {

					switch (resistance.value) {
						case 1:
							antibiotic.colorValue = 0;
							antibiotic.labelValue = 'L';
							break;
						case 2:
							antibiotic.colorValue = 0.3;
							antibiotic.labelValue = 'I';
							break;
						case 3:
							antibiotic.colorValue = 0.7;
							antibiotic.labelValue = 'H';
							break;
						default: 
							console.error('Unknown resistance %o', resistance);
							antibiotic.colorValue = null;
							antibiotic.labelValue = null;
					}
				}

				else {
					antibiotic.colorValue = resistance.value === null ? null : resistance.value / 100;
					antibiotic.labelValue = resistance.value === null ? '' : Math.round(resistance.value) + '%';
				}

				//console.error(resistance.type, resistance.value, antibiotic.colorValue, antibiotic.labelValue);

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
