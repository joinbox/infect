'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {

	'use strict';

	/* global angular, localStorage */

	/**
 * Red legal notice just below the log. Adds hide functionality which hides the notice for 60 days after the
 * hide button is clicked.
 */

	var LegalNoticeController = function () {
		function LegalNoticeController() {
			_classCallCheck(this, LegalNoticeController);

			this.hidden = true;

			// Check local storage
			var hidden = false;
			try {
				var data = localStorage.getItem('hideLegalNotice');
				if (data) {
					var parsedData = JSON.parse(data);
					if (parsedData.expires && new Date(parsedData.expires).getTime() > new Date().getTime()) {
						hidden = parsedData.value;
					}
				}
			} catch (err) {}

			this.hidden = hidden;
		}

		/**
  * Hide click handler. Store status in localStorage for 60d.
  */


		_createClass(LegalNoticeController, [{
			key: 'hide',
			value: function hide() {

				try {
					// Expires in 60d
					var expires = new Date();
					expires.setDate(expires.getDate() + 60);
					localStorage.setItem('hideLegalNotice', JSON.stringify({
						expires: expires.toString(),
						value: true
					}));
				} catch (err) {}

				this.hidden = true;
			}
		}]);

		return LegalNoticeController;
	}();

	angular.module('infekt').component('legalNotice', {
		template: '<div class="informationBox" ng-hide="$ctrl.hidden">\n\t\t\t\t\t\t\t\t\t<p><b>Infect ist ein Produkt in sehr fr\xFChem Entwicklungsstadium.</b> Diese Seite dient lediglich zur Demonstration. Weder die Applikation noch die darin verwendeten Daten d\xFCrfen derzeit zur Behandlung von Patienten verwendet werden, f\xFCr beide wird keinerlei Gew\xE4hr \xFCbernommen.</p>\n\t\t\t\t\t\t\t\t\t<button class="about-overlay-button">Mehr zu INFECT (in Englisch)</button>\n\t\t\t\t\t\t\t\t\t<button class="button -close" ng-click="$ctrl.hide()">&times;</button>\n\t\t\t\t\t\t\t\t</div>',
		controller: LegalNoticeController
	});
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpzL2FuZ3VsYXIvaW5mZWt0L2xlZ2FsLW5vdGljZS5lczIwMTUuanMiXSwibmFtZXMiOlsiTGVnYWxOb3RpY2VDb250cm9sbGVyIiwiaGlkZGVuIiwiZGF0YSIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJwYXJzZWREYXRhIiwiSlNPTiIsInBhcnNlIiwiZXhwaXJlcyIsIkRhdGUiLCJnZXRUaW1lIiwidmFsdWUiLCJlcnIiLCJzZXREYXRlIiwiZ2V0RGF0ZSIsInNldEl0ZW0iLCJzdHJpbmdpZnkiLCJ0b1N0cmluZyIsImFuZ3VsYXIiLCJtb2R1bGUiLCJjb21wb25lbnQiLCJ0ZW1wbGF0ZSIsImNvbnRyb2xsZXIiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLENBQUMsWUFBTTs7QUFFTjs7QUFFQTs7QUFHQTs7Ozs7QUFQTSxLQVdBQSxxQkFYQTtBQWFMLG1DQUFjO0FBQUE7O0FBRWIsUUFBS0MsTUFBTCxHQUFjLElBQWQ7O0FBRUE7QUFDQSxPQUFJQSxTQUFTLEtBQWI7QUFDQSxPQUFJO0FBQ0gsUUFBTUMsT0FBT0MsYUFBYUMsT0FBYixDQUFxQixpQkFBckIsQ0FBYjtBQUNBLFFBQUlGLElBQUosRUFBVTtBQUNULFNBQU1HLGFBQWFDLEtBQUtDLEtBQUwsQ0FBV0wsSUFBWCxDQUFuQjtBQUNBLFNBQUlHLFdBQVdHLE9BQVgsSUFBc0IsSUFBSUMsSUFBSixDQUFTSixXQUFXRyxPQUFwQixFQUE2QkUsT0FBN0IsS0FBeUMsSUFBSUQsSUFBSixHQUFXQyxPQUFYLEVBQW5FLEVBQXlGO0FBQ3hGVCxlQUFTSSxXQUFXTSxLQUFwQjtBQUNBO0FBQ0Q7QUFDRCxJQVJELENBU0EsT0FBTUMsR0FBTixFQUFXLENBQUU7O0FBRWIsUUFBS1gsTUFBTCxHQUFjQSxNQUFkO0FBRUE7O0FBR0Q7Ozs7O0FBbkNLO0FBQUE7QUFBQSwwQkFzQ0U7O0FBRU4sUUFBSTtBQUNIO0FBQ0EsU0FBTU8sVUFBVSxJQUFJQyxJQUFKLEVBQWhCO0FBQ0FELGFBQVFLLE9BQVIsQ0FBZ0JMLFFBQVFNLE9BQVIsS0FBb0IsRUFBcEM7QUFDQVgsa0JBQWFZLE9BQWIsQ0FBcUIsaUJBQXJCLEVBQXdDVCxLQUFLVSxTQUFMLENBQWU7QUFDdERSLGVBQVlBLFFBQVFTLFFBQVIsRUFEMEM7QUFFcEROLGFBQVU7QUFGMEMsTUFBZixDQUF4QztBQUlBLEtBUkQsQ0FTQSxPQUFNQyxHQUFOLEVBQVcsQ0FBRTs7QUFFYixTQUFLWCxNQUFMLEdBQWMsSUFBZDtBQUVBO0FBckRJOztBQUFBO0FBQUE7O0FBMEROaUIsU0FDQ0MsTUFERCxDQUNRLFFBRFIsRUFFQ0MsU0FGRCxDQUVXLGFBRlgsRUFFMEI7QUFDekJDLCtqQkFEeUI7QUFNdkJDLGNBQWN0QjtBQU5TLEVBRjFCO0FBV0EsQ0FyRUQiLCJmaWxlIjoianMvYW5ndWxhci9pbmZla3QvbGVnYWwtbm90aWNlLmVzMjAxNS5qcyIsInNvdXJjZXNDb250ZW50IjpbIigoKSA9PiB7XG5cblx0J3VzZSBzdHJpY3QnO1xuXG5cdC8qIGdsb2JhbCBhbmd1bGFyLCBsb2NhbFN0b3JhZ2UgKi9cblxuXG5cdC8qKlxuXHQqIFJlZCBsZWdhbCBub3RpY2UganVzdCBiZWxvdyB0aGUgbG9nLiBBZGRzIGhpZGUgZnVuY3Rpb25hbGl0eSB3aGljaCBoaWRlcyB0aGUgbm90aWNlIGZvciA2MCBkYXlzIGFmdGVyIHRoZVxuXHQqIGhpZGUgYnV0dG9uIGlzIGNsaWNrZWQuXG5cdCovXG5cdGNsYXNzIExlZ2FsTm90aWNlQ29udHJvbGxlciB7XG5cblx0XHRjb25zdHJ1Y3RvcigpIHtcblxuXHRcdFx0dGhpcy5oaWRkZW4gPSB0cnVlO1xuXG5cdFx0XHQvLyBDaGVjayBsb2NhbCBzdG9yYWdlXG5cdFx0XHRsZXQgaGlkZGVuID0gZmFsc2U7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCBkYXRhID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2hpZGVMZWdhbE5vdGljZScpO1xuXHRcdFx0XHRpZiAoZGF0YSkge1xuXHRcdFx0XHRcdGNvbnN0IHBhcnNlZERhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuXHRcdFx0XHRcdGlmIChwYXJzZWREYXRhLmV4cGlyZXMgJiYgbmV3IERhdGUocGFyc2VkRGF0YS5leHBpcmVzKS5nZXRUaW1lKCkgPiBuZXcgRGF0ZSgpLmdldFRpbWUoKSkge1xuXHRcdFx0XHRcdFx0aGlkZGVuID0gcGFyc2VkRGF0YS52YWx1ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNhdGNoKGVycikge31cblxuXHRcdFx0dGhpcy5oaWRkZW4gPSBoaWRkZW47XG5cblx0XHR9XG5cblxuXHRcdC8qKlxuXHRcdCogSGlkZSBjbGljayBoYW5kbGVyLiBTdG9yZSBzdGF0dXMgaW4gbG9jYWxTdG9yYWdlIGZvciA2MGQuXG5cdFx0Ki9cblx0XHRoaWRlKCkge1xuXHRcdFx0XG5cdFx0XHR0cnkge1xuXHRcdFx0XHQvLyBFeHBpcmVzIGluIDYwZFxuXHRcdFx0XHRjb25zdCBleHBpcmVzID0gbmV3IERhdGUoKTtcblx0XHRcdFx0ZXhwaXJlcy5zZXREYXRlKGV4cGlyZXMuZ2V0RGF0ZSgpICsgNjApO1xuXHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnaGlkZUxlZ2FsTm90aWNlJywgSlNPTi5zdHJpbmdpZnkoe1xuXHRcdFx0XHRcdGV4cGlyZXNcdFx0XHQ6IGV4cGlyZXMudG9TdHJpbmcoKVxuXHRcdFx0XHRcdCwgdmFsdWVcdFx0XHQ6IHRydWVcblx0XHRcdFx0fSkpO1xuXHRcdFx0fVxuXHRcdFx0Y2F0Y2goZXJyKSB7fVxuXG5cdFx0XHR0aGlzLmhpZGRlbiA9IHRydWU7XG5cblx0XHR9XG5cblxuXHR9XG5cblx0YW5ndWxhclxuXHQubW9kdWxlKCdpbmZla3QnKVxuXHQuY29tcG9uZW50KCdsZWdhbE5vdGljZScsIHtcblx0XHR0ZW1wbGF0ZVx0XHRcdDogYDxkaXYgY2xhc3M9XCJpbmZvcm1hdGlvbkJveFwiIG5nLWhpZGU9XCIkY3RybC5oaWRkZW5cIj5cblx0XHRcdFx0XHRcdFx0XHRcdDxwPjxiPkluZmVjdCBpc3QgZWluIFByb2R1a3QgaW4gc2VociBmcsO8aGVtIEVudHdpY2tsdW5nc3N0YWRpdW0uPC9iPiBEaWVzZSBTZWl0ZSBkaWVudCBsZWRpZ2xpY2ggenVyIERlbW9uc3RyYXRpb24uIFdlZGVyIGRpZSBBcHBsaWthdGlvbiBub2NoIGRpZSBkYXJpbiB2ZXJ3ZW5kZXRlbiBEYXRlbiBkw7xyZmVuIGRlcnplaXQgenVyIEJlaGFuZGx1bmcgdm9uIFBhdGllbnRlbiB2ZXJ3ZW5kZXQgd2VyZGVuLCBmw7xyIGJlaWRlIHdpcmQga2VpbmVybGVpIEdld8OkaHIgw7xiZXJub21tZW4uPC9wPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cImFib3V0LW92ZXJsYXktYnV0dG9uXCI+TWVociB6dSBJTkZFQ1QgKGluIEVuZ2xpc2NoKTwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cIlwiIG5nLWNsaWNrPVwiJGN0cmwuaGlkZSgpXCI+JnRpbWVzOzwvYnV0dG9uPlxuXHRcdFx0XHRcdFx0XHRcdDwvZGl2PmBcblx0XHQsIGNvbnRyb2xsZXJcdFx0OiBMZWdhbE5vdGljZUNvbnRyb2xsZXJcblx0fSk7XG5cbn0pKCk7XG5cbiJdfQ==
