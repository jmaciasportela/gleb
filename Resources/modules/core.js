/**
* Core functionality for the app
* @author Jesus Macias, Fernando Ruiz, Mario Izquierdo
**/

/***************************
* Private methods, variables, & dependencies
***************************/


/***************************
* Public methods & variables
***************************/

/**
* Set properties for app
* @param {String} name Name of property
* @param {String} value Value of property
*/
exports.addProperty = function(name, value) {
properties[name] = value;
};

/**
* Register a plugin with the core app
* @param {String} name Name of plugin
* @param {Object} object The object namespace the plugin uses
*/  
exports.register = function(name, object) {
plugins[name] = object;
};

/**
* Helper method to show all properties in the core app
*/
exports.properties = function() {
return properties;
};

/**
* Helper method to show one property in the core app
* @param {String} name
*/
exports.property = function(name) {
return properties[name];
};

/**
* Change layout based on orientation
* @param {Object} _event
*/
exports.orientationObserverUpdate = function(_event) {
// Example of how you can control the current page with global events
var type = (_event.source.isLandscape()) ? 'landscape' : 'portrait' ;

if(currentPage && currentPage.orientationUpdate) {
currentPage.orientationUpdate(type);
}
};

/**
* Get orientation in a sane way
* @param {String} o
*/
exports.getOrientation = function(o) {
    switch (o) {
        case Titanium.UI.PORTRAIT: {
            return 'portrait';
    }
        case Titanium.UI.UPSIDE_PORTRAIT: {
            return 'upside portrait';
    }
        case Titanium.UI.LANDSCAPE_LEFT: {
            return 'landscape left';
    }
        case Titanium.UI.LANDSCAPE_RIGHT: {
            return 'landscape right';
    }
        case Titanium.UI.FACE_UP: {
            return 'face up';
    }
        case Titanium.UI.FACE_DOWN: {
            return 'face down';
    }
    case Titanium.UI.UNKNOWN: {
            return 'unknown';
    }
  }
};

/**
* Get DISPLAY Constant
* @param {String} p
*/
exports._p = function (value) {     
    platformWidth = Ti.App.Properties.getInt("platformWidth");  
    return parseInt(value*platformWidth/320);
};  


/**
* Decode text in base64
* @param {String} texto
*/
exports.textoClaro = function (texto){
    if (texto.substring(0, 7) == "base64*") {
        texto = texto.substring(7);
        var textLabel = Ti.Utils.base64decode(texto);
    }
    else {
        var textLabel = texto;
    }    
return textLabel;
}

/**
* Replace
* @param {String} o
*/
exports.replaceCadena = function(str) {
str = str.replace (/{LATITUD}/g,Ti.App.Properties.getString('lastLatitude'));
str = str.replace (/{LONGITUD}/g,Ti.App.Properties.getString('lastLongitude'));
str = str.replace (/{EXACTITUD}/g,Ti.App.Properties.getString('lastAccuracy'));
str = str.replace (/{ALTURA}/g,Ti.App.Properties.getString('lastAltitude'));
return str;
}


exports.machaca = function(obj) {
    // eliminar padre   
    if (obj !== null) {
        if (obj.getChildren().length > 0 ) {
            Ti.API.info('GLEB - LIMPIANDO OBJETO PADRE='+obj.getChildren());
            Ti.API.info('GLEB - Cuantos hijos='+obj.getChildren().length);
            var tamano = obj.getChildren().length;      
            for (var j=0; j < tamano; j++) {
                Ti.API.info('GLEB - OBJETO='+obj.children);         
                Ti.API.info('GLEB - revisando objeto='+j+" ---> "+obj.children[0]);
                Ti.API.info('GLEB - Objeto tiene hijos?'+obj.children[0].getChildren().length); 
                if(obj.children[0].getChildren().length > 0) {
                    Ti.API.info('GLEB - llamando a limpieza de nuevo con: '+obj.children[0]);
                    Ti.App.glebUtils.machaca(obj.children[0]);
                }
                Ti.API.info('GLEB - limpiando objeto hijo='+j+" ---> "+obj.children[0]);
                /*
                if (obj.children[0] == "[object WebView]") {
                    obj.children[0].setUrl ('/ui/vacio.html');
                    Ti.API.info('GLEB - Liberando memoria WEBVIEW');
                    obj.children[0].release();
                }*/
                if (obj.children[0]!=null) obj.remove(obj.children[0]);         
                obj.children[0]=null;
            }
        }
        obj=null;
     }
}

