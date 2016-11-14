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
			value: function updateData(data, keyName) {

				this._data = data;
				console.log('ResistencyMatrix / updateData: Update data to %o', data);
				this._keyName = keyName;
				if (this._container && this._data) this.drawMatrix();
			}

			/**
   * Main method. Draws the matrix with data and container provided.
   */

		}, {
			key: 'drawMatrix',
			value: function drawMatrix() {

				// Get row scale
				this._columnScale = this._createColumnScale();
				this._colorScale = this._createColorScale();

				this._elements.rows = this._drawRows(this._columnScale.bandwidth());
				this._elements.columns = this._drawColumnHeads();

				this._updateColumnScale();
				this._updatePositionsAndSizes();
			}

			/**
   * Draws the rows
   * @param {Number} rowHeight			Width of a single row
   */

		}, {
			key: '_drawRows',
			value: function _drawRows(rowHeight) {

				console.log('ResistencyMatrix / _drawRows: Draw rows with data %o and height %o', Object.values(this._data), rowHeight);

				// Reference to this, needed for each
				var self = this;

				// g
				var rows = this._elements.svg.selectAll('.row').data(Object.entries(this._data)).enter().append('g').attr('class', 'row').attr('transform', function (d, i) {
					return 'translate(0, ' + i * rowHeight + ')';
				})
				// Cannot use arrow functions as we need this
				.each(function (row) {
					self._drawCell(this, row, rowHeight);
				});

				this._createSingleRowLabel(rows);
				return rows;
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
				return element.append('text').attr('class', 'label').attr('text-anchor', 'end').text(function (d, i) {
					return d[0];
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

				var data = Object.keys(Object.values(this._data)[0]);
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
					//console.warn
					t.toFixed(3), hue.toFixed(3), saturation.toFixed(3), lightness.toFixed(3);
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
				var amountOfDataSets = Object.values(Object.values(this._data)[0]).length - 1;
				var width = this._getSvgWidth() - 50 - this._getMaxRowLabelWidth() - this._configuration.spaceBetweenLabelsAndMatrix - amountOfDataSets * this._configuration.lineWeight;
				console.log('ResistencyMatrix / _updateColumnScale: Col # is %o, svg width is %o, width column content is %o', amountOfDataSets, this._getSvgWidth(), width);

				// Update scale
				this._columnScale.range([0, width]);
			}

			/**
   * Returns width of widest row label
   */

		}, {
			key: '_getMaxRowLabelWidth',
			value: function _getMaxRowLabelWidth() {
				if (!this._elements.rows) return 0;

				var maxRowLabelWidth = 0;
				this._elements.rows.select('.label').each(function () {
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
				this._elements.columns.select('.label').each(function () {
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
				this._elements.rows.each(function (d, i) {
					d3.select(this).attr('height', bandWidth).attr('transform', 'translate(0, ' + (i * Math.floor(bandWidth) + Math.floor(maxColLabelHeight) + self._configuration.spaceBetweenLabelsAndMatrix + i * self._configuration.lineWeight) + ')');
				});

				// Update cell's rectangles
				this._elements.rows.selectAll('.cell').each(function (d, i) {
					self._alignCell(this, Math.floor(self._columnScale.bandwidth()), i, Math.floor(maxRowLabelWidth + self._configuration.spaceBetweenLabelsAndMatrix), self._configuration.lineWeight);
				}).select('rect').each(function () {
					self._resizeCell(this, Math.floor(self._columnScale.bandwidth()));
				});

				// Update cols
				this._elements.columns.each(function (d, i) {
					// step / 2: Make sure we're kinda centered over the col
					var left = i * (Math.floor(step) + self._configuration.lineWeight) + maxRowLabelWidth + self._configuration.spaceBetweenLabelsAndMatrix + step / 2;
					d3.select(this).attr('transform', 'translate(' + left + ', ' + maxColLabelHeight + ')');
				});

				// Update label's x position
				this._elements.rows.select('.label').attr('x', maxRowLabelWidth).each(function () {
					d3.select(this).attr('y', bandWidth / 2 + this.getBBox().height / 2);
				});

				// Update col label's y position
				this._elements.columns.select('.label').attr('transform', 'rotate(-45)');

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
				var firstRow = Object.values(this._data)[0];
				var headers = Object.keys(firstRow);
				console.log('ResistencyMatrix / _drawColumnHeads: Headers are %o', headers);

				// <g> and transform
				var colHeads = this._elements.svg.selectAll('.column').data(headers).enter().append('g')
				// translation will be done in this.updatePositionsAndSizes
				.attr('class', 'column');

				// Text
				colHeads.append('text').attr('class', 'label').attr('text-anchor', 'start').text(function (d) {
					return d;
				});

				return colHeads;
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
				var filteredData = Object.values(rowData[1]).filter(function (entry) {
					return entry.key !== 'name';
				}).map(function (entry) {
					return entry.value;
				});

				// <g>
				var cells = d3.select(rowElement).selectAll('.cell').data(filteredData).enter().append('g').attr('class', 'cell');

				// Rect
				cells.each(function (d) {
					d3.select(this).append('rect').style('fill', d ? self._colorScale(d) : '#fff').style('stroke', d === null ? '#dedede' : '').style('stroke-width', d === null ? 1 : 0)
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

				return cells;
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
				if (!data) return;

				var svg = void 0;
				this._elements.svg.each(function () {
					svg = this;
				});

				var y = element.getBoundingClientRect().top - svg.getBoundingClientRect().top,
				    x = element.getBoundingClientRect().left - svg.getBoundingClientRect().left,
				    width = parseInt(d3.select(element).attr('width'), 10) + 40,
				    height = parseInt(d3.select(element).attr('height'), 10) + 40;

				this._mouseOverRect = this._elements.svg.append('g');

				this._mouseOverRect.append('rect').attr('x', x - 20).attr('y', y - 20).style('fill', element.style.fill).style('pointer-events', 'none').attr('height', height).attr('width', width).style('pointer-events', 'none').style('opacity', 0.9);

				this._mouseOverRect.append('text').text(data.toFixed(2)).style('color', 'black').style('font-size', '20px').style('text-align', 'center').style('pointer-events', 'none').attr('x', x - 10).attr('y', y + 20);

				this._mouseOverRect.select('text').each(function () {
					//const bbox = this.getBBox();
				});
				//console.error(this._mouseOverRect, this._mouseOverRect.querySelector('text').getBBox());

				// Highlight row
				var row = this._getParentElement(element, '.row');
				d3.select(row).classed('active', true);

				// Highlight col
				var cell = this._getParentElement(element, '.cell');
				var colIndex = this._getChildNodeIndex(cell, '.cell');
				var currentCol = this._elements.columns.filter(function (d, i) {
					return i === colIndex;
				});
				currentCol.classed('active', true);
			}
		}, {
			key: '_mouseOutHandler',
			value: function _mouseOutHandler() {

				if (this._mouseOverRect) this._mouseOverRect.remove();

				this._elements.rows.classed('active', false);
				this._elements.columns.classed('active', false);
			}
		}]);

		return ResistencyMatrix;
	}();

	window.infect = window.infect || {};
	window.infect.ResistencyMatrix = ResistencyMatrix;
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL21hdHJpeC9yZXNpc3RlbmN5LW1hdHJpeC5lczIwMTUuanMiXSwibmFtZXMiOlsiUmVzaXN0ZW5jeU1hdHJpeCIsImNvbnRhaW5lciIsImRhdGEiLCJFcnJvciIsIl9jb250YWluZXIiLCJfZGF0YSIsIl9jb25maWd1cmF0aW9uIiwic3BhY2VCZXR3ZWVuTGFiZWxzQW5kTWF0cml4IiwibGluZVdlaWdodCIsIl9lbGVtZW50cyIsInN2ZyIsIl9jcmVhdGVTVkciLCJkcmF3TWF0cml4Iiwia2V5TmFtZSIsImNvbnNvbGUiLCJsb2ciLCJfa2V5TmFtZSIsIl9jb2x1bW5TY2FsZSIsIl9jcmVhdGVDb2x1bW5TY2FsZSIsIl9jb2xvclNjYWxlIiwiX2NyZWF0ZUNvbG9yU2NhbGUiLCJyb3dzIiwiX2RyYXdSb3dzIiwiYmFuZHdpZHRoIiwiY29sdW1ucyIsIl9kcmF3Q29sdW1uSGVhZHMiLCJfdXBkYXRlQ29sdW1uU2NhbGUiLCJfdXBkYXRlUG9zaXRpb25zQW5kU2l6ZXMiLCJyb3dIZWlnaHQiLCJPYmplY3QiLCJ2YWx1ZXMiLCJzZWxmIiwic2VsZWN0QWxsIiwiZW50cmllcyIsImVudGVyIiwiYXBwZW5kIiwiYXR0ciIsImQiLCJpIiwiZWFjaCIsInJvdyIsIl9kcmF3Q2VsbCIsIl9jcmVhdGVTaW5nbGVSb3dMYWJlbCIsInByb3BlcnR5IiwiZWxlbWVudCIsInRleHQiLCJkMyIsInNlbGVjdCIsImtleXMiLCJzY2FsZUJhbmQiLCJkb21haW4iLCJyYW5nZSIsIl9nZXRTdmdXaWR0aCIsInNjYWxlU2VxdWVudGlhbCIsInQiLCJzYXR1cmF0aW9uIiwibGlnaHRuZXNzIiwiaHVlIiwidG9GaXhlZCIsImhzbCIsInRvU3RyaW5nIiwiYW1vdW50T2ZEYXRhU2V0cyIsImxlbmd0aCIsIndpZHRoIiwiX2dldE1heFJvd0xhYmVsV2lkdGgiLCJtYXhSb3dMYWJlbFdpZHRoIiwiZ2V0QkJveCIsIm1heENvbExhYmVsSGVpZ2h0IiwiaGVpZ2h0IiwiX2dldE1heENvbHVtbkxhYmVsSGVpZ2h0IiwiYmFuZFdpZHRoIiwic3RlcCIsIk1hdGgiLCJmbG9vciIsIl9hbGlnbkNlbGwiLCJfcmVzaXplQ2VsbCIsImxlZnQiLCJhbW91bnRPZkNvbHMiLCJjb2xIZWlnaHQiLCJzdHlsZSIsImNlbGwiLCJkaW1lbnNpb25zIiwibnVtYmVyIiwib2Zmc2V0IiwiZmlyc3RSb3ciLCJoZWFkZXJzIiwiY29sSGVhZHMiLCJyb3dFbGVtZW50Iiwicm93RGF0YSIsImZpbHRlcmVkRGF0YSIsImZpbHRlciIsImVudHJ5Iiwia2V5IiwibWFwIiwidmFsdWUiLCJjZWxscyIsIm9uIiwiX21vdXNlT3ZlckhhbmRsZXIiLCJjYWxsIiwiX21vdXNlT3V0SGFuZGxlciIsInNlbGVjdG9yIiwibWF0Y2giLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwibWF0Y2hlcyIsInBhcmVudE5vZGUiLCJjaGlsZCIsImluZGV4IiwicHJldmlvdXNTaWJsaW5nIiwieSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsIngiLCJwYXJzZUludCIsIl9tb3VzZU92ZXJSZWN0IiwiZmlsbCIsIl9nZXRQYXJlbnRFbGVtZW50IiwiY2xhc3NlZCIsImNvbEluZGV4IiwiX2dldENoaWxkTm9kZUluZGV4IiwiY3VycmVudENvbCIsInJlbW92ZSIsIndpbmRvdyIsImluZmVjdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsQ0FBQyxZQUFNOztBQUVOOztBQUVBOzs7Ozs7QUFKTSxLQVVBQSxnQkFWQTtBQVlMLDRCQUFZQyxTQUFaLEVBQXVCQyxJQUF2QixFQUE2QjtBQUFBOztBQUU1QixPQUFJLENBQUNELFNBQUwsRUFBZ0I7QUFDZixVQUFNLElBQUlFLEtBQUosQ0FBVSwrRUFBVixDQUFOO0FBQ0E7O0FBRUQsUUFBS0MsVUFBTCxHQUFtQkgsU0FBbkI7QUFDQSxRQUFLSSxLQUFMLEdBQWdCSCxJQUFoQjs7QUFFQSxRQUFLSSxjQUFMLEdBQXNCO0FBQ3JCQyxpQ0FBK0IsRUFEVjtBQUVuQkMsZ0JBQWlCO0FBRkUs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S0gsY0FBVCxFQUF5QixLQUFLQSxjQUFMLENBQW9CTyxNQUFwQjs7QUFFekIsU0FBS2hILFNBQUwsQ0FBZVksSUFBZixDQUFvQmdHLE9BQXBCLENBQTRCLFFBQTVCLEVBQXNDLEtBQXRDO0FBQ0EsU0FBSzVHLFNBQUwsQ0FBZWUsT0FBZixDQUF1QjZGLE9BQXZCLENBQStCLFFBQS9CLEVBQXlDLEtBQXpDO0FBRUE7QUExZUk7O0FBQUE7QUFBQTs7QUE4ZU5LLFFBQU9DLE1BQVAsR0FBZ0JELE9BQU9DLE1BQVAsSUFBaUIsRUFBakM7QUFDQUQsUUFBT0MsTUFBUCxDQUFjM0gsZ0JBQWQsR0FBaUNBLGdCQUFqQztBQUVBLENBamZEIiwiZmlsZSI6ImpzL21hdHJpeC9yZXNpc3RlbmN5LW1hdHJpeC5lczIwMTUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIoKCkgPT4ge1xuXG5cdC8qIGdsb2JhbCBkMywgd2luZG93ICovXG5cblx0LyoqXG5cdCogRHJhd3MgYSBtYXRyaXggd2l0aCByZXNpc3RlbmNpZXMuIFxuXHQqIFJvd3M6IEFudGkgYmlvdGljc1xuXHQqIENvbHM6IEJhY3RlcmlhXG5cdCogQ2VsbHM6IENvbG9yZWQgYWNjb3JkaW5nIHRvIHJlc2lzdGVuY3lcblx0Ki9cblx0Y2xhc3MgUmVzaXN0ZW5jeU1hdHJpeCB7XG5cblx0XHRjb25zdHJ1Y3Rvcihjb250YWluZXIsIGRhdGEpIHtcblxuXHRcdFx0aWYgKCFjb250YWluZXIpIHtcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdSZXNpc3RlbmN5TWF0cml4OiBBdCBsZWFzdCBvbmUgYXJndW1lbnQgKGNvbnRhaW5lcikgaXMgbmVlZGVkIGluIGNvbnN0cnVjdG9yLicpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9jb250YWluZXIgXHQ9IGNvbnRhaW5lcjtcblx0XHRcdHRoaXMuX2RhdGEgXHRcdFx0PSBkYXRhO1xuXG5cdFx0XHR0aGlzLl9jb25maWd1cmF0aW9uXHQ9IHtcblx0XHRcdFx0c3BhY2VCZXR3ZWVuTGFiZWxzQW5kTWF0cml4XHRcdDogMjBcblx0XHRcdFx0LCBsaW5lV2VpZ2h0XHRcdFx0XHRcdDogNVxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gSG9sZHMgcmVmZXJlbmNlc1xuXHRcdFx0dGhpcy5fZWxlbWVudHNcdFx0PSB7fTtcblxuXHRcdFx0Ly8gQ3JlYXRlIFNWR1xuXHRcdFx0dGhpcy5fZWxlbWVudHMuc3ZnID0gdGhpcy5fY3JlYXRlU1ZHKCk7XG5cblx0XHRcdC8vIElmIGFsbCByZXF1aXJlZCBkYXRhIGlzIGF2YWlsYWJsZSwgZHJhdyBtYXRyaXhcblx0XHRcdGlmICh0aGlzLl9jb250YWluZXIgJiYgdGhpcy5fZGF0YSkgdGhpcy5kcmF3TWF0cml4KCk7XG5cblx0XHR9XG5cblxuXG5cdFx0LyoqXG5cdFx0KiBVcGRhdGVzIHRoZSBtYXRyaXgnIGRhdGFcblx0XHQqIEBwYXJhbSB7QXJyYXl9IGRhdGFcdFx0XHRcdEFycmF5IChyb3dzKSBvZiBBcnJheXMgKGNvbHMpIHdoaWNoIGhvbGQgdGhlIHZhbHVlcyAoT2JqZWN0KVxuXHRcdCogQHBhcmFtIHtTdHJpbmd9wqBmaWVsZE5hbWVcdFx0XHRWYWx1ZXMgYXJlIHBhc3NlZCBpbiBhbiBvYmplY3Q7IG5hbWUgb2YgdGhlIGtleSB0aGF0IGhvbGRzIHRoZVxuXHRcdCpcdFx0XHRcdFx0XHRcdFx0XHRkYXRhIHdoaWNoIHNob3VsZCBiZSBkaXNwbGF5ZWQgaW4gdGFibGUuXG5cdFx0Ki9cblx0XHR1cGRhdGVEYXRhKGRhdGEsIGtleU5hbWUpIHtcblxuXHRcdFx0dGhpcy5fZGF0YSA9IGRhdGE7XG5cdFx0XHRjb25zb2xlLmxvZygnUmVzaXN0ZW5jeU1hdHJpeCAvIHVwZGF0ZURhdGE6IFVwZGF0ZSBkYXRhIHRvICVvJywgZGF0YSk7XG5cdFx0XHR0aGlzLl9rZXlOYW1lID0ga2V5TmFtZTtcblx0XHRcdGlmICh0aGlzLl9jb250YWluZXIgJiYgdGhpcy5fZGF0YSkgdGhpcy5kcmF3TWF0cml4KCk7XG5cblx0XHR9XG5cblxuXG5cblx0XHQvKipcblx0XHQqIE1haW4gbWV0aG9kLiBEcmF3cyB0aGUgbWF0cml4IHdpdGggZGF0YSBhbmQgY29udGFpbmVyIHByb3ZpZGVkLlxuXHRcdCovXG5cdFx0ZHJhd01hdHJpeCgpIHtcblxuXHRcdFx0Ly8gR2V0IHJvdyBzY2FsZVxuXHRcdFx0dGhpcy5fY29sdW1uU2NhbGUgPSB0aGlzLl9jcmVhdGVDb2x1bW5TY2FsZSgpO1xuXHRcdFx0dGhpcy5fY29sb3JTY2FsZSA9IHRoaXMuX2NyZWF0ZUNvbG9yU2NhbGUoKTtcblxuXHRcdFx0dGhpcy5fZWxlbWVudHMucm93cyA9IHRoaXMuX2RyYXdSb3dzKCB0aGlzLl9jb2x1bW5TY2FsZS5iYW5kd2lkdGgoKSApO1xuXHRcdFx0dGhpcy5fZWxlbWVudHMuY29sdW1ucyA9IHRoaXMuX2RyYXdDb2x1bW5IZWFkcygpO1xuXG5cdFx0XHR0aGlzLl91cGRhdGVDb2x1bW5TY2FsZSgpO1xuXHRcdFx0dGhpcy5fdXBkYXRlUG9zaXRpb25zQW5kU2l6ZXMoKTtcblxuXHRcdH1cblxuXG5cblx0XHQvKipcblx0XHQqIERyYXdzIHRoZSByb3dzXG5cdFx0KiBAcGFyYW0ge051bWJlcn0gcm93SGVpZ2h0XHRcdFx0V2lkdGggb2YgYSBzaW5nbGUgcm93XG5cdFx0Ki9cblx0XHRfZHJhd1Jvd3Mocm93SGVpZ2h0KSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKCdSZXNpc3RlbmN5TWF0cml4IC8gX2RyYXdSb3dzOiBEcmF3IHJvd3Mgd2l0aCBkYXRhICVvIGFuZCBoZWlnaHQgJW8nLCBPYmplY3QudmFsdWVzKHRoaXMuX2RhdGEpLCByb3dIZWlnaHQpO1xuXG5cdFx0XHQvLyBSZWZlcmVuY2UgdG8gdGhpcywgbmVlZGVkIGZvciBlYWNoXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRcdFx0Ly8gZ1xuXHRcdFx0Y29uc3Qgcm93cyA9IHRoaXMuX2VsZW1lbnRzLnN2Z1xuXHRcdFx0XHQuc2VsZWN0QWxsKCcucm93Jylcblx0XHRcdFx0LmRhdGEoT2JqZWN0LmVudHJpZXModGhpcy5fZGF0YSkpXG5cdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0LmFwcGVuZCgnZycpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAncm93Jylcblx0XHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAoZCwgaSkgPT4gYHRyYW5zbGF0ZSgwLCAke2kgKiByb3dIZWlnaHR9KWApXG5cdFx0XHRcdFx0XHQvLyBDYW5ub3QgdXNlIGFycm93IGZ1bmN0aW9ucyBhcyB3ZSBuZWVkIHRoaXNcblx0XHRcdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKHJvdykge1xuXHRcdFx0XHRcdFx0XHRzZWxmLl9kcmF3Q2VsbCggdGhpcywgcm93LCByb3dIZWlnaHQgKTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cblx0XHRcdHRoaXMuX2NyZWF0ZVNpbmdsZVJvd0xhYmVsKHJvd3MpO1xuXHRcdFx0cmV0dXJuIHJvd3M7XG5cblx0XHR9XG5cblxuXG5cdFx0LyoqXG5cdFx0KiBSZXR1cm5zIHRoZSBTVkcncyB3aWR0aCBcblx0XHQqIEByZXR1cm4ge051bWJlcn1cblx0XHQqL1xuXHRcdF9nZXRTdmdXaWR0aCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbGVtZW50cy5zdmcucHJvcGVydHkoJ2NsaWVudFdpZHRoJyk7XG5cdFx0fVxuXG5cblxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIHNpbmdsZSByb3cgbGFiZWwuIE5lZWRlZCB0byBmaXJzdCBtZWFzdXJlIGFuZCB0aGVuXG5cdFx0KiBkcmF3IGl0IGF0IHRoZSByaWdodCBwbGFjZVxuXHRcdCovXG5cdFx0X2NyZWF0ZVNpbmdsZVJvd0xhYmVsKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50XG5cdFx0XHRcdC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHQuYXR0cignY2xhc3MnLCAnbGFiZWwnKVxuXHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnZW5kJylcblx0XHRcdFx0LnRleHQoKGQsIGkpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gZFswXTtcblx0XHRcdFx0fSk7XG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQqIENyZWF0ZXMgYW5kIHJldHVybnMgdGhlIFNWR1xuXHRcdCovXG5cdFx0X2NyZWF0ZVNWRygpIHtcblx0XHRcdHJldHVybiBkMy5zZWxlY3QodGhpcy5fY29udGFpbmVyKVxuXHRcdFx0XHQuYXBwZW5kKCdzdmcnKTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlcyB0aGUgc2NhbGUgZm9yIGFsbCBjb2x1bW5zLCBpLmUuIGZvciBhbGwgdGhlIHZlcnRpY2FsIGVudGl0aWVzIOKAk8Kgcm93IGRhdGFcblx0XHQqIG11c3QgYmUgdGFrZW4uIFRoaXMgaXMgZG9uZSBiZWZvcmUgdGhlIGxhYmVscyBhcmUgdGhlcmUsIHRoZXJlZm9yZVxuXHRcdCogdGFrZSB0aGUgd2hvbGUgU1ZHIHdpZHRoLlxuXHRcdCovXG5cdFx0X2NyZWF0ZUNvbHVtblNjYWxlKCkge1xuXG5cdFx0XHRjb25zdCBkYXRhID0gT2JqZWN0LmtleXMoT2JqZWN0LnZhbHVlcyh0aGlzLl9kYXRhKVswXSk7XG5cdFx0XHRyZXR1cm4gZDMuc2NhbGVCYW5kKClcblx0XHRcdFx0LmRvbWFpbihkYXRhKVxuXHRcdFx0XHQvLyAtNTA6IFdlIHR1cm4gdGhlIGNvbCBsYWJlbHMgYnkgNDXCsCwgdGhpcyB0YWtlcyBhIGJpdCBvZiBzcGFjZVxuXHRcdFx0XHQucmFuZ2UoWzAsIHRoaXMuX2dldFN2Z1dpZHRoKCkgLSA1MF0pO1xuXG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQqIFJldHVybnMgdGhlIHNjYWxlIGZvciBjb2xvcmluZyB0aGUgY2VsbHNcblx0XHQqL1xuXHRcdF9jcmVhdGVDb2xvclNjYWxlKCkge1xuXHRcdFx0cmV0dXJuIG5ldyBkMy5zY2FsZVNlcXVlbnRpYWwoKHQpID0+IHtcblx0XHRcdFx0Ly9jb25zdCBzYXR1cmF0aW9uID0gdCAqIDAuMiArIDAuNDsgLy8gNTDigJM2MCVcblx0XHRcdFx0Y29uc3Qgc2F0dXJhdGlvbiA9IDAuNztcblx0XHRcdFx0Y29uc3QgbGlnaHRuZXNzID0gKDEgLSB0KSAqIDAuNiArIDAuNDsgLy8gMzDigJM4MCVcblx0XHRcdFx0Ly9jb25zdCBsaWdodG5lc3MgPSAwLjU7XG5cdFx0XHRcdC8vIEh1ZSBuZWVkcyB2YWx1ZXMgYmV0d2VlbiA0MCBhbmQgOTBcblx0XHRcdFx0Y29uc3QgaHVlID0gdCAqIDEwMDtcblx0XHRcdFx0Ly9jb25zb2xlLndhcm5cblx0XHRcdFx0KHQudG9GaXhlZCgzKSwgaHVlLnRvRml4ZWQoMyksIHNhdHVyYXRpb24udG9GaXhlZCgzKSwgbGlnaHRuZXNzLnRvRml4ZWQoMykpO1xuXHRcdFx0XHRjb25zdCBoc2wgPSBkMy5oc2woaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MpO1xuXHRcdFx0XHRyZXR1cm4gaHNsLnRvU3RyaW5nKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogVXBkYXRlcyB0aGUgY29sIHNjYWxlLiBJcyBjYWxsZWQgYWZ0ZXIgbGFiZWxzIHdlcmUgZHJhd24gYW5kIG1lYXN1cmVkLiBTY2FsZSBzaG91bGQgdGFrZSB1cFxuXHRcdCogYWxsIGhvcml6b250YWwgc3BhY2UgdGhhdCdzIGxlZnQuIFxuXHRcdCovXG5cdFx0X3VwZGF0ZUNvbHVtblNjYWxlKCkge1xuXG5cdFx0XHQvLyBSZW1vdmUgYW1vdW50IG9mIGVudHJpZXMgc28gdGhhdCB3ZSBjYW4gaW5zZXJ0IGEgbGluZSBvZiAxIHB4XG5cdFx0XHRjb25zdCBhbW91bnRPZkRhdGFTZXRzID0gT2JqZWN0LnZhbHVlcyhPYmplY3QudmFsdWVzKHRoaXMuX2RhdGEpWzBdKS5sZW5ndGggLSAxO1xuXHRcdFx0Y29uc3Qgd2lkdGggPSB0aGlzLl9nZXRTdmdXaWR0aCgpIC0gNTAgLSB0aGlzLl9nZXRNYXhSb3dMYWJlbFdpZHRoKCkgLSB0aGlzLl9jb25maWd1cmF0aW9uLnNwYWNlQmV0d2VlbkxhYmVsc0FuZE1hdHJpeCAtIGFtb3VudE9mRGF0YVNldHMgKiB0aGlzLl9jb25maWd1cmF0aW9uLmxpbmVXZWlnaHQ7XG5cdFx0XHRjb25zb2xlLmxvZyggJ1Jlc2lzdGVuY3lNYXRyaXggLyBfdXBkYXRlQ29sdW1uU2NhbGU6IENvbCAjIGlzICVvLCBzdmcgd2lkdGggaXMgJW8sIHdpZHRoIGNvbHVtbiBjb250ZW50IGlzICVvJywgYW1vdW50T2ZEYXRhU2V0cywgdGhpcy5fZ2V0U3ZnV2lkdGgoKSwgd2lkdGggKTtcblxuXHRcdFx0Ly8gVXBkYXRlIHNjYWxlXG5cdFx0XHR0aGlzLl9jb2x1bW5TY2FsZS5yYW5nZShbMCwgd2lkdGhdKTtcblxuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBSZXR1cm5zIHdpZHRoIG9mIHdpZGVzdCByb3cgbGFiZWxcblx0XHQqL1xuXHRcdF9nZXRNYXhSb3dMYWJlbFdpZHRoKCkge1xuXHRcdFx0aWYgKCF0aGlzLl9lbGVtZW50cy5yb3dzKSByZXR1cm4gMDtcblxuXHRcdFx0bGV0IG1heFJvd0xhYmVsV2lkdGggPSAwO1xuXHRcdFx0dGhpcy5fZWxlbWVudHMucm93cy5zZWxlY3QoJy5sYWJlbCcpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0Y29uc3Qgd2lkdGggPSB0aGlzLmdldEJCb3goKS53aWR0aDtcblx0XHRcdFx0aWYgKHdpZHRoID4gbWF4Um93TGFiZWxXaWR0aCkgbWF4Um93TGFiZWxXaWR0aCA9IHdpZHRoO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbWF4Um93TGFiZWxXaWR0aDtcblxuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBSZXR1cm5zIHdpZHRoIG9mIHdpZGVzdCBjb2x1bW4gbGFiZWxcblx0XHQqL1xuXHRcdF9nZXRNYXhDb2x1bW5MYWJlbEhlaWdodCgpIHtcblx0XHRcdGxldCBtYXhDb2xMYWJlbEhlaWdodCA9IDA7XG5cdFx0XHR0aGlzLl9lbGVtZW50cy5jb2x1bW5zLnNlbGVjdCgnLmxhYmVsJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgaGVpZ2h0ID0gdGhpcy5nZXRCQm94KCkud2lkdGg7XG5cdFx0XHRcdGlmIChoZWlnaHQgPiBtYXhDb2xMYWJlbEhlaWdodCkgbWF4Q29sTGFiZWxIZWlnaHQgPSBoZWlnaHQ7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBtYXhDb2xMYWJlbEhlaWdodDtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogVXBkYXRlcyB0aGUgc2NhbGVzIGFmdGVyIHRoZSBsYWJlbHMgKHJvdy9jb2wpIHdlcmUgZHJhd24gYW5kIHVwZGF0ZXMgY2VsbHMvcm93cyB0byBcblx0XHQqIHJlc3BlY3Qgd2lkdGgvaGVpZ2h0IG9mIHRoZSBsYWJlbHMuXG5cdFx0KiBSZXNldHMgaGVpZ2h0IG9mIHRoZSBTVkcgdG8gbWF0Y2ggaXRzIGNvbnRlbnRzLlxuXHRcdCovXG5cdFx0X3VwZGF0ZVBvc2l0aW9uc0FuZFNpemVzKCkge1xuXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRcdFx0Y29uc3QgbWF4Um93TGFiZWxXaWR0aCA9IHRoaXMuX2dldE1heFJvd0xhYmVsV2lkdGgoKVxuXHRcdFx0XHQsIG1heENvbExhYmVsSGVpZ2h0ID0gdGhpcy5fZ2V0TWF4Q29sdW1uTGFiZWxIZWlnaHQoKTtcblxuXHRcdFx0Y29uc3QgYmFuZFdpZHRoIFx0PSB0aGlzLl9jb2x1bW5TY2FsZS5iYW5kd2lkdGgoKVxuXHRcdFx0XHQsIHN0ZXBcdFx0XHQ9dGhpcy5fY29sdW1uU2NhbGUuc3RlcCgpO1xuXG5cdFx0XHRjb25zb2xlLmxvZygnUmVzaXN0ZW5jeU1hdHJpeCAvIF91cGRhdGVQb3NpdGlvbnNBbmRTaXplczogbWF4Um93TGFiZWxXaWR0aCcsIG1heFJvd0xhYmVsV2lkdGgsICdjb2xsYWJlbGhlaWdodCcsIG1heENvbExhYmVsSGVpZ2h0LCAnYmFuZFdpZHRoJywgYmFuZFdpZHRoKTtcblxuXHRcdFx0Ly8gVXBkYXRlIHJvd3Ncblx0XHRcdHRoaXMuX2VsZW1lbnRzLnJvd3Ncblx0XHRcdFx0LmVhY2goZnVuY3Rpb24oZCxpKXtcblx0XHRcdFx0XHRkMy5zZWxlY3QodGhpcylcblx0XHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBiYW5kV2lkdGgpXG5cdFx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAkeyBpICogTWF0aC5mbG9vciggYmFuZFdpZHRoICkgKyBNYXRoLmZsb29yKCBtYXhDb2xMYWJlbEhlaWdodCApICsgc2VsZi5fY29uZmlndXJhdGlvbi5zcGFjZUJldHdlZW5MYWJlbHNBbmRNYXRyaXggKyBpICogc2VsZi5fY29uZmlndXJhdGlvbi5saW5lV2VpZ2h0IH0pYCk7XG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdC8vIFVwZGF0ZSBjZWxsJ3MgcmVjdGFuZ2xlc1xuXHRcdFx0dGhpcy5fZWxlbWVudHMucm93c1xuXHRcdFx0XHQuc2VsZWN0QWxsKCcuY2VsbCcpXG5cdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRzZWxmLl9hbGlnbkNlbGwodGhpcywgTWF0aC5mbG9vcihzZWxmLl9jb2x1bW5TY2FsZS5iYW5kd2lkdGgoKSksIGksIE1hdGguZmxvb3IobWF4Um93TGFiZWxXaWR0aCArIHNlbGYuX2NvbmZpZ3VyYXRpb24uc3BhY2VCZXR3ZWVuTGFiZWxzQW5kTWF0cml4KSwgc2VsZi5fY29uZmlndXJhdGlvbi5saW5lV2VpZ2h0KTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnNlbGVjdCgncmVjdCcpXG5cdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHNlbGYuX3Jlc2l6ZUNlbGwodGhpcywgTWF0aC5mbG9vcihzZWxmLl9jb2x1bW5TY2FsZS5iYW5kd2lkdGgoKSkpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0Ly8gVXBkYXRlIGNvbHNcblx0XHRcdHRoaXMuX2VsZW1lbnRzLmNvbHVtbnNcblx0XHRcdFx0LmVhY2goZnVuY3Rpb24oZCxpKSB7XG5cdFx0XHRcdFx0Ly8gc3RlcCAvIDI6IE1ha2Ugc3VyZSB3ZSdyZSBraW5kYSBjZW50ZXJlZCBvdmVyIHRoZSBjb2xcblx0XHRcdFx0XHRjb25zdCBsZWZ0ID0gaSAqIChNYXRoLmZsb29yKHN0ZXApICsgc2VsZi5fY29uZmlndXJhdGlvbi5saW5lV2VpZ2h0KSArIG1heFJvd0xhYmVsV2lkdGggKyBzZWxmLl9jb25maWd1cmF0aW9uLnNwYWNlQmV0d2VlbkxhYmVsc0FuZE1hdHJpeCArIHN0ZXAgLyAyO1xuXHRcdFx0XHRcdGQzLnNlbGVjdCh0aGlzKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHsgbGVmdCB9LCAkeyBtYXhDb2xMYWJlbEhlaWdodCB9KWApO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0Ly8gVXBkYXRlIGxhYmVsJ3MgeCBwb3NpdGlvblxuXHRcdFx0dGhpcy5fZWxlbWVudHMucm93c1xuXHRcdFx0XHQuc2VsZWN0KCcubGFiZWwnKVxuXHRcdFx0XHQuYXR0cigneCcsIG1heFJvd0xhYmVsV2lkdGgpXG5cdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGQzLnNlbGVjdCh0aGlzKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3knLCBiYW5kV2lkdGggLyAyICsgdGhpcy5nZXRCQm94KCkuaGVpZ2h0IC8gMik7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHQvLyBVcGRhdGUgY29sIGxhYmVsJ3MgeSBwb3NpdGlvblxuXHRcdFx0dGhpcy5fZWxlbWVudHMuY29sdW1uc1xuXHRcdFx0XHQuc2VsZWN0KCcubGFiZWwnKVxuXHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgJ3JvdGF0ZSgtNDUpJyk7XG5cblx0XHRcdC8vIFVwZGF0ZSBzdmcgaGVpZ2h0XG5cdFx0XHRjb25zdCBhbW91bnRPZkNvbHMgPSAoIE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpLmxlbmd0aCApXG5cdFx0XHRcdCwgY29sSGVpZ2h0ID0gdGhpcy5fY29sdW1uU2NhbGUuc3RlcCgpO1xuXHRcdFx0dGhpcy5fY29udGFpbmVyLnN0eWxlLmhlaWdodCA9ICh0aGlzLl9nZXRNYXhDb2x1bW5MYWJlbEhlaWdodCgpICsgKGNvbEhlaWdodCArIHRoaXMuX2NvbmZpZ3VyYXRpb24ubGluZVdlaWdodCkgKiBhbW91bnRPZkNvbHMgKyB0aGlzLl9jb25maWd1cmF0aW9uLnNwYWNlQmV0d2VlbkxhYmVsc0FuZE1hdHJpeCkgKyAncHgnO1xuXG5cdFx0fVxuXG5cblxuXHRcdC8qKlxuXHRcdCogQWxpZ25zIGEgc2luZ2xlIGNlbGxcblx0XHQqL1xuXHRcdF9hbGlnbkNlbGwoY2VsbCwgZGltZW5zaW9ucywgbnVtYmVyLCBvZmZzZXQgPSAwLCBsaW5lV2VpZ2h0ID0gMSkge1xuXHRcdFx0ZDMuc2VsZWN0KGNlbGwpXG5cdFx0XHRcdC8vICsgbnVtYmVyOiBTcGFjZSAxIHB4IGJldHdlZW4gY2VsbHNcblx0XHRcdFx0LmF0dHIoJ3RyYW5zZm9ybScsIGB0cmFuc2xhdGUoJHsgb2Zmc2V0ICsgbnVtYmVyICogZGltZW5zaW9ucyArIG51bWJlciAqIGxpbmVXZWlnaHQgfSwwKWApO1xuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBSZXNpemVzIGEgc2luZ2xlIGNlbGxcblx0XHQqLyBcblx0XHRfcmVzaXplQ2VsbChjZWxsLCBkaW1lbnNpb25zKSB7XG5cdFx0XHRkMy5zZWxlY3QoY2VsbClcblx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIGRpbWVuc2lvbnMpXG5cdFx0XHRcdC5hdHRyKCd3aWR0aCcsIGRpbWVuc2lvbnMpO1xuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBEcmF3cyB0aGUgY29sdW1uIGhlYWRzLCB0aGVuIHJldHVybnMgdGhlIGNyZWF0ZWQgZWxlbWVudHNcblx0XHQqL1xuXHRcdF9kcmF3Q29sdW1uSGVhZHMoKSB7XG5cblx0XHRcdC8vIEdldCBoZWFkZXJzIGZyb20gZGF0YSAoa2V5cyBvZiBmaXJzdCBhcnJheSBpdGVtKVxuXHRcdFx0Y29uc3QgZmlyc3RSb3cgPSBPYmplY3QudmFsdWVzKHRoaXMuX2RhdGEpWzBdO1xuXHRcdFx0Y29uc3QgaGVhZGVycyA9IE9iamVjdC5rZXlzKGZpcnN0Um93KTtcblx0XHRcdGNvbnNvbGUubG9nKCdSZXNpc3RlbmN5TWF0cml4IC8gX2RyYXdDb2x1bW5IZWFkczogSGVhZGVycyBhcmUgJW8nLCBoZWFkZXJzKTtcblxuXHRcdFx0Ly8gPGc+IGFuZCB0cmFuc2Zvcm1cblx0XHRcdGNvbnN0IGNvbEhlYWRzID0gdGhpcy5fZWxlbWVudHMuc3ZnXG5cdFx0XHRcdC5zZWxlY3RBbGwoJy5jb2x1bW4nKVxuXHRcdFx0XHQuZGF0YShoZWFkZXJzKVxuXHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdC5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC8vIHRyYW5zbGF0aW9uIHdpbGwgYmUgZG9uZSBpbiB0aGlzLnVwZGF0ZVBvc2l0aW9uc0FuZFNpemVzXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2NvbHVtbicpO1xuXG5cdFx0XHQvLyBUZXh0XG5cdFx0XHRjb2xIZWFkc1xuXHRcdFx0XHQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2xhYmVsJylcblx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ3N0YXJ0Jylcblx0XHRcdFx0LnRleHQoZCA9PiBkKTtcblxuXHRcdFx0cmV0dXJuIGNvbEhlYWRzO1xuXG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQqIERyYXdzIGEgc2luZ2xlIHJlc2lzdGVuY3kgY2VsbFxuXHRcdCovXG5cdFx0X2RyYXdDZWxsKCByb3dFbGVtZW50LCByb3dEYXRhLCBkaW1lbnNpb25zICkge1xuXG5cdFx0XHQvL2NvbnNvbGUubG9nKCAnUmVzaXN0ZW5jeU1hdHJpeCAvIF9kcmF3Q2VsbDogcm93ICVvLCBkYXRhICVvLCBkaW1lbnNpb25zICVvJywgcm93RWxlbWVudCwgcm93RGF0YSwgZGltZW5zaW9ucyApO1xuXHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0XHRcdC8vIFJlbW92ZSAnbmFtZScgcHJvcGVydHkgb24gcm93IG9iamVjdFxuXHRcdFx0Y29uc3QgZmlsdGVyZWREYXRhID0gT2JqZWN0LnZhbHVlcyhyb3dEYXRhWzFdKVxuXHRcdFx0XHRcdC5maWx0ZXIoKGVudHJ5KSA9PiAgZW50cnkua2V5ICE9PSAnbmFtZScpXG5cdFx0XHRcdFx0Lm1hcCgoZW50cnkpID0+IGVudHJ5LnZhbHVlKTtcblxuXHRcdFx0Ly8gPGc+XG5cdFx0XHRjb25zdCBjZWxscyA9IGQzLnNlbGVjdChyb3dFbGVtZW50KVxuXHRcdFx0XHQuc2VsZWN0QWxsKCcuY2VsbCcpXG5cdFx0XHRcdC5kYXRhKGZpbHRlcmVkRGF0YSlcblx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnY2VsbCcpO1xuXG5cdFx0XHQvLyBSZWN0XG5cdFx0XHRjZWxscy5lYWNoKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpXG5cdFx0XHRcdFx0LmFwcGVuZCgncmVjdCcpXG5cdFx0XHRcdFx0LnN0eWxlKCdmaWxsJywgZCA/IHNlbGYuX2NvbG9yU2NhbGUoZCkgOiAnI2ZmZicpXG5cdFx0XHRcdFx0LnN0eWxlKCdzdHJva2UnLCBkID09PSBudWxsID8gJyNkZWRlZGUnIDogJycpXG5cdFx0XHRcdFx0LnN0eWxlKCdzdHJva2Utd2lkdGgnLCBkID09PSBudWxsID8gMSA6IDApXG5cdFx0XHRcdFx0Ly8gU2V0IHNpemUgb2YgcmVjdFxuXHRcdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0c2VsZi5fcmVzaXplQ2VsbCh0aGlzLGRpbWVuc2lvbnMpO1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0Y29uc3QgZWxlbWVudCA9IHRoaXM7XG5cdFx0XHRcdFx0XHRzZWxmLl9tb3VzZU92ZXJIYW5kbGVyLmNhbGwoc2VsZiwgZWxlbWVudCwgZCk7XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0XHQub24oJ21vdXNlbGVhdmUnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdGNvbnN0IGVsZW1lbnQgPSB0aGlzO1xuXHRcdFx0XHRcdFx0c2VsZi5fbW91c2VPdXRIYW5kbGVyLmNhbGwoc2VsZiwgZWxlbWVudCk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0cmV0dXJuIGNlbGxzO1xuXG5cdFx0fVxuXG5cblxuXG5cdFx0LyoqXG5cdFx0KiBSZXR1cm5zIHRoZSBmaXJzdCBwYXJlbnQgb2YgZWxlbWVudCB0aGF0IG1hdGNoZXMgc2VsZWN0b3Jcblx0XHQqL1xuXHRcdF9nZXRQYXJlbnRFbGVtZW50KGVsZW1lbnQsIHNlbGVjdG9yKSB7XG5cblx0XHRcdGxldCBtYXRjaDtcblx0XHRcdHdoaWxlKGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ3N2ZycpIHtcblx0XHRcdFx0aWYgKGVsZW1lbnQubWF0Y2hlcyhzZWxlY3RvcikpIHtcblx0XHRcdFx0XHRtYXRjaCA9IGVsZW1lbnQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIG1hdGNoO1xuXG5cdFx0fVxuXG5cdFx0LyoqXG5cdFx0KiBSZXR1cm5zIGluZGV4IG9mIGN1cnJlbnQgY2hpbGQgdGhhdCBtYXRjaGVzIHNlbGVjdG9yIGluIGl0cyBwYXJlbnRcblx0XHQqL1xuXHRcdF9nZXRDaGlsZE5vZGVJbmRleChjaGlsZCwgc2VsZWN0b3IpIHtcblxuXHRcdFx0bGV0IGluZGV4ID0gMDtcblx0XHRcdHdoaWxlKGNoaWxkLnByZXZpb3VzU2libGluZykge1xuXHRcdFx0XHRpZiAoY2hpbGQucHJldmlvdXNTaWJsaW5nLm1hdGNoZXMoc2VsZWN0b3IpKSBpbmRleCsrO1xuXHRcdFx0XHRjaGlsZCA9IGNoaWxkLnByZXZpb3VzU2libGluZztcblx0XHRcdH1cblx0XHRcdHJldHVybiBpbmRleDtcblxuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBIYW5kbGVzIG1vdXNlZW50ZXIgb24gYSBjZWxsXG5cdFx0Ki9cblx0XHRfbW91c2VPdmVySGFuZGxlcihlbGVtZW50LCBkYXRhKSB7XG5cblx0XHRcdC8vIERhdGEgbm90IGF2YWlsYWJsZTogQ2VsbCBoYXMgbm8gdmFsdWUuIFRoZXJlJ3Mgbm8gXG5cdFx0XHQvLyBob3ZlciBlZmZlY3QgZm9yIGVtcHR5IGNlbGxzLlxuXHRcdFx0aWYgKCFkYXRhKSByZXR1cm47XG5cblx0XHRcdGxldCBzdmc7XG5cdFx0XHR0aGlzLl9lbGVtZW50cy5zdmcuZWFjaChmdW5jdGlvbigpIHsgc3ZnID0gdGhpczsgfSk7XG5cblx0XHRcdGNvbnN0IHlcdFx0XHQ9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gc3ZnLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcFxuXHRcdFx0XHQsIHhcdFx0XHQ9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCAtIHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0XG5cdFx0XHRcdCwgd2lkdGhcdFx0PSBwYXJzZUludChkMy5zZWxlY3QoZWxlbWVudCkuYXR0cignd2lkdGgnKSwgMTApICsgNDBcblx0XHRcdFx0LCBoZWlnaHRcdD0gcGFyc2VJbnQoZDMuc2VsZWN0KGVsZW1lbnQpLmF0dHIoJ2hlaWdodCcpLCAxMCkgKyA0MDtcblxuXHRcdFx0dGhpcy5fbW91c2VPdmVyUmVjdCA9IHRoaXMuX2VsZW1lbnRzLnN2Z1xuXHRcdFx0XHQuYXBwZW5kKCdnJyk7XG5cblx0XHRcdHRoaXMuX21vdXNlT3ZlclJlY3Rcblx0XHRcdFx0LmFwcGVuZCgncmVjdCcpXG5cdFx0XHRcdC5hdHRyKCd4JywgeCAtIDIwKVxuXHRcdFx0XHQuYXR0cigneScsIHkgLSAyMClcblx0XHRcdFx0LnN0eWxlKCdmaWxsJywgZWxlbWVudC5zdHlsZS5maWxsKVxuXHRcdFx0XHQuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXHRcdFx0XHQuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuXHRcdFx0XHQuYXR0cignd2lkdGgnLCB3aWR0aClcblx0XHRcdFx0LnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJylcblx0XHRcdFx0LnN0eWxlKCdvcGFjaXR5JywgMC45KTtcblx0XHRcdFxuXHRcdFx0dGhpcy5fbW91c2VPdmVyUmVjdFxuXHRcdFx0XHQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0LnRleHQoZGF0YS50b0ZpeGVkKDIpKVxuXHRcdFx0XHQuc3R5bGUoJ2NvbG9yJywgJ2JsYWNrJylcblx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCAnMjBweCcpXG5cdFx0XHRcdC5zdHlsZSgndGV4dC1hbGlnbicsICdjZW50ZXInKVxuXHRcdFx0XHQuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXHRcdFx0XHQuYXR0cigneCcsIHggLSAxMClcblx0XHRcdFx0LmF0dHIoJ3knLCB5ICsgMjApO1xuXG5cdFx0XHR0aGlzLl9tb3VzZU92ZXJSZWN0LnNlbGVjdCgndGV4dCcpLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdC8vY29uc3QgYmJveCA9IHRoaXMuZ2V0QkJveCgpO1xuXHRcdFx0fSk7XG5cdFx0XHQvL2NvbnNvbGUuZXJyb3IodGhpcy5fbW91c2VPdmVyUmVjdCwgdGhpcy5fbW91c2VPdmVyUmVjdC5xdWVyeVNlbGVjdG9yKCd0ZXh0JykuZ2V0QkJveCgpKTtcblxuXHRcdFx0Ly8gSGlnaGxpZ2h0IHJvd1xuXHRcdFx0Y29uc3Qgcm93ID0gdGhpcy5fZ2V0UGFyZW50RWxlbWVudChlbGVtZW50LCAnLnJvdycpO1xuXHRcdFx0ZDMuc2VsZWN0KHJvdykuY2xhc3NlZCgnYWN0aXZlJyx0cnVlKTtcblxuXHRcdFx0Ly8gSGlnaGxpZ2h0IGNvbFxuXHRcdFx0Y29uc3QgY2VsbCA9IHRoaXMuX2dldFBhcmVudEVsZW1lbnQoZWxlbWVudCwgJy5jZWxsJyk7XG5cdFx0XHRjb25zdCBjb2xJbmRleCA9IHRoaXMuX2dldENoaWxkTm9kZUluZGV4KGNlbGwsICcuY2VsbCcpO1xuXHRcdFx0Y29uc3QgY3VycmVudENvbCA9IHRoaXMuX2VsZW1lbnRzLmNvbHVtbnMuZmlsdGVyKChkLGkpID0+IGkgPT09IGNvbEluZGV4KTtcblx0XHRcdGN1cnJlbnRDb2wuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG5cblx0XHR9XG5cblx0XHRfbW91c2VPdXRIYW5kbGVyKCkge1xuXG5cdFx0XHRpZiAodGhpcy5fbW91c2VPdmVyUmVjdCkgdGhpcy5fbW91c2VPdmVyUmVjdC5yZW1vdmUoKTtcblxuXHRcdFx0dGhpcy5fZWxlbWVudHMucm93cy5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG5cdFx0XHR0aGlzLl9lbGVtZW50cy5jb2x1bW5zLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcblxuXHRcdH1cblxuXHR9XG5cblx0d2luZG93LmluZmVjdCA9IHdpbmRvdy5pbmZlY3QgfHzCoHt9O1xuXHR3aW5kb3cuaW5mZWN0LlJlc2lzdGVuY3lNYXRyaXggPSBSZXNpc3RlbmN5TWF0cml4O1xuXG59KSgpO1xuXG4iXX0=
