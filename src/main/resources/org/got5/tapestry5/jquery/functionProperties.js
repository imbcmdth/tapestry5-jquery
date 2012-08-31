window.convertFunctionProperties = (function( $ ){

    var ajaxProperties = [
        "beforeSend",
        "complete", // Normal callback
        "complete.*", // Array version
        "converters.*",
        "dataFilter",
        "error",
        "jsonpCallback",
        "success",
        "success.*",
        "xhr"
    ];

    // Used to set ajaxOptions in `tabs` component
    function makeAjaxProperties(prefix, target) {
        var newAjaxProperties;

        if($.type(target) !== "array") {
            newAjaxProperties = [];
        } else {
            newAjaxProperties = target;
        }

        $.each(ajaxProperties, function(index, value){
            newAjaxProperties.push(prefix + "." + value);
        });
        return newAjaxProperties;
    }

    var componentProperties = {
        "ajax" : ajaxProperties,
        // jQuery UI Widgets:
        "accordion" : [
            // Options
            "navigationFilter",
            // Events
            "create",
            "change",
            "accordionchange",
            "changestart"
        ],
        "autocomplete" : [
            "source",
            // Events
            "create",
            "search",
            "open",
            "focus",
            "select",
            "close",
            "change"
        ],
        "button" : [
            // Events
            "create"
        ],
        "datepicker" : [
            // Options
            "calculateWeek",
            // Events
            "beforeShow",
            "beforeShowDay",
            "onChangeMonthYear",
            "onClose",
            "onSelect"
        ],
        "dialog" : [
            // Options
            "buttons.*",
            "buttons.*.click",
            // Events
            "create",
            "beforeClose",
            "open",
            "focus",
            "dragStart",
            "drag",
            "dragStop",
            "resizeStart",
            "resize",
            "resizeStop",
            "close"
        ],
        "progressbar" : [
            // Events
            "create",
            "change",
            "complete"
        ],
        "slider" : [
            // Events
            "create",
            "start",
            "slide",
            "change",
            "stop"
        ],
        "tabs" : [
            // ajaxOptions : added below
            // Events
            "create",
            "select",
            "load",
            "show",
            "add",
            "remove",
            "enable",
            "disable"
        ],
        // jQuery UI Interactions:
        "draggable" : [
            // Options
            "helper",
            // Events
            "create",
            "start",
            "drag",
            "stop"
        ],
        "droppable" : [
            // Options
            "accept",
            // Events
            "create",
            "activate",
            "deactivate",
            "over",
            "out",
            "drop"
        ],
        "resizable" : [
            // Events
            "create",
            "start",
            "resize",
            "stop"
        ],
        "selectable" : [
            // Events
            "create",
            "selected",
            "selecting",
            "start",
            "stop",
            "unselected",
            "unselecting"
        ],
        "sortable" : [
            // Options
            "helper",
            // Events
            "create",
            "start",
            "sort",
            "change",
            "beforeStop",
            "stop",
            "update",
            "receive",
            "remove",
            "over",
            "out",
            "activate",
            "deactivate"
        ]
    };

    // Add `ajaxOptions` to tabs
    makeAjaxProperties("ajaxOptions", componentProperties.tabs);

    function convertStringToFunction(fnString) {
        if ($.type(fnString) !== "string") {
            return fnString;
        }

        try {
            // TODO: Use the iframe trick to protect the global scope?
            var fn = Function("return " + fnString + ";")();
        } catch (e) {
            return fnString;
        }

        if($.type(fn) === "function") {
            return fn;
        } else {
            return fnString;
        }
    }

    function convertAllFunctionProperties(params) {
        $.each(params, function(key, value) {
            params[key] = convertStringToFunction(value);
        });
    }

    function convertFunctionPropertiesDescending(params, properties) {
        var currentProp = params;
        var lastProperty = properties.length - 1;

        $.each(properties, function(index, key) {
            // Check that the current level exists
            // If not, we break out of the each()
            if (key !== '*' && !(key in currentProp)) return false;

            // If we are are operating on the last key in properties,
            // we attempt to generate a function for all matches in currentProp
            if(lastProperty === index) {
                if (key === '*') {
                    convertAllFunctionProperties(currentProp);
                } else {
                    currentProp[key] = convertStringToFunction(currentProp[key]);
                }
                return true;
            }

            if (key === '*') {
                var subProperties = properties.slice(index + 1);
                $.each(currentProp, function(subKey, value) {
                    if (subKey in currentProp) {
                        convertFunctionPropertiesDescending(currentProp[subKey], subProperties);
                    }
                });
            } else {
                currentProp = currentProp[key];
            }
        });
    }

    // Iterate over every possible property requiring a function
    // and if they exist and are a string, we convert using eval
    function convertFunctionProperties(params, properties) {

        if($.type(properties) !== "array") {
            if(properties in componentProperties) {
                properties = componentProperties[properties];
            } else {
                return;
            }
        }

        if (params) {
            $.each(properties, function(index, value) {
                var keys = value.split(".");
                convertFunctionPropertiesDescending(params, keys);
            });
        }
    }

    convertFunctionProperties.addComponent = function(component, properties) {
        componentProperties[component] = properties;
    }

    return convertFunctionProperties;
})( jQuery );