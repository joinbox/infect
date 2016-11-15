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

				var antibiotics = JSON.parse(JSON.stringify(this.antibiotics)),
				    bacteria = JSON.parse(JSON.stringify(this.bacteria));

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

		}, {
			key: '_filterBacteria',
			value: function _filterBacteria(bacteria, filters) {
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

				console.warn('ResistanceMatrixController / $onChange: resistances is %o, antibiotics %o, bacteria %o', resistances, antibiotics, bacteria);

				// Conversion 1
				var intermediateData = this._remodelMatrix(bacteria, antibiotics, resistances);
				console.log('ResistanceMatrixController / $onChanges: intermediateData is %o', intermediateData);

				// Conversion 2
				//const internalData = this._prepareMatrixForComponent(intermediateData);
				//console.log('ResistanceMatrixController / $onChanges: internalData is %o', internalData);
				var internalData = intermediateData;

				var dontUpdateScale = true;

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
							, value: null
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

					antibiotic.value = resistance.value;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2FuZ3VsYXIvaW5mZWt0L3Jlc2lzdGFuY2VNYXRyaXhDb21wb25lbnQuZXMyMDE1LmpzIl0sIm5hbWVzIjpbIlJlc2lzdGFuY2VNYXRyaXhDb250cm9sbGVyIiwiJGVsZW1lbnQiLCJjaGFuZ2VzT2JqIiwiZmlsdGVycyIsImJhY3RlcmlhIiwiYW50aWJpb3RpY3MiLCJyZXNpc3RhbmNlcyIsImxlbmd0aCIsIl91cGRhdGVWaXNpYmlsaXR5IiwiX2hhbmRsZURhdGFVcGRhdGUiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJjb25zb2xlIiwiZXJyb3IiLCJPYmplY3QiLCJlbnRyaWVzIiwiYW50aWJpb3RpYyIsIl9maWx0ZXJBbnRpYmlvdGljcyIsImJhY3Rlcml1bSIsIl9maWx0ZXJCYWN0ZXJpYSIsImxvZyIsImZpbHRlcmVkIiwia2V5cyIsImZvckVhY2giLCJmaWx0ZXJLZXkiLCJmaWx0ZXIiLCJjb250YWluZXJzIiwibWFwIiwiY29udGFpbmVyVmFsdWUiLCJpZCIsImluZGV4T2YiLCJwdXNoIiwid2FybiIsImludGVybWVkaWF0ZURhdGEiLCJfcmVtb2RlbE1hdHJpeCIsImludGVybmFsRGF0YSIsImRvbnRVcGRhdGVTY2FsZSIsIl9tYXRyaXgiLCJlbXB0eSIsImluZmVjdCIsIlJlc2lzdGVuY3lNYXRyaXgiLCJ1cGRhdGVEYXRhIiwicmVtb2RlbGVkIiwic29ydGVkQW50aWJpb3RpY3MiLCJzb3J0IiwiYSIsImIiLCJuYW1lIiwibGF0aW5OYW1lIiwicm93IiwidmFsdWUiLCJyZXNpc3RhbmNlIiwiZmluZCIsImNvbCIsIiRpbmplY3QiLCJhbmd1bGFyIiwibW9kdWxlIiwiY29tcG9uZW50IiwiY29udHJvbGxlciIsImJpbmRpbmdzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxDQUFDLFlBQU07O0FBRU47O0FBRk0sS0FJQUEsMEJBSkE7QUFNTCxzQ0FBWUMsUUFBWixFQUFzQjtBQUFBOztBQUNyQixRQUFLQSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBOztBQUlEOzs7OztBQVpLO0FBQUE7QUFBQSw4QkFlTUMsVUFmTixFQWVrQjs7QUFFdEI7QUFDQTtBQUNBLFFBQUlBLFdBQVdDLE9BQVgsSUFBdUIsS0FBS0MsUUFBTCxJQUFpQixLQUFLQyxXQUF0QixJQUFxQyxLQUFLQyxXQUFqRSxJQUFrRixLQUFLRixRQUFMLENBQWNHLE1BQWQsSUFBd0IsS0FBS0YsV0FBTCxDQUFpQkUsTUFBekMsSUFBbUQsS0FBS0QsV0FBTCxDQUFpQkMsTUFBMUosRUFBbUs7QUFDbEssVUFBS0MsaUJBQUw7QUFDQTs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxRQUFJLENBQUNOLFdBQVdJLFdBQVgsSUFBMEJKLFdBQVdFLFFBQXJDLElBQWlERixXQUFXRyxXQUE3RCxLQUE4RSxLQUFLQSxXQUFMLElBQW9CLEtBQUtELFFBQXpCLElBQXFDLEtBQUtFLFdBQXhILElBQXlJLEtBQUtELFdBQUwsQ0FBaUJFLE1BQWpCLElBQTJCLEtBQUtILFFBQUwsQ0FBY0csTUFBekMsSUFBbUQsS0FBS0QsV0FBTCxDQUFpQkMsTUFBak4sRUFBME47QUFDek47QUFDQSxVQUFLRSxpQkFBTCxDQUF1QixLQUFLSixXQUE1QixFQUF5QyxLQUFLRCxRQUE5QyxFQUF3RCxLQUFLRSxXQUE3RDtBQUNBO0FBRUQ7O0FBSUQ7Ozs7QUFuQ0s7QUFBQTtBQUFBLHVDQXNDZTs7QUFFbkIsUUFBSUQsY0FBY0ssS0FBS0MsS0FBTCxDQUFXRCxLQUFLRSxTQUFMLENBQWUsS0FBS1AsV0FBcEIsQ0FBWCxDQUFsQjtBQUFBLFFBQ0dELFdBQVdNLEtBQUtDLEtBQUwsQ0FBV0QsS0FBS0UsU0FBTCxDQUFlLEtBQUtSLFFBQXBCLENBQVgsQ0FEZDs7QUFHQVMsWUFBUUMsS0FBUixDQUFjLG1CQUFkLEVBQW1DVCxXQUFuQyxFQUFnREQsUUFBaEQsRUFBMEQsS0FBS0QsT0FBL0Q7O0FBRUEsUUFBSVksT0FBT0MsT0FBUCxDQUFlLEtBQUtiLE9BQUwsQ0FBYWMsVUFBNUIsRUFBd0NWLE1BQTVDLEVBQW9EO0FBQ25ETSxhQUFRQyxLQUFSLENBQWMsS0FBS1gsT0FBTCxDQUFhYyxVQUEzQjtBQUNBWixtQkFBYyxLQUFLYSxrQkFBTCxDQUF3QmIsV0FBeEIsRUFBcUMsS0FBS0YsT0FBTCxDQUFhYyxVQUFsRCxDQUFkO0FBQ0E7O0FBRUQsUUFBSUYsT0FBT0MsT0FBUCxDQUFlLEtBQUtiLE9BQUwsQ0FBYWdCLFNBQTVCLEVBQXVDWixNQUEzQyxFQUFtRDtBQUNsREgsZ0JBQVcsS0FBS2dCLGVBQUwsQ0FBcUJoQixRQUFyQixFQUErQixLQUFLRCxPQUFMLENBQWFnQixTQUE1QyxDQUFYO0FBQ0E7O0FBRUROLFlBQVFRLEdBQVIsQ0FBWSx5REFBWixFQUF1RWhCLFdBQXZFLEVBQW9GRCxRQUFwRjtBQUNBLFNBQUtLLGlCQUFMLENBQXVCSixXQUF2QixFQUFvQ0QsUUFBcEMsRUFBOEMsS0FBS0UsV0FBbkQ7QUFFQTs7QUFJRDs7OztBQTdESztBQUFBO0FBQUEsbUNBZ0VXRixRQWhFWCxFQWdFcUJELE9BaEVyQixFQWdFOEI7QUFDbEMsV0FBT0MsUUFBUDtBQUNBOztBQUdEOzs7OztBQXJFSztBQUFBO0FBQUEsc0NBeUVjQyxXQXpFZCxFQXlFMkJGLE9BekUzQixFQXlFb0M7O0FBRXhDLFFBQU1tQixXQUFXLEVBQWpCOztBQUVBUCxXQUFPUSxJQUFQLENBQVlwQixPQUFaLEVBQXFCcUIsT0FBckIsQ0FBNkIsVUFBQ0MsU0FBRCxFQUFlO0FBQzNDO0FBQ0F0QixhQUFRc0IsU0FBUixFQUFtQkQsT0FBbkIsQ0FBMkIsVUFBQ0UsTUFBRCxFQUFZOztBQUV0QztBQUNBO0FBQ0FyQixrQkFBWW1CLE9BQVosQ0FBb0IsVUFBQ1AsVUFBRCxFQUFnQjtBQUNuQyxXQUFJUyxPQUFPQyxVQUFQLENBQWtCQyxHQUFsQixDQUFzQixVQUFDQyxjQUFEO0FBQUEsZUFBb0JBLGVBQWVDLEVBQW5DO0FBQUEsUUFBdEIsRUFBNkRDLE9BQTdELENBQXFFZCxXQUFXYSxFQUFoRixJQUFzRixDQUFDLENBQTNGLEVBQThGO0FBQzdGUixpQkFBU1UsSUFBVCxDQUFjZixVQUFkO0FBQ0E7QUFDRCxPQUpEO0FBTUEsTUFWRDtBQVdBLEtBYkQ7O0FBZUFKLFlBQVFDLEtBQVIsQ0FBYyxjQUFkLEVBQThCUSxRQUE5QjtBQUNBLFdBQU9BLFFBQVA7QUFFQTs7QUFJRDs7Ozs7QUFuR0s7QUFBQTtBQUFBLHFDQXVHYWpCLFdBdkdiLEVBdUcwQkQsUUF2RzFCLEVBdUdvQ0UsV0F2R3BDLEVBdUdpRDs7QUFFcERPLFlBQVFvQixJQUFSLENBQWEsd0ZBQWIsRUFBdUczQixXQUF2RyxFQUFvSEQsV0FBcEgsRUFBaUlELFFBQWpJOztBQUVBO0FBQ0EsUUFBTThCLG1CQUFtQixLQUFLQyxjQUFMLENBQW9CL0IsUUFBcEIsRUFBOEJDLFdBQTlCLEVBQTJDQyxXQUEzQyxDQUF6QjtBQUNBTyxZQUFRUSxHQUFSLENBQVksaUVBQVosRUFBK0VhLGdCQUEvRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxRQUFNRSxlQUFlRixnQkFBckI7O0FBRUEsUUFBSUcsa0JBQWtCLElBQXRCOztBQUVBO0FBQ0E7QUFDQSxRQUFJLENBQUMsS0FBS0MsT0FBVixFQUFtQjtBQUNsQixVQUFLckMsUUFBTCxDQUFjc0MsS0FBZDtBQUNBLFVBQUtELE9BQUwsR0FBZSxJQUFJRSxPQUFPQyxnQkFBWCxDQUE0QixLQUFLeEMsUUFBTCxDQUFjLENBQWQsQ0FBNUIsQ0FBZjtBQUNBb0MsdUJBQWtCLEtBQWxCO0FBQ0E7QUFDRCxTQUFLQyxPQUFMLENBQWFJLFVBQWIsQ0FBd0JOLFlBQXhCLEVBQXNDLE9BQXRDLEVBQStDQyxlQUEvQztBQUVEOztBQUdEOzs7Ozs7Ozs7Ozs7Ozs7OztBQWxJSztBQUFBO0FBQUEsa0NBa0pVakMsUUFsSlYsRUFrSm9CQyxXQWxKcEIsRUFrSmlDQyxXQWxKakMsRUFrSjhDOztBQUVsRDtBQUNBLFFBQU1xQyxZQUFZLEVBQWxCOztBQUVBO0FBQ0EsUUFBTUMsb0JBQW9CdkMsWUFDeEJ3QyxJQUR3QixDQUNuQixVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxZQUFVRCxFQUFFRSxJQUFGLEdBQVNELEVBQUVDLElBQVgsR0FBa0IsQ0FBQyxDQUFuQixHQUF1QixDQUFqQztBQUFBLEtBRG1CLENBQTFCOztBQUdBO0FBQ0E1QyxhQUNFeUMsSUFERixDQUNPLFVBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFlBQVVELEVBQUVHLFNBQUYsR0FBY0YsRUFBRUUsU0FBaEIsR0FBNEIsQ0FBQyxDQUE3QixHQUFpQyxDQUEzQztBQUFBLEtBRFAsRUFFRXpCLE9BRkYsQ0FFVSxVQUFDTCxTQUFELEVBQWU7QUFDdkIsU0FBTStCLE1BQU0sRUFBWjtBQUNBTix1QkFBa0JwQixPQUFsQixDQUEwQixVQUFDUCxVQUFELEVBQWdCO0FBQ3pDaUMsVUFBSWxCLElBQUosQ0FBUztBQUNSZixtQkFBY0E7QUFDZDtBQUZRLFNBR05rQyxPQUFVO0FBSEosT0FBVDtBQUtBLE1BTkQ7QUFPQVIsZUFBVVgsSUFBVixDQUFlO0FBQ2RiLGlCQUFjQSxTQURBO0FBRVpkLG1CQUFlNkM7QUFGSCxNQUFmO0FBSUEsS0FmRjs7QUFrQkE7QUFDQTVDLGdCQUFZa0IsT0FBWixDQUFvQixVQUFDNEIsVUFBRCxFQUFnQjs7QUFFbkM7QUFDQSxTQUFNakMsWUFBWXdCLFVBQVVVLElBQVYsQ0FBZSxVQUFDSCxHQUFEO0FBQUEsYUFBU0EsSUFBSS9CLFNBQUosS0FBa0JpQyxXQUFXakMsU0FBdEM7QUFBQSxNQUFmLENBQWxCO0FBQ0EsU0FBSSxDQUFDQSxTQUFMLEVBQWdCOztBQUVoQixTQUFNRixhQUFhRSxVQUFVZCxXQUFWLENBQXNCZ0QsSUFBdEIsQ0FBMkIsVUFBQ0MsR0FBRDtBQUFBLGFBQVNBLElBQUlyQyxVQUFKLEtBQW1CbUMsV0FBV25DLFVBQXZDO0FBQUEsTUFBM0IsQ0FBbkI7QUFDQSxTQUFJLENBQUNBLFVBQUwsRUFBaUI7O0FBRWpCQSxnQkFBV2tDLEtBQVgsR0FBbUJDLFdBQVdELEtBQTlCO0FBRUEsS0FYRDs7QUFhQSxXQUFPUixTQUFQO0FBRUE7QUE5TEk7O0FBQUE7QUFBQTs7QUFtTU4zQyw0QkFBMkJ1RCxPQUEzQixHQUFxQyxDQUFDLFVBQUQsQ0FBckM7O0FBR0FDLFNBQ0NDLE1BREQsQ0FDUSxRQURSLEVBRUNDLFNBRkQsQ0FFVyxrQkFGWCxFQUUrQjtBQUM5QkMsY0FBZTNEO0FBQ2Y7QUFGOEIsSUFHNUI0RCxVQUFhO0FBQ2R0RCxnQkFBZSxHQURELENBQ0s7QUFETCxLQUVaRCxhQUFjLEdBRkY7QUFHWkQsYUFBWSxHQUhBO0FBSVpELFlBQVc7QUFKQztBQUhlLEVBRi9CO0FBYUEsQ0FuTkQiLCJmaWxlIjoianMvYW5ndWxhci9pbmZla3QvcmVzaXN0YW5jZU1hdHJpeENvbXBvbmVudC5lczIwMTUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoKCkgPT4ge1xuXG5cdC8qIGdsb2JhbCBhbmd1bGFyLCBpbmZlY3QgKi9cblxuXHRjbGFzcyBSZXNpc3RhbmNlTWF0cml4Q29udHJvbGxlciB7XG5cblx0XHRjb25zdHJ1Y3RvcigkZWxlbWVudCkge1xuXHRcdFx0dGhpcy4kZWxlbWVudCA9ICRlbGVtZW50O1xuXHRcdH1cblxuXG5cblx0XHQvKipcblx0XHQqIENoYW5nZSBoYW5kbGVyIGZvciB0aGUgY29tcG9uZW50J3MgYmluZGluZ3Ncblx0XHQqL1xuXHRcdCRvbkNoYW5nZXMoY2hhbmdlc09iaikge1xuXG5cdFx0XHQvLyBGaWx0ZXJzIGNoYW5nZWQ6IFVwZGF0ZSB2aXNpYmlsaXR5IOKAk8KgYnV0IG9ubHkgaWYgZGF0YSBpcyBhdmFpbGFibGUuIElmIGl0J3Mgbm90LCBcblx0XHRcdC8vIHRoZXJlJ3Mgbm8gbmVlZCB0byBmaWx0ZXIsIGFzIHRhYmxlIGlzIGVtcHR5LlxuXHRcdFx0aWYgKGNoYW5nZXNPYmouZmlsdGVycyAmJiAodGhpcy5iYWN0ZXJpYSAmJiB0aGlzLmFudGliaW90aWNzICYmIHRoaXMucmVzaXN0YW5jZXMpICYmICh0aGlzLmJhY3RlcmlhLmxlbmd0aCAmJiB0aGlzLmFudGliaW90aWNzLmxlbmd0aCAmJiB0aGlzLnJlc2lzdGFuY2VzLmxlbmd0aCkpIHtcblx0XHRcdFx0dGhpcy5fdXBkYXRlVmlzaWJpbGl0eSgpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBDaGFuZ2UgY29uY2VybnMgdGhlIGRhdGEgcHJvcGVydHk6XG5cdFx0XHQvLyBVcGdyYWRlIGRhdGEgdG8gaGF2ZSB0aGUgZm9ybWF0IHRoYXQgUmVzaXN0ZW5jeU1hdHJpeCByZXF1aXJlc1xuXHRcdFx0Ly8gSWdub3JlIGVtcHR5IGRhdGFcblx0XHRcdGlmICgoY2hhbmdlc09iai5yZXNpc3RhbmNlcyB8fCBjaGFuZ2VzT2JqLmJhY3RlcmlhIHx8IGNoYW5nZXNPYmouYW50aWJpb3RpY3MpICYmICh0aGlzLmFudGliaW90aWNzICYmIHRoaXMuYmFjdGVyaWEgJiYgdGhpcy5yZXNpc3RhbmNlcykgJiYgKHRoaXMuYW50aWJpb3RpY3MubGVuZ3RoICYmIHRoaXMuYmFjdGVyaWEubGVuZ3RoICYmIHRoaXMucmVzaXN0YW5jZXMubGVuZ3RoKSkge1xuXHRcdFx0XHQvLyBMZXQncyBhc3N1bWUgdGhpcyBpcyB0aGUgaW5pdGlhbCByZW5kZXJpbmcgYW5kIHdvbid0IGJlIGNhbGxlZCBhZnRlcndhcmRzXG5cdFx0XHRcdHRoaXMuX2hhbmRsZURhdGFVcGRhdGUodGhpcy5hbnRpYmlvdGljcywgdGhpcy5iYWN0ZXJpYSwgdGhpcy5yZXNpc3RhbmNlcyk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblxuXG5cdFx0LyoqXG5cdFx0KiBVcGRhdGVzIHZpc2liaWxpdHkgb2Ygcm93cyBhbmQgY29sdW1zbiB0byBtYXRjaCB0aGlzLmZpbHRlcnMuIEhhbmRsZXIgZm9yIGNoYW5nZXMgb24gdGhpcy5maWx0ZXJzLlxuXHRcdCovXG5cdFx0X3VwZGF0ZVZpc2liaWxpdHkoKSB7XG5cblx0XHRcdGxldCBhbnRpYmlvdGljcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5hbnRpYmlvdGljcykpXG5cdFx0XHRcdCwgYmFjdGVyaWEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuYmFjdGVyaWEpKTtcblxuXHRcdFx0Y29uc29sZS5lcnJvcignX3VwZGF0ZVZpc2liaWxpdHknLCBhbnRpYmlvdGljcywgYmFjdGVyaWEsIHRoaXMuZmlsdGVycyk7XG5cblx0XHRcdGlmIChPYmplY3QuZW50cmllcyh0aGlzLmZpbHRlcnMuYW50aWJpb3RpYykubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IodGhpcy5maWx0ZXJzLmFudGliaW90aWMpO1xuXHRcdFx0XHRhbnRpYmlvdGljcyA9IHRoaXMuX2ZpbHRlckFudGliaW90aWNzKGFudGliaW90aWNzLCB0aGlzLmZpbHRlcnMuYW50aWJpb3RpYyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChPYmplY3QuZW50cmllcyh0aGlzLmZpbHRlcnMuYmFjdGVyaXVtKS5sZW5ndGgpIHtcblx0XHRcdFx0YmFjdGVyaWEgPSB0aGlzLl9maWx0ZXJCYWN0ZXJpYShiYWN0ZXJpYSwgdGhpcy5maWx0ZXJzLmJhY3Rlcml1bSk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUubG9nKCdSZXNpc3RhbmNlTWF0cml4Q29udHJvbGxlcjogRmlsdGVyZWQgYWIgJW8sIGJhY3RlcmlhICVvJywgYW50aWJpb3RpY3MsIGJhY3RlcmlhKTtcblx0XHRcdHRoaXMuX2hhbmRsZURhdGFVcGRhdGUoYW50aWJpb3RpY3MsIGJhY3RlcmlhLCB0aGlzLnJlc2lzdGFuY2VzKTtcblxuXHRcdH1cblxuXG5cblx0XHQvKipcblx0XHQqIEZpbHRlcnMgYmFjdGVyaWEgKGNsb25lIGZyb20gdGhpcy5iYWN0ZXJpYSkgd2l0aCBmaWx0ZXJzIGZyb20gdGhpcy5maWx0ZXJzXG5cdFx0Ki9cblx0XHRfZmlsdGVyQmFjdGVyaWEoYmFjdGVyaWEsIGZpbHRlcnMpIHtcblx0XHRcdHJldHVybiBiYWN0ZXJpYTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogRmlsdGVycyBhbnRpYmlvdGljcyAoY2xvbmUgZnJvbSBmcm9tIHRoaXMuYW50aWJpb2NzKSB3aXRoIGZpbHRlcnMgZnJvbSBcblx0XHQqIHRoaXMuZmlsdGVyc1xuXHRcdCovXG5cdFx0X2ZpbHRlckFudGliaW90aWNzKGFudGliaW90aWNzLCBmaWx0ZXJzKSB7XG5cblx0XHRcdGNvbnN0IGZpbHRlcmVkID0gW107XG5cblx0XHRcdE9iamVjdC5rZXlzKGZpbHRlcnMpLmZvckVhY2goKGZpbHRlcktleSkgPT4ge1xuXHRcdFx0XHQvLyBHbyB0aHJvdWdoIGZpbHRlcnMgb24gYSB0eXBlLCBlLmcuIHN1YnN0YW5jZXNcblx0XHRcdFx0ZmlsdGVyc1tmaWx0ZXJLZXldLmZvckVhY2goKGZpbHRlcikgPT4ge1xuXG5cdFx0XHRcdFx0Ly8gR28gdGhyb3VnaCBhbGwgYW50aWJpb3RpY3MgYW5kIGNoZWNrIGlmIHRoZXkncmUgcGFydCBvZiBcblx0XHRcdFx0XHQvLyB0aGUgY29udGFpbmVyXG5cdFx0XHRcdFx0YW50aWJpb3RpY3MuZm9yRWFjaCgoYW50aWJpb3RpYykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGZpbHRlci5jb250YWluZXJzLm1hcCgoY29udGFpbmVyVmFsdWUpID0+IGNvbnRhaW5lclZhbHVlLmlkKS5pbmRleE9mKGFudGliaW90aWMuaWQpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0ZmlsdGVyZWQucHVzaChhbnRpYmlvdGljKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zb2xlLmVycm9yKCdmaWx0ZXJlZDogJW8nLCBmaWx0ZXJlZCk7XG5cdFx0XHRyZXR1cm4gZmlsdGVyZWQ7XG5cblx0XHR9XG5cblxuXG5cdFx0LyoqXG5cdFx0KiBDYWxsZWQgd2hlbmV2ZXIgcmVpc3RhbmNlLCBiYWN0ZXJpYSBvciBhbnRpYmlvdGljcyBjaGFuZ2U6IFxuXHRcdCogUmUtZm9ybWF0IGRhdGEgYW5kIHVwZGF0ZSBtYXRyaXhcblx0XHQqL1xuXHRcdF9oYW5kbGVEYXRhVXBkYXRlKGFudGliaW90aWNzLCBiYWN0ZXJpYSwgcmVzaXN0YW5jZXMpIHtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1Jlc2lzdGFuY2VNYXRyaXhDb250cm9sbGVyIC8gJG9uQ2hhbmdlOiByZXNpc3RhbmNlcyBpcyAlbywgYW50aWJpb3RpY3MgJW8sIGJhY3RlcmlhICVvJywgcmVzaXN0YW5jZXMsIGFudGliaW90aWNzLCBiYWN0ZXJpYSk7XG5cblx0XHRcdFx0Ly8gQ29udmVyc2lvbiAxXG5cdFx0XHRcdGNvbnN0IGludGVybWVkaWF0ZURhdGEgPSB0aGlzLl9yZW1vZGVsTWF0cml4KGJhY3RlcmlhLCBhbnRpYmlvdGljcywgcmVzaXN0YW5jZXMpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnUmVzaXN0YW5jZU1hdHJpeENvbnRyb2xsZXIgLyAkb25DaGFuZ2VzOiBpbnRlcm1lZGlhdGVEYXRhIGlzICVvJywgaW50ZXJtZWRpYXRlRGF0YSk7XG5cblx0XHRcdFx0Ly8gQ29udmVyc2lvbiAyXG5cdFx0XHRcdC8vY29uc3QgaW50ZXJuYWxEYXRhID0gdGhpcy5fcHJlcGFyZU1hdHJpeEZvckNvbXBvbmVudChpbnRlcm1lZGlhdGVEYXRhKTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnUmVzaXN0YW5jZU1hdHJpeENvbnRyb2xsZXIgLyAkb25DaGFuZ2VzOiBpbnRlcm5hbERhdGEgaXMgJW8nLCBpbnRlcm5hbERhdGEpO1xuXHRcdFx0XHRjb25zdCBpbnRlcm5hbERhdGEgPSBpbnRlcm1lZGlhdGVEYXRhO1xuXG5cdFx0XHRcdGxldCBkb250VXBkYXRlU2NhbGUgPSB0cnVlO1xuXG5cdFx0XHRcdC8vIERyYXcgbWF0cml4LCBiZWNhdXNlIGl0IGhhcyBub3QgeWV0IGJlZW4gaW5pdGlhbGl6ZWRcblx0XHRcdFx0Ly8gQWZ0ZXJ3YXJkcyBvbmx5IHVwZGF0ZSBkYXRhIGFuZCBkb24ndCBjaGFuZ2Ugc2NhbGVcblx0XHRcdFx0aWYgKCF0aGlzLl9tYXRyaXgpIHtcblx0XHRcdFx0XHR0aGlzLiRlbGVtZW50LmVtcHR5KCk7XG5cdFx0XHRcdFx0dGhpcy5fbWF0cml4ID0gbmV3IGluZmVjdC5SZXNpc3RlbmN5TWF0cml4KHRoaXMuJGVsZW1lbnRbMF0pO1xuXHRcdFx0XHRcdGRvbnRVcGRhdGVTY2FsZSA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuX21hdHJpeC51cGRhdGVEYXRhKGludGVybmFsRGF0YSwgJ3ZhbHVlJywgZG9udFVwZGF0ZVNjYWxlKTtcblxuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBUYWtlcyBiYWN0ZXJpYSwgYW50aWJpb3RpY3MgYW5kIHJlc2lzdGFuY2VzIGFuZCBjcmVhdGVzIGEgdGFibGUgY29uc2lzdGluZyBvZiBNYXBzXG5cdFx0KlxuXHRcdCoge1xuXHRcdCpcdFtiYWN0ZXJpdW1PYmplY3RdXHRcdDoge1xuXHRcdCpcdFx0W2FudGliaW90aWNPYmplY3RdXHQ6IHJlc2lzdGFuY2Vcblx0XHQqXHRcdFthbnRpYmlvdGljT2JqZWN0XVx0OiByZXNpc3RhbmNlXG5cdFx0Klx0fVxuXHRcdCogfSwge1xuXHRcdCpcdFtiYWN0ZXJpdW1PYmplY3RdXHRcdDoge1xuXHRcdCpcdFx0W2FudGliaW90aWNPYmplY3RdXHQ6IHJlc2lzdGFuY2Vcblx0XHQqXHRcdFthbnRpYmlvdGljT2JqZWN0XVx0OiByZXNpc3RhbmNlXG5cdFx0Klx0fVxuXHRcdCogfVxuXHRcdCpcblx0XHQqL1xuXHRcdF9yZW1vZGVsTWF0cml4KGJhY3RlcmlhLCBhbnRpYmlvdGljcywgcmVzaXN0YW5jZXMpIHtcblxuXHRcdFx0Ly8gTWFwIHdpdGgga2V5OiBiYWN0ZXJpdW0sIHZhbHVlOiBNYXAgd2l0aCBrZXk6IGFudGliaW90aWMsIHZhbHVlOiByZWlzdGFuY2Vcblx0XHRcdGNvbnN0IHJlbW9kZWxlZCA9IFtdO1xuXG5cdFx0XHQvLyBTb3J0IGFudGliaW90aWNzIChhcyB0aGV5IHdpbGwgYmUgcmUtdXNlZCB3aGVuIGNyZWF0aW5nIHRoZSBjb2xzKVxuXHRcdFx0Y29uc3Qgc29ydGVkQW50aWJpb3RpY3MgPSBhbnRpYmlvdGljc1xuXHRcdFx0XHQuc29ydCgoYSwgYikgPT4gYS5uYW1lIDwgYi5uYW1lID8gLTEgOiAxKTtcblxuXHRcdFx0Ly8gQ3JlYXRlIHJvd3MgKGJhY3RlcmlhKSB3aXRoIGNvbHMgKGFudGliaW90aWNzKVxuXHRcdFx0YmFjdGVyaWFcblx0XHRcdFx0LnNvcnQoKGEsIGIpID0+IGEubGF0aW5OYW1lIDwgYi5sYXRpbk5hbWUgPyAtMSA6IDEgKVxuXHRcdFx0XHQuZm9yRWFjaCgoYmFjdGVyaXVtKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3Qgcm93ID0gW107XG5cdFx0XHRcdFx0c29ydGVkQW50aWJpb3RpY3MuZm9yRWFjaCgoYW50aWJpb3RpYykgPT4ge1xuXHRcdFx0XHRcdFx0cm93LnB1c2goe1xuXHRcdFx0XHRcdFx0XHRhbnRpYmlvdGljXHRcdDogYW50aWJpb3RpY1xuXHRcdFx0XHRcdFx0XHQvLyBudWxsIGlzIHRoZSBkZWZhdWx0IHJlc2lzdGFuY2Vcblx0XHRcdFx0XHRcdFx0LCB2YWx1ZVx0XHRcdDogbnVsbFxuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0fSk7XHRcdFx0XHRcblx0XHRcdFx0XHRyZW1vZGVsZWQucHVzaCh7XG5cdFx0XHRcdFx0XHRiYWN0ZXJpdW1cdFx0XHQ6IGJhY3Rlcml1bVxuXHRcdFx0XHRcdFx0LCBhbnRpYmlvdGljc1x0XHQ6IHJvd1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblxuXG5cdFx0XHQvLyBXcml0ZSByZXNpc3RhbmNlIG9uIHZhbHVlIHByb3BlcnR5IG9mIHRoZSBtYXBwaW5nIGJldHdlZW4gYW50aWJpb3RpYyBhbmQgYmFjdGVyaXVtXG5cdFx0XHRyZXNpc3RhbmNlcy5mb3JFYWNoKChyZXNpc3RhbmNlKSA9PiB7XG5cblx0XHRcdFx0Ly8gR2V0IGJhY3Rlcml1bVxuXHRcdFx0XHRjb25zdCBiYWN0ZXJpdW0gPSByZW1vZGVsZWQuZmluZCgocm93KSA9PiByb3cuYmFjdGVyaXVtID09PSByZXNpc3RhbmNlLmJhY3Rlcml1bSk7XG5cdFx0XHRcdGlmICghYmFjdGVyaXVtKSByZXR1cm47XG5cblx0XHRcdFx0Y29uc3QgYW50aWJpb3RpYyA9IGJhY3Rlcml1bS5hbnRpYmlvdGljcy5maW5kKChjb2wpID0+IGNvbC5hbnRpYmlvdGljID09PSByZXNpc3RhbmNlLmFudGliaW90aWMpO1xuXHRcdFx0XHRpZiAoIWFudGliaW90aWMpIHJldHVybjtcblxuXHRcdFx0XHRhbnRpYmlvdGljLnZhbHVlID0gcmVzaXN0YW5jZS52YWx1ZTtcblxuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiByZW1vZGVsZWQ7XG5cblx0XHR9XG5cblx0fVxuXG5cblx0UmVzaXN0YW5jZU1hdHJpeENvbnRyb2xsZXIuJGluamVjdCA9IFsnJGVsZW1lbnQnXTtcblxuXG5cdGFuZ3VsYXJcblx0Lm1vZHVsZSgnaW5mZWt0Jylcblx0LmNvbXBvbmVudCgncmVzaXN0YW5jZU1hdHJpeCcsIHtcblx0XHRjb250cm9sbGVyXHRcdFx0OiBSZXNpc3RhbmNlTWF0cml4Q29udHJvbGxlclxuXHRcdC8vLCB0ZW1wbGF0ZVx0XHRcdDogJ3Rlc3Qge3skY3RybC5maWx0ZXJzIHzCoGpzb259fSMnXG5cdFx0LCBiaW5kaW5nc1x0XHRcdDoge1xuXHRcdFx0cmVzaXN0YW5jZXNcdFx0OiAnPCcgLy8gT25lLXdheSBmcm9tIHBhcmVudFxuXHRcdFx0LCBhbnRpYmlvdGljc1x0OiAnPCdcblx0XHRcdCwgYmFjdGVyaWFcdFx0OiAnPCdcblx0XHRcdCwgZmlsdGVyc1x0XHQ6ICc8J1xuXHRcdH1cblx0fSk7XG5cbn0pKCk7XG4iXX0=
