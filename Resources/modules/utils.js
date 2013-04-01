/**
* Utils functionality for the app
* @author Jesus Macias Portela, Fernando Ruiz Hernandez, Mario Izquierdo Rodriguez
**/

exports._p = function (value) {
    //return parseInt(value*Ti.Platform.displayCaps.platformWidth/320);
    platformWidth = Ti.App.Properties.getInt("platformWidth");
    return parseInt(value*platformWidth/320);
};

exports.convertDpToPixel = function (value) {
    return parseInt(value*Ti.App.Properties.getDouble('displayConstant'));
};


/*
exports.textoClaro = function (texto){
var base64Matcher = new RegExp("^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{4})$");
if (base64Matcher.test(texto)) {
        var textLabel = Ti.Utils.base64decode(texto);
} else {
        var textLabel = texto;
}
return textLabel;
}
*/


exports.textoClaro = function (texto){
    //Ti.API.debug('GLEB - Decodificando: '+ texto);
    if (texto.substring(0, 7) == "base64*") {
        texto = texto.substring(7);
        var textLabel = Ti.Utils.base64decode(texto);
    }
    else {
        var textLabel = texto;
    }
    //Ti.API.debug('GLEB - Decodificado: '+ textLabel);
return textLabel;
}

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


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// ACTIVITY INDICATOR
/////////////////////////////////////////////////////////////////////////////////////////////////////////

var actInd = Titanium.UI.createActivityIndicator({
        font: { fontSize: exports._p(14)},
        style:Titanium.UI.iPhone.ActivityIndicatorStyle.PLAIN,
        message: 'Cargando...'
});

var timer;

exports.openActivityIndicator = function(message){    
    Ti.API.debug('GLEB- UTILS - Mostrando ActivityIndicator: '+message.text);
    if (Ti.App.Properties.getBool('actInd') && timer!=null) clearTimeout(timer);
    if (Ti.App.Properties.getBool('actInd')) {
        actInd.hide();            
    }    
    actInd.setMessage(message.text);
    actInd.show();
    Ti.App.Properties.setBool('actInd', true);
    // El activiti indicator bloquea la app, por si en algún momento tarda más de 45sg en ejecutar la acción se devuelve el control
    
    timer = setTimeout(function(){
        if (Ti.App.Properties.getBool('actInd')){
            exports.closeActivityIndicator();
            alert("Parece que algo no va bien. Por favor reintentalo.");
        }
    },45000);      
}

exports.closeActivityIndicator = function(){    
    Ti.API.debug('GLEB- UTILS - Ocultando ActivityIndicator: '+actInd.message);
    if (Ti.App.Properties.getBool('actInd')) {
        actInd.hide();            
    }  
    Ti.App.Properties.setBool ('actInd',false);    
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////
// DATE TIME
/////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.getCurrentDateMS = function(){
    return Math.round((new Date()).getTime());
}

exports.getCurrentDate = function(){
    var ts = Math.round((new Date()).getTime());
    var date = new Date(ts);
    var mes = date.getMonth();      
    var dia = date.getDate();
    var anyo = date.getFullYear();
    var hour = date.getHours();
    var min = date.getMinutes();    
    return [dia, mes, anyo, hour, min];
}

exports.getCurrentDateFromTS = function(ts){    
    var date = new Date(parseInt(ts));
    var mes = date.getMonth();      
    var dia = date.getDate();
    var anyo = date.getFullYear();
    return [dia, mes, anyo];
}

// Check if UI is update from same day
exports.checkValidInterval = function(){    
    var a = exports.getCurrentDate();
    var b = exports.getCurrentDateFromTS (Ti.App.Properties.getString('lastUIDownload'));
    //Si la fecha de la ultima descarga es la misma que el dia actual
    if (a[0]==b[0] && a[1]==b[1] && a[2]==b[2]) return true;
    else return false;
}


