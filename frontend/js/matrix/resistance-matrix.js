'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

	/* global d3, window */

	/**
 * Draws a matrix with resistencies. 
 * Rows: Anti biotics
 * Cols: Bacteria
 * Cells: Colored according to resistance
 */
	var ResistanceMatrix = function () {

		/**
  * @param {HTMLElement} container
  * @param {Array} data				Data to be displayed must be a 2-d array where the values of the 2nd dimension array
  *									are objects, e.g. [[{bacterium: {name: 'bact-0'}, antibiotic: {name: 'ab-0'}, resistance: 0.5}]]
  * @param {Object} config			Contains the config with the following properties: 
  *									- colorValue: Function that returns the cell's color value (from the cell's object)
  * 									- cellLabelValue: Function that returns the cell label's value (from the cell's object)
  *									- columnHeaderTransformer: transformation-function that takes the whole data and returns array relevant for
  *									  column headers
  *									- columnHeaderIdentifier: Function that returns id for the col header (from columnHeaderTransformer)
  *									- columnLabelValue: Function that returns the column label's value (from the columnHeaderTransformer array)
  *									- rowLabelValue: Function that returns the row label's value (from the cell's array)
  * 									- spaceBetweenLabelsAndMatrix: Space between label and matrix in px
  *									- paddingRatio: Line weight (in % of the cells)
  */
		function ResistanceMatrix(container, data) {
			var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

			_classCallCheck(this, ResistanceMatrix);

			if (!container) {
				throw new Error('ResistanceMatrix: At least one argument (container) is needed in constructor.');
			}

			this._container = container;
			this._data = data;

			this._configuration = {
				spaceBetweenLabelsAndMatrix: config.spaceBetweenLabelsAndMatrix || 20,
				transitionDuration: config.transitionDuration || 900,
				paddingRatio: config.paddingRatio || 0.2,
				colorValue: config.colorValue || function () {
					return 1;
				},
				cellLabelValue: config.cellLabelValue || function () {
					return '–';
				},
				rowLabelValue: config.rowLabelValue || function () {
					return 'n/a';
				},
				columnLabelValue: config.columnLabelValue || function () {
					return 'n/a';
				},
				columnHeaderTransformer: config.columnHeaderTransformer || function (item) {
					return item;
				},
				columnHeaderIdentifier: config.columnHeaderIdentifier || function (item) {
					return item;
				},
				rowIdentifier: config.rowIdentifier || function (item) {
					return item;
				},
				rowDataTransformer: config.rowDataTransformer || function (item) {
					return item;
				},
				rowHidden: config.rowHidden || false
			};

			// Holds references
			this._elements = {};
			this._isInitialRendering = true;

			// Create SVG
			this._elements.svg = this._createSVG();

			// If all required data is available, draw matrix
			if (this._container && this._data) this.drawMatrix();
		}

		/**
  * Updates the matrix' data
  * @param {Array} data				Array (rows) of Arrays (cols) which hold the values (Object)
  */


		_createClass(ResistanceMatrix, [{
			key: 'updateData',
			value: function updateData(data) {

				this._data = data;
				console.log('ResistanceMatrix: Update data to %o', data);
				if (this._container && this._data) this.drawMatrix(true);
			}

			/**
   * Main method. Draws the matrix with data and container provided.
   */

		}, {
			key: 'drawMatrix',
			value: function drawMatrix(dontUpdateScale) {

				// Create scales if we want them to be updated (which we don't when elements are removed or added
				// as this will enlarge/reduce the cell's size)
				if (!dontUpdateScale) {
					this._columnScale = this._createColumnScale();
					this._colorScale = this._createColorScale();
				}

				// Draw column heads and rows (incl. labels and cells) – this is the very
				// basic setup.
				this._drawColumnHeads(this._columnScale);
				this._drawRows(this._columnScale);

				// Update column scale to account for labels (row/col) which take up
				// space
				if (!dontUpdateScale) {
					this._updateColumnScale();
				}

				// Set height of the whole SVG
				//console.error(this._getMaxColumnLabelHeight(), this._configuration.spaceBetweenLabelsAndMatrix, this._data.length, this._columnScale.step(), this._columnScale.bandwidth());
				// Why step() + 4? IDK. It just works. If we only use step(), step seems to be too small.
				this._elements.svg.attr('height', this._getMaxColumnLabelHeight() + this._configuration.spaceBetweenLabelsAndMatrix + (this._columnScale.step() + 4) * this._data.length);

				// When rendering is initial, update rows and columns to account for new scale
				// that now respects labels
				if (this._isInitialRendering) {
					this._drawRows(this._columnScale);
					this._drawColumnHeads(this._columnScale);
				}

				this._isInitialRendering = false;
			}

			/**
   * Draws the rows
   * @param {Number} rowHeight			Width of a single row
   */

		}, {
			key: '_drawRows',
			value: function _drawRows(scale) {
				var _this = this;

				var self = this;

				console.log('ResistanceMatrix / _drawRows: Draw rows with data %o and height %o', Object.values(this._data), scale.bandwidth());

				// g
				var rows = this._elements.svg.selectAll('.row').call(function (d) {
					console.error('updated rows', d.size());
				})
				// http://stackoverflow.com/questions/22240842/d3-update-on-node-removal-always-remove-the-last-entry-in-svg-dom
				.data(this._data, this._configuration.rowIdentifier);

				// Enter
				var enteredRows = rows.enter().append('g').attr('class', 'row');

				// Exit
				rows.exit().remove();

				// Label (enter and update), before cells
				this._createSingleRowLabel(enteredRows);

				// Update and enter: 
				// Adjust LABEL position
				enteredRows.merge(rows).selectAll('.row-label').attr('transform', function () {
					return 'translate(' + self._getMaxRowLabelWidth() + ', ' + (this.getBBox().height / 2 - 4) + ')';
				});

				// Enter and update:
				// - move down
				// - animates transformation
				var numberOfVisibleRows = 0;
				enteredRows.call(function (d) {
					return console.error('new rows', d.size());
				}).merge(rows).transition().duration(this._configuration.transitionDuration).attr('transform', function (d) {
					var translation = 'translate(0, ' + (_this._getMaxColumnLabelHeight() + _this._configuration.spaceBetweenLabelsAndMatrix + numberOfVisibleRows * scale.step()) + ')';
					if (!_this._configuration.rowHidden(d)) numberOfVisibleRows++;
					return translation;
				}).style('opacity', function (d) {
					return _this._configuration.rowHidden(d) ? 0 : 1;
				});

				// Draw cells
				enteredRows.merge(rows).call(function (parent) {
					_this._drawCell(parent, scale);
				});
			}

			/**
   * Returns the SVG's width 
   * @return {Number}
   */

		}, {
			key: '_getSvgWidth',
			value: function _getSvgWidth() {
				return this._elements.svg.property('clientWidth');
			}

			/**
   * Creates and returns a single row label. Needed to first measure and then
   * draw it at the right place
   */

		}, {
			key: '_createSingleRowLabel',
			value: function _createSingleRowLabel(element) {

				return element.append('text').attr('class', 'row-label').attr('text-anchor', 'end').text(this._configuration.rowLabelValue);
			}

			/**
   * Creates and returns the SVG
   */

		}, {
			key: '_createSVG',
			value: function _createSVG() {
				return d3.select(this._container).append('svg');
			}

			/**
   * Creates the scale for all columns, i.e. for all the vertical entities – row data
   * must be taken. This is done before the labels are there, therefore take the whole
   * SVG width. The scale's range will later be updated through _updateColumnScale
   */

		}, {
			key: '_createColumnScale',
			value: function _createColumnScale() {

				var data = this._configuration.columnHeaderTransformer(this._data);
				console.log('ResistanceMatrix: Data for column scale (len %o) is %o', data.length, data);
				var scale = d3.scaleBand()
				// -50: We turn the col labels by 45°, this takes a bit of space
				.rangeRound([0, this._getSvgWidth() - 50])
				// Domain: Array of object fucks things up (only has 1 entry) – use Array of strings
				.domain(data.map(this._configuration.columnHeaderIdentifier)).paddingInner(this._configuration.paddingRatio);
				console.log('ResistanceMatrix: Column scale bandwidth is %o', scale.bandwidth());
				return scale;
			}

			/**
   * Returns the scale for coloring the cells
   */

		}, {
			key: '_createColorScale',
			value: function _createColorScale() {
				return new d3.scaleSequential(function (t) {
					// Saturation: 40–90%
					var invertedT = 1 + t * -1;
					var saturation = invertedT * 0.5 + 0.4;
					// Lightness: 60–100% – this is very important
					var lightness = (1 - invertedT) * 0.6 + 0.4;
					// Hue 0-100
					var hue = invertedT * 100;
					var hsl = d3.hsl(hue, saturation, lightness);
					return hsl.toString();
				});
			}

			/**
   * Updates the col scale. Is called after labels were drawn and measured. Scale should take up
   * all horizontal space that's left. 
   */

		}, {
			key: '_updateColumnScale',
			value: function _updateColumnScale() {

				// 50: Just some security margin
				var availableWidth = this._getSvgWidth() - 50 - this._getMaxRowLabelWidth() - this._configuration.spaceBetweenLabelsAndMatrix;
				console.log('ResistanceMatrix / _updateColumnScale: SVG width is %o, width column content is %o', this._getSvgWidth(), availableWidth);

				// Update scale
				this._columnScale.rangeRound([0, availableWidth]);
				console.log('ResistanceMatrix: New bandwidth is %o, step is %o', this._columnScale.bandwidth(), this._columnScale.step());
			}

			/**
   * Returns width of widest row label
   */

		}, {
			key: '_getMaxRowLabelWidth',
			value: function _getMaxRowLabelWidth() {

				if (!this._elements.svg.selectAll('.row')) return 0;

				var maxRowLabelWidth = 0;
				this._elements.svg.selectAll('.row').select('.row-label').each(function () {
					maxRowLabelWidth = Math.max(maxRowLabelWidth, this.getBBox().width);
				});
				return Math.ceil(maxRowLabelWidth);
			}

			/**
   * Returns width of widest column label
   */

		}, {
			key: '_getMaxColumnLabelHeight',
			value: function _getMaxColumnLabelHeight() {
				var maxColLabelHeight = 0;
				this._elements.svg.selectAll('.column').select('.column-label').each(function () {
					maxColLabelHeight = Math.max(maxColLabelHeight, this.getBBox().width);
				});
				return Math.ceil(maxColLabelHeight);
			}

			/**
   * Draws the column heads, then returns the created elements
   */

		}, {
			key: '_drawColumnHeads',
			value: function _drawColumnHeads(scale) {

				var self = this;

				// Get headers from data (keys of first array item)
				var headers = this._configuration.columnHeaderTransformer(this._data);
				console.log('ResistanceMatrix / _drawColumnHeads: Headers are %o', headers);

				// <g> and transform
				var colHeads = this._elements.svg.selectAll('.column').data(headers, this._configuration.columnHeaderIdentifier);

				// Draw heads, consisting of <g> with contained <text>
				var colHeadsEnter = colHeads.enter().append('g')
				// translation will be done in this.updatePositionsAndSizes
				.attr('class', 'column');

				// Append text. Rotate by 45°
				colHeadsEnter.append('text').attr('class', 'column-label').attr('text-anchor', 'start').attr('transform', 'rotate(-45)').text(this._configuration.columnLabelValue);

				// Update position
				// (enter and update)
				var currentIndex = 0;
				colHeadsEnter.merge(colHeads).transition().duration(this._configuration.transitionDuration).attr('transform', function (d) {
					var translation = 'translate(' + (currentIndex * scale.step() + self._getMaxRowLabelWidth() + self._configuration.spaceBetweenLabelsAndMatrix + Math.round(scale.step() / 2 - 8)) + ', ' + self._getMaxColumnLabelHeight() + ')';
					if (!d.hidden) currentIndex++;
					return translation;
				}).style('opacity', function (d) {
					return d.hidden ? 0 : 1;
				});
			}

			/**
   * Draws a single resistance cell
   */

		}, {
			key: '_drawCell',
			value: function _drawCell(row, scale) {
				var _this2 = this;

				console.log('ResistanceMatrix: Draw cell; row %o, dimensions %o', row, scale.bandwidth());

				var cells = row.selectAll('.cell')
				// Row is {bacterium: {} antibiotics: []} – only use antibiotics
				.data(this._configuration.rowDataTransformer);

				// g
				var gs = cells.enter().append('g')
				// data-label attribute (debugging)
				.attr('data-label', function (d) {
					return _this2._configuration.cellLabelValue(d);
				}).attr('data-antibiotic', function (d) {
					return _this2._configuration.columnLabelValue(d);
				})
				// data-color attribute (debugging)
				.attr('data-color', function (d) {
					return _this2._configuration.colorValue(d);
				}).attr('class', 'cell');

				// Add rect to every g
				this._drawCellRectangle(gs, scale);

				// Label
				this._drawCellLabel(gs);

				// Move right
				var currentRowIndex = 0;
				row.enter().merge(row).selectAll('.cell').transition().duration(this._configuration.transitionDuration).attr('transform', function (d, i) {
					// Reset currentRowIndex if i equals 0 again
					if (i === 0) currentRowIndex = 0;
					// Get translation
					var translation = 'translate(' + (_this2._getMaxRowLabelWidth() + _this2._configuration.spaceBetweenLabelsAndMatrix + currentRowIndex * scale.step()) + ', 0)';
					// Update currentRowIndex
					if (!d.hidden) currentRowIndex++;
					return translation;
				}).style('opacity', function (d) {
					return d.hidden ? 0 : 1;
				});
			}

			/**
   * Draws the label in a cell
   */

		}, {
			key: '_drawCellLabel',
			value: function _drawCellLabel(cells) {

				return;
				var self = this;

				cells.each(function (d) {
					var labelValue = self._configuration.cellLabelValue(d);
					d3.select(this).append('text').attr('class', 'cell-label').text(labelValue).style('pointer-events', 'none').attr('transform', function () {
						var translation = 'translate(' + this.getBBox().width / -2 + ', ' + (this.getBBox().height / 2 - 4) + ')';
						return translation;
					});
				});
			}

			/**
   * Draws the rectangle in a cell
   */

		}, {
			key: '_drawCellRectangle',
			value: function _drawCellRectangle(cells, scale) {

				var self = this;

				cells.each(function (d) {

					var colorValue = self._configuration.colorValue(d);

					d3.select(this)
					//.append('rect')
					.append('circle').style('fill', colorValue === null ? '#fff' : self._colorScale(colorValue))

					// Add white stroke around cells so that mouse over happens smoothly
					.style('stroke', colorValue === null ? '#dedede' : '#fff')

					// Stroke width: 1px for empty values, else half of the space between the cells
					.style('stroke-width', colorValue === null ? 1 : (scale.step() - scale.bandwidth()) / 2)

					// Radius: Remove stroke from radius if stroke's there
					.attr('r', colorValue === null ? scale.bandwidth() / 2 - 2 : scale.bandwidth() / 2).on('mouseenter', function (d) {
						var element = this;
						self._mouseOverHandler.call(self, element, d);
					}).on('mouseleave', function () {
						var element = this;
						self._mouseOutHandler.call(self, element);
					});
				});
			}

			/**
   * Returns the first parent of element that matches selector
   */

		}, {
			key: '_getParentElement',
			value: function _getParentElement(element, selector) {

				var match = void 0;
				while (element.nodeName.toLowerCase() !== 'svg') {
					if (element.matches(selector)) {
						match = element;
						break;
					}
					element = element.parentNode;
				}

				return match;
			}

			/**
   * Returns index of current child that matches selector in its parent
   */

		}, {
			key: '_getChildNodeIndex',
			value: function _getChildNodeIndex(child, selector) {

				var index = 0;
				while (child.previousSibling) {
					if (child.previousSibling.matches(selector)) index++;
					child = child.previousSibling;
				}
				return index;
			}

			/**
   * Handles mouseenter on a cell
   */

		}, {
			key: '_mouseOverHandler',
			value: function _mouseOverHandler(element, data) {

				var label = this._configuration.cellLabelValue(data);

				// Data not available: Cell has no value. There's no 
				// hover effect for empty cells.
				if (!label) return;

				// Map svg's DOM element to svg
				var svg = void 0;
				this._elements.svg.each(function () {
					svg = this;
				});

				var y = element.getBoundingClientRect().top - svg.getBoundingClientRect().top,
				    x = element.getBoundingClientRect().left - svg.getBoundingClientRect().left,
				    width = parseInt(element.getBBox().width, 10) + 40,
				    height = parseInt(element.getBBox().height, 10) + 40;

				this._mouseOverRect = this._elements.svg.append('g').attr('transform', 'translate(' + (x - 20) + ', ' + (y - 20) + ')');

				this._mouseOverRect.append('circle').attr('class', 'hover-cell').style('fill', element.style.fill).style('pointer-events', 'none').attr('r', width / 2).attr('cx', width / 2).attr('cy', width / 2);

				this._mouseOverRect.append('text').text(label).style('color', 'black').style('font-size', '20px').style('text-align', 'center').style('pointer-events', 'none').attr('transform', function () {
					return 'translate(' + (width / 2 - this.getBBox().width / 2) + ', ' + (this.getBBox().height / 2 + height / 2 - 5) + ')';
				});

				// Highlight row
				var row = this._getParentElement(element, '.row');
				d3.select(row).classed('active', true);

				// Highlight col
				var cell = this._getParentElement(element, '.cell');
				var colIndex = this._getChildNodeIndex(cell, '.cell');
				var currentCol = this._elements.svg.selectAll('.column').filter(function (d, i) {
					return i === colIndex;
				});
				currentCol.classed('active', true);
			}
		}, {
			key: '_mouseOutHandler',
			value: function _mouseOutHandler() {

				if (this._mouseOverRect) this._mouseOverRect.remove();

				this._elements.svg.selectAll('.row').classed('active', false);
				this._elements.svg.selectAll('.column').classed('active', false);
			}
		}]);

		return ResistanceMatrix;
	}();

	window.infect = window.infect || {};
	window.infect.ResistanceMatrix = ResistanceMatrix;
})();
//# sourceMappingURL=resistance-matrix.es2015.js.map
