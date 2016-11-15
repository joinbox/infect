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

				self._createSingleRowLabel(enteredRows);

				rows.exit().remove();
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
				colHeads.exit().remove();
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

				// <g>
				var cells = d3.select(rowElement).selectAll('.cell').data(filteredData, function (col) {
					//console.error(col.antibiotic.id);
					return col.antibiotic.id;
				});

				cells.enter().append('g').attr('class', 'cell')
				// Rect
				.each(function (d) {
					d3.select(this).append('rect').style('fill', d ? self._colorScale(d.value) : '#fff').style('stroke', d === null ? '#dedede' : '').style('stroke-width', d === null ? 1 : 0)
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

				cells.exit().remove().each(function (d, i) {
					console.error(this, d, i);
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
				if (!data.value) return;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL21hdHJpeC9yZXNpc3RlbmN5LW1hdHJpeC5lczIwMTUuanMiXSwibmFtZXMiOlsiUmVzaXN0ZW5jeU1hdHJpeCIsImNvbnRhaW5lciIsImRhdGEiLCJFcnJvciIsIl9jb250YWluZXIiLCJfZGF0YSIsIl9jb25maWd1cmF0aW9uIiwic3BhY2VCZXR3ZWVuTGFiZWxzQW5kTWF0cml4IiwibGluZVdlaWdodCIsIl9lbGVtZW50cyIsInN2ZyIsIl9jcmVhdGVTVkciLCJkcmF3TWF0cml4Iiwia2V5TmFtZSIsImRvbnRVcGRhdGVTY2FsZSIsImNvbnNvbGUiLCJsb2ciLCJfa2V5TmFtZSIsIl9jb2x1bW5TY2FsZSIsIl9jcmVhdGVDb2x1bW5TY2FsZSIsIl9jb2xvclNjYWxlIiwiX2NyZWF0ZUNvbG9yU2NhbGUiLCJfZHJhd1Jvd3MiLCJiYW5kd2lkdGgiLCJfZHJhd0NvbHVtbkhlYWRzIiwiX3VwZGF0ZUNvbHVtblNjYWxlIiwiX3VwZGF0ZVBvc2l0aW9uc0FuZFNpemVzIiwicm93SGVpZ2h0IiwiT2JqZWN0IiwidmFsdWVzIiwic2VsZiIsInJvd3MiLCJzZWxlY3RBbGwiLCJiYWN0ZXJpdW0iLCJpZCIsImVudGVyZWRSb3dzIiwiZW50ZXIiLCJhcHBlbmQiLCJhdHRyIiwiZCIsImkiLCJlYWNoIiwicm93IiwiX2RyYXdDZWxsIiwiX2NyZWF0ZVNpbmdsZVJvd0xhYmVsIiwiZXhpdCIsInJlbW92ZSIsInByb3BlcnR5IiwiZWxlbWVudCIsInRleHQiLCJsYXRpbk5hbWUiLCJkMyIsInNlbGVjdCIsImFudGliaW90aWNzIiwibWFwIiwiaXRlbSIsImFudGliaW90aWMiLCJuYW1lIiwibGVuZ3RoIiwic2NhbGVCYW5kIiwiZG9tYWluIiwicmFuZ2UiLCJfZ2V0U3ZnV2lkdGgiLCJzY2FsZVNlcXVlbnRpYWwiLCJ0Iiwic2F0dXJhdGlvbiIsImxpZ2h0bmVzcyIsImh1ZSIsImhzbCIsInRvU3RyaW5nIiwiYW1vdW50T2ZEYXRhU2V0cyIsInNpemUiLCJ3aWR0aCIsIl9nZXRNYXhSb3dMYWJlbFdpZHRoIiwic3RlcCIsIm1heFJvd0xhYmVsV2lkdGgiLCJnZXRCQm94IiwibWF4Q29sTGFiZWxIZWlnaHQiLCJoZWlnaHQiLCJfZ2V0TWF4Q29sdW1uTGFiZWxIZWlnaHQiLCJiYW5kV2lkdGgiLCJNYXRoIiwiZmxvb3IiLCJfYWxpZ25DZWxsIiwiX3Jlc2l6ZUNlbGwiLCJsZWZ0IiwiYW1vdW50T2ZDb2xzIiwia2V5cyIsImNvbEhlaWdodCIsInN0eWxlIiwiY2VsbCIsImRpbWVuc2lvbnMiLCJudW1iZXIiLCJvZmZzZXQiLCJoZWFkZXJzIiwiY29sIiwiY29sSGVhZHMiLCJyb3dFbGVtZW50Iiwicm93RGF0YSIsImZpbHRlcmVkRGF0YSIsImNlbGxzIiwidmFsdWUiLCJvbiIsIl9tb3VzZU92ZXJIYW5kbGVyIiwiY2FsbCIsIl9tb3VzZU91dEhhbmRsZXIiLCJlcnJvciIsInNlbGVjdG9yIiwibWF0Y2giLCJub2RlTmFtZSIsInRvTG93ZXJDYXNlIiwibWF0Y2hlcyIsInBhcmVudE5vZGUiLCJjaGlsZCIsImluZGV4IiwicHJldmlvdXNTaWJsaW5nIiwieSIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsInRvcCIsIngiLCJwYXJzZUludCIsIl9tb3VzZU92ZXJSZWN0IiwiZmlsbCIsInRvRml4ZWQiLCJfZ2V0UGFyZW50RWxlbWVudCIsImNsYXNzZWQiLCJjb2xJbmRleCIsIl9nZXRDaGlsZE5vZGVJbmRleCIsImN1cnJlbnRDb2wiLCJmaWx0ZXIiLCJ3aW5kb3ciLCJpbmZlY3QiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBTTs7QUFFTjs7QUFFQTs7Ozs7O0FBSk0sS0FVQUEsZ0JBVkE7QUFZTCw0QkFBWUMsU0FBWixFQUF1QkMsSUFBdkIsRUFBNkI7QUFBQTs7QUFFNUIsT0FBSSxDQUFDRCxTQUFMLEVBQWdCO0FBQ2YsVUFBTSxJQUFJRSxLQUFKLENBQVUsK0VBQVYsQ0FBTjtBQUNBOztBQUVELFFBQUtDLFVBQUwsR0FBbUJILFNBQW5CO0FBQ0Es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QUFqQztBQUVBLENBdmhCRCIsImZpbGUiOiJqcy9tYXRyaXgvcmVzaXN0ZW5jeS1tYXRyaXguZXMyMDE1LmpzIiwic291cmNlc0NvbnRlbnQiOlsiKCgpID0+IHtcblxuXHQvKiBnbG9iYWwgZDMsIHdpbmRvdyAqL1xuXG5cdC8qKlxuXHQqIERyYXdzIGEgbWF0cml4IHdpdGggcmVzaXN0ZW5jaWVzLiBcblx0KiBSb3dzOiBBbnRpIGJpb3RpY3Ncblx0KiBDb2xzOiBCYWN0ZXJpYVxuXHQqIENlbGxzOiBDb2xvcmVkIGFjY29yZGluZyB0byByZXNpc3RlbmN5XG5cdCovXG5cdGNsYXNzIFJlc2lzdGVuY3lNYXRyaXgge1xuXG5cdFx0Y29uc3RydWN0b3IoY29udGFpbmVyLCBkYXRhKSB7XG5cblx0XHRcdGlmICghY29udGFpbmVyKSB7XG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignUmVzaXN0ZW5jeU1hdHJpeDogQXQgbGVhc3Qgb25lIGFyZ3VtZW50IChjb250YWluZXIpIGlzIG5lZWRlZCBpbiBjb25zdHJ1Y3Rvci4nKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fY29udGFpbmVyIFx0PSBjb250YWluZXI7XG5cdFx0XHR0aGlzLl9kYXRhIFx0XHRcdD0gZGF0YTtcblxuXHRcdFx0dGhpcy5fY29uZmlndXJhdGlvblx0PSB7XG5cdFx0XHRcdHNwYWNlQmV0d2VlbkxhYmVsc0FuZE1hdHJpeFx0XHQ6IDIwXG5cdFx0XHRcdCwgbGluZVdlaWdodFx0XHRcdFx0XHQ6IDVcblx0XHRcdH07XG5cblx0XHRcdC8vIEhvbGRzIHJlZmVyZW5jZXNcblx0XHRcdHRoaXMuX2VsZW1lbnRzXHRcdD0ge307XG5cblx0XHRcdC8vIENyZWF0ZSBTVkdcblx0XHRcdHRoaXMuX2VsZW1lbnRzLnN2ZyA9IHRoaXMuX2NyZWF0ZVNWRygpO1xuXG5cdFx0XHQvLyBJZiBhbGwgcmVxdWlyZWQgZGF0YSBpcyBhdmFpbGFibGUsIGRyYXcgbWF0cml4XG5cdFx0XHRpZiAodGhpcy5fY29udGFpbmVyICYmIHRoaXMuX2RhdGEpIHRoaXMuZHJhd01hdHJpeCgpO1xuXG5cdFx0fVxuXG5cblxuXHRcdC8qKlxuXHRcdCogVXBkYXRlcyB0aGUgbWF0cml4JyBkYXRhXG5cdFx0KiBAcGFyYW0ge0FycmF5fSBkYXRhXHRcdFx0XHRBcnJheSAocm93cykgb2YgQXJyYXlzIChjb2xzKSB3aGljaCBob2xkIHRoZSB2YWx1ZXMgKE9iamVjdClcblx0XHQqIEBwYXJhbSB7U3RyaW5nfcKgZmllbGROYW1lXHRcdFx0VmFsdWVzIGFyZSBwYXNzZWQgaW4gYW4gb2JqZWN0OyBuYW1lIG9mIHRoZSBrZXkgdGhhdCBob2xkcyB0aGVcblx0XHQqXHRcdFx0XHRcdFx0XHRcdFx0ZGF0YSB3aGljaCBzaG91bGQgYmUgZGlzcGxheWVkIGluIHRhYmxlLlxuXHRcdCovXG5cdFx0dXBkYXRlRGF0YShkYXRhLCBrZXlOYW1lLCBkb250VXBkYXRlU2NhbGUpIHtcblxuXHRcdFx0dGhpcy5fZGF0YSA9IGRhdGE7XG5cdFx0XHRjb25zb2xlLmxvZygnUmVzaXN0ZW5jeU1hdHJpeCAvIHVwZGF0ZURhdGE6IFVwZGF0ZSBzY2FsZT8gJW8uIFVwZGF0ZSBkYXRhIHRvICVvJywgIWRvbnRVcGRhdGVTY2FsZSwgZGF0YSk7XG5cdFx0XHR0aGlzLl9rZXlOYW1lID0ga2V5TmFtZTtcblx0XHRcdGlmICh0aGlzLl9jb250YWluZXIgJiYgdGhpcy5fZGF0YSkgdGhpcy5kcmF3TWF0cml4KGRvbnRVcGRhdGVTY2FsZSk7XG5cblx0XHR9XG5cblxuXG5cblx0XHQvKipcblx0XHQqIE1haW4gbWV0aG9kLiBEcmF3cyB0aGUgbWF0cml4IHdpdGggZGF0YSBhbmQgY29udGFpbmVyIHByb3ZpZGVkLlxuXHRcdCovXG5cdFx0ZHJhd01hdHJpeChkb250VXBkYXRlU2NhbGUpIHtcblxuXHRcdFx0Ly8gR2V0IHJvdyBzY2FsZVxuXHRcdFx0aWYgKCFkb250VXBkYXRlU2NhbGUpIHtcblx0XHRcdFx0dGhpcy5fY29sdW1uU2NhbGUgPSB0aGlzLl9jcmVhdGVDb2x1bW5TY2FsZSgpO1xuXHRcdFx0XHR0aGlzLl9jb2xvclNjYWxlID0gdGhpcy5fY3JlYXRlQ29sb3JTY2FsZSgpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLl9kcmF3Um93cyh0aGlzLl9jb2x1bW5TY2FsZS5iYW5kd2lkdGgoKSk7XG5cdFx0XHR0aGlzLl9kcmF3Q29sdW1uSGVhZHMoKTtcblxuXHRcdFx0aWYgKCFkb250VXBkYXRlU2NhbGUpIHtcblx0XHRcdFx0dGhpcy5fdXBkYXRlQ29sdW1uU2NhbGUoKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5fdXBkYXRlUG9zaXRpb25zQW5kU2l6ZXMoKTtcblxuXHRcdH1cblxuXG5cblx0XHQvKipcblx0XHQqIERyYXdzIHRoZSByb3dzXG5cdFx0KiBAcGFyYW0ge051bWJlcn0gcm93SGVpZ2h0XHRcdFx0V2lkdGggb2YgYSBzaW5nbGUgcm93XG5cdFx0Ki9cblx0XHRfZHJhd1Jvd3Mocm93SGVpZ2h0KSB7XG5cblx0XHRcdGNvbnNvbGUubG9nKCdSZXNpc3RlbmN5TWF0cml4IC8gX2RyYXdSb3dzOiBEcmF3IHJvd3Mgd2l0aCBkYXRhICVvIGFuZCBoZWlnaHQgJW8nLCBPYmplY3QudmFsdWVzKHRoaXMuX2RhdGEpLCByb3dIZWlnaHQpO1xuXG5cdFx0XHQvLyBSZWZlcmVuY2UgdG8gdGhpcywgbmVlZGVkIGZvciBlYWNoXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRcdFx0Ly8gZ1xuXHRcdFx0Y29uc3Qgcm93cyA9IHRoaXMuX2VsZW1lbnRzLnN2Z1xuXHRcdFx0XHQuc2VsZWN0QWxsKCcucm93Jylcblx0XHRcdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8yMjI0MDg0Mi9kMy11cGRhdGUtb24tbm9kZS1yZW1vdmFsLWFsd2F5cy1yZW1vdmUtdGhlLWxhc3QtZW50cnktaW4tc3ZnLWRvbVxuXHRcdFx0XHQuZGF0YSh0aGlzLl9kYXRhLCAoYmFjdGVyaXVtKSA9PiBiYWN0ZXJpdW0uaWQpO1xuXG5cdFx0XHRjb25zdCBlbnRlcmVkUm93cyA9IHJvd3Ncblx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0XHQuYXBwZW5kKCdnJylcblx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAncm93Jylcblx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgKGQsIGkpID0+IGB0cmFuc2xhdGUoMCwgJHtpICogcm93SGVpZ2h0fSlgKVxuXHRcdFx0XHRcdC8vIENhbm5vdCB1c2UgYXJyb3cgZnVuY3Rpb25zIGFzIHdlIG5lZWQgdGhpc1xuXHRcdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKHJvdykge1xuXHRcdFx0XHRcdFx0c2VsZi5fZHJhd0NlbGwodGhpcywgcm93LCByb3dIZWlnaHQpO1xuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRzZWxmLl9jcmVhdGVTaW5nbGVSb3dMYWJlbChlbnRlcmVkUm93cyk7XG5cblx0XHRcdHJvd3Ncblx0XHRcdFx0LmV4aXQoKVxuXHRcdFx0XHQucmVtb3ZlKCk7XG5cblx0XHR9XG5cblxuXG5cdFx0LyoqXG5cdFx0KiBSZXR1cm5zIHRoZSBTVkcncyB3aWR0aCBcblx0XHQqIEByZXR1cm4ge051bWJlcn1cblx0XHQqL1xuXHRcdF9nZXRTdmdXaWR0aCgpIHtcblx0XHRcdHJldHVybiB0aGlzLl9lbGVtZW50cy5zdmcucHJvcGVydHkoJ2NsaWVudFdpZHRoJyk7XG5cdFx0fVxuXG5cblxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlcyBhbmQgcmV0dXJucyBhIHNpbmdsZSByb3cgbGFiZWwuIE5lZWRlZCB0byBmaXJzdCBtZWFzdXJlIGFuZCB0aGVuXG5cdFx0KiBkcmF3IGl0IGF0IHRoZSByaWdodCBwbGFjZVxuXHRcdCovXG5cdFx0X2NyZWF0ZVNpbmdsZVJvd0xhYmVsKGVsZW1lbnQpIHtcblx0XHRcdHJldHVybiBlbGVtZW50XG5cdFx0XHRcdC5hcHBlbmQoJ3RleHQnKVxuXHRcdFx0XHQuYXR0cignY2xhc3MnLCAnbGFiZWwnKVxuXHRcdFx0XHQuYXR0cigndGV4dC1hbmNob3InLCAnZW5kJylcblx0XHRcdFx0LnRleHQoKGQpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gZC5iYWN0ZXJpdW0ubGF0aW5OYW1lO1xuXHRcdFx0XHR9KTtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogQ3JlYXRlcyBhbmQgcmV0dXJucyB0aGUgU1ZHXG5cdFx0Ki9cblx0XHRfY3JlYXRlU1ZHKCkge1xuXHRcdFx0cmV0dXJuIGQzLnNlbGVjdCh0aGlzLl9jb250YWluZXIpXG5cdFx0XHRcdC5hcHBlbmQoJ3N2ZycpO1xuXHRcdH1cblxuXG5cdFx0LyoqXG5cdFx0KiBDcmVhdGVzIHRoZSBzY2FsZSBmb3IgYWxsIGNvbHVtbnMsIGkuZS4gZm9yIGFsbCB0aGUgdmVydGljYWwgZW50aXRpZXMg4oCTwqByb3cgZGF0YVxuXHRcdCogbXVzdCBiZSB0YWtlbi4gVGhpcyBpcyBkb25lIGJlZm9yZSB0aGUgbGFiZWxzIGFyZSB0aGVyZSwgdGhlcmVmb3JlXG5cdFx0KiB0YWtlIHRoZSB3aG9sZSBTVkcgd2lkdGguXG5cdFx0Ki9cblx0XHRfY3JlYXRlQ29sdW1uU2NhbGUoKSB7XG5cblx0XHRcdGNvbnN0IGRhdGEgPSB0aGlzLl9kYXRhWzBdLmFudGliaW90aWNzLm1hcCgoaXRlbSkgPT4gaXRlbS5hbnRpYmlvdGljLm5hbWUpO1xuXHRcdFx0Y29uc29sZS5sb2coJ1Jlc2lzdGVuY3lNYXRyaXg6IERhdGEgZm9yIGNvbHVtbiBzY2FsZSAobGVuICVvKSBpcyAlbycsIGRhdGEubGVuZ3RoLCBkYXRhKTtcblx0XHRcdHJldHVybiBkMy5zY2FsZUJhbmQoKVxuXHRcdFx0XHQuZG9tYWluKGRhdGEpXG5cdFx0XHRcdC8vIC01MDogV2UgdHVybiB0aGUgY29sIGxhYmVscyBieSA0NcKwLCB0aGlzIHRha2VzIGEgYml0IG9mIHNwYWNlXG5cdFx0XHRcdC5yYW5nZShbMCwgdGhpcy5fZ2V0U3ZnV2lkdGgoKSAtIDUwXSk7XG5cblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogUmV0dXJucyB0aGUgc2NhbGUgZm9yIGNvbG9yaW5nIHRoZSBjZWxsc1xuXHRcdCovXG5cdFx0X2NyZWF0ZUNvbG9yU2NhbGUoKSB7XG5cdFx0XHRyZXR1cm4gbmV3IGQzLnNjYWxlU2VxdWVudGlhbCgodCkgPT4ge1xuXHRcdFx0XHQvL2NvbnN0IHNhdHVyYXRpb24gPSB0ICogMC4yICsgMC40OyAvLyA1MOKAkzYwJVxuXHRcdFx0XHRjb25zdCBzYXR1cmF0aW9uID0gMC43O1xuXHRcdFx0XHRjb25zdCBsaWdodG5lc3MgPSAoMSAtIHQpICogMC42ICsgMC40OyAvLyAzMOKAkzgwJVxuXHRcdFx0XHQvL2NvbnN0IGxpZ2h0bmVzcyA9IDAuNTtcblx0XHRcdFx0Ly8gSHVlIG5lZWRzIHZhbHVlcyBiZXR3ZWVuIDQwIGFuZCA5MFxuXHRcdFx0XHRjb25zdCBodWUgPSB0ICogMTAwO1xuXHRcdFx0XHQvL2NvbnNvbGUud2Fybih0LnRvRml4ZWQoMyksIGh1ZS50b0ZpeGVkKDMpLCBzYXR1cmF0aW9uLnRvRml4ZWQoMyksIGxpZ2h0bmVzcy50b0ZpeGVkKDMpKTtcblx0XHRcdFx0Y29uc3QgaHNsID0gZDMuaHNsKGh1ZSwgc2F0dXJhdGlvbiwgbGlnaHRuZXNzKTtcblx0XHRcdFx0cmV0dXJuIGhzbC50b1N0cmluZygpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQqIFVwZGF0ZXMgdGhlIGNvbCBzY2FsZS4gSXMgY2FsbGVkIGFmdGVyIGxhYmVscyB3ZXJlIGRyYXduIGFuZCBtZWFzdXJlZC4gU2NhbGUgc2hvdWxkIHRha2UgdXBcblx0XHQqIGFsbCBob3Jpem9udGFsIHNwYWNlIHRoYXQncyBsZWZ0LiBcblx0XHQqL1xuXHRcdF91cGRhdGVDb2x1bW5TY2FsZSgpIHtcblxuXHRcdFx0Ly8gUmVtb3ZlIGFtb3VudCBvZiBlbnRyaWVzIHNvIHRoYXQgd2UgY2FuIGluc2VydCBhIGxpbmUgb2YgMSBweFxuXHRcdFx0Y29uc3QgYW1vdW50T2ZEYXRhU2V0cyA9IHRoaXMuX2VsZW1lbnRzLnN2Zy5zZWxlY3RBbGwoJy5jb2x1bW4nKS5zaXplKCk7XG5cdFx0XHRjb25zdCB3aWR0aCA9IHRoaXMuX2dldFN2Z1dpZHRoKCkgLSA1MCAtIHRoaXMuX2dldE1heFJvd0xhYmVsV2lkdGgoKSAtIHRoaXMuX2NvbmZpZ3VyYXRpb24uc3BhY2VCZXR3ZWVuTGFiZWxzQW5kTWF0cml4IC0gYW1vdW50T2ZEYXRhU2V0cyAqIHRoaXMuX2NvbmZpZ3VyYXRpb24ubGluZVdlaWdodDtcblx0XHRcdGNvbnNvbGUubG9nKCdSZXNpc3RlbmN5TWF0cml4IC8gX3VwZGF0ZUNvbHVtblNjYWxlOiBDb2wgIyBpcyAlbywgc3ZnIHdpZHRoIGlzICVvLCB3aWR0aCBjb2x1bW4gY29udGVudCBpcyAlbycsIGFtb3VudE9mRGF0YVNldHMsIHRoaXMuX2dldFN2Z1dpZHRoKCksIHdpZHRoKTtcblxuXHRcdFx0Ly8gVXBkYXRlIHNjYWxlXG5cdFx0XHR0aGlzLl9jb2x1bW5TY2FsZS5yYW5nZShbMCwgd2lkdGhdKTtcblx0XHRcdGNvbnNvbGUubG9nKCdSZXNpc3RlbmN5TWF0cml4OiBOZXcgYmFuZHdpZHRoIGlzICVvLCBzdGVwIGlzICVvJywgdGhpcy5fY29sdW1uU2NhbGUuYmFuZHdpZHRoKCksIHRoaXMuX2NvbHVtblNjYWxlLnN0ZXAoKSk7XG5cblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogUmV0dXJucyB3aWR0aCBvZiB3aWRlc3Qgcm93IGxhYmVsXG5cdFx0Ki9cblx0XHRfZ2V0TWF4Um93TGFiZWxXaWR0aCgpIHtcblxuXHRcdFx0aWYgKCF0aGlzLl9lbGVtZW50cy5zdmcuc2VsZWN0QWxsKCcucm93JykpIHJldHVybiAwO1xuXG5cdFx0XHRsZXQgbWF4Um93TGFiZWxXaWR0aCA9IDA7XG5cdFx0XHR0aGlzLl9lbGVtZW50cy5zdmcuc2VsZWN0QWxsKCcucm93Jykuc2VsZWN0KCcubGFiZWwnKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNvbnN0IHdpZHRoID0gdGhpcy5nZXRCQm94KCkud2lkdGg7XG5cdFx0XHRcdGlmICh3aWR0aCA+IG1heFJvd0xhYmVsV2lkdGgpIG1heFJvd0xhYmVsV2lkdGggPSB3aWR0aDtcblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG1heFJvd0xhYmVsV2lkdGg7XG5cblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogUmV0dXJucyB3aWR0aCBvZiB3aWRlc3QgY29sdW1uIGxhYmVsXG5cdFx0Ki9cblx0XHRfZ2V0TWF4Q29sdW1uTGFiZWxIZWlnaHQoKSB7XG5cdFx0XHRsZXQgbWF4Q29sTGFiZWxIZWlnaHQgPSAwO1xuXHRcdFx0dGhpcy5fZWxlbWVudHMuc3ZnLnNlbGVjdEFsbCgnLmNvbHVtbicpLnNlbGVjdCgnLmxhYmVsJykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0Y29uc3QgaGVpZ2h0ID0gdGhpcy5nZXRCQm94KCkud2lkdGg7XG5cdFx0XHRcdGlmIChoZWlnaHQgPiBtYXhDb2xMYWJlbEhlaWdodCkgbWF4Q29sTGFiZWxIZWlnaHQgPSBoZWlnaHQ7XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBtYXhDb2xMYWJlbEhlaWdodDtcblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogVXBkYXRlcyB0aGUgc2NhbGVzIGFmdGVyIHRoZSBsYWJlbHMgKHJvdy9jb2wpIHdlcmUgZHJhd24gYW5kIHVwZGF0ZXMgY2VsbHMvcm93cyB0byBcblx0XHQqIHJlc3BlY3Qgd2lkdGgvaGVpZ2h0IG9mIHRoZSBsYWJlbHMuXG5cdFx0KiBSZXNldHMgaGVpZ2h0IG9mIHRoZSBTVkcgdG8gbWF0Y2ggaXRzIGNvbnRlbnRzLlxuXHRcdCovXG5cdFx0X3VwZGF0ZVBvc2l0aW9uc0FuZFNpemVzKCkge1xuXG5cdFx0XHRjb25zdCBzZWxmID0gdGhpcztcblxuXHRcdFx0Y29uc3QgbWF4Um93TGFiZWxXaWR0aCA9IHRoaXMuX2dldE1heFJvd0xhYmVsV2lkdGgoKVxuXHRcdFx0XHQsIG1heENvbExhYmVsSGVpZ2h0ID0gdGhpcy5fZ2V0TWF4Q29sdW1uTGFiZWxIZWlnaHQoKTtcblxuXHRcdFx0Y29uc3QgYmFuZFdpZHRoIFx0PSB0aGlzLl9jb2x1bW5TY2FsZS5iYW5kd2lkdGgoKVxuXHRcdFx0XHQsIHN0ZXBcdFx0XHQ9dGhpcy5fY29sdW1uU2NhbGUuc3RlcCgpO1xuXG5cdFx0XHRjb25zb2xlLmxvZygnUmVzaXN0ZW5jeU1hdHJpeCAvIF91cGRhdGVQb3NpdGlvbnNBbmRTaXplczogbWF4Um93TGFiZWxXaWR0aCcsIG1heFJvd0xhYmVsV2lkdGgsICdjb2xsYWJlbGhlaWdodCcsIG1heENvbExhYmVsSGVpZ2h0LCAnYmFuZFdpZHRoJywgYmFuZFdpZHRoKTtcblxuXHRcdFx0Ly8gVXBkYXRlIHJvd3Ncblx0XHRcdHRoaXMuX2VsZW1lbnRzLnN2Z1xuXHRcdFx0XHQuc2VsZWN0QWxsKCcucm93Jylcblx0XHRcdFx0LmVhY2goZnVuY3Rpb24oZCxpKXtcblx0XHRcdFx0XHRkMy5zZWxlY3QodGhpcylcblx0XHRcdFx0XHRcdC5hdHRyKCdoZWlnaHQnLCBiYW5kV2lkdGgpXG5cdFx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgwLCAkeyBpICogTWF0aC5mbG9vciggYmFuZFdpZHRoICkgKyBNYXRoLmZsb29yKCBtYXhDb2xMYWJlbEhlaWdodCApICsgc2VsZi5fY29uZmlndXJhdGlvbi5zcGFjZUJldHdlZW5MYWJlbHNBbmRNYXRyaXggKyBpICogc2VsZi5fY29uZmlndXJhdGlvbi5saW5lV2VpZ2h0IH0pYCk7XG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdC8vIFVwZGF0ZSBjZWxsJ3MgcmVjdGFuZ2xlc1xuXHRcdFx0dGhpcy5fZWxlbWVudHMuc3ZnXG5cdFx0XHRcdC5zZWxlY3RBbGwoJy5yb3cnKVxuXHRcdFx0XHQuc2VsZWN0QWxsKCcuY2VsbCcpXG5cdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKGQsIGkpIHtcblx0XHRcdFx0XHRzZWxmLl9hbGlnbkNlbGwodGhpcywgTWF0aC5mbG9vcihzZWxmLl9jb2x1bW5TY2FsZS5iYW5kd2lkdGgoKSksIGksIE1hdGguZmxvb3IobWF4Um93TGFiZWxXaWR0aCArIHNlbGYuX2NvbmZpZ3VyYXRpb24uc3BhY2VCZXR3ZWVuTGFiZWxzQW5kTWF0cml4KSwgc2VsZi5fY29uZmlndXJhdGlvbi5saW5lV2VpZ2h0KTtcblx0XHRcdFx0fSlcblx0XHRcdFx0LnNlbGVjdCgncmVjdCcpXG5cdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHNlbGYuX3Jlc2l6ZUNlbGwodGhpcywgTWF0aC5mbG9vcihzZWxmLl9jb2x1bW5TY2FsZS5iYW5kd2lkdGgoKSkpO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0Ly8gVXBkYXRlIGNvbHNcblx0XHRcdC8vdGhpcy5fZWxlbWVudHMuY29sdW1uc1xuXHRcdFx0dGhpcy5fZWxlbWVudHMuc3ZnXG5cdFx0XHRcdC5zZWxlY3RBbGwoJy5jb2x1bW4nKVxuXHRcdFx0XHQuZWFjaChmdW5jdGlvbihkLGkpIHtcblx0XHRcdFx0XHQvLyBzdGVwIC8gMjogTWFrZSBzdXJlIHdlJ3JlIGtpbmRhIGNlbnRlcmVkIG92ZXIgdGhlIGNvbFxuXHRcdFx0XHRcdGNvbnN0IGxlZnQgPSBpICogKE1hdGguZmxvb3Ioc3RlcCkgKyBzZWxmLl9jb25maWd1cmF0aW9uLmxpbmVXZWlnaHQpICsgbWF4Um93TGFiZWxXaWR0aCArIHNlbGYuX2NvbmZpZ3VyYXRpb24uc3BhY2VCZXR3ZWVuTGFiZWxzQW5kTWF0cml4ICsgc3RlcCAvIDI7XG5cdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpXG5cdFx0XHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgkeyBsZWZ0IH0sICR7IG1heENvbExhYmVsSGVpZ2h0IH0pYCk7XG5cdFx0XHRcdH0pO1xuXG5cdFx0XHQvLyBVcGRhdGUgbGFiZWwncyB4IHBvc2l0aW9uXG5cdFx0XHR0aGlzLl9lbGVtZW50cy5zdmdcblx0XHRcdFx0LnNlbGVjdEFsbCgnLnJvdycpXG5cdFx0XHRcdC5zZWxlY3QoJy5sYWJlbCcpXG5cdFx0XHRcdC5hdHRyKCd4JywgbWF4Um93TGFiZWxXaWR0aClcblx0XHRcdFx0LmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpXG5cdFx0XHRcdFx0XHQuYXR0cigneScsIGJhbmRXaWR0aCAvIDIgKyB0aGlzLmdldEJCb3goKS5oZWlnaHQgLyAyKTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdC8vIFVwZGF0ZSBjb2wgbGFiZWwncyB5IHBvc2l0aW9uXG5cdFx0XHQvL3RoaXMuX2VsZW1lbnRzLmNvbHVtbnNcblx0XHRcdC8vXHQuc2VsZWN0KCcubGFiZWwnKVxuXHRcdFx0Ly9cdC5hdHRyKCd0cmFuc2Zvcm0nLCAncm90YXRlKC00NSknKTtcblxuXHRcdFx0Ly8gVXBkYXRlIHN2ZyBoZWlnaHRcblx0XHRcdGNvbnN0IGFtb3VudE9mQ29scyA9ICggT2JqZWN0LmtleXModGhpcy5fZGF0YSkubGVuZ3RoIClcblx0XHRcdFx0LCBjb2xIZWlnaHQgPSB0aGlzLl9jb2x1bW5TY2FsZS5zdGVwKCk7XG5cdFx0XHR0aGlzLl9jb250YWluZXIuc3R5bGUuaGVpZ2h0ID0gKHRoaXMuX2dldE1heENvbHVtbkxhYmVsSGVpZ2h0KCkgKyAoY29sSGVpZ2h0ICsgdGhpcy5fY29uZmlndXJhdGlvbi5saW5lV2VpZ2h0KSAqIGFtb3VudE9mQ29scyArIHRoaXMuX2NvbmZpZ3VyYXRpb24uc3BhY2VCZXR3ZWVuTGFiZWxzQW5kTWF0cml4KSArICdweCc7XG5cblx0XHR9XG5cblxuXG5cdFx0LyoqXG5cdFx0KiBBbGlnbnMgYSBzaW5nbGUgY2VsbFxuXHRcdCovXG5cdFx0X2FsaWduQ2VsbChjZWxsLCBkaW1lbnNpb25zLCBudW1iZXIsIG9mZnNldCA9IDAsIGxpbmVXZWlnaHQgPSAxKSB7XG5cdFx0XHRkMy5zZWxlY3QoY2VsbClcblx0XHRcdFx0Ly8gKyBudW1iZXI6IFNwYWNlIDEgcHggYmV0d2VlbiBjZWxsc1xuXHRcdFx0XHQuYXR0cigndHJhbnNmb3JtJywgYHRyYW5zbGF0ZSgkeyBvZmZzZXQgKyBudW1iZXIgKiBkaW1lbnNpb25zICsgbnVtYmVyICogbGluZVdlaWdodCB9LDApYCk7XG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQqIFJlc2l6ZXMgYSBzaW5nbGUgY2VsbFxuXHRcdCovIFxuXHRcdF9yZXNpemVDZWxsKGNlbGwsIGRpbWVuc2lvbnMpIHtcblx0XHRcdGQzLnNlbGVjdChjZWxsKVxuXHRcdFx0XHQuYXR0cignaGVpZ2h0JywgZGltZW5zaW9ucylcblx0XHRcdFx0LmF0dHIoJ3dpZHRoJywgZGltZW5zaW9ucyk7XG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQqIERyYXdzIHRoZSBjb2x1bW4gaGVhZHMsIHRoZW4gcmV0dXJucyB0aGUgY3JlYXRlZCBlbGVtZW50c1xuXHRcdCovXG5cdFx0X2RyYXdDb2x1bW5IZWFkcygpIHtcblxuXHRcdFx0Ly8gR2V0IGhlYWRlcnMgZnJvbSBkYXRhIChrZXlzIG9mIGZpcnN0IGFycmF5IGl0ZW0pXG5cdFx0XHRjb25zdCBoZWFkZXJzID0gdGhpcy5fZGF0YVswXS5hbnRpYmlvdGljcy5tYXAoKGNvbCkgPT4gY29sLmFudGliaW90aWMpO1xuXHRcdFx0Y29uc29sZS5sb2coJ1Jlc2lzdGVuY3lNYXRyaXggLyBfZHJhd0NvbHVtbkhlYWRzOiBIZWFkZXJzIGFyZSAlbycsIGhlYWRlcnMpO1xuXG5cdFx0XHQvLyA8Zz4gYW5kIHRyYW5zZm9ybVxuXHRcdFx0Y29uc3QgY29sSGVhZHMgPSB0aGlzLl9lbGVtZW50cy5zdmdcblx0XHRcdFx0LnNlbGVjdEFsbCgnLmNvbHVtbicpXG5cdFx0XHRcdC5kYXRhKGhlYWRlcnMsIChjb2wpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gY29sLmlkO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0Ly8gRHJhdyBoZWFkcywgY29uc2lzdGluZyBvZiA8Zz4gd2l0aCBjb250YWluZWQgPHRleHQ+XG5cdFx0XHRjb2xIZWFkc1xuXHRcdFx0XHQuZW50ZXIoKVxuXHRcdFx0XHRcdC5hcHBlbmQoJ2cnKVxuXHRcdFx0XHRcdC8vIHRyYW5zbGF0aW9uIHdpbGwgYmUgZG9uZSBpbiB0aGlzLnVwZGF0ZVBvc2l0aW9uc0FuZFNpemVzXG5cdFx0XHRcdFx0LmF0dHIoJ2NsYXNzJywgJ2NvbHVtbicpXG5cdFx0XHRcdFx0LmFwcGVuZCgndGV4dCcpXG5cdFx0XHRcdFx0XHQuYXR0cignY2xhc3MnLCAnbGFiZWwnKVxuXHRcdFx0XHRcdFx0LmF0dHIoJ3RleHQtYW5jaG9yJywgJ3N0YXJ0Jylcblx0XHRcdFx0XHRcdC5hdHRyKCd0cmFuc2Zvcm0nLCAncm90YXRlKC00NSknKVxuXHRcdFx0XHRcdFx0LnRleHQoZCA9PiBkLm5hbWUpO1xuXG5cblx0XHRcdC8vIFRleHRcblx0XHRcdGNvbEhlYWRzXG5cdFx0XHRcdC5leGl0KClcblx0XHRcdFx0LnJlbW92ZSgpO1xuXG5cdFx0fVxuXG5cblx0XHQvKipcblx0XHQqIERyYXdzIGEgc2luZ2xlIHJlc2lzdGVuY3kgY2VsbFxuXHRcdCovXG5cdFx0X2RyYXdDZWxsKCByb3dFbGVtZW50LCByb3dEYXRhLCBkaW1lbnNpb25zICkge1xuXG5cdFx0XHQvL2NvbnNvbGUubG9nKCAnUmVzaXN0ZW5jeU1hdHJpeCAvIF9kcmF3Q2VsbDogcm93ICVvLCBkYXRhICVvLCBkaW1lbnNpb25zICVvJywgcm93RWxlbWVudCwgcm93RGF0YSwgZGltZW5zaW9ucyApO1xuXHRcdFx0Y29uc3Qgc2VsZiA9IHRoaXM7XG5cblx0XHRcdC8vIFJlbW92ZSAnbmFtZScgcHJvcGVydHkgb24gcm93IG9iamVjdFxuXHRcdFx0Y29uc3QgZmlsdGVyZWREYXRhID0gcm93RGF0YS5hbnRpYmlvdGljcztcblxuXHRcdFx0Ly8gPGc+XG5cdFx0XHRjb25zdCBjZWxscyA9IGQzLnNlbGVjdChyb3dFbGVtZW50KVxuXHRcdFx0XHQuc2VsZWN0QWxsKCcuY2VsbCcpXG5cdFx0XHRcdC5kYXRhKGZpbHRlcmVkRGF0YSwgKGNvbCkgPT4ge1xuXHRcdFx0XHRcdC8vY29uc29sZS5lcnJvcihjb2wuYW50aWJpb3RpYy5pZCk7XG5cdFx0XHRcdFx0cmV0dXJuIGNvbC5hbnRpYmlvdGljLmlkO1xuXHRcdFx0XHR9KTtcblxuXHRcdFx0Y2VsbHNcblx0XHRcdFx0LmVudGVyKClcblx0XHRcdFx0LmFwcGVuZCgnZycpXG5cdFx0XHRcdC5hdHRyKCdjbGFzcycsICdjZWxsJylcblx0XHRcdFx0Ly8gUmVjdFxuXHRcdFx0XHQuZWFjaChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0ZDMuc2VsZWN0KHRoaXMpXG5cdFx0XHRcdFx0XHQuYXBwZW5kKCdyZWN0Jylcblx0XHRcdFx0XHRcdC5zdHlsZSgnZmlsbCcsIGQgPyBzZWxmLl9jb2xvclNjYWxlKGQudmFsdWUpIDogJyNmZmYnKVxuXHRcdFx0XHRcdFx0LnN0eWxlKCdzdHJva2UnLCBkID09PSBudWxsID8gJyNkZWRlZGUnIDogJycpXG5cdFx0XHRcdFx0XHQuc3R5bGUoJ3N0cm9rZS13aWR0aCcsIGQgPT09IG51bGwgPyAxIDogMClcblx0XHRcdFx0XHRcdC8vIFNldCBzaXplIG9mIHJlY3Rcblx0XHRcdFx0XHRcdC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRzZWxmLl9yZXNpemVDZWxsKHRoaXMsZGltZW5zaW9ucyk7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0Lm9uKCdtb3VzZWVudGVyJywgZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBlbGVtZW50ID0gdGhpcztcblx0XHRcdFx0XHRcdFx0c2VsZi5fbW91c2VPdmVySGFuZGxlci5jYWxsKHNlbGYsIGVsZW1lbnQsIGQpO1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0XHRcdC5vbignbW91c2VsZWF2ZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0XHRjb25zdCBlbGVtZW50ID0gdGhpcztcblx0XHRcdFx0XHRcdFx0c2VsZi5fbW91c2VPdXRIYW5kbGVyLmNhbGwoc2VsZiwgZWxlbWVudCk7XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cblxuXHRcdFx0Y2VsbHNcblx0XHRcdFx0LmV4aXQoKVxuXHRcdFx0XHQucmVtb3ZlKClcblx0XHRcdFx0LmVhY2goZnVuY3Rpb24oZCwgaSkge1xuXHRcdFx0XHRcdGNvbnNvbGUuZXJyb3IodGhpcywgZCwgaSk7XG5cdFx0XHRcdH0pO1xuXG5cblx0XHRcdHJldHVybiBjZWxscztcblxuXHRcdH1cblxuXG5cblxuXHRcdC8qKlxuXHRcdCogUmV0dXJucyB0aGUgZmlyc3QgcGFyZW50IG9mIGVsZW1lbnQgdGhhdCBtYXRjaGVzIHNlbGVjdG9yXG5cdFx0Ki9cblx0XHRfZ2V0UGFyZW50RWxlbWVudChlbGVtZW50LCBzZWxlY3Rvcikge1xuXG5cdFx0XHRsZXQgbWF0Y2g7XG5cdFx0XHR3aGlsZShlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCkgIT09ICdzdmcnKSB7XG5cdFx0XHRcdGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG5cdFx0XHRcdFx0bWF0Y2ggPSBlbGVtZW50O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtYXRjaDtcblxuXHRcdH1cblxuXHRcdC8qKlxuXHRcdCogUmV0dXJucyBpbmRleCBvZiBjdXJyZW50IGNoaWxkIHRoYXQgbWF0Y2hlcyBzZWxlY3RvciBpbiBpdHMgcGFyZW50XG5cdFx0Ki9cblx0XHRfZ2V0Q2hpbGROb2RlSW5kZXgoY2hpbGQsIHNlbGVjdG9yKSB7XG5cblx0XHRcdGxldCBpbmRleCA9IDA7XG5cdFx0XHR3aGlsZShjaGlsZC5wcmV2aW91c1NpYmxpbmcpIHtcblx0XHRcdFx0aWYgKGNoaWxkLnByZXZpb3VzU2libGluZy5tYXRjaGVzKHNlbGVjdG9yKSkgaW5kZXgrKztcblx0XHRcdFx0Y2hpbGQgPSBjaGlsZC5wcmV2aW91c1NpYmxpbmc7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gaW5kZXg7XG5cblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogSGFuZGxlcyBtb3VzZWVudGVyIG9uIGEgY2VsbFxuXHRcdCovXG5cdFx0X21vdXNlT3ZlckhhbmRsZXIoZWxlbWVudCwgZGF0YSkge1xuXG5cdFx0XHQvLyBEYXRhIG5vdCBhdmFpbGFibGU6IENlbGwgaGFzIG5vIHZhbHVlLiBUaGVyZSdzIG5vIFxuXHRcdFx0Ly8gaG92ZXIgZWZmZWN0IGZvciBlbXB0eSBjZWxscy5cblx0XHRcdGlmICghZGF0YS52YWx1ZSkgcmV0dXJuO1xuXG5cdFx0XHRsZXQgc3ZnO1xuXHRcdFx0dGhpcy5fZWxlbWVudHMuc3ZnLmVhY2goZnVuY3Rpb24oKSB7IHN2ZyA9IHRoaXM7IH0pO1xuXG5cdFx0XHRjb25zdCB5XHRcdFx0PSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCAtIHN2Zy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3Bcblx0XHRcdFx0LCB4XHRcdFx0PSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQgLSBzdmcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdFxuXHRcdFx0XHQsIHdpZHRoXHRcdD0gcGFyc2VJbnQoZDMuc2VsZWN0KGVsZW1lbnQpLmF0dHIoJ3dpZHRoJyksIDEwKSArIDQwXG5cdFx0XHRcdCwgaGVpZ2h0XHQ9IHBhcnNlSW50KGQzLnNlbGVjdChlbGVtZW50KS5hdHRyKCdoZWlnaHQnKSwgMTApICsgNDA7XG5cblx0XHRcdHRoaXMuX21vdXNlT3ZlclJlY3QgPSB0aGlzLl9lbGVtZW50cy5zdmdcblx0XHRcdFx0LmFwcGVuZCgnZycpO1xuXG5cdFx0XHR0aGlzLl9tb3VzZU92ZXJSZWN0XG5cdFx0XHRcdC5hcHBlbmQoJ3JlY3QnKVxuXHRcdFx0XHQuYXR0cigneCcsIHggLSAyMClcblx0XHRcdFx0LmF0dHIoJ3knLCB5IC0gMjApXG5cdFx0XHRcdC5hdHRyKCdjbGFzcycsICdob3Zlci1jZWxsJylcblx0XHRcdFx0LnN0eWxlKCdmaWxsJywgZWxlbWVudC5zdHlsZS5maWxsKVxuXHRcdFx0XHQuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXHRcdFx0XHQuYXR0cignaGVpZ2h0JywgaGVpZ2h0KVxuXHRcdFx0XHQuYXR0cignd2lkdGgnLCB3aWR0aClcblx0XHRcdFx0LnN0eWxlKCdwb2ludGVyLWV2ZW50cycsICdub25lJyk7XG5cdFx0XHRcdC8vLnN0eWxlKCdvcGFjaXR5JywgMC45KTtcblx0XHRcdFxuXHRcdFx0dGhpcy5fbW91c2VPdmVyUmVjdFxuXHRcdFx0XHQuYXBwZW5kKCd0ZXh0Jylcblx0XHRcdFx0LnRleHQoZGF0YS52YWx1ZS50b0ZpeGVkKDIpKVxuXHRcdFx0XHQuc3R5bGUoJ2NvbG9yJywgJ2JsYWNrJylcblx0XHRcdFx0LnN0eWxlKCdmb250LXNpemUnLCAnMjBweCcpXG5cdFx0XHRcdC5zdHlsZSgndGV4dC1hbGlnbicsICdjZW50ZXInKVxuXHRcdFx0XHQuc3R5bGUoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKVxuXHRcdFx0XHQuYXR0cigneCcsIHggLSAxMClcblx0XHRcdFx0LmF0dHIoJ3knLCB5ICsgMjApO1xuXG5cdFx0XHQvKnRoaXMuX21vdXNlT3ZlclJlY3Quc2VsZWN0KCd0ZXh0JykuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdFx0Ly9jb25zdCBiYm94ID0gdGhpcy5nZXRCQm94KCk7XG5cdFx0XHR9KTtcblx0XHRcdFxuXHRcdFx0dGhpcy5fbW91c2VPdmVyUmVjdC5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKHRoaXMucXVlcnlTZWxlY3RvcigncmVjdCcpKTtcblx0XHRcdH0pOyovXG5cblx0XHRcdC8vIEhpZ2hsaWdodCByb3dcblx0XHRcdGNvbnN0IHJvdyA9IHRoaXMuX2dldFBhcmVudEVsZW1lbnQoZWxlbWVudCwgJy5yb3cnKTtcblx0XHRcdGQzLnNlbGVjdChyb3cpLmNsYXNzZWQoJ2FjdGl2ZScsdHJ1ZSk7XG5cblx0XHRcdC8vIEhpZ2hsaWdodCBjb2xcblx0XHRcdGNvbnN0IGNlbGwgPSB0aGlzLl9nZXRQYXJlbnRFbGVtZW50KGVsZW1lbnQsICcuY2VsbCcpO1xuXHRcdFx0Y29uc3QgY29sSW5kZXggPSB0aGlzLl9nZXRDaGlsZE5vZGVJbmRleChjZWxsLCAnLmNlbGwnKTtcblx0XHRcdGNvbnN0IGN1cnJlbnRDb2wgPSB0aGlzLl9lbGVtZW50cy5zdmcuc2VsZWN0QWxsKCcuY29sdW1uJykuZmlsdGVyKChkLGkpID0+IGkgPT09IGNvbEluZGV4KTtcblx0XHRcdGN1cnJlbnRDb2wuY2xhc3NlZCgnYWN0aXZlJywgdHJ1ZSk7XG5cblx0XHR9XG5cblx0XHRfbW91c2VPdXRIYW5kbGVyKCkge1xuXG5cdFx0XHRpZiAodGhpcy5fbW91c2VPdmVyUmVjdCkgdGhpcy5fbW91c2VPdmVyUmVjdC5yZW1vdmUoKTtcblxuXHRcdFx0dGhpcy5fZWxlbWVudHMuc3ZnLnNlbGVjdEFsbCgnLnJvdycpLmNsYXNzZWQoJ2FjdGl2ZScsIGZhbHNlKTtcblx0XHRcdHRoaXMuX2VsZW1lbnRzLnN2Zy5zZWxlY3RBbGwoJy5jb2x1bW4nKS5jbGFzc2VkKCdhY3RpdmUnLCBmYWxzZSk7XG5cblx0XHR9XG5cblx0fVxuXG5cdHdpbmRvdy5pbmZlY3QgPSB3aW5kb3cuaW5mZWN0IHx8wqB7fTtcblx0d2luZG93LmluZmVjdC5SZXNpc3RlbmN5TWF0cml4ID0gUmVzaXN0ZW5jeU1hdHJpeDtcblxufSkoKTtcblxuIl19
