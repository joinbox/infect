(() => {

	'use strict';

	/* global angular, localStorage */


	/**
	* Red legal notice just below the log. Adds hide functionality which hides the notice for 60 days after the
	* hide button is clicked.
	*/
	class LegalNoticeController {

		constructor() {

			this.hidden = true;

			// Check local storage
			let hidden = false;
			try {
				const data = localStorage.getItem('hideLegalNotice');
				if (data) {
					const parsedData = JSON.parse(data);
					if (parsedData.expires && new Date(parsedData.expires).getTime() > new Date().getTime()) {
						hidden = parsedData.value;
					}
				}
			}
			catch(err) {}

			this.hidden = hidden;

		}


		/**
		* Hide click handler. Store status in localStorage for 60d.
		*/
		hide() {
			
			try {
				// Expires in 60d
				const expires = new Date();
				expires.setDate(expires.getDate() + 60);
				localStorage.setItem('hideLegalNotice', JSON.stringify({
					expires			: expires.toString()
					, value			: true
				}));
			}
			catch(err) {}

			this.hidden = true;

		}


	}

	angular
	.module('infekt')
	.component('legalNotice', {
		template			: `<div class="informationBox" ng-hide="$ctrl.hidden">
									<p><b>Infect ist ein Produkt in sehr frühem Entwicklungsstadium.</b> Diese Seite dient lediglich zur Demonstration. Weder die Applikation noch die darin verwendeten Daten dürfen derzeit zur Behandlung von Patienten verwendet werden, für beide wird keinerlei Gewähr übernommen.</p>
									<button class="about-overlay-button">Mehr zu INFECT (in Englisch)</button>
									<button class="" ng-click="$ctrl.hide()">&times;</button>
								</div>`
		, controller		: LegalNoticeController
	});

})();

