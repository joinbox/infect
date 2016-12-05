'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

	/* global angular, infect */

	var ResistanceMatrixController = function () {
		function ResistanceMatrixController($element) {
			_classCallCheck(this, ResistanceMatrixController);

			this.$element = $element;
		}

		/**
  * Change handler for the component's bindings
  */


		_createClass(ResistanceMatrixController, [{
			key: '$onChanges',
			value: function $onChanges(changesObj) {

				// Filters changed: Update visibility – but only if data is available. If it's not, 
				// there's no need to filter, as table is empty.
				if (changesObj.filters && this.bacteria && this.antibiotics && this.resistances && this.bacteria.length && this.antibiotics.length && this.resistances.length) {
					this._updateVisibility();
				}

				// Change concerns the data property:
				// Upgrade data to have the format that ResistencyMatrix requires
				// Ignore empty data
				if ((changesObj.resistances || changesObj.bacteria || changesObj.antibiotics) && this.antibiotics && this.bacteria && this.resistances && this.antibiotics.length && this.bacteria.length && this.resistances.length) {
					// Let's assume this is the initial rendering and won't be called afterwards
					this._handleDataUpdate(this.antibiotics, this.bacteria, this.resistances);
				}
			}

			/**
   * Updates visibility of rows and columsn to match this.filters. Handler for changes on this.filters.
   */

		}, {
			key: '_updateVisibility',
			value: function _updateVisibility() {
				var _this = this;

				console.log('ResistanceMatrixController: filters are %o', this.filters);

				if (!this._data) return;

				// Filter BACTERIA
				this._data.forEach(function (bacterium) {
					var match = _this._matchesFilter(bacterium.bacterium, _this.filters.bacterium);
					if (match) console.log('ResistanceMatrixController: Matches: %o', bacterium);
					bacterium.bacterium.hidden = !match;
				});

				// Filter ANTIBIOTICS
				var antibiotics = this._data[0].antibiotics;

				// Get indexes of all visible antibiotics; we only want to calculate the filters once
				var visibleAntibioticIndexes = [];
				antibiotics.forEach(function (cell, index) {
					if (_this._matchesFilter(cell.antibiotic, _this.filters.antibiotic)) {
						visibleAntibioticIndexes.push(index);
					}
				});

				// Go through rows, then antibiotics, and update the «hidden» property on them
				this._data.forEach(function (row) {
					row.antibiotics.forEach(function (ab, abIndex) {
						ab.hidden = visibleAntibioticIndexes.indexOf(abIndex) > -1 ? false : true;
					});
				});

				this._matrix.updateData(this._data);
			}

			/**
   * Takes bacterium or ab as item and the corresponding filters as filters and returns true if
   * the item is part of the filters. 
   */

		}, {
			key: '_matchesFilter',
			value: function _matchesFilter(item, filters) {

				// Types of filters as array (e.g. ['gram'])
				var filterTypes = Object.keys(filters);

				// Return value – true if all filter types are matched
				var matchesAllFilters = true;

				// Loop filter types – e.g. name, gram etc.
				filterTypes.some(function (type) {

					// Same type of filter: They are additional, take all values
					var filtersForType = filters[type];
					//console.log('ResistanceMatrixController: Filter by type %o', type);

					// Is item part of the current filter type?
					var isInFilterType = false;
					filtersForType.some(function (filter) {

						// Filter is in container
						var inContainer = filter.containers.find(function (container) {
							return container.id === item.id;
						});
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

		}, {
			key: '_filterBacteria',
			value: function _filterBacteria(bacteria, filters) {
				console.error(filters);
				return bacteria;
			}

			/**
   * Filters antibiotics (clone from from this.antibiocs) with filters from 
   * this.filters
   */

		}, {
			key: '_filterAntibiotics',
			value: function _filterAntibiotics(antibiotics, filters) {

				var filtered = [];

				Object.keys(filters).forEach(function (filterKey) {
					// Go through filters on a type, e.g. substances
					filters[filterKey].forEach(function (filter) {

						// Go through all antibiotics and check if they're part of 
						// the container
						antibiotics.forEach(function (antibiotic) {
							if (filter.containers.map(function (containerValue) {
								return containerValue.id;
							}).indexOf(antibiotic.id) > -1) {
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

		}, {
			key: '_handleDataUpdate',
			value: function _handleDataUpdate(antibiotics, bacteria, resistances) {

				console.warn('ResistanceMatrixController: resistances is %o, antibiotics %o, bacteria %o', resistances, antibiotics, bacteria);

				// Conversion 1
				var intermediateData = this._remodelMatrix(bacteria, antibiotics, resistances);
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
						columnHeaderTransformer: function columnHeaderTransformer(data) {
							return data[0].antibiotics.map(function (item) {
								return item;
							});
						},
						columnLabelValue: function columnLabelValue(item) {
							return item.antibiotic.name;
						},
						columnHeaderIdentifier: function columnHeaderIdentifier(item) {
							return item.antibiotic.id;
						},
						rowDataTransformer: function rowDataTransformer(item) {
							return item.antibiotics;
						},
						rowIdentifier: function rowIdentifier(item) {
							return item.bacterium.id;
						},
						colorValue: function colorValue(item) {
							return item.colorValue;
						},
						cellLabelValue: function cellLabelValue(item) {
							return item.labelValue === null ? '' : item.labelValue;
						},
						rowLabelValue: function rowLabelValue(item) {
							return item.bacterium.latinName;
						},
						rowHidden: function rowHidden(item) {
							return item.bacterium.hidden;
						}
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

		}, {
			key: '_remodelMatrix',
			value: function _remodelMatrix(bacteria, antibiotics, resistances) {

				// Map with key: bacterium, value: Map with key: antibiotic, value: reistance
				var remodeled = [];

				// Sort antibiotics (as they will be re-used when creating the cols)
				var sortedAntibiotics = antibiotics.sort(function (a, b) {
					return a.name < b.name ? -1 : 1;
				});

				// Create rows (bacteria) with cols (antibiotics)
				bacteria.sort(function (a, b) {
					return a.latinName < b.latinName ? -1 : 1;
				}).forEach(function (bacterium) {
					var row = [];
					sortedAntibiotics.forEach(function (antibiotic) {
						row.push({
							antibiotic: antibiotic
							// null is the default resistance
							, colorValue: null
						});
					});
					remodeled.push({
						bacterium: bacterium,
						antibiotics: row
					});
				});

				// Write resistance on value property of the mapping between antibiotic and bacterium
				resistances.forEach(function (resistance) {

					// Get bacterium
					var bacterium = remodeled.find(function (row) {
						return row.bacterium === resistance.bacterium;
					});
					if (!bacterium) return;

					var antibiotic = bacterium.antibiotics.find(function (col) {
						return col.antibiotic === resistance.antibiotic;
					});
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
					} else {
						antibiotic.colorValue = resistance.value === null ? null : resistance.value / 100;
						antibiotic.labelValue = resistance.value === null ? '' : Math.round(resistance.value) + '%';
					}

					//console.error(resistance.type, resistance.value, antibiotic.colorValue, antibiotic.labelValue);
				});

				return remodeled;
			}
		}]);

		return ResistanceMatrixController;
	}();

	ResistanceMatrixController.$inject = ['$element'];

	angular.module('infekt').component('resistanceMatrix', {
		controller: ResistanceMatrixController
		//, template			: 'test {{$ctrl.filters | json}}#'
		, bindings: {
			resistances: '<' // One-way from parent
			, antibiotics: '<',
			bacteria: '<',
			filters: '<'
		}
	});
})();
//# sourceMappingURL=resistanceMatrixComponent.es2015.js.map
