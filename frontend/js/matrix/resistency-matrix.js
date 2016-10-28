(() => {

	/* global d3, window */

	/**
	* Draws a matrix with resistencies. 
	* Rows: Anti biotics
	* Cols: Bacteria
	* Cells: Colored according to resistency
	*/
	class ResistencyMatrix {

		constructor(container, data) {

			if (!container) {
				throw new Error('ResistencyMatrix: At least one argument (container) is needed in constructor.');
			}

			this._container 	= container;
			this._data 			= data;

			this._configuration	= {
				spaceBetweenLabelsAndMatrix		: 20
				, lineWeight					: 5
			};

			// Holds references
			this._elements		= {};

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
		updateData(data, keyName) {

			this._data = data;
			console.log('ResistencyMatrix / updateData: Update data to %o', data);
			this._keyName = keyName;
			if (this._container && this._data) this.drawMatrix();

		}




		/**
		* Main method. Draws the matrix with data and container provided.
		*/
		drawMatrix() {

			// Get row scale
			this._columnScale = this._createColumnScale();
			this._colorScale = this._createColorScale();

			this._elements.rows = this._drawRows( this._columnScale.bandwidth() );
			this._elements.columns = this._drawColumnHeads();

			this._updateColumnScale();
			this._updatePositionsAndSizes();

		}



		/**
		* Draws the rows
		* @param {Number} rowHeight			Width of a single row
		*/
		_drawRows(rowHeight) {

			console.log('ResistencyMatrix / _drawRows: Draw rows with data %o and height %o', Object.values(this._data), rowHeight);

			// Reference to this, needed for each
			const self = this;

			// g
			const rows = this._elements.svg
				.selectAll('.row')
				.data(Object.entries(this._data))
				.enter()
					.append('g')
						.attr('class', 'row')
						.attr('transform', (d, i) => `translate(0, ${i * rowHeight})`)
						// Cannot use arrow functions as we need this
						.each(function(row) {
							self._drawCell( this, row, rowHeight );
						});


			this._createSingleRowLabel(rows);
			return rows;

		}



		/**
		* Returns the SVG's width 
		* @return {Number}
		*/
		_getSvgWidth() {
			return this._elements.svg.property('clientWidth');
		}



		/**
		* Creates and returns a single row label. Needed to first measure and then
		* draw it at the right place
		*/
		_createSingleRowLabel(element) {
			return element
				.append('text')
				.attr('class', 'label')
				.attr('text-anchor', 'end')
				.text((d, i) => {
					return d[0];
				});
		}


		/**
		* Creates and returns the SVG
		*/
		_createSVG() {
			return d3.select(this._container)
				.append('svg');
		}


		/**
		* Creates the scale for all columns, i.e. for all the vertical entities – row data
		* must be taken. This is done before the labels are there, therefore
		* take the whole SVG width.
		*/
		_createColumnScale() {

			const data = Object.keys(Object.values(this._data)[0]);
			return d3.scaleBand()
				.domain(data)
				// -50: We turn the col labels by 45°, this takes a bit of space
				.range([0, this._getSvgWidth() - 50]);

		}


		/**
		* Returns the scale for coloring the cells
		*/
		_createColorScale() {
			return new d3.scaleSequential((t) => {
				// Hue needs values between 40 and 90
				const hue = (40 + (t * 50))/360 * 100;
				const hsl = d3.hsl(hue, 1, (1 - t));
				return hsl.toString();
			});
		}


		/**
		* Updates the col scale. Is called after labels were drawn and measured. Scale should take up
		* all horizontal space that's left. 
		*/
		_updateColumnScale() {

			// Remove amount of entries so that we can insert a line of 1 px
			const amountOfDataSets = Object.values(Object.values(this._data)[0]).length - 1;
			const width = this._getSvgWidth() - 50 - this._getMaxRowLabelWidth() - this._configuration.spaceBetweenLabelsAndMatrix - amountOfDataSets * this._configuration.lineWeight;
			console.log( 'ResistencyMatrix / _updateColumnScale: Col # is %o, svg width is %o, width column content is %o', amountOfDataSets, this._getSvgWidth(), width );

			// Update scale
			this._columnScale.range([0, width]);

		}


		/**
		* Returns width of widest row label
		*/
		_getMaxRowLabelWidth() {
			if (!this._elements.rows) return 0;

			let maxRowLabelWidth = 0;
			this._elements.rows.select('.label').each(function(){
				const width = this.getBBox().width;
				if (width > maxRowLabelWidth) maxRowLabelWidth = width;
			});
			return maxRowLabelWidth;

		}


		/**
		* Returns width of widest column label
		*/
		_getMaxColumnLabelHeight() {
			let maxColLabelHeight = 0;
			this._elements.columns.select('.label').each(function() {
				const height = this.getBBox().width;
				if (height > maxColLabelHeight) maxColLabelHeight = height;
			});
			return maxColLabelHeight;
		}


		/**
		* Updates the scales after the labels (row/col) were drawn and updates cells/rows to 
		* respect width/height of the labels.
		* Resets height of the SVG to match its contents.
		*/
		_updatePositionsAndSizes() {

			const self = this;

			const maxRowLabelWidth = this._getMaxRowLabelWidth()
				, maxColLabelHeight = this._getMaxColumnLabelHeight();

			const bandWidth 	= this._columnScale.bandwidth()
				, step			=this._columnScale.step();

			console.log('ResistencyMatrix / _updatePositionsAndSizes: maxRowLabelWidth', maxRowLabelWidth, 'collabelheight', maxColLabelHeight, 'bandWidth', bandWidth);

			// Update rows
			this._elements.rows
				.each(function(d,i){
					d3.select(this)
						.attr('height', bandWidth)
						.attr('transform', `translate(0, ${ i * Math.floor( bandWidth ) + Math.floor( maxColLabelHeight ) + self._configuration.spaceBetweenLabelsAndMatrix + i * self._configuration.lineWeight })`);
				});


			// Update cell's rectangles
			this._elements.rows
				.selectAll('.cell')
				.each(function(d, i) {
					self._alignCell(this, Math.floor(self._columnScale.bandwidth()), i, Math.floor(maxRowLabelWidth + self._configuration.spaceBetweenLabelsAndMatrix), self._configuration.lineWeight);
				})
				.select('rect')
				.each(function() {
					self._resizeCell(this, Math.floor(self._columnScale.bandwidth()));
				});

			// Update cols
			this._elements.columns
				.each(function(d,i) {
					// step / 2: Make sure we're kinda centered over the col
					const left = i * (Math.floor(step) + self._configuration.lineWeight) + maxRowLabelWidth + self._configuration.spaceBetweenLabelsAndMatrix + step / 2;
					d3.select(this)
						.attr('transform', `translate(${ left }, ${ maxColLabelHeight })`);
				});

			// Update label's x position
			this._elements.rows
				.select('.label')
				.attr('x', maxRowLabelWidth)
				.each(function() {
					d3.select(this)
						.attr('y', bandWidth / 2 + this.getBBox().height / 2);
				});

			// Update col label's y position
			this._elements.columns
				.select('.label')
				.attr('transform', 'rotate(-45)');

			// Update svg height
			const amountOfCols = ( Object.keys(this._data).length )
				, colHeight = this._columnScale.step();
			this._container.style.height = (this._getMaxColumnLabelHeight() + (colHeight + this._configuration.lineWeight) * amountOfCols + this._configuration.spaceBetweenLabelsAndMatrix) + 'px';

		}



		/**
		* Aligns a single cell
		*/
		_alignCell(cell, dimensions, number, offset = 0, lineWeight = 1) {
			d3.select(cell)
				// + number: Space 1 px between cells
				.attr('transform', `translate(${ offset + number * dimensions + number * lineWeight },0)`);
		}


		/**
		* Resizes a single cell
		*/ 
		_resizeCell(cell, dimensions) {
			d3.select(cell)
				.attr('height', dimensions)
				.attr('width', dimensions);
		}


		/**
		* Draws the column heads, then returns the created elements
		*/
		_drawColumnHeads() {

			// Get headers from data (keys of first array item)
			const firstRow = Object.values(this._data)[0];
			const headers = Object.keys(firstRow);
			console.log('ResistencyMatrix / _drawColumnHeads: Headers are %o', headers);

			// <g> and transform
			const colHeads = this._elements.svg
				.selectAll('.column')
				.data(headers)
				.enter()
					.append('g')
					// translation will be done in this.updatePositionsAndSizes
					.attr('class', 'column');

			// Text
			colHeads
				.append('text')
				.attr('class', 'label')
				.attr('text-anchor', 'start')
				.text(d => d);

			return colHeads;

		}


		/**
		* Draws a single resistency cell
		*/
		_drawCell( rowElement, rowData, dimensions ) {

			console.log( 'ResistencyMatrix / _drawCell: row %o, data %o, dimensions %o', rowElement, rowData, dimensions );
			const self = this;

			// Remove 'name' property on row object
			const filteredData = Object.values(rowData[1])
					.filter((entry) =>  entry.key !== 'name')
					.map((entry) => entry.value);

			// <g>
			const cells = d3.select(rowElement)
				.selectAll('.cell')
				.data(filteredData)
				.enter()
					.append('g')
					.attr('class', 'cell');

			// Rect
			cells.each(function(d) {
				d3.select(this)
					.append('rect')
					.style('fill', d ? self._colorScale(d) : '#fff')
					.style('stroke', d === null ? '#dedede' : '')
					.style('stroke-width', d === null ? 1 : 0)
					// Set size of rect
					.each(function() {
						self._resizeCell(this,dimensions);
					})
					.on('mouseenter', function(d) {
						const element = this;
						self._mouseOverHandler.call(self, element, d);
					})
					.on('mouseleave', function() {
						const element = this;
						self._mouseOutHandler.call(self, element);
					});
			});

			return cells;

		}




		/**
		* Returns the first parent of element that matches selector
		*/
		_getParentElement(element, selector) {

			let match;
			while(element.nodeName.toLowerCase() !== 'svg') {
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
		_getChildNodeIndex(child, selector) {

			let index = 0;
			while(child.previousSibling) {
				if (child.previousSibling.matches(selector)) index++;
				child = child.previousSibling;
			}
			return index;

		}


		/**
		* Handles mouseenter on a cell
		*/
		_mouseOverHandler(element, data) {

			let svg;
			this._elements.svg.each(function() { svg = this; });

			const y			= element.getBoundingClientRect().top - svg.getBoundingClientRect().top
				, x			= element.getBoundingClientRect().left - svg.getBoundingClientRect().left
				, width		= parseInt(d3.select(element).attr('width'), 10) + 40
				, height	= parseInt(d3.select(element).attr('height'), 10) + 40;

			this._mouseOverRect = this._elements.svg
				.append('g');

			this._mouseOverRect
				.append('rect')
				.attr('x', x - 20)
				.attr('y', y - 20)
				.style('fill', 'tomato')
				.style('pointer-events', 'none')
				.attr('height', height)
				.attr('width', width)
				.style('opacity', 0.9);
			
			this._mouseOverRect
				.append('text')
				.text(data)
				.style('color', 'black')
				.attr('x', x)
				.attr('y', y);

			// Highlight row
			const row = this._getParentElement(element, '.row');
			d3.select(row).classed('active',true);

			// Highlight col
			const cell = this._getParentElement(element, '.cell');
			const colIndex = this._getChildNodeIndex(cell, '.cell');
			const currentCol = this._elements.columns.filter((d,i) => i === colIndex);
			currentCol.classed('active', true);

		}

		_mouseOutHandler() {

			this._mouseOverRect.remove();

			this._elements.rows.classed('active', false);
			this._elements.columns.classed('active', false);

		}

	}

	window.infect = window.infect || {};
	window.infect.ResistencyMatrix = ResistencyMatrix;

})();

