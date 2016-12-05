'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

	/* global d3, window */

	/**
 * Draws a matrix with resistencies. 
 * Rows: Anti biotics
 * Cols: Bacteria
 * Cells: Colored according to resistency
 */
	var ResistencyMatrix = function () {
		function ResistencyMatrix(container, data) {
			_classCallCheck(this, ResistencyMatrix);

			if (!container) {
				throw new Error('ResistencyMatrix: At least one argument (container) is needed in constructor.');
			}

			this._container = container;
			this._data = data;

			this._configuration = {
				spaceBetweenLabelsAndMatrix: 20,
				lineWeight: 5
			};

			// Holds references
			this._elements = {};

			// Create SVG
			this._elements.svg = this._createSVG();

			// If all required data is available, draw matrix
			if (this._container && this._data) this.drawMatrix();
		}

		/**
  * Updates the matrix' data
  * @param {Array} data				Array (rows) of Arrays (cols) which hold the values (Object)
  * @param {String} fieldName			Values are passed in an object; name of the key that holds the
  *									data which should be displayed in table.
  */


		_createClass(ResistencyMatrix, [{
			key: 'updateData',
			value: function updateData(data, keyName, dontUpdateScale) {

				this._data = data;
				console.log('ResistencyMatrix / updateData: Update scale? %o. Update data to %o', !dontUpdateScale, data);
				this._keyName = keyName;
				if (this._container && this._data) this.drawMatrix(dontUpdateScale);
			}

			/**
   * Main method. Draws the matrix with data and container provided.
   */

		}, {
			key: 'drawMatrix',
			value: function drawMatrix(dontUpdateScale) {

				// Get row scale
				if (!dontUpdateScale) {
					this._columnScale = this._createColumnScale();
					this._colorScale = this._createColorScale();
				}

				this._drawRows(this._columnScale.bandwidth());
				this._drawColumnHeads();

				if (!dontUpdateScale) {
					this._updateColumnScale();
				}

				this._updatePositionsAndSizes();
			}

			/**
   * Draws the rows
   * @param {Number} rowHeight			Width of a single row
   */

		}, {
			key: '_drawRows',
			value: function _drawRows(rowHeight) {
				var _this = this;

				console.log('ResistencyMatrix / _drawRows: Draw rows with data %o and height %o', Object.values(this._data), rowHeight);

				// Reference to this, needed for each
				var self = this;

				// g
				var rows = this._elements.svg.selectAll('.row')
				// http://stackoverflow.com/questions/22240842/d3-update-on-node-removal-always-remove-the-last-entry-in-svg-dom
				.data(this._data, function (bacterium) {
					return bacterium.id;
				});

				var enteredRows = rows.enter().append('g').attr('class', 'row').attr('transform', function (d, i) {
					return 'translate(0, ' + i * rowHeight + ')';
				})
				// Cannot use arrow functions as we need this
				.each(function (row) {
					self._drawCell(this, row, rowHeight);
				});

				enteredRows.enter().append('text').each(function () {
					console.error('create row');
				}).text('test');

				self._createSingleRowLabel(enteredRows);

				rows.exit().each(function () {
					console.error('rm rw', _this);
				}).remove();
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
				return element.append('text').attr('class', 'label').attr('text-anchor', 'end').text(function (d) {
					return d.bacterium.latinName;
				});
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
   * must be taken. This is done before the labels are there, therefore
   * take the whole SVG width.
   */

		}, {
			key: '_createColumnScale',
			value: function _createColumnScale() {

				var data = this._data[0].antibiotics.map(function (item) {
					return item.antibiotic.name;
				});
				console.log('ResistencyMatrix: Data for column scale (len %o) is %o', data.length, data);
				return d3.scaleBand().domain(data)
				// -50: We turn the col labels by 45°, this takes a bit of space
				.range([0, this._getSvgWidth() - 50]);
			}

			/**
   * Returns the scale for coloring the cells
   */

		}, {
			key: '_createColorScale',
			value: function _createColorScale() {
				return new d3.scaleSequential(function (t) {
					//const saturation = t * 0.2 + 0.4; // 50–60%
					var saturation = 0.7;
					var lightness = (1 - t) * 0.6 + 0.4; // 30–80%
					//const lightness = 0.5;
					// Hue needs values between 40 and 90
					var hue = t * 100;
					//console.warn(t.toFixed(3), hue.toFixed(3), saturation.toFixed(3), lightness.toFixed(3));
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

				// Remove amount of entries so that we can insert a line of 1 px
				var amountOfDataSets = this._elements.svg.selectAll('.column').size();
				var width = this._getSvgWidth() - 50 - this._getMaxRowLabelWidth() - this._configuration.spaceBetweenLabelsAndMatrix - amountOfDataSets * this._configuration.lineWeight;
				console.log('ResistencyMatrix / _updateColumnScale: Col # is %o, svg width is %o, width column content is %o', amountOfDataSets, this._getSvgWidth(), width);

				// Update scale
				this._columnScale.range([0, width]);
				console.log('ResistencyMatrix: New bandwidth is %o, step is %o', this._columnScale.bandwidth(), this._columnScale.step());
			}

			/**
   * Returns width of widest row label
   */

		}, {
			key: '_getMaxRowLabelWidth',
			value: function _getMaxRowLabelWidth() {

				if (!this._elements.svg.selectAll('.row')) return 0;

				var maxRowLabelWidth = 0;
				this._elements.svg.selectAll('.row').select('.label').each(function () {
					var width = this.getBBox().width;
					if (width > maxRowLabelWidth) maxRowLabelWidth = width;
				});
				return maxRowLabelWidth;
			}

			/**
   * Returns width of widest column label
   */

		}, {
			key: '_getMaxColumnLabelHeight',
			value: function _getMaxColumnLabelHeight() {
				var maxColLabelHeight = 0;
				this._elements.svg.selectAll('.column').select('.label').each(function () {
					var height = this.getBBox().width;
					if (height > maxColLabelHeight) maxColLabelHeight = height;
				});
				return maxColLabelHeight;
			}

			/**
   * Updates the scales after the labels (row/col) were drawn and updates cells/rows to 
   * respect width/height of the labels.
   * Resets height of the SVG to match its contents.
   */

		}, {
			key: '_updatePositionsAndSizes',
			value: function _updatePositionsAndSizes() {

				var self = this;

				var maxRowLabelWidth = this._getMaxRowLabelWidth(),
				    maxColLabelHeight = this._getMaxColumnLabelHeight();

				var bandWidth = this._columnScale.bandwidth(),
				    step = this._columnScale.step();

				console.log('ResistencyMatrix / _updatePositionsAndSizes: maxRowLabelWidth', maxRowLabelWidth, 'collabelheight', maxColLabelHeight, 'bandWidth', bandWidth);

				// Update rows
				this._elements.svg.selectAll('.row').each(function (d, i) {
					d3.select(this).attr('height', bandWidth).attr('transform', 'translate(0, ' + (i * Math.floor(bandWidth) + Math.floor(maxColLabelHeight) + self._configuration.spaceBetweenLabelsAndMatrix + i * self._configuration.lineWeight) + ')');
				});

				// Update cell's rectangles
				this._elements.svg.selectAll('.row').selectAll('.cell').each(function (d, i) {
					self._alignCell(this, Math.floor(self._columnScale.bandwidth()), i, Math.floor(maxRowLabelWidth + self._configuration.spaceBetweenLabelsAndMatrix), self._configuration.lineWeight);
				}).select('rect').each(function () {
					self._resizeCell(this, Math.floor(self._columnScale.bandwidth()));
				});

				// Update cols
				//this._elements.columns
				this._elements.svg.selectAll('.column').each(function (d, i) {
					// step / 2: Make sure we're kinda centered over the col
					var left = i * (Math.floor(step) + self._configuration.lineWeight) + maxRowLabelWidth + self._configuration.spaceBetweenLabelsAndMatrix + step / 2;
					d3.select(this).attr('transform', 'translate(' + left + ', ' + maxColLabelHeight + ')');
				});

				// Update label's x position
				this._elements.svg.selectAll('.row').select('.label').attr('x', maxRowLabelWidth).each(function () {
					d3.select(this).attr('y', bandWidth / 2 + this.getBBox().height / 2);
				});

				// Update col label's y position
				//this._elements.columns
				//	.select('.label')
				//	.attr('transform', 'rotate(-45)');

				// Update svg height
				var amountOfCols = Object.keys(this._data).length,
				    colHeight = this._columnScale.step();
				this._container.style.height = this._getMaxColumnLabelHeight() + (colHeight + this._configuration.lineWeight) * amountOfCols + this._configuration.spaceBetweenLabelsAndMatrix + 'px';
			}

			/**
   * Aligns a single cell
   */

		}, {
			key: '_alignCell',
			value: function _alignCell(cell, dimensions, number) {
				var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
				var lineWeight = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 1;

				d3.select(cell)
				// + number: Space 1 px between cells
				.attr('transform', 'translate(' + (offset + number * dimensions + number * lineWeight) + ',0)');
			}

			/**
   * Resizes a single cell
   */

		}, {
			key: '_resizeCell',
			value: function _resizeCell(cell, dimensions) {
				d3.select(cell).attr('height', dimensions).attr('width', dimensions);
			}

			/**
   * Draws the column heads, then returns the created elements
   */

		}, {
			key: '_drawColumnHeads',
			value: function _drawColumnHeads() {

				// Get headers from data (keys of first array item)
				var headers = this._data[0].antibiotics.map(function (col) {
					return col.antibiotic;
				});
				console.log('ResistencyMatrix / _drawColumnHeads: Headers are %o', headers);

				// <g> and transform
				var colHeads = this._elements.svg.selectAll('.column').data(headers, function (col) {
					return col.id;
				});

				// Draw heads, consisting of <g> with contained <text>
				colHeads.enter().append('g')
				// translation will be done in this.updatePositionsAndSizes
				.attr('class', 'column').append('text').attr('class', 'label').attr('text-anchor', 'start').attr('transform', 'rotate(-45)').text(function (d) {
					return d.name;
				});

				// Text
				colHeads.exit().each(function () {
					console.error('rm cl hd');
				}).remove();
			}

			/**
   * Draws a single resistency cell
   */

		}, {
			key: '_drawCell',
			value: function _drawCell(rowElement, rowData, dimensions) {

				//console.log( 'ResistencyMatrix / _drawCell: row %o, data %o, dimensions %o', rowElement, rowData, dimensions );
				var self = this;

				// Remove 'name' property on row object
				var filteredData = rowData.antibiotics;
				//console.error('drawCell: %o', filteredData);

				// <g>
				var cells = d3.select(rowElement).selectAll('.cell').data(filteredData, function (col) {
					//console.error(col.antibiotic.id);
					return col.antibiotic.id;
				});

				cells.enter().append('g').attr('class', 'cell')
				// Rect
				.each(function (d) {
					d3.select(this).append('rect').style('fill', d ? self._colorScale(d.value) : '#fff').style('stroke', d.value === null ? '#dedede' : '').style('stroke-width', d.value === null ? 1 : 0)
					// Set size of rect
					.each(function () {
						self._resizeCell(this, dimensions);
					}).on('mouseenter', function (d) {
						var element = this;
						self._mouseOverHandler.call(self, element, d);
					}).on('mouseleave', function () {
						var element = this;
						self._mouseOutHandler.call(self, element);
					});
				});

				cells.exit().each(function () {
					console.error('rm cell');
				}).remove();
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

				// Data not available: Cell has no value. There's no 
				// hover effect for empty cells.
				if (!data.value) return;

				// Map svg's DOM element to svg
				var svg = void 0;
				this._elements.svg.each(function () {
					svg = this;
				});

				var y = element.getBoundingClientRect().top - svg.getBoundingClientRect().top,
				    x = element.getBoundingClientRect().left - svg.getBoundingClientRect().left,
				    width = parseInt(d3.select(element).attr('width'), 10) + 40,
				    height = parseInt(d3.select(element).attr('height'), 10) + 40;

				this._mouseOverRect = this._elements.svg.append('g');

				this._mouseOverRect.append('rect').attr('x', x - 20).attr('y', y - 20).attr('class', 'hover-cell').style('fill', element.style.fill).style('pointer-events', 'none').attr('height', height).attr('width', width).style('pointer-events', 'none');
				//.style('opacity', 0.9);

				this._mouseOverRect.append('text').text(data.value.toFixed(2)).style('color', 'black').style('font-size', '20px').style('text-align', 'center').style('pointer-events', 'none').attr('x', x - 10).attr('y', y + 20);

				/*this._mouseOverRect.select('text').each(function() {
    	//const bbox = this.getBBox();
    });
    
    this._mouseOverRect.each(function() {
    	console.error(this.querySelector('rect'));
    });*/

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

		return ResistencyMatrix;
	}();

	window.infect = window.infect || {};
	window.infect.ResistencyMatrix = ResistencyMatrix;
})();
//# sourceMappingURL=resistency-matrix-old.es2015.js.map
