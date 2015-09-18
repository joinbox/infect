( function() {

	'use strict';

	angular
	.module( 'infekt' )
	.factory( 'DiagnosisFactory', [ '$http', 'BacteriaFactory', function( $http, BacteriaFactory ) {

		var _getDataPromise
			, _diagnosis = [];

		var Diagnosis = function() {
		};


		Diagnosis.prototype.getDiagnosis = function() {
			return _diagnosis;
		};


		Diagnosis.prototype.fetchDiagnosis = function() {
			
			var self = this
				, bacteria
				, diagnosisData;

			if( _getDataPromise ) {
				return _getDataPromise;
			}

			var url = infektSettings.apiUrls.base + "/" + infektSettings.apiUrls.diagnosis + "?" + infektSettings.apiKeyName + "=" + infektSettings.apiKey + "&noc=" + new Date().getTime();
			console.log( "Diagn: URL for diagnosis: %o", url );

			// Get diagnosis data
			_getDataPromise = $http( { 
				method: "GET"
				, url: url 
			} )

			// Wait for bacteria to be ready/loaded from serer
			.then( function( response ) {

				diagnosisData = response.data;

				return BacteriaFactory
					.getBacteria();

			} )

			// Parse data
			.then( function( bacteriaData ) {

				bacteria = bacteriaData;

				_diagnosis = self.parseServerData( diagnosisData, bacteria );
				return _diagnosis;

			} );
			
			return _getDataPromise;

		};


		/**
		* @param <Array> bacteriaData		parsed bacterium data from BacteriaFactory
		* @param <Array> diagnosisData		Data gotten from server (/diagnosis)
		*/
		Diagnosis.prototype.parseServerData = function( diagnosisData, bacteriaData ) {

			console.error( diagnosisData, bacteria );
			var ret = [];

			// Go through each diagnosis
			diagnosisData.forEach( function( diagnosis ) {

				// Go through bacteria; add bacteria that can cause the diagnosis
				// to diagnosisBacteria
				var diagnosisBacteria = [];
				bacteriaData.forEach( function( bacterium ) {

					if( diagnosis.bacteria.indexOf( bacterium.id ) > -1 ) {
						diagnosisBacteria.push( bacterium );
					}

				} );


				ret.push( {
					name					: diagnosis.locales[ 0 ].title
					, bacteria				: diagnosisBacteria
					, type					: 'diagnosis'
				} );

			} );

			console.error( ret );

			return ret;
		};



		return new Diagnosis();



	} ] );

} )();