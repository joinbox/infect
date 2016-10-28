$(document).ready(function() {

	//specify class name of cell you want to rotate
	//$('#resistence-table').rotateTableCellContent({className: 'vertical'});
	
	$('.about-overlay-button').click(function() {
		
		$('.about-overlay').show();
		$('body').css('overflow', 'hidden');
		
	});
	
	$('.about-overlay-close-button').click(function() {
		
		$('.about-overlay').hide();
		$('body').css('overflow', 'auto');
		
	});
	  
});
