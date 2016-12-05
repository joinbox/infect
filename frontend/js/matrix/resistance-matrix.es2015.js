(() => {

	/* global d3, window */

	/**
	* Draws a matrix with resistencies. 
	* Rows: Anti biotics
	* Cols: Bacteria
	* Cells: Colored according to resistance
	*/
	class ResistanceMatrix {

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
		constructor(container, data, config = {}) {

			if (!container) {
				throw new Error('ResistanceMatrix: At least one argument (container) is needed in constructor.');
			}

			this._container 	= container;
			this._data 			= data;


			this._configuration	= {
				spaceBetweenLabelsAndMatrix		: config.spaceBetweenLabelsAndMatrix || 20
				, transitionDuration			: config.transitionDuration || 900
				, paddingRatio					: config.paddingRatio || 0.2
				, colorValue					: config.colorValue || (() => 1)
				, cellLabelValue				: config.cellLabelValue || (() => '–')
				, rowLabelValue					: config.rowLabelValue || (() => 'n/a')
				, columnLabelValue				: config.columnLabelValue || (() => 'n/a')
				, columnHeaderTransformer		: config.columnHeaderTransformer || ((item) => item)
				, columnHeaderIdentifier		: config.columnHeaderIdentifier || ((item) => item)
				, rowIdentifier					: config.rowIdentifier || ((item) => item)
				, rowDataTransformer			: config.rowDataTransformer || ((item) => item)
				, rowHidden						: config.rowHidden || false
			};

			// Holds references
			this._elements		= {};
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
		updateData(data) {

			this._data = data;
			console.log('ResistanceMatrix: Update data to %o', data);
			if (this._container && this._data) this.drawMatrix(true);

		}




		/**
		* Main method. Draws the matrix with data and container provided.
		*/
		drawMatrix(dontUpdateScale) {

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
			if(this._isInitialRendering) {
				this._drawRows(this._columnScale);
				this._drawColumnHeads(this._columnScale);
			}

			this._isInitialRendering = false;

		}



		/**
		* Draws the rows
		* @param {Number} rowHeight			Width of a single row
		*/
		_drawRows(scale) {

			const self = this;

			console.log('ResistanceMatrix / _drawRows: Draw rows with data %o and height %o', Object.values(this._data), scale.bandwidth());

			// g
			const rows = this._elements.svg
				.selectAll('.row')
				.call((d) => {
					console.error('updated rows', d.size());
				})
				// http://stackoverflow.com/questions/22240842/d3-update-on-node-removal-always-remove-the-last-entry-in-svg-dom
				.data(this._data, this._configuration.rowIdentifier);
				

			// Enter
			const enteredRows = rows
				.enter()
					.append('g')
					.attr('class', 'row');


			// Exit
			rows
				.exit()
				.remove();



			// Label (enter and update), before cells
			this._createSingleRowLabel(enteredRows);


			// Update and enter: 
			// Adjust LABEL position
			enteredRows
				.merge(rows)
				.selectAll('.row-label')
				.attr('transform', function() {
					return `translate(${ self._getMaxRowLabelWidth() }, ${ this.getBBox().height / 2 - 4 })`;
				});



			// Enter and update:
			// - move down
			// - animates transformation
			let numberOfVisibleRows = 0;
			enteredRows
				.call((d) => console.error('new rows', d.size() ))
				.merge(rows)
				.transition()
				.duration(this._configuration.transitionDuration)
				.attr('transform', (d) => {
					const translation =  `translate(0, ${ this._getMaxColumnLabelHeight() + this._configuration.spaceBetweenLabelsAndMatrix + numberOfVisibleRows * scale.step() })`;
					if (!this._configuration.rowHidden(d)) numberOfVisibleRows++;
					return translation;
				})
				.style('opacity', (d) => this._configuration.rowHidden(d) ? 0 : 1);


			// Draw cells
			enteredRows
				.merge(rows)
				.call((parent) => {
					this._drawCell(parent, scale);
				});


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
				.attr('class', 'row-label')
				.attr('text-anchor', 'end')
				.text(this._configuration.rowLabelValue);

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
		* must be taken. This is done before the labels are there, therefore take the whole
		* SVG width. The scale's range will later be updated through _updateColumnScale
		*/
		_createColumnScale() { 

			const data = this._configuration.columnHeaderTransformer(this._data);
			console.log('ResistanceMatrix: Data for column scale (len %o) is %o', data.length, data);
			const scale = d3.scaleBand()
				// -50: We turn the col labels by 45°, this takes a bit of space
				.rangeRound([0, this._getSvgWidth() - 50])
				// Domain: Array of object fucks things up (only has 1 entry) – use Array of strings
				.domain(data.map(this._configuration.columnHeaderIdentifier))
				.paddingInner(this._configuration.paddingRatio);
			console.log('ResistanceMatrix: Column scale bandwidth is %o', scale.bandwidth());
			return scale;

		}



		/**
		* Returns the scale for coloring the cells
		*/
		_createColorScale() {
			return new d3.scaleSequential((t) => {
				// Saturation: 40–90%
				const invertedT = 1 + (t * -1);
				const saturation = invertedT * 0.5 + 0.4;
				// Lightness: 60–100% – this is very important
				const lightness = (1 - invertedT) * 0.6 + 0.4;
				// Hue 0-100
				const hue = invertedT * 100;
				const hsl = d3.hsl(hue, saturation, lightness);
				return hsl.toString();
			});
		}



		/**
		* Updates the col scale. Is called after labels were drawn and measured. Scale should take up
		* all horizontal space that's left. 
		*/
		_updateColumnScale() {

			// 50: Just some security margin
			const availableWidth = this._getSvgWidth() - 50 - this._getMaxRowLabelWidth() - this._configuration.spaceBetweenLabelsAndMatrix;
			console.log('ResistanceMatrix / _updateColumnScale: SVG width is %o, width column content is %o', this._getSvgWidth(), availableWidth);

			// Update scale
			this._columnScale.rangeRound([0, availableWidth]);
			console.log('ResistanceMatrix: New bandwidth is %o, step is %o', this._columnScale.bandwidth(), this._columnScale.step());

		}



		/**
		* Returns width of widest row label
		*/
		_getMaxRowLabelWidth() {

			if (!this._elements.svg.selectAll('.row')) return 0;

			let maxRowLabelWidth = 0;
			this._elements.svg.selectAll('.row').select('.row-label').each(function(){
				maxRowLabelWidth = Math.max(maxRowLabelWidth, this.getBBox().width);
			});
			return Math.ceil(maxRowLabelWidth);

		}



		/**
		* Returns width of widest column label
		*/
		_getMaxColumnLabelHeight() {
			let maxColLabelHeight = 0;
			this._elements.svg.selectAll('.column').select('.column-label').each(function() {
				maxColLabelHeight = Math.max(maxColLabelHeight, this.getBBox().width);
			});
			return Math.ceil(maxColLabelHeight);
		}







		/**
		* Draws the column heads, then returns the created elements
		*/
		_drawColumnHeads(scale) {

			const self = this;

			// Get headers from data (keys of first array item)
			const headers = this._configuration.columnHeaderTransformer(this._data);
			console.log('ResistanceMatrix / _drawColumnHeads: Headers are %o', headers);

			// <g> and transform
			const colHeads = this._elements.svg
				.selectAll('.column')
				.data(headers, this._configuration.columnHeaderIdentifier);

			// Draw heads, consisting of <g> with contained <text>
			const colHeadsEnter = colHeads
				.enter()
					.append('g')
					// translation will be done in this.updatePositionsAndSizes
					.attr('class', 'column');

			// Append text. Rotate by 45°
			colHeadsEnter
					.append('text')
						.attr('class', 'column-label')
						.attr('text-anchor', 'start')
						.attr('transform', 'rotate(-45)')
						.text(this._configuration.columnLabelValue);


			// Update position
			// (enter and update)
			let currentIndex = 0;
			colHeadsEnter
				.merge(colHeads)
				.transition()
				.duration(this._configuration.transitionDuration)
				.attr('transform', function(d) {
					const translation = `translate(${ currentIndex * scale.step() + self._getMaxRowLabelWidth() + self._configuration.spaceBetweenLabelsAndMatrix + Math.round(scale.step() / 2 - 8) }, ${ self._getMaxColumnLabelHeight() })`;
					if (!d.hidden) currentIndex++;
					return translation;
				})
				.style('opacity', (d) => d.hidden ? 0 : 1);

		}




		/**
		* Draws a single resistance cell
		*/
		_drawCell(row, scale) {

			console.log('ResistanceMatrix: Draw cell; row %o, dimensions %o', row, scale.bandwidth());
			

			const cells = row
				.selectAll('.cell')
				// Row is {bacterium: {} antibiotics: []} – only use antibiotics
				.data(this._configuration.rowDataTransformer);


			// g
			const gs = cells
				.enter()
				.append('g')
				// data-label attribute (debugging)
				.attr('data-label', (d) => {
					return this._configuration.cellLabelValue(d);
				})
				.attr('data-antibiotic', (d) => {
					return this._configuration.columnLabelValue(d);
				})
				// data-color attribute (debugging)
				.attr('data-color', (d) => {
					return this._configuration.colorValue(d);
				})
				.attr('class', 'cell');




			// Add rect to every g
			this._drawCellRectangle(gs, scale);

			// Label
			this._drawCellLabel(gs);





			// Move right
			let currentRowIndex = 0;
			row
				.enter()
				.merge(row)
				.selectAll('.cell')
				.transition()
				.duration(this._configuration.transitionDuration)
				.attr('transform', (d, i) => {
					// Reset currentRowIndex if i equals 0 again
					if (i === 0) currentRowIndex = 0;
					// Get translation
					const translation = `translate(${ this._getMaxRowLabelWidth() + this._configuration.spaceBetweenLabelsAndMatrix + currentRowIndex * scale.step() }, 0)`;
					// Update currentRowIndex
					if (!d.hidden) currentRowIndex++;
					return translation;
				})
				.style('opacity', (d) => {
					return d.hidden ? 0 : 1;
				});


		}


		/**
		* Draws the label in a cell
		*/
		_drawCellLabel(cells) {

			return;
			const self = this;

			cells.each(function(d) {
				const labelValue = self._configuration.cellLabelValue(d);
				d3.select(this)
					.append('text')
					.attr('class', 'cell-label')
					.text(labelValue)
					.style('pointer-events', 'none')
					.attr('transform', function() {
						const translation = `translate(${ this.getBBox().width / -2 }, ${ this.getBBox().height / 2 - 4 })`;
						return translation;
					});
			});

		}


		/**
		* Draws the rectangle in a cell
		*/
		_drawCellRectangle(cells, scale) {

			const self = this;

			cells.each(function(d) {

				const colorValue = self._configuration.colorValue(d);

				d3.select(this)
					//.append('rect')
					.append('circle')
					.style('fill', colorValue === null ? '#fff' : self._colorScale(colorValue))

					// Add white stroke around cells so that mouse over happens smoothly
					.style('stroke', colorValue === null ? '#dedede' : '#fff')

					// Stroke width: 1px for empty values, else half of the space between the cells
					.style('stroke-width', colorValue === null ? 1 : (scale.step() - scale.bandwidth()) / 2 )

					// Radius: Remove stroke from radius if stroke's there
					.attr('r', colorValue === null ? scale.bandwidth() / 2 - 2 : scale.bandwidth() / 2)

					.on('mouseenter', function(d) {
						const element = this;
						self._mouseOverHandler.call(self, element, d);
					})

					.on('mouseleave', function() {
						const element = this;
						self._mouseOutHandler.call(self, element);
					});

			});

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

			const label = this._configuration.cellLabelValue(data);

			// Data not available: Cell has no value. There's no 
			// hover effect for empty cells.
			if (!label) return;

			// Map svg's DOM element to svg
			let svg;
			this._elements.svg.each(function() { svg = this; });

			const y			= element.getBoundingClientRect().top - svg.getBoundingClientRect().top
				, x			= element.getBoundingClientRect().left - svg.getBoundingClientRect().left
				, width		= parseInt(element.getBBox().width, 10) + 40
				, height	= parseInt(element.getBBox().height, 10) + 40;


			this._mouseOverRect = this._elements.svg
				.append('g')
				.attr('transform', `translate(${ x-20 }, ${ y - 20 })`);

			this._mouseOverRect
				.append('circle')
				.attr('class', 'hover-cell')
				.style('fill', element.style.fill)
				.style('pointer-events', 'none')
				.attr('r', width / 2)
				.attr('cx', width / 2)
				.attr('cy', width / 2);
			
			this._mouseOverRect
				.append('text')
				.text(label)
				.style('color', 'black')
				.style('font-size', '20px')
				.style('text-align', 'center')
				.style('pointer-events', 'none')
				.attr('transform', function() {
					return `translate(${ width / 2 - this.getBBox().width / 2 }, ${ this.getBBox().height / 2 + height / 2 - 5 })`;
				});


			// Highlight row
			const row = this._getParentElement(element, '.row');
			d3.select(row).classed('active',true);

			// Highlight col
			const cell = this._getParentElement(element, '.cell');
			const colIndex = this._getChildNodeIndex(cell, '.cell');
			const currentCol = this._elements.svg.selectAll('.column').filter((d,i) => i === colIndex);
			currentCol
				.classed('active', true);

		}

		_mouseOutHandler() {

			if (this._mouseOverRect) this._mouseOverRect.remove();

			this._elements.svg.selectAll('.row').classed('active', false);
			this._elements.svg.selectAll('.column').classed('active', false);

		}

	}

	window.infect = window.infect || {};
	window.infect.ResistanceMatrix = ResistanceMatrix;

})();

