(function( $ ) {

	T5.extendInitializers(function(){
		
		function init(specs) {
			convertFunctionProperties(specs.params, "dialog");
			$("#" + specs.id).dialog(specs.params);
		}
		
		return {
			dialog : init
		}
	});
	
}) ( jQuery );