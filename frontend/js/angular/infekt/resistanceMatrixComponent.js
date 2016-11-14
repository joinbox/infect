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
				var internalData = this._prepareMatrixForComponent(intermediateData);
				console.log('ResistanceMatrixController / $onChanges: internalData is %o', internalData);

				// Draw matrix
				this.$element.empty();
				var matrix = new infect.ResistencyMatrix(this.$element[0]);
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

		}, {
			key: '_remodelMatrix',
			value: function _remodelMatrix(bacteria, antibiotics, resistances) {

				// Map with key: bacterium, value: Map with key: antibiotic, value: reistance
				var remodeled = new Map();

				// Sort antibiotics (as they will be re-used when creating the cols)
				var sortedAntibiotics = antibiotics.sort(function (a, b) {
					return a.name < b.name ? -1 : 1;
				});

				// Create rows (bacteria) with cols (antibiotics)
				bacteria.sort(function (a, b) {
					return a.name < b.name ? -1 : 1;
				}).forEach(function (bacterium) {
					var map = new Map();
					sortedAntibiotics.forEach(function (antibiotic) {
						map.set(antibiotic, null); // null is the default resistance
					});
					remodeled.set(bacterium, map);
				});

				// Set resistances on the remodeled row
				resistances.forEach(function (resistance) {
					// We must find the key by its ID as we're working on pseudo-immutable data
					var matchedBacteriumKey = Array.from(remodeled.keys()).find(function (bacterium) {
						return bacterium.id === resistance.bacterium.id;
					});
					if (!matchedBacteriumKey) return;
					var matchedBacterium = remodeled.get(matchedBacteriumKey);
					var antibioticKey = Array.from(matchedBacterium.keys()).find(function (antibiotic) {
						return antibiotic.id === resistance.antibiotic.id;
					});
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

		}, {
			key: '_prepareMatrixForComponent',
			value: function _prepareMatrixForComponent(data) {
				var ret = {};
				data.forEach(function (rowValue, rowKey) {
					var col = {};
					rowValue.forEach(function (colValue, colKey) {
						col[colKey.name] = { value: colValue };
					});
					ret[rowKey.latinName] = col;
				});
				return ret;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2FuZ3VsYXIvaW5mZWt0L3Jlc2lzdGFuY2VNYXRyaXhDb21wb25lbnQuZXMyMDE1LmpzIl0sIm5hbWVzIjpbIlJlc2lzdGFuY2VNYXRyaXhDb250cm9sbGVyIiwiJGVsZW1lbnQiLCJjaGFuZ2VzT2JqIiwiZmlsdGVycyIsImJhY3RlcmlhIiwiYW50aWJpb3RpY3MiLCJyZXNpc3RhbmNlcyIsImxlbmd0aCIsIl91cGRhdGVWaXNpYmlsaXR5IiwiX2hhbmRsZURhdGFVcGRhdGUiLCJKU09OIiwicGFyc2UiLCJzdHJpbmdpZnkiLCJjb25zb2xlIiwiZXJyb3IiLCJPYmplY3QiLCJlbnRyaWVzIiwiYW50aWJpb3RpYyIsIl9maWx0ZXJBbnRpYmlvdGljcyIsImJhY3Rlcml1bSIsIl9maWx0ZXJCYWN0ZXJpYSIsImxvZyIsImZpbHRlcmVkIiwia2V5cyIsImZvckVhY2giLCJmaWx0ZXJLZXkiLCJmaWx0ZXIiLCJjb250YWluZXJzIiwibWFwIiwiY29udGFpbmVyVmFsdWUiLCJpZCIsImluZGV4T2YiLCJwdXNoIiwid2FybiIsImludGVybWVkaWF0ZURhdGEiLCJfcmVtb2RlbE1hdHJpeCIsImludGVybmFsRGF0YSIsIl9wcmVwYXJlTWF0cml4Rm9yQ29tcG9uZW50IiwiZW1wdHkiLCJtYXRyaXgiLCJpbmZlY3QiLCJSZXNpc3RlbmN5TWF0cml4IiwidXBkYXRlRGF0YSIsInJlbW9kZWxlZCIsIk1hcCIsInNvcnRlZEFudGliaW90aWNzIiwic29ydCIsImEiLCJiIiwibmFtZSIsInNldCIsInJlc2lzdGFuY2UiLCJtYXRjaGVkQmFjdGVyaXVtS2V5IiwiQXJyYXkiLCJmcm9tIiwiZmluZCIsIm1hdGNoZWRCYWN0ZXJpdW0iLCJnZXQiLCJhbnRpYmlvdGljS2V5IiwidmFsdWUiLCJkYXRhIiwicmV0Iiwicm93VmFsdWUiLCJyb3dLZXkiLCJjb2wiLCJjb2xWYWx1ZSIsImNvbEtleSIsImxhdGluTmFtZSIsIiRpbmplY3QiLCJhbmd1bGFyIiwibW9kdWxlIiwi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QUFBLGFBQWdCQSxXQUFXYSxFQUFYLEtBQWtCcUIsV0FBV2xDLFVBQVgsQ0FBc0JhLEVBQXhEO0FBQUEsTUFBekMsQ0FBdEI7QUFDQSxTQUFJLENBQUM0QixhQUFMLEVBQW9CO0FBQ3BCRixzQkFBaUJOLEdBQWpCLENBQXFCUSxhQUFyQixFQUFvQ1AsV0FBV1EsS0FBL0M7QUFDQTtBQUNBLEtBVEQ7O0FBV0EsV0FBT2hCLFNBQVA7QUFFQTs7QUFJRDs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFoTEs7QUFBQTtBQUFBLDhDQWdNc0JpQixJQWhNdEIsRUFnTTRCO0FBQ2hDLFFBQU1DLE1BQU0sRUFBWjtBQUNBRCxTQUFLcEMsT0FBTCxDQUFhLFVBQUNzQyxRQUFELEVBQVdDLE1BQVgsRUFBc0I7QUFDbEMsU0FBTUMsTUFBTSxFQUFaO0FBQ0FGLGNBQVN0QyxPQUFULENBQWlCLFVBQUN5QyxRQUFELEVBQVdDLE1BQVgsRUFBc0I7QUFDdENGLFVBQUlFLE9BQU9qQixJQUFYLElBQW1CLEVBQUVVLE9BQU9NLFFBQVQsRUFBbkI7QUFDQSxNQUZEO0FBR0FKLFNBQUlFLE9BQU9JLFNBQVgsSUFBd0JILEdBQXhCO0FBQ0EsS0FORDtBQU9BLFdBQU9ILEdBQVA7QUFDQTtBQTFNSTs7QUFBQTtBQUFBOztBQStNTjdELDRCQUEyQm9FLE9BQTNCLEdBQXFDLENBQUMsVUFBRCxDQUFyQzs7QUFHQUMsU0FDQ0MsTUFERCxDQUNRLFFBRFIsRUFFQ0MsU0FGRCxDQUVXLGtCQUZYLEVBRStCO0FBQzlCQyxjQUFleEU7QUFDZjtBQUY4QixJQUc1QnlFLFVBQWE7QUFDZG5FLGdCQUFlLEdBREQsQ0FDSztBQURMLEtBRVpELGFBQWMsR0FGRjtBQUdaRCxhQUFZLEdBSEE7QUFJWkQsWUFBVztBQUpDO0FBSGUsRUFGL0I7QUFhQSxDQS9ORCIsImZpbGUiOiJqcy9hbmd1bGFyL2luZmVrdC9yZXNpc3RhbmNlTWF0cml4Q29tcG9uZW50LmVzMjAxNS5qcyIsInNvdXJjZXNDb250ZW50IjpbIigoKSA9PiB7XG5cblx0LyogZ2xvYmFsIGFuZ3VsYXIsIGluZmVjdCAqL1xuXG5cdGNsYXNzIFJlc2lzdGFuY2VNYXRyaXhDb250cm9sbGVyIHtcblxuXHRcdGNvbnN0cnVjdG9yKCRlbGVtZW50KSB7XG5cdFx0XHR0aGlzLiRlbGVtZW50ID0gJGVsZW1lbnQ7XG5cdFx0fVxuXG5cblxuXHRcdC8qKlxuXHRcdCogQ2hhbmdlIGhhbmRsZXIgZm9yIHRoZSBjb21wb25lbnQncyBiaW5kaW5nc1xuXHRcdCovXG5cdFx0JG9uQ2hhbmdlcyhjaGFuZ2VzT2JqKSB7XG5cblx0XHRcdC8vIEZpbHRlcnMgY2hhbmdlZDogVXBkYXRlIHZpc2liaWxpdHkg4oCTwqBidXQgb25seSBpZiBkYXRhIGlzIGF2YWlsYWJsZS4gSWYgaXQncyBub3QsIFxuXHRcdFx0Ly8gdGhlcmUncyBubyBuZWVkIHRvIGZpbHRlciwgYXMgdGFibGUgaXMgZW1wdHkuXG5cdFx0XHRpZiAoY2hhbmdlc09iai5maWx0ZXJzICYmICh0aGlzLmJhY3RlcmlhICYmIHRoaXMuYW50aWJpb3RpY3MgJiYgdGhpcy5yZXNpc3RhbmNlcykgJiYgKHRoaXMuYmFjdGVyaWEubGVuZ3RoICYmIHRoaXMuYW50aWJpb3RpY3MubGVuZ3RoICYmIHRoaXMucmVzaXN0YW5jZXMubGVuZ3RoKSkge1xuXHRcdFx0XHR0aGlzLl91cGRhdGVWaXNpYmlsaXR5KCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIENoYW5nZSBjb25jZXJucyB0aGUgZGF0YSBwcm9wZXJ0eTpcblx0XHRcdC8vIFVwZ3JhZGUgZGF0YSB0byBoYXZlIHRoZSBmb3JtYXQgdGhhdCBSZXNpc3RlbmN5TWF0cml4IHJlcXVpcmVzXG5cdFx0XHQvLyBJZ25vcmUgZW1wdHkgZGF0YVxuXHRcdFx0aWYgKChjaGFuZ2VzT2JqLnJlc2lzdGFuY2VzIHx8IGNoYW5nZXNPYmouYmFjdGVyaWEgfHwgY2hhbmdlc09iai5hbnRpYmlvdGljcykgJiYgKHRoaXMuYW50aWJpb3RpY3MgJiYgdGhpcy5iYWN0ZXJpYSAmJiB0aGlzLnJlc2lzdGFuY2VzKSAmJiAodGhpcy5hbnRpYmlvdGljcy5sZW5ndGggJiYgdGhpcy5iYWN0ZXJpYS5sZW5ndGggJiYgdGhpcy5yZXNpc3RhbmNlcy5sZW5ndGgpKSB7XG5cdFx0XHRcdHRoaXMuX2hhbmRsZURhdGFVcGRhdGUodGhpcy5hbnRpYmlvdGljcywgdGhpcy5iYWN0ZXJpYSwgdGhpcy5yZXNpc3RhbmNlcyk7XG5cdFx0XHR9XG5cblx0XHR9XG5cblxuXG5cdFx0LyoqXG5cdFx0KiBVcGRhdGVzIHZpc2liaWxpdHkgb2Ygcm93cyBhbmQgY29sdW1zbiB0byBtYXRjaCB0aGlzLmZpbHRlcnMuIEhhbmRsZXIgZm9yIGNoYW5nZXMgb24gdGhpcy5maWx0ZXJzLlxuXHRcdCovXG5cdFx0X3VwZGF0ZVZpc2liaWxpdHkoKSB7XG5cblx0XHRcdGxldCBhbnRpYmlvdGljcyA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodGhpcy5hbnRpYmlvdGljcykpXG5cdFx0XHRcdCwgYmFjdGVyaWEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHRoaXMuYmFjdGVyaWEpKTtcblxuXHRcdFx0Y29uc29sZS5lcnJvcignX3VwZGF0ZVZpc2liaWxpdHknLCBhbnRpYmlvdGljcywgYmFjdGVyaWEsIHRoaXMuZmlsdGVycyk7XG5cblx0XHRcdGlmIChPYmplY3QuZW50cmllcyh0aGlzLmZpbHRlcnMuYW50aWJpb3RpYykubGVuZ3RoKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IodGhpcy5maWx0ZXJzLmFudGliaW90aWMpO1xuXHRcdFx0XHRhbnRpYmlvdGljcyA9IHRoaXMuX2ZpbHRlckFudGliaW90aWNzKGFudGliaW90aWNzLCB0aGlzLmZpbHRlcnMuYW50aWJpb3RpYyk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChPYmplY3QuZW50cmllcyh0aGlzLmZpbHRlcnMuYmFjdGVyaXVtKS5sZW5ndGgpIHtcblx0XHRcdFx0YmFjdGVyaWEgPSB0aGlzLl9maWx0ZXJCYWN0ZXJpYShiYWN0ZXJpYSwgdGhpcy5maWx0ZXJzLmJhY3Rlcml1bSk7XG5cdFx0XHR9XG5cblx0XHRcdGNvbnNvbGUubG9nKCdSZXNpc3RhbmNlTWF0cml4Q29udHJvbGxlcjogRmlsdGVyZWQgYWIgJW8sIGJhY3RlcmlhICVvJywgYW50aWJpb3RpY3MsIGJhY3RlcmlhKTtcblx0XHRcdHRoaXMuX2hhbmRsZURhdGFVcGRhdGUoYW50aWJpb3RpY3MsIGJhY3RlcmlhLCB0aGlzLnJlc2lzdGFuY2VzKTtcblxuXHRcdH1cblxuXG5cblx0XHQvKipcblx0XHQqIEZpbHRlcnMgYmFjdGVyaWEgKGNsb25lIGZyb20gdGhpcy5iYWN0ZXJpYSkgd2l0aCBmaWx0ZXJzIGZyb20gdGhpcy5maWx0ZXJzXG5cdFx0Ki9cblx0XHRfZmlsdGVyQmFjdGVyaWEoYmFjdGVyaWEsIGZpbHRlcnMpIHtcblx0XHRcdHJldHVybiBiYWN0ZXJpYTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogRmlsdGVycyBhbnRpYmlvdGljcyAoY2xvbmUgZnJvbSBmcm9tIHRoaXMuYW50aWJpb2NzKSB3aXRoIGZpbHRlcnMgZnJvbSBcblx0XHQqIHRoaXMuZmlsdGVyc1xuXHRcdCovXG5cdFx0X2ZpbHRlckFudGliaW90aWNzKGFudGliaW90aWNzLCBmaWx0ZXJzKSB7XG5cblx0XHRcdGNvbnN0IGZpbHRlcmVkID0gW107XG5cblx0XHRcdE9iamVjdC5rZXlzKGZpbHRlcnMpLmZvckVhY2goKGZpbHRlcktleSkgPT4ge1xuXHRcdFx0XHQvLyBHbyB0aHJvdWdoIGZpbHRlcnMgb24gYSB0eXBlLCBlLmcuIHN1YnN0YW5jZXNcblx0XHRcdFx0ZmlsdGVyc1tmaWx0ZXJLZXldLmZvckVhY2goKGZpbHRlcikgPT4ge1xuXG5cdFx0XHRcdFx0Ly8gR28gdGhyb3VnaCBhbGwgYW50aWJpb3RpY3MgYW5kIGNoZWNrIGlmIHRoZXkncmUgcGFydCBvZiBcblx0XHRcdFx0XHQvLyB0aGUgY29udGFpbmVyXG5cdFx0XHRcdFx0YW50aWJpb3RpY3MuZm9yRWFjaCgoYW50aWJpb3RpYykgPT4ge1xuXHRcdFx0XHRcdFx0aWYgKGZpbHRlci5jb250YWluZXJzLm1hcCgoY29udGFpbmVyVmFsdWUpID0+IGNvbnRhaW5lclZhbHVlLmlkKS5pbmRleE9mKGFudGliaW90aWMuaWQpID4gLTEpIHtcblx0XHRcdFx0XHRcdFx0ZmlsdGVyZWQucHVzaChhbnRpYmlvdGljKTtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHRjb25zb2xlLmVycm9yKCdmaWx0ZXJlZDogJW8nLCBmaWx0ZXJlZCk7XG5cdFx0XHRyZXR1cm4gZmlsdGVyZWQ7XG5cblx0XHR9XG5cblxuXG5cdFx0LyoqXG5cdFx0KiBDYWxsZWQgd2hlbmV2ZXIgcmVpc3RhbmNlLCBiYWN0ZXJpYSBvciBhbnRpYmlvdGljcyBjaGFuZ2U6IFxuXHRcdCogUmUtZm9ybWF0IGRhdGEgYW5kIHVwZGF0ZSBtYXRyaXhcblx0XHQqL1xuXHRcdF9oYW5kbGVEYXRhVXBkYXRlKGFudGliaW90aWNzLCBiYWN0ZXJpYSwgcmVzaXN0YW5jZXMpIHtcblxuXHRcdFx0XHRjb25zb2xlLndhcm4oJ1Jlc2lzdGFuY2VNYXRyaXhDb250cm9sbGVyIC8gJG9uQ2hhbmdlOiByZXNpc3RhbmNlcyBpcyAlbywgYW50aWJpb3RpY3MgJW8sIGJhY3RlcmlhICVvJywgcmVzaXN0YW5jZXMsIGFudGliaW90aWNzLCBiYWN0ZXJpYSk7XG5cblx0XHRcdFx0Ly8gQ29udmVyc2lvbiAxXG5cdFx0XHRcdGNvbnN0IGludGVybWVkaWF0ZURhdGEgPSB0aGlzLl9yZW1vZGVsTWF0cml4KGJhY3RlcmlhLCBhbnRpYmlvdGljcywgcmVzaXN0YW5jZXMpO1xuXHRcdFx0XHRjb25zb2xlLmxvZygnUmVzaXN0YW5jZU1hdHJpeENvbnRyb2xsZXIgLyAkb25DaGFuZ2VzOiBpbnRlcm1lZGlhdGVEYXRhIGlzICVvJywgaW50ZXJtZWRpYXRlRGF0YSk7XG5cblx0XHRcdFx0Ly8gQ29udmVyc2lvbiAyXG5cdFx0XHRcdGNvbnN0IGludGVybmFsRGF0YSA9IHRoaXMuX3ByZXBhcmVNYXRyaXhGb3JDb21wb25lbnQoaW50ZXJtZWRpYXRlRGF0YSk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdSZXNpc3RhbmNlTWF0cml4Q29udHJvbGxlciAvICRvbkNoYW5nZXM6IGludGVybmFsRGF0YSBpcyAlbycsIGludGVybmFsRGF0YSk7XG5cblx0XHRcdFx0Ly8gRHJhdyBtYXRyaXhcblx0XHRcdFx0dGhpcy4kZWxlbWVudC5lbXB0eSgpO1xuXHRcdFx0XHRjb25zdCBtYXRyaXggPSBuZXcgaW5mZWN0LlJlc2lzdGVuY3lNYXRyaXgodGhpcy4kZWxlbWVudFswXSk7XG5cdFx0XHRcdG1hdHJpeC51cGRhdGVEYXRhKGludGVybmFsRGF0YSwgJ3ZhbHVlJyk7XG5cblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogVGFrZXMgYmFjdGVyaWEsIGFudGliaW90aWNzIGFuZCByZXNpc3RhbmNlcyBhbmQgY3JlYXRlcyBhIHRhYmxlIGNvbnNpc3Rpbmcgb2YgTWFwc1xuXHRcdCpcblx0XHQqIHtcblx0XHQqXHRbYmFjdGVyaXVtT2JqZWN0XVx0XHQ6IHtcblx0XHQqXHRcdFthbnRpYmlvdGljT2JqZWN0XVx0OiByZXNpc3RhbmNlXG5cdFx0Klx0XHRbYW50aWJpb3RpY09iamVjdF1cdDogcmVzaXN0YW5jZVxuXHRcdCpcdH1cblx0XHQqIH0sIHtcblx0XHQqXHRbYmFjdGVyaXVtT2JqZWN0XVx0XHQ6IHtcblx0XHQqXHRcdFthbnRpYmlvdGljT2JqZWN0XVx0OiByZXNpc3RhbmNlXG5cdFx0Klx0XHRbYW50aWJpb3RpY09iamVjdF1cdDogcmVzaXN0YW5jZVxuXHRcdCpcdH1cblx0XHQqIH1cblx0XHQqXG5cdFx0Ki9cblx0XHRfcmVtb2RlbE1hdHJpeChiYWN0ZXJpYSwgYW50aWJpb3RpY3MsIHJlc2lzdGFuY2VzKSB7XG5cblx0XHRcdC8vIE1hcCB3aXRoIGtleTogYmFjdGVyaXVtLCB2YWx1ZTogTWFwIHdpdGgga2V5OiBhbnRpYmlvdGljLCB2YWx1ZTogcmVpc3RhbmNlXG5cdFx0XHRjb25zdCByZW1vZGVsZWQgPSBuZXcgTWFwKCk7XG5cblx0XHRcdC8vIFNvcnQgYW50aWJpb3RpY3MgKGFzIHRoZXkgd2lsbCBiZSByZS11c2VkIHdoZW4gY3JlYXRpbmcgdGhlIGNvbHMpXG5cdFx0XHRjb25zdCBzb3J0ZWRBbnRpYmlvdGljcyA9IGFudGliaW90aWNzXG5cdFx0XHRcdC5zb3J0KChhLCBiKSA9PiBhLm5hbWUgPCBiLm5hbWUgPyAtMSA6IDEpO1xuXG5cdFx0XHQvLyBDcmVhdGUgcm93cyAoYmFjdGVyaWEpIHdpdGggY29scyAoYW50aWJpb3RpY3MpXG5cdFx0XHRiYWN0ZXJpYVxuXHRcdFx0XHQuc29ydCgoYSwgYikgPT4gYS5uYW1lIDwgYi5uYW1lID8gLTEgOiAxIClcblx0XHRcdFx0LmZvckVhY2goKGJhY3Rlcml1bSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IG1hcCA9IG5ldyBNYXAoKTtcblx0XHRcdFx0XHRzb3J0ZWRBbnRpYmlvdGljcy5mb3JFYWNoKChhbnRpYmlvdGljKSA9PiB7XG5cdFx0XHRcdFx0XHRtYXAuc2V0KGFudGliaW90aWMsIG51bGwpOyAvLyBudWxsIGlzIHRoZSBkZWZhdWx0IHJlc2lzdGFuY2Vcblx0XHRcdFx0XHR9KTtcdFx0XHRcdFxuXHRcdFx0XHRcdHJlbW9kZWxlZC5zZXQoYmFjdGVyaXVtLCBtYXApO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0Ly8gU2V0IHJlc2lzdGFuY2VzIG9uIHRoZSByZW1vZGVsZWQgcm93XG5cdFx0XHRyZXNpc3RhbmNlcy5mb3JFYWNoKChyZXNpc3RhbmNlKSA9PiB7XG5cdFx0XHRcdC8vIFdlIG11c3QgZmluZCB0aGUga2V5IGJ5IGl0cyBJRCBhcyB3ZSdyZSB3b3JraW5nIG9uIHBzZXVkby1pbW11dGFibGUgZGF0YVxuXHRcdFx0XHRjb25zdCBtYXRjaGVkQmFjdGVyaXVtS2V5ID0gQXJyYXkuZnJvbShyZW1vZGVsZWQua2V5cygpKS5maW5kKChiYWN0ZXJpdW0pID0+IGJhY3Rlcml1bS5pZCA9PT0gcmVzaXN0YW5jZS5iYWN0ZXJpdW0uaWQpO1xuXHRcdFx0XHRpZiAoIW1hdGNoZWRCYWN0ZXJpdW1LZXkpIHJldHVybjtcblx0XHRcdFx0Y29uc3QgbWF0Y2hlZEJhY3Rlcml1bSA9IHJlbW9kZWxlZC5nZXQobWF0Y2hlZEJhY3Rlcml1bUtleSk7XG5cdFx0XHRcdGNvbnN0IGFudGliaW90aWNLZXkgPSBBcnJheS5mcm9tKG1hdGNoZWRCYWN0ZXJpdW0ua2V5cygpKS5maW5kKChhbnRpYmlvdGljKSA9PiBhbnRpYmlvdGljLmlkID09PSByZXNpc3RhbmNlLmFudGliaW90aWMuaWQpO1xuXHRcdFx0XHRpZiAoIWFudGliaW90aWNLZXkpIHJldHVybjtcblx0XHRcdFx0bWF0Y2hlZEJhY3Rlcml1bS5zZXQoYW50aWJpb3RpY0tleSwgcmVzaXN0YW5jZS52YWx1ZSk7XG5cdFx0XHRcdC8vaWYgKGJhY3Rlcml1bSkgYmFjdGVyaXVtLnNldChyZXNpc3RhbmNlLmFudGliaW90aWMsIHJlc2lzdGFuY2UudmFsdWUpO1xuXHRcdFx0fSk7XG5cblx0XHRcdHJldHVybiByZW1vZGVsZWQ7XG5cblx0XHR9XG5cblxuXG5cdFx0LyoqXG5cdFx0KiBUYWtlcyB0aGUgbWF0cnggcmV0dXJuZWQgYnkgX3JlbW9kZWxNYXRyaXgsIHByZXBhcmVzIGl0IHRvIGJlIHVzZWQgd2l0aCBcblx0XHQqIFJlc2lzdGVuY3lNYXRyaXgsIGkuZS5cblx0XHQqIHtcblx0XHQqIFx0YmFjdDFOYW1lXHRcdDoge1xuXHRcdCpcdFx0YWIxTmFtZVx0XHQ6IHtkYXRhfVxuXHRcdCpcdFx0LCBhYjJOYW1lXHQ6IHtkYXRhfVxuXHRcdCogfSwge1xuXHRcdCogXHRiYWN0Mk5hbWVcdFx0OiB7XG5cdFx0Klx0XHRhYjFOYW1lXHRcdDoge2RhdGF9XG5cdFx0Klx0XHQsIGFiMk5hbWVcdDoge2RhdGF9XG5cdFx0Klx0fVxuXHRcdCogfVxuXHRcdCpcblx0XHQqIHdoZXJlIHtkYXRhfSBhdCBsZWFzdCBjb250YWlucyBhIHZhbHVlICgwLTEpXG5cdFx0Ki9cblx0XHRfcHJlcGFyZU1hdHJpeEZvckNvbXBvbmVudChkYXRhKSB7XG5cdFx0XHRjb25zdCByZXQgPSB7fTtcblx0XHRcdGRhdGEuZm9yRWFjaCgocm93VmFsdWUsIHJvd0tleSkgPT4ge1xuXHRcdFx0XHRjb25zdCBjb2wgPSB7fTtcblx0XHRcdFx0cm93VmFsdWUuZm9yRWFjaCgoY29sVmFsdWUsIGNvbEtleSkgPT4ge1xuXHRcdFx0XHRcdGNvbFtjb2xLZXkubmFtZV0gPSB7IHZhbHVlOiBjb2xWYWx1ZSB9O1xuXHRcdFx0XHR9KTtcblx0XHRcdFx0cmV0W3Jvd0tleS5sYXRpbk5hbWVdID0gY29sO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gcmV0O1xuXHRcdH1cblxuXHR9XG5cblxuXHRSZXNpc3RhbmNlTWF0cml4Q29udHJvbGxlci4kaW5qZWN0ID0gWyckZWxlbWVudCddO1xuXG5cblx0YW5ndWxhclxuXHQubW9kdWxlKCdpbmZla3QnKVxuXHQuY29tcG9uZW50KCdyZXNpc3RhbmNlTWF0cml4Jywge1xuXHRcdGNvbnRyb2xsZXJcdFx0XHQ6IFJlc2lzdGFuY2VNYXRyaXhDb250cm9sbGVyXG5cdFx0Ly8sIHRlbXBsYXRlXHRcdFx0OiAndGVzdCB7eyRjdHJsLmZpbHRlcnMgfMKganNvbn19Iydcblx0XHQsIGJpbmRpbmdzXHRcdFx0OiB7XG5cdFx0XHRyZXNpc3RhbmNlc1x0XHQ6ICc8JyAvLyBPbmUtd2F5IGZyb20gcGFyZW50XG5cdFx0XHQsIGFudGliaW90aWNzXHQ6ICc8J1xuXHRcdFx0LCBiYWN0ZXJpYVx0XHQ6ICc8J1xuXHRcdFx0LCBmaWx0ZXJzXHRcdDogJzwnXG5cdFx0fVxuXHR9KTtcblxufSkoKTtcbiJdfQ==
