(function( $ ) {

	T5.extendInitializers(function(){
		
		function init(specs) {
			convertFunctionProperties(specs.options, "autocomplete");

			if(!specs.options) specs.options = {};

			$.extend(specs.options, {
				delay : specs.delay,
				minLength : specs.minLength,
				source: function(request, response) {
					
					var params = {};
					
					var extra = $("#" + specs.id).data('extra');
					if(extra) {
						params["extra"] = extra;
					}
					
					params[specs.paramName] = request.term;
					
					var ajaxRequest = {
                    	url:specs.url,
                        success: function(data){
                            response(eval(data));
                        }, 
                        data:"data="+$.toJSON( params ), 
                        dataType: "json", 
                        type:"POST"
                    };
                    this.xhr = $.ajax(ajaxRequest);
                }
        	});

	        $("#" + specs.id).autocomplete(specs.options);
	    }
		
		return {
			autocomplete : init
		}
	});
	
}) ( jQuery );