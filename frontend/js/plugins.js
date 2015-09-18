// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());




// Rotate table cell content
  /*
  Version 1.0
  7/2011
  Written by David Votrubec (davidjs.com) and
  Michal Tehnik (@Mictech) for ST-Software.com
  */
/*(function ($) {
  $.fn.rotateTableCellContent = function (options) {

		var cssClass = ((options) ? options.className : false) || "vertical";

		var cellsToRotate = $('.' + cssClass, this);

		var betterCells = [];
		cellsToRotate.each(function () {
			var cell = $(this)
		  , newText = cell.text()
		  , height = cell.height()
		  , width = cell.width()
		  , newDiv = $('<div>', { height: width, width: height })
		  , newInnerDiv = $('<div>', { text: newText, 'class': 'rotated' });

			newDiv.append(newInnerDiv);

			betterCells.push(newDiv);
		});

		cellsToRotate.each(function (i) {
			$(this).html(betterCells[i]);
		});
	};
})(Zepto);*/