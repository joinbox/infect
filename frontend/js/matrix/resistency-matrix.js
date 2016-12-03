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
					console.error('remove row');
				}).text('test');

				self._createSingleRowLabel(enteredRows);

				rows.exit().each(function () {
					console.error('rm rw');
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL21hdHJpeC9yZXNpc3RlbmN5LW1hdHJpeC5lczIwMTUuanMiXSwibmFtZXMiOlsiUmVzaXN0ZW5jeU1hdHJpeCIsImNvbnRhaW5lciIsImRhdGEiLCJFcnJvciIsIl9jb250YWluZXIiLCJfZGF0YSIsIl9jb25maWd1cmF0aW9uIiwic3BhY2VCZXR3ZWVuTGFiZWxzQW5kTWF0cml4IiwibGluZVdlaWdodCIsIl9lbGVtZW50cyIsInN2ZyIsIl9jcmVhdGVTVkciLCJkcmF3TWF0cml4Iiwia2V5TmFtZSIsImRvbnRVcGRhdGVTY2FsZSIsImNvbnNvbGUiLCJsb2ciLCJfa2V5TmFtZSIsIl9jb2x1bW5TY2FsZSIsIl9jcmVhdGVDb2x1bW5TY2FsZSIsIl9jb2xvclNjYWxlIiwiX2NyZWF0ZUNvbG9yU2NhbGUiLCJfZHJhd1Jvd3MiLCJiYW5kd2lkdGgiLCJfZHJhd0NvbHVtbkhlYWRzIiwiX3VwZGF0ZUNvbHVtblNjYWxlIiwiX3VwZGF0ZVBvc2l0aW9uc0FuZFNpemVzIiwicm93SGVpZ2h0IiwiT2JqZWN0IiwidmFsdWVzIiwic2VsZiIsInJvd3MiLCJzZWxlY3RBbGwiLCJiYWN0ZXJpdW0iLCJpZCIsImVudGVyZWRSb3dzIiwiZW50ZXIiLCJhcHBlbmQiLCJhdHRyIiwiZCIsImkiLCJlYWNoIiwicm93IiwiX2RyYXdDZWxsIiwiZXJyb3IiLCJ0ZXh0IiwiX2NyZWF0ZVNpbmdsZVJvd0xhYmVsIiwiZXhpdCIsInJlbW92ZSIsInByb3BlcnR5IiwiZWxlbWVudCIsImxhdGluTmFtZSIsImQzIiwic2VsZWN0IiwiYW50aWJpb3RpY3MiLCJtYXAiLCJpdGVtIiwiYW50aWJpb3RpYyIsIm5hbWUiLCJsZW5ndGgiLCJzY2FsZUJhbmQiLCJkb21haW4iLCJyYW5nZSIsIl9nZXRTdmdXaWR0aCIsInNjYWxlU2VxdWVudGlhbCIsInQiLCJzYXR1cmF0aW9uIiwibGlnaHRuZXNzIiwiaHVlIiwiaHNsIiwidG9TdHJpbmciLCJhbW91bnRPZkRhdGFTZXRzIiwic2l6ZSIsIndpZHRoIiwiX2dldE1heFJvd0xhYmVsV2lkdGgiLCJzdGVwIiwibWF4Um93TGFiZWxXaWR0aCIsImdldEJCb3giLCJtYXhDb2xMYWJlbEhlaWdodCIsImhlaWdodCIsIl9nZXRNYXhDb2x1bW5MYWJlbEhlaWdodCIsImJhbmRXaWR0aCIsIk1hdGgiLCJmbG9vciIsIl9hbGlnbkNlbGwiLCJfcmVzaXplQ2VsbCIsImxlZnQiLCJhbW91bnRPZkNvbHMiLCJrZXlzIiwiY29sSGVpZ2h0Iiwic3R5bGUiLCJjZWxsIiwiZGltZW5zaW9ucyIsIm51bWJlciIsIm9mZnNldCIsImhlYWRlcnMiLCJjb2wiLCJjb2xIZWFkcyIsInJvd0VsZW1lbnQiLCJyb3dEYXRhIiwiZmlsdGVyZWREYXRhIiwiY2VsbHMiLCJ2YWx1ZSIsIm9uIiwiX21vdXNlT3ZlckhhbmRsZXIiLCJjYWxsIiwiX21vdXNlT3V0SGFuZGxlciIsInNlbGVjdG9yIiwibWF0Y2giLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwibWF0Y2hlcyIsInBhcmVudE5vZGUiLCJjaGlsZCIsImluZGV4IiwicHJldmlvdXNTaWJsaW5nIiwieSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsIngiLCJwYXJzZUludCIsIl9tb3VzZU92ZXJSZWN0IiwiZmlsbCIsInRvRml4ZWQiLCJfZ2V0UGFyZW50RWxlbWVudCIsImNsYXNzZWQiLCJjb2xJbmRleCIsIl9nZXRDaGlsZE5vZGVJbmRleCIsImN1cnJlbnRDb2wiLCJmaWx0ZXIiLCJ3aW5kb3ciLCJpbmZlY3QiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBTTs7QUFFTjs7QUFFQTs7Ozs7O0FBSk0sS0FVQUEsZ0JBVkE7QUFZTCw0QkFBWUMsU0FBWixFQUF1QkMsSUFBdkIsRUFBNkI7QUFBQTs7QUFFNUIsT0FBSSxDQUFDRCxTQUFMLEVBQWdCO0FBQ2YsVUFBTSxJQUFJRSxLQUFKLENBQVUsK0VBQVYsQ0FBTjtBQUNBOztBQUVELFFBQUtDLFVBQUwsR0FBbUJILFNBQW5CO0FBQ0Es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dUQsS0FBdkQ7QUFDQSxTQUFLcEgsU0FBTCxDQUFlQyxHQUFmLENBQW1Cc0IsU0FBbkIsQ0FBNkIsU0FBN0IsRUFBd0M2RixPQUF4QyxDQUFnRCxRQUFoRCxFQUEwRCxLQUExRDtBQUVBO0FBOWhCSTs7QUFBQTtBQUFBOztBQWtpQk5LLFFBQU9DLE1BQVAsR0FBZ0JELE9BQU9DLE1BQVAsSUFBaUIsRUFBakM7QUFDQUQsUUFBT0MsTUFBUCxDQUFjbkksZ0JBQWQsR0FBaUNBLGdCQUFqQztBQUVBLENBcmlCRCIsImZpbGUiOiJqcy9tYXRyaXgvcmVzaXN0ZW5jeS1tYXRyaXguZXMyMDE1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKCgpID0+IHtcblxuXHQvKiBnbG9iYWwgZDMsIHdpbmRvdyAqL1xuXG5cdC8qKlxuXHQqIERyYXdzIGEgbWF0cml4IHdpdGggcmVzaXN0ZW5jaWVzLiBcblx0KiBSb3dzOiBBbnRpIGJpb3RpY3Ncblx0KiBDb2xzOiBCYWN0ZXJpYVxuXHQqIENlbGxzOiBDb2xvcmVkIGFjY29yZGluZyB0byByZXNpc3RlbmN5XG5cdCovXG5cdGNsYXNzIFJlc2lzdGVuY3lNYXRyaXgge1xuXG5cdFx0Y29uc3RydWN0b3IoY29udGFpbmVyLCBkYXRhKSB7XG5cblx0XHRcdGlmICghY29udGFpbmVyKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignUmVzaXN0ZW5jeU1hdHJpeDogQXQgbGVhc3Qgb25lIGFyZ3VtZW50IChjb250YWluZXIpIGlzIG5lZWRlZCBpbiBjb25zdHJ1Y3Rvci4nKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fY29udGFpbmVyIFx0PSBjb250YWluZXI7XG5cdFx0XHR0aGlzLl9kYXRhIFx0XHRcdD0gZGF0YTtcblxuXHRcdFx0dGhpcy5fY29uZmlndXJhdGlvblx0PSB7XG5cdFx0XHRcdHNwYWNlQmV0d2VlbkxhYmVsc0FuZE1hdHJpeFx0XHQ6IDIwXG5cdFx0XHRcdCwgbGluZVdlaWdodFx0XHRcdFx0XHQ6IDVcblx0XHRcdH07XG5cblx0XHRcdC8vIEhvbGRzIHJlZmVyZW5jZXNcblx0XHRcdHRoaXMuX2VsZW1lbnRzXHRcdD0ge307XG5cblx0XHRcdC8vIENyZWF0ZSBTVkdcblx0XHRcdHRoaXMuX2VsZW1lbnRzLnN2ZyA9IHRoaXMuX2NyZWF0ZVNWRygpO1xuXG5cdFx0XHQvLyBJZiBhbGwgcmVxdWlyZWQgZGF0YSBpcyBhdmFpbGFibGUsIGRyYXcgbWF0cml4XG5cdFx0XHRpZiAodGhpcy5fY29udGFpbmVyICYmIHRoaXMuX2RhdGEpIHRoaXMuZHJhd01hdHJpeCgpO1xuXG5cdFx0fVxuXG5cblxuXHRcdC8qKlxuXHRcdCogVXBkYXRlcyB0aGUgbWF0cml4JyBkYXRhXG5cdFx0KiBAcGFyYW0ge0FycmF5fSBkYXRhXHRcdFx0XHRBcnJheSAocm93cykgb2YgQXJyYXlzIChjb2xzKSB3aGljaCBob2xkIHRoZSB2YWx1ZXMgKE9iamVjdClcblx0XHQqIEBwYXJhbSB7U3RyaW5nfcKgZmllbGROYW1lXHRcdFx0VmFsdWVzIGFyZSBwYXNzZWQgaW4gYW4gb2JqZWN0OyBuYW1lIG9mIHRoZSBrZXkgdGhhdCBob2xkcyB0aGVcblx0XHQqXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YSB3aGljaCBzaG91bGQgYmUgZGlzcGxheWVkIGluIHRhYmxlLlxuXHRcdCovXG5cdFx0dXBkYXRlRGF0YShkYXRhLCBrZXlOYW1lLCBkb250VXBkYXRlU2NhbGUpIHtcblxuXHRcdFx0dGhpcy5fZGF0YSA9IGRhdGE7XG5cdFx0XHRjb25zb2xlLmxvZygnUmVzaXN0ZW5jeU1hdHJpeCAvIHVwZGF0ZURhdGE6IFVwZGF0ZSBzY2FsZT8gJW8uIFVwZGF0ZSBkYXRhIHRvICVvJywgIWRvbnRVcGRhdGVTY2FsZSwgZGF0YSk7XG5cdFx0XHR0aGlzLl9rZXlOYW1lID0ga2V5TmFtZTtcblx0XHRcdGlmICh0aGlzLl9jb250YWluZXIgJiYgdGhpcy5fZGF0YSkgdGhpcy5kcmF3TWF0cml4KGRvbnRVcGRhdGVTY2FsZSk7XG5cblx0XHR9XG5cblxuXG5cblx0XHQvKipcblx0XHQqIE1haW4gbWV0aG9kLiBEcmF3cyB0aGUgbWF0cml4IHdpdGggZGF0YSBhbmQgY29udGFpbmVyIHByb3ZpZGVkLlxuXHRcdCovXG5cdFx0ZHJhd01hdHJpeChkb250VXBkYXRlU2NhbGUpIHtcblxuXHRcdFx0Ly8gR2V0IHJvdyBzY2FsZVxuXHRcdFx0aWYgKCFkb250VXBkYXRlU2NhbGUpIHtcblx0XHRcdFx0dGhpcy5fY29sdW1uU2NhbGUgPSB0aGlzLl9jcmVhdGVDb2x1bW5TY2FsZSgpO1xuXHRcdFx0XHR0aGlzLl9jb2xvclNjYWxlID0gdGhpcy5fY3JlYXRlQ29sb3JTY2FsZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9kcmF3Um93cyh0aGlzLl9jb2x1bW5TY2FsZS5iYW5kd2lkdGgoKSk7XG5cdFx0XHR0aGlzLl9kcmF3Q29sdW1uSGVhZHMoKTtcblxuXHRcdFx0aWYgKCFkb250VXBkYXRlU2NhbGUpIHtcblx0XHRcdFx0dGhpcy5fdXBkYXRlQ29sdW1uU2NhbGUoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fdXBkYXRlUG9zaXRpb25zQW5kU2l6ZXMoKTtcblxuXHRcdH1cblxuXG5cblx0XHQvKipcblx0XHQqIERyYXdzIHRoZSByb3dzXG5cdFx0KiBAcGFyYW0ge051bWJlcn0gcm93SGVpZ2h0XHRcdFx0V2lkdGggb2YgYSBzaW5nbGUgcm93XG5cdFx0Ki9cblx0XHRfZHJhd1Jvd3Mocm93SGVpZ2h0KSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKCdSZXNpc3RlbmN5TWF0cml4IC8gX2RyYXdSb3dzOiBEcmF3IHJvd3Mgd2l0aCBkYXRhICVvIGFuZCBoZWlnaHQgJW8nLCBPYmplY3QudmFsdWVzKHRoaXMuX2RhdGEpLCByb3dIZWlnaHQpO1xuXG5cdFx0XHQvLyBSZWZlcmVuY2UgdG8gdGhpcywgbmVlZGVkIGZvciBlYWNoXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRcdFx0Ly8gZ1xuXHRcdFx0Y29uc3Qgcm93cyA9IHRoaXMuX2VsZW1lbnRzLnN2Z1xuXHRcdFx0XHQuc2VsZWN0QWxsKCcucm93Jylcblx0XHRcdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMjI0MDg0Mi9kMy11cGRhdGUtb24tbm9kZS1yZW1vdmFsLWFsd2F5cy1yZW1vdmUtdGhlLWxhc3QtZW50cnktaW4tc3ZnLWRvbVxuXHRcdFx0XHQuZGF0YSh0aGlzLl9kYXRhLCAoYmFjdGVyaXVtKSA9PiBiYWN0ZXJpdW0uaWQpO1xuXG5cdFx0XHRjb25zdCBlbnRlcmVkUm93cyA9IHJvd3Ncblx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAncm93Jylcblx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IGB0cmFuc2xhdGUoMCwgJHtpICogcm93SGVpZ2h0fSlgKVxuXHRcdFx0XHRcdC8vIENhbm5vdCB1c2UgYXJyb3cgZnVuY3Rpb25zIGFzIHdlIG5lZWQgdGhpc1xuXHRcdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKHJvdykge1xuXHRcdFx0XHRcdFx0c2VsZi5fZHJhd0NlbGwodGhpcywgcm93LCByb3dIZWlnaHQpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRlbnRlcmVkUm93c1xuXHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0LmVhY2goKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3JlbW92ZSByb3cnKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnRleHQoJ3Rlc3QnKTtcblxuXHRcdFx0c2VsZi5fY3JlYXRlU2luZ2xlUm93TGFiZWwoZW50ZXJlZFJvd3MpO1xuXG5cdFx0XHRyb3dzXG5cdFx0XHRcdC5leGl0KClcblx0XHRcdFx0LmVhY2goKCkgPT4ge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3JtIHJ3Jyk7XG5cdFx0XHRcdH0pXG5cdFx0XHRcdC5yZW1vdmUoKTtcblxuXHRcdH1cblxuXG5cblx0XHQvKipcblx0XHQqIFJldHVybnMgdGhlIFNWRydzIHdpZHRoIFxuXHRcdCogQHJldHVybiB7TnVtYmVyfVxuXHRcdCovXG5cdFx0X2dldFN2Z1dpZHRoKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX2VsZW1lbnRzLnN2Zy5wcm9wZXJ0eSgnY2xpZW50V2lkdGgnKTtcblx0XHR9XG5cblxuXG5cdFx0LyoqXG5cdFx0KiBDcmVhdGVzIGFuZCByZXR1cm5zIGEgc2luZ2xlIHJvdyBsYWJlbC4gTmVlZGVkIHRvIGZpcnN0IG1lYXN1cmUgYW5kIHRoZW5cblx0XHQqIGRyYXcgaXQgYXQgdGhlIHJpZ2h0IHBsYWNlXG5cdFx0Ki9cblx0XHRfY3JlYXRlU2luZ2xlUm93TGFiZWwoZWxlbWVudCkge1xuXHRcdFx0cmV0dXJuIGVsZW1lbnRcblx0XHRcdFx0LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdC5hdHRyKCdjbGFzcycsICdsYWJlbCcpXG5cdFx0XHRcdC5hdHRyKCd0ZXh0LWFuY2hvcicsICdlbmQnKVxuXHRcdFx0XHQudGV4dCgoZCkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBkLmJhY3Rlcml1bS5sYXRpbk5hbWU7XG5cdFx0XHRcdH0pO1xuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBDcmVhdGVzIGFuZCByZXR1cm5zIHRoZSBTVkdcblx0XHQqL1xuXHRcdF9jcmVhdGVTVkcoKSB7XG5cdFx0XHRyZXR1cm4gZDMuc2VsZWN0KHRoaXMuX2NvbnRhaW5lcilcblx0XHRcdFx0LmFwcGVuZCgnc3ZnJyk7XG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQqIENyZWF0ZXMgdGhlIHNjYWxlIGZvciBhbGwgY29sdW1ucywgaS5lLiBmb3IgYWxsIHRoZSB2ZXJ0aWNhbCBlbnRpdGllcyDigJPCoHJvdyBkYXRhXG5cdFx0KiBtdXN0IGJlIHRha2VuLiBUaGlzIGlzIGRvbmUgYmVmb3JlIHRoZSBsYWJlbHMgYXJlIHRoZXJlLCB0aGVyZWZvcmVcblx0XHQqIHRha2UgdGhlIHdob2xlIFNWRyB3aWR0aC5cblx0XHQqL1xuXHRcdF9jcmVhdGVDb2x1bW5TY2FsZSgpIHtcblxuXHRcdFx0Y29uc3QgZGF0YSA9IHRoaXMuX2RhdGFbMF0uYW50aWJpb3RpY3MubWFwKChpdGVtKSA9PiBpdGVtLmFudGliaW90aWMubmFtZSk7XG5cdFx0XHRjb25zb2xlLmxvZygnUmVzaXN0ZW5jeU1hdHJpeDogRGF0YSBmb3IgY29sdW1uIHNjYWxlIChsZW4gJW8pIGlzICVvJywgZGF0YS5sZW5ndGgsIGRhdGEpO1xuXHRcdFx0cmV0dXJuIGQzLnNjYWxlQmFuZCgpXG5cdFx0XHRcdC5kb21haW4oZGF0YSlcblx0XHRcdFx0Ly8gLTUwOiBXZSB0dXJuIHRoZSBjb2wgbGFiZWxzIGJ5IDQ1wrAsIHRoaXMgdGFrZXMgYSBiaXQgb2Ygc3BhY2Vcblx0XHRcdFx0LnJhbmdlKFswLCB0aGlzLl9nZXRTdmdXaWR0aCgpIC0gNTBdKTtcblxuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBSZXR1cm5zIHRoZSBzY2FsZSBmb3IgY29sb3JpbmcgdGhlIGNlbGxzXG5cdFx0Ki9cblx0XHRfY3JlYXRlQ29sb3JTY2FsZSgpIHtcblx0XHRcdHJldHVybiBuZXcgZDMuc2NhbGVTZXF1ZW50aWFsKCh0KSA9PiB7XG5cdFx0XHRcdC8vY29uc3Qgc2F0dXJhdGlvbiA9IHQgKiAwLjIgKyAwLjQ7IC8vIDUw4oCTNjAlXG5cdFx0XHRcdGNvbnN0IHNhdHVyYXRpb24gPSAwLjc7XG5cdFx0XHRcdGNvbnN0IGxpZ2h0bmVzcyA9ICgxIC0gdCkgKiAwLjYgKyAwLjQ7IC8vIDMw4oCTODAlXG5cdFx0XHRcdC8vY29uc3QgbGlnaHRuZXNzID0gMC41O1xuXHRcdFx0XHQvLyBIdWUgbmVlZHMgdmFsdWVzIGJldHdlZW4gNDAgYW5kIDkwXG5cdFx0XHRcdGNvbnN0IGh1ZSA9IHQgKiAxMDA7XG5cdFx0XHRcdC8vY29uc29sZS53YXJuKHQudG9GaXhlZCgzKSwgaHVlLnRvRml4ZWQoMyksIHNhdHVyYXRpb24udG9GaXhlZCgzKSwgbGlnaHRuZXNzLnRvRml4ZWQoMykpO1xuXHRcdFx0XHRjb25zdCBoc2wgPSBkMy5oc2woaHVlLCBzYXR1cmF0aW9uLCBsaWdodG5lc3MpO1xuXHRcdFx0XHRyZXR1cm4gaHNsLnRvU3RyaW5nKCk7XG5cdFx0XHR9KTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogVXBkYXRlcyB0aGUgY29sIHNjYWxlLiBJcyBjYWxsZWQgYWZ0ZXIgbGFiZWxzIHdlcmUgZHJhd24gYW5kIG1lYXN1cmVkLiBTY2FsZSBzaG91bGQgdGFrZSB1cFxuXHRcdCogYWxsIGhvcml6b250YWwgc3BhY2UgdGhhdCdzIGxlZnQuIFxuXHRcdCovXG5cdFx0X3VwZGF0ZUNvbHVtblNjYWxlKCkge1xuXG5cdFx0XHQvLyBSZW1vdmUgYW1vdW50IG9mIGVudHJpZXMgc28gdGhhdCB3ZSBjYW4gaW5zZXJ0IGEgbGluZSBvZiAxIHB4XG5cdFx0XHRjb25zdCBhbW91bnRPZkRhdGFTZXRzID0gdGhpcy5fZWxlbWVudHMuc3ZnLnNlbGVjdEFsbCgnLmNvbHVtbicpLnNpemUoKTtcblx0XHRcdGNvbnN0IHdpZHRoID0gdGhpcy5fZ2V0U3ZnV2lkdGgoKSAtIDUwIC0gdGhpcy5fZ2V0TWF4Um93TGFiZWxXaWR0aCgpIC0gdGhpcy5fY29uZmlndXJhdGlvbi5zcGFjZUJldHdlZW5MYWJlbHNBbmRNYXRyaXggLSBhbW91bnRPZkRhdGFTZXRzICogdGhpcy5fY29uZmlndXJhdGlvbi5saW5lV2VpZ2h0O1xuXHRcdFx0Y29uc29sZS5sb2coJ1Jlc2lzdGVuY3lNYXRyaXggLyBfdXBkYXRlQ29sdW1uU2NhbGU6IENvbCAjIGlzICVvLCBzdmcgd2lkdGggaXMgJW8sIHdpZHRoIGNvbHVtbiBjb250ZW50IGlzICVvJywgYW1vdW50T2ZEYXRhU2V0cywgdGhpcy5fZ2V0U3ZnV2lkdGgoKSwgd2lkdGgpO1xuXG5cdFx0XHQvLyBVcGRhdGUgc2NhbGVcblx0XHRcdHRoaXMuX2NvbHVtblNjYWxlLnJhbmdlKFswLCB3aWR0aF0pO1xuXHRcdFx0Y29uc29sZS5sb2coJ1Jlc2lzdGVuY3lNYXRyaXg6IE5ldyBiYW5kd2lkdGggaXMgJW8sIHN0ZXAgaXMgJW8nLCB0aGlzLl9jb2x1bW5TY2FsZS5iYW5kd2lkdGgoKSwgdGhpcy5fY29sdW1uU2NhbGUuc3RlcCgpKTtcblxuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBSZXR1cm5zIHdpZHRoIG9mIHdpZGVzdCByb3cgbGFiZWxcblx0XHQqL1xuXHRcdF9nZXRNYXhSb3dMYWJlbFdpZHRoKCkge1xuXG5cdFx0XHRpZiAoIXRoaXMuX2VsZW1lbnRzLnN2Zy5zZWxlY3RBbGwoJy5yb3cnKSkgcmV0dXJuIDA7XG5cblx0XHRcdGxldCBtYXhSb3dMYWJlbFdpZHRoID0gMDtcblx0XHRcdHRoaXMuX2VsZW1lbnRzLnN2Zy5zZWxlY3RBbGwoJy5yb3cnKS5zZWxlY3QoJy5sYWJlbCcpLmVhY2goZnVuY3Rpb24oKXtcblx0XHRcdFx0Y29uc3Qgd2lkdGggPSB0aGlzLmdldEJCb3goKS53aWR0aDtcblx0XHRcdFx0aWYgKHdpZHRoID4gbWF4Um93TGFiZWxXaWR0aCkgbWF4Um93TGFiZWxXaWR0aCA9IHdpZHRoO1xuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbWF4Um93TGFiZWxXaWR0aDtcblxuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBSZXR1cm5zIHdpZHRoIG9mIHdpZGVzdCBjb2x1bW4gbGFiZWxcblx0XHQqL1xuXHRcdF9nZXRNYXhDb2x1bW5MYWJlbEhlaWdodCgpIHtcblx0XHRcdGxldCBtYXhDb2xMYWJlbEhlaWdodCA9IDA7XG5cdFx0XHR0aGlzLl9lbGVtZW50cy5zdmcuc2VsZWN0QWxsKCcuY29sdW1uJykuc2VsZWN0KCcubGFiZWwnKS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zdCBoZWlnaHQgPSB0aGlzLmdldEJCb3goKS53aWR0aDtcblx0XHRcdFx0aWYgKGhlaWdodCA+IG1heENvbExhYmVsSGVpZ2h0KSBtYXhDb2xMYWJlbEhlaWdodCA9IGhlaWdodDtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1heENvbExhYmVsSGVpZ2h0O1xuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBVcGRhdGVzIHRoZSBzY2FsZXMgYWZ0ZXIgdGhlIGxhYmVscyAocm93L2NvbCkgd2VyZSBkcmF3biBhbmQgdXBkYXRlcyBjZWxscy9yb3dzIHRvIFxuXHRcdCogcmVzcGVjdCB3aWR0aC9oZWlnaHQgb2YgdGhlIGxhYmVscy5cblx0XHQqIFJlc2V0cyBoZWlnaHQgb2YgdGhlIFNWRyB0byBtYXRjaCBpdHMgY29udGVudHMuXG5cdFx0Ki9cblx0XHRfdXBkYXRlUG9zaXRpb25zQW5kU2l6ZXMoKSB7XG5cblx0XHRcdGNvbnN0IHNlbGYgPSB0aGlzO1xuXG5cdFx0XHRjb25zdCBtYXhSb3dMYWJlbFdpZHRoID0gdGhpcy5fZ2V0TWF4Um93TGFiZWxXaWR0aCgpXG5cdFx0XHRcdCwgbWF4Q29sTGFiZWxIZWlnaHQgPSB0aGlzLl9nZXRNYXhDb2x1bW5MYWJlbEhlaWdodCgpO1xuXG5cdFx0XHRjb25zdCBiYW5kV2lkdGggXHQ9IHRoaXMuX2NvbHVtblNjYWxlLmJhbmR3aWR0aCgpXG5cdFx0XHRcdCwgc3RlcFx0XHRcdD10aGlzLl9jb2x1bW5TY2FsZS5zdGVwKCk7XG5cblx0XHRcdGNvbnNvbGUubG9nKCdSZXNpc3RlbmN5TWF0cml4IC8gX3VwZGF0ZVBvc2l0aW9uc0FuZFNpemVzOiBtYXhSb3dMYWJlbFdpZHRoJywgbWF4Um93TGFiZWxXaWR0aCwgJ2NvbGxhYmVsaGVpZ2h0JywgbWF4Q29sTGFiZWxIZWlnaHQsICdiYW5kV2lkdGgnLCBiYW5kV2lkdGgpO1xuXG5cdFx0XHQvLyBVcGRhdGUgcm93c1xuXHRcdFx0dGhpcy5fZWxlbWVudHMuc3ZnXG5cdFx0XHRcdC5zZWxlY3RBbGwoJy5yb3cnKVxuXHRcdFx0XHQuZWFjaChmdW5jdGlvbihkLGkpe1xuXHRcdFx0XHRcdGQzLnNlbGVjdCh0aGlzKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ2hlaWdodCcsIGJhbmRXaWR0aClcblx0XHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKDAsICR7IGkgKiBNYXRoLmZsb29yKCBiYW5kV2lkdGggKSArIE1hdGguZmxvb3IoIG1heENvbExhYmVsSGVpZ2h0ICkgKyBzZWxmLl9jb25maWd1cmF0aW9uLnNwYWNlQmV0d2VlbkxhYmVsc0FuZE1hdHJpeCArIGkgKiBzZWxmLl9jb25maWd1cmF0aW9uLmxpbmVXZWlnaHQgfSlgKTtcblx0XHRcdFx0fSk7XG5cblxuXHRcdFx0Ly8gVXBkYXRlIGNlbGwncyByZWN0YW5nbGVzXG5cdFx0XHR0aGlzLl9lbGVtZW50cy5zdmdcblx0XHRcdFx0LnNlbGVjdEFsbCgnLnJvdycpXG5cdFx0XHRcdC5zZWxlY3RBbGwoJy5jZWxsJylcblx0XHRcdFx0LmVhY2goZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdHNlbGYuX2FsaWduQ2VsbCh0aGlzLCBNYXRoLmZsb29yKHNlbGYuX2NvbHVtblNjYWxlLmJhbmR3aWR0aCgpKSwgaSwgTWF0aC5mbG9vcihtYXhSb3dMYWJlbFdpZHRoICsgc2VsZi5fY29uZmlndXJhdGlvbi5zcGFjZUJldHdlZW5MYWJlbHNBbmRNYXRyaXgpLCBzZWxmLl9jb25maWd1cmF0aW9uLmxpbmVXZWlnaHQpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQuc2VsZWN0KCdyZWN0Jylcblx0XHRcdFx0LmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0c2VsZi5fcmVzaXplQ2VsbCh0aGlzLCBNYXRoLmZsb29yKHNlbGYuX2NvbHVtblNjYWxlLmJhbmR3aWR0aCgpKSk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHQvLyBVcGRhdGUgY29sc1xuXHRcdFx0Ly90aGlzLl9lbGVtZW50cy5jb2x1bW5zXG5cdFx0XHR0aGlzLl9lbGVtZW50cy5zdmdcblx0XHRcdFx0LnNlbGVjdEFsbCgnLmNvbHVtbicpXG5cdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKGQsaSkge1xuXHRcdFx0XHRcdC8vIHN0ZXAgLyAyOiBNYWtlIHN1cmUgd2UncmUga2luZGEgY2VudGVyZWQgb3ZlciB0aGUgY29sXG5cdFx0XHRcdFx0Y29uc3QgbGVmdCA9IGkgKiAoTWF0aC5mbG9vcihzdGVwKSArIHNlbGYuX2NvbmZpZ3VyYXRpb24ubGluZVdlaWdodCkgKyBtYXhSb3dMYWJlbFdpZHRoICsgc2VsZi5fY29uZmlndXJhdGlvbi5zcGFjZUJldHdlZW5MYWJlbHNBbmRNYXRyaXggKyBzdGVwIC8gMjtcblx0XHRcdFx0XHRkMy5zZWxlY3QodGhpcylcblx0XHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7IGxlZnQgfSwgJHsgbWF4Q29sTGFiZWxIZWlnaHQgfSlgKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdC8vIFVwZGF0ZSBsYWJlbCdzIHggcG9zaXRpb25cblx0XHRcdHRoaXMuX2VsZW1lbnRzLnN2Z1xuXHRcdFx0XHQuc2VsZWN0QWxsKCcucm93Jylcblx0XHRcdFx0LnNlbGVjdCgnLmxhYmVsJylcblx0XHRcdFx0LmF0dHIoJ3gnLCBtYXhSb3dMYWJlbFdpZHRoKVxuXHRcdFx0XHQuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRkMy5zZWxlY3QodGhpcylcblx0XHRcdFx0XHRcdC5hdHRyKCd5JywgYmFuZFdpZHRoIC8gMiArIHRoaXMuZ2V0QkJveCgpLmhlaWdodCAvIDIpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0Ly8gVXBkYXRlIGNvbCBsYWJlbCdzIHkgcG9zaXRpb25cblx0XHRcdC8vdGhpcy5fZWxlbWVudHMuY29sdW1uc1xuXHRcdFx0Ly9cdC5zZWxlY3QoJy5sYWJlbCcpXG5cdFx0XHQvL1x0LmF0dHIoJ3RyYW5zZm9ybScsICdyb3RhdGUoLTQ1KScpO1xuXG5cdFx0XHQvLyBVcGRhdGUgc3ZnIGhlaWdodFxuXHRcdFx0Y29uc3QgYW1vdW50T2ZDb2xzID0gKCBPYmplY3Qua2V5cyh0aGlzLl9kYXRhKS5sZW5ndGggKVxuXHRcdFx0XHQsIGNvbEhlaWdodCA9IHRoaXMuX2NvbHVtblNjYWxlLnN0ZXAoKTtcblx0XHRcdHRoaXMuX2NvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAodGhpcy5fZ2V0TWF4Q29sdW1uTGFiZWxIZWlnaHQoKSArIChjb2xIZWlnaHQgKyB0aGlzLl9jb25maWd1cmF0aW9uLmxpbmVXZWlnaHQpICogYW1vdW50T2ZDb2xzICsgdGhpcy5fY29uZmlndXJhdGlvbi5zcGFjZUJldHdlZW5MYWJlbHNBbmRNYXRyaXgpICsgJ3B4JztcblxuXHRcdH1cblxuXG5cblx0XHQvKipcblx0XHQqIEFsaWducyBhIHNpbmdsZSBjZWxsXG5cdFx0Ki9cblx0XHRfYWxpZ25DZWxsKGNlbGwsIGRpbWVuc2lvbnMsIG51bWJlciwgb2Zmc2V0ID0gMCwgbGluZVdlaWdodCA9IDEpIHtcblx0XHRcdGQzLnNlbGVjdChjZWxsKVxuXHRcdFx0XHQvLyArIG51bWJlcjogU3BhY2UgMSBweCBiZXR3ZWVuIGNlbGxzXG5cdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCBgdHJhbnNsYXRlKCR7IG9mZnNldCArIG51bWJlciAqIGRpbWVuc2lvbnMgKyBudW1iZXIgKiBsaW5lV2VpZ2h0IH0sMClgKTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogUmVzaXplcyBhIHNpbmdsZSBjZWxsXG5cdFx0Ki8gXG5cdFx0X3Jlc2l6ZUNlbGwoY2VsbCwgZGltZW5zaW9ucykge1xuXHRcdFx0ZDMuc2VsZWN0KGNlbGwpXG5cdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBkaW1lbnNpb25zKVxuXHRcdFx0XHQuYXR0cignd2lkdGgnLCBkaW1lbnNpb25zKTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogRHJhd3MgdGhlIGNvbHVtbiBoZWFkcywgdGhlbiByZXR1cm5zIHRoZSBjcmVhdGVkIGVsZW1lbnRzXG5cdFx0Ki9cblx0XHRfZHJhd0NvbHVtbkhlYWRzKCkge1xuXG5cdFx0XHQvLyBHZXQgaGVhZGVycyBmcm9tIGRhdGEgKGtleXMgb2YgZmlyc3QgYXJyYXkgaXRlbSlcblx0XHRcdGNvbnN0IGhlYWRlcnMgPSB0aGlzLl9kYXRhWzBdLmFudGliaW90aWNzLm1hcCgoY29sKSA9PiBjb2wuYW50aWJpb3RpYyk7XG5cdFx0XHRjb25zb2xlLmxvZygnUmVzaXN0ZW5jeU1hdHJpeCAvIF9kcmF3Q29sdW1uSGVhZHM6IEhlYWRlcnMgYXJlICVvJywgaGVhZGVycyk7XG5cblx0XHRcdC8vIDxnPiBhbmQgdHJhbnNmb3JtXG5cdFx0XHRjb25zdCBjb2xIZWFkcyA9IHRoaXMuX2VsZW1lbnRzLnN2Z1xuXHRcdFx0XHQuc2VsZWN0QWxsKCcuY29sdW1uJylcblx0XHRcdFx0LmRhdGEoaGVhZGVycywgKGNvbCkgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBjb2wuaWQ7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHQvLyBEcmF3IGhlYWRzLCBjb25zaXN0aW5nIG9mIDxnPiB3aXRoIGNvbnRhaW5lZCA8dGV4dD5cblx0XHRcdGNvbEhlYWRzXG5cdFx0XHRcdC5lbnRlcigpXG5cdFx0XHRcdFx0LmFwcGVuZCgnZycpXG5cdFx0XHRcdFx0Ly8gdHJhbnNsYXRpb24gd2lsbCBiZSBkb25lIGluIHRoaXMudXBkYXRlUG9zaXRpb25zQW5kU2l6ZXNcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnY29sdW1uJylcblx0XHRcdFx0XHQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0XHRcdC5hdHRyKCdjbGFzcycsICdsYWJlbCcpXG5cdFx0XHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnc3RhcnQnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RyYW5zZm9ybScsICdyb3RhdGUoLTQ1KScpXG5cdFx0XHRcdFx0XHQudGV4dChkID0+IGQubmFtZSk7XG5cblxuXHRcdFx0Ly8gVGV4dFxuXHRcdFx0Y29sSGVhZHNcblx0XHRcdFx0LmV4aXQoKVxuXHRcdFx0XHQuZWFjaCgoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcigncm0gY2wgaGQnKTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnJlbW92ZSgpO1xuXG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQqIERyYXdzIGEgc2luZ2xlIHJlc2lzdGVuY3kgY2VsbFxuXHRcdCovXG5cdFx0X2RyYXdDZWxsKCByb3dFbGVtZW50LCByb3dEYXRhLCBkaW1lbnNpb25zICkge1xuXG5cdFx0XHQvL2NvbnNvbGUubG9nKCAnUmVzaXN0ZW5jeU1hdHJpeCAvIF9kcmF3Q2VsbDogcm93ICVvLCBkYXRhICVvLCBkaW1lbnNpb25zICVvJywgcm93RWxlbWVudCwgcm93RGF0YSwgZGltZW5zaW9ucyApO1xuXHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0XHRcdC8vIFJlbW92ZSAnbmFtZScgcHJvcGVydHkgb24gcm93IG9iamVjdFxuXHRcdFx0Y29uc3QgZmlsdGVyZWREYXRhID0gcm93RGF0YS5hbnRpYmlvdGljcztcblx0XHRcdC8vY29uc29sZS5lcnJvcignZHJhd0NlbGw6ICVvJywgZmlsdGVyZWREYXRhKTtcblxuXHRcdFx0Ly8gPGc+XG5cdFx0XHRjb25zdCBjZWxscyA9IGQzLnNlbGVjdChyb3dFbGVtZW50KVxuXHRcdFx0XHQuc2VsZWN0QWxsKCcuY2VsbCcpXG5cdFx0XHRcdC5kYXRhKGZpbHRlcmVkRGF0YSwgKGNvbCkgPT4ge1xuXHRcdFx0XHRcdC8vY29uc29sZS5lcnJvcihjb2wuYW50aWJpb3RpYy5pZCk7XG5cdFx0XHRcdFx0cmV0dXJuIGNvbC5hbnRpYmlvdGljLmlkO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0Y2VsbHNcblx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0LmFwcGVuZCgnZycpXG5cdFx0XHRcdC5hdHRyKCdjbGFzcycsICdjZWxsJylcblx0XHRcdFx0Ly8gUmVjdFxuXHRcdFx0XHQuZWFjaChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKCdyZWN0Jylcblx0XHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsIGQgPyBzZWxmLl9jb2xvclNjYWxlKGQudmFsdWUpIDogJyNmZmYnKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdzdHJva2UnLCBkLnZhbHVlID09PSBudWxsID8gJyNkZWRlZGUnIDogJycpXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIGQudmFsdWUgPT09IG51bGwgPyAxIDogMClcblx0XHRcdFx0XHRcdC8vIFNldCBzaXplIG9mIHJlY3Rcblx0XHRcdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRzZWxmLl9yZXNpemVDZWxsKHRoaXMsZGltZW5zaW9ucyk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBlbGVtZW50ID0gdGhpcztcblx0XHRcdFx0XHRcdFx0c2VsZi5fbW91c2VPdmVySGFuZGxlci5jYWxsKHNlbGYsIGVsZW1lbnQsIGQpO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBlbGVtZW50ID0gdGhpcztcblx0XHRcdFx0XHRcdFx0c2VsZi5fbW91c2VPdXRIYW5kbGVyLmNhbGwoc2VsZiwgZWxlbWVudCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblxuXHRcdFx0Y2VsbHNcblx0XHRcdFx0LmV4aXQoKVxuXHRcdFx0XHQuZWFjaCgoKSA9PiB7XG5cdFx0XHRcdFx0Y29uc29sZS5lcnJvcigncm0gY2VsbCcpO1xuXHRcdFx0XHR9KVxuXHRcdFx0XHQucmVtb3ZlKCk7XG5cblxuXHRcdH1cblxuXG5cblxuXHRcdC8qKlxuXHRcdCogUmV0dXJucyB0aGUgZmlyc3QgcGFyZW50IG9mIGVsZW1lbnQgdGhhdCBtYXRjaGVzIHNlbGVjdG9yXG5cdFx0Ki9cblx0XHRfZ2V0UGFyZW50RWxlbWVudChlbGVtZW50LCBzZWxlY3Rvcikge1xuXG5cdFx0XHRsZXQgbWF0Y2g7XG5cdFx0XHR3aGlsZShlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdzdmcnKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0bWF0Y2ggPSBlbGVtZW50O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtYXRjaDtcblxuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCogUmV0dXJucyBpbmRleCBvZiBjdXJyZW50IGNoaWxkIHRoYXQgbWF0Y2hlcyBzZWxlY3RvciBpbiBpdHMgcGFyZW50XG5cdFx0Ki9cblx0XHRfZ2V0Q2hpbGROb2RlSW5kZXgoY2hpbGQsIHNlbGVjdG9yKSB7XG5cblx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHR3aGlsZShjaGlsZC5wcmV2aW91c1NpYmxpbmcpIHtcblx0XHRcdFx0aWYgKGNoaWxkLnByZXZpb3VzU2libGluZy5tYXRjaGVzKHNlbGVjdG9yKSkgaW5kZXgrKztcblx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5wcmV2aW91c1NpYmxpbmc7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5kZXg7XG5cblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogSGFuZGxlcyBtb3VzZWVudGVyIG9uIGEgY2VsbFxuXHRcdCovXG5cdFx0X21vdXNlT3ZlckhhbmRsZXIoZWxlbWVudCwgZGF0YSkge1xuXG5cdFx0XHQvLyBEYXRhIG5vdCBhdmFpbGFibGU6IENlbGwgaGFzIG5vIHZhbHVlLiBUaGVyZSdzIG5vIFxuXHRcdFx0Ly8gaG92ZXIgZWZmZWN0IGZvciBlbXB0eSBjZWxscy5cblx0XHRcdGlmICghZGF0YS52YWx1ZSkgcmV0dXJuO1xuXG5cdFx0XHQvLyBNYXAgc3ZnJ3MgRE9NIGVsZW1lbnQgdG8gc3ZnXG5cdFx0XHRsZXQgc3ZnO1xuXHRcdFx0dGhpcy5fZWxlbWVudHMuc3ZnLmVhY2goZnVuY3Rpb24oKSB7IHN2ZyA9IHRoaXM7IH0pO1xuXG5cdFx0XHRjb25zdCB5XHRcdFx0PSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3Bcblx0XHRcdFx0LCB4XHRcdFx0PSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuXHRcdFx0XHQsIHdpZHRoXHRcdD0gcGFyc2VJbnQoZDMuc2VsZWN0KGVsZW1lbnQpLmF0dHIoJ3dpZHRoJyksIDEwKSArIDQwXG5cdFx0XHRcdCwgaGVpZ2h0XHQ9IHBhcnNlSW50KGQzLnNlbGVjdChlbGVtZW50KS5hdHRyKCdoZWlnaHQnKSwgMTApICsgNDA7XG5cblx0XHRcdHRoaXMuX21vdXNlT3ZlclJlY3QgPSB0aGlzLl9lbGVtZW50cy5zdmdcblx0XHRcdFx0LmFwcGVuZCgnZycpO1xuXG5cdFx0XHR0aGlzLl9tb3VzZU92ZXJSZWN0XG5cdFx0XHRcdC5hcHBlbmQoJ3JlY3QnKVxuXHRcdFx0XHQuYXR0cigneCcsIHggLSAyMClcblx0XHRcdFx0LmF0dHIoJ3knLCB5IC0gMjApXG5cdFx0XHRcdC5hdHRyKCdjbGFzcycsICdob3Zlci1jZWxsJylcblx0XHRcdFx0LnN0eWxlKCdmaWxsJywgZWxlbWVudC5zdHlsZS5maWxsKVxuXHRcdFx0XHQuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXHRcdFx0XHQuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuXHRcdFx0XHQuYXR0cignd2lkdGgnLCB3aWR0aClcblx0XHRcdFx0LnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG5cdFx0XHRcdC8vLnN0eWxlKCdvcGFjaXR5JywgMC45KTtcblx0XHRcdFxuXHRcdFx0dGhpcy5fbW91c2VPdmVyUmVjdFxuXHRcdFx0XHQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0LnRleHQoZGF0YS52YWx1ZS50b0ZpeGVkKDIpKVxuXHRcdFx0XHQuc3R5bGUoJ2NvbG9yJywgJ2JsYWNrJylcblx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCAnMjBweCcpXG5cdFx0XHRcdC5zdHlsZSgndGV4dC1hbGlnbicsICdjZW50ZXInKVxuXHRcdFx0XHQuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXHRcdFx0XHQuYXR0cigneCcsIHggLSAxMClcblx0XHRcdFx0LmF0dHIoJ3knLCB5ICsgMjApO1xuXG5cdFx0XHQvKnRoaXMuX21vdXNlT3ZlclJlY3Quc2VsZWN0KCd0ZXh0JykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly9jb25zdCBiYm94ID0gdGhpcy5nZXRCQm94KCk7XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0dGhpcy5fbW91c2VPdmVyUmVjdC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKHRoaXMucXVlcnlTZWxlY3RvcigncmVjdCcpKTtcblx0XHRcdH0pOyovXG5cblx0XHRcdC8vIEhpZ2hsaWdodCByb3dcblx0XHRcdGNvbnN0IHJvdyA9IHRoaXMuX2dldFBhcmVudEVsZW1lbnQoZWxlbWVudCwgJy5yb3cnKTtcblx0XHRcdGQzLnNlbGVjdChyb3cpLmNsYXNzZWQoJ2FjdGl2ZScsdHJ1ZSk7XG5cblx0XHRcdC8vIEhpZ2hsaWdodCBjb2xcblx0XHRcdGNvbnN0IGNlbGwgPSB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KGVsZW1lbnQsICcuY2VsbCcpO1xuXHRcdFx0Y29uc3QgY29sSW5kZXggPSB0aGlzLl9nZXRDaGlsZE5vZGVJbmRleChjZWxsLCAnLmNlbGwnKTtcblx0XHRcdGNvbnN0IGN1cnJlbnRDb2wgPSB0aGlzLl9lbGVtZW50cy5zdmcuc2VsZWN0QWxsKCcuY29sdW1uJykuZmlsdGVyKChkLGkpID0+IGkgPT09IGNvbEluZGV4KTtcblx0XHRcdGN1cnJlbnRDb2wuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG5cblx0XHR9XG5cblx0XHRfbW91c2VPdXRIYW5kbGVyKCkge1xuXG5cdFx0XHRpZiAodGhpcy5fbW91c2VPdmVyUmVjdCkgdGhpcy5fbW91c2VPdmVyUmVjdC5yZW1vdmUoKTtcblxuXHRcdFx0dGhpcy5fZWxlbWVudHMuc3ZnLnNlbGVjdEFsbCgnLnJvdycpLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcblx0XHRcdHRoaXMuX2VsZW1lbnRzLnN2Zy5zZWxlY3RBbGwoJy5jb2x1bW4nKS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG5cblx0XHR9XG5cblx0fVxuXG5cdHdpbmRvdy5pbmZlY3QgPSB3aW5kb3cuaW5mZWN0IHx8wqB7fTtcblx0d2luZG93LmluZmVjdC5SZXNpc3RlbmN5TWF0cml4ID0gUmVzaXN0ZW5jeU1hdHJpeDtcblxufSkoKTtcblxuIl19
