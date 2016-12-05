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
		template: '<div class="informationBox" ng-hide="$ctrl.hidden">\n\t\t\t\t\t\t\t\t\t<p><b>Infect ist ein Produkt in sehr fr\xFChem Entwicklungsstadium.</b> Diese Seite dient lediglich zur Demonstration. Weder die Applikation noch die darin verwendeten Daten d\xFCrfen derzeit zur Behandlung von Patienten verwendet werden, f\xFCr beide wird keinerlei Gew\xE4hr \xFCbernommen.</p>\n\t\t\t\t\t\t\t\t\t<button class="about-overlay-button">Mehr zu INFECT (in Englisch)</button>\n\t\t\t\t\t\t\t\t\t<button class="" ng-click="$ctrl.hide()">&times;</button>\n\t\t\t\t\t\t\t\t</div>',
		controller: LegalNoticeController
	});
})();
//# sourceMappingURL=legal-notice.es2015.js.map
